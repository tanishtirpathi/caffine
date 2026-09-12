import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { IsLoggedIn } from "@/app/middleware/isloggedin";
import BookingModel from "@/modal/booking.modal";
import dbConnect from "@/lib/monodb";
import UserModel from "@/modal/user.modal";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await IsLoggedIn();
    if (typeof session !== "object" || session === null || session.role !== "admin") {
      return NextResponse.json({ message: "Only admins can delete users" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    if ("userId" in session && session.userId === id) {
      return NextResponse.json({ message: "You cannot delete your own admin account" }, { status: 400 });
    }

    await dbConnect();
    const user = await UserModel.findByIdAndDelete(id).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await BookingModel.deleteMany({ user_id: id });

    return NextResponse.json(
      { message: "User and related bookings deleted successfully", user },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

    console.error("Delete user error:", error);
    return NextResponse.json({ message }, { status });
  }
}
