import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { IsLoggedIn } from "@/app/middleware/isloggedin";
import dbConnect from "@/lib/monodb";
import BookingModel, { BookingStatus } from "@/modal/booking.modal";

const editableStatuses: BookingStatus[] = ["approved", "rejected"];

function isAdmin(session: unknown) {
  return typeof session === "object" && session !== null && "role" in session && session.role === "admin";
}

export async function GET() {
  try {
    const session = await IsLoggedIn();
    if (!isAdmin(session)) {
      return NextResponse.json({ message: "Only admins can view bookings" }, { status: 403 });
    }

    await dbConnect();
    const bookings = await BookingModel.find({})
      .populate("venue_id", "name building capacity")
      .populate("user_id", "name loginId mobileNo")
      .sort({ status: 1, date: 1, starting_time: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await IsLoggedIn();
    if (!isAdmin(session)) {
      return NextResponse.json({ message: "Only admins can update bookings" }, { status: 403 });
    }

    const body = await request.json();
    const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";
    const status = typeof body.status === "string" ? body.status as BookingStatus : null;

    if (!mongoose.isValidObjectId(bookingId) || !status || !editableStatuses.includes(status)) {
      return NextResponse.json({ message: "A valid bookingId and approved or rejected status are required" }, { status: 400 });
    }

    await dbConnect();
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true },
    ).populate("venue_id", "name building").populate("user_id", "name loginId mobileNo").lean();

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (status === "approved") {
      //! TODO: Send an SMS to the student's mobileNo after integrating an SMS provider.
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
