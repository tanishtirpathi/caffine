import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/monodb";
import BookingModel from "@/modal/booking.modal";
import VenueModel from "@/modal/venue.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid venue ID" }, { status: 400 });
        }

        await dbConnect();
        const venue = await VenueModel.findById(id).lean();

        if (!venue) {
            return NextResponse.json({ message: "Venue not found" }, { status: 404 });
        }

        return NextResponse.json({ venue }, { status: 200 });
    } catch (error: unknown) {
        console.error("Get venue error:", error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: Request, context: RouteContext) {
    try {
        const user = await IsLoggedIn();

        if (!user || typeof user !== "object" || user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admins can delete venues" },
                { status: 403 }
            );
        }

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid venue ID" }, { status: 400 });
        }

        await dbConnect();
        const venue = await VenueModel.findByIdAndDelete(id).lean();

        if (!venue) {
            return NextResponse.json({ message: "Venue not found" }, { status: 404 });
        }

        await BookingModel.deleteMany({ venue_id: id });

        return NextResponse.json(
            { message: "Venue deleted successfully", venue },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

        console.error("Delete venue error:", error);
        return NextResponse.json({ message }, { status });
    }
}
