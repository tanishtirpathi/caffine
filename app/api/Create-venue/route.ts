import { NextResponse } from "next/server";

import dbConnect from "@/lib/monodb";
import VenueModel from "@/modal/venue.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";

export async function POST(request: Request) {
	try {
		const user = await IsLoggedIn();

		if (!user || typeof user !== "object" || user.role !== "admin") {
			return NextResponse.json(
				{ message: "Only admins can create venues" },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const name = typeof body.name === "string" ? body.name.trim() : "";
		const building = typeof body.building === "string" ? body.building.trim() : "";
		const capacity = typeof body.capacity === "number" ? body.capacity : Number(body.capacity);
		const images = Array.isArray(body.images)
			? body.images.filter((image: unknown): image is string => typeof image === "string")
			: [];

		if (!name || !building || !Number.isInteger(capacity) || capacity < 1) {
			return NextResponse.json(
				{ message: "name, building and a positive integer capacity are required" },
				{ status: 400 }
			);
		}

		await dbConnect();

		const venue = await VenueModel.create({
			name,
			building,
			capacity,
			images,
		});

		return NextResponse.json(
			{
				message: "Venue created successfully",
				venue,
			},
			{ status: 201 }
		);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Internal server error";
		const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

		console.error("Create venue error:", error);
		return NextResponse.json({ message }, { status });
	}
}
