import { NextResponse } from "next/server";

import dbConnect from "@/lib/monodb";
import BookingModel from "@/modal/booking.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";

export async function GET() {
  try {
    await IsLoggedIn();
    await dbConnect();

    const bookings = await BookingModel.find({})
      .populate("venue_id", "name building capacity")
      .sort({ date: 1, starting_time: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

    console.error("Get all bookings error:", error);
    return NextResponse.json({ message }, { status });
  }
}
