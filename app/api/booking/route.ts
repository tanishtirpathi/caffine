import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/monodb";
import BookingModel, { BookingStatus } from "@/modal/booking.modal";
import UserModel from "@/modal/user.modal";
import VenueModel from "@/modal/venue.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";
import { VENUE_RESOURCES } from "@/lib/resources";

//! this is out time slots
const validTimes = [
	"09:00",
	"10:00",
	"11:00",
	"12:00",
	"13:00",
	"14:00",
	"15:00",
	"16:00",
	"17:00",
] as const;

const bookingStatuses: BookingStatus[] = ["pending", "approved"];
const MAX_REASON_LENGTH = 250;
// ! this is the data we have to send from the frontend 
type BookingData = {
	venueId: string;
	startingTime: (typeof validTimes)[number];
	endingTime: (typeof validTimes)[number];
	date: string;
	numberOfStudents: number;
	reason: string;
	resources: string[];
};
//! it will automatically detect the user id 
function getUserId(session: unknown) {
	if (typeof session !== "object" || session === null || !("userId" in session)) {
		return null;
	}

	const userId = session.userId;
	return typeof userId === "string" && mongoose.isValidObjectId(userId) ? userId : null;
}
//! this is the data we are getting from frontend and I am validating and this is purely ai writtern
function parseBookingData(value: unknown): BookingData | null {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const body = value as Record<string, unknown>;

	const startingTime = body.startingTime;
	const endingTime = body.endingTime;
	const date = typeof body.date === "string" ? body.date : "";
	const numberOfStudents = body.numberOfStudents;
	const reason =
		typeof body.reason === "string" ? body.reason.trim() : "";
	const resources = Array.isArray(body.resources)
		? body.resources.filter((resource): resource is string => typeof resource === "string")
		: [];

	const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

	if (
		typeof body.venueId === "string" &&
		mongoose.isValidObjectId(body.venueId) &&
		typeof startingTime === "string" &&
		validTimes.includes(startingTime as (typeof validTimes)[number]) &&
		typeof endingTime === "string" &&
		validTimes.includes(endingTime as (typeof validTimes)[number]) &&
		validTimes.indexOf(startingTime as (typeof validTimes)[number]) <
		validTimes.indexOf(endingTime as (typeof validTimes)[number]) &&
		isValidDate &&
		Number.isInteger(numberOfStudents) &&
		(numberOfStudents as number) > 0 &&
		Boolean(reason) &&
		reason.length <= MAX_REASON_LENGTH
		&& resources.every((resource) =>
			VENUE_RESOURCES.includes(resource as (typeof VENUE_RESOURCES)[number]),
		)
	) {
		return {
			venueId: body.venueId,
			startingTime: startingTime as BookingData["startingTime"],
			endingTime: endingTime as BookingData["endingTime"],
			date,
			numberOfStudents: numberOfStudents as number,
			reason,
			resources: [...new Set(resources)],
		};
	}

	return null;
}

//! India time zone 

function getTodayIST(): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}


//! this will get out booking history of the user 
export async function GET() {
	//* algoritgm 
	//^ check the user is ogin or not 
	//^ then connect the db 
	//^ then just check the booking thing from user id and send me 
	try {
		const userId = getUserId(await IsLoggedIn());

		if (!userId) {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		await dbConnect();
		const bookings = await BookingModel.find({ user_id: userId })
			.populate("venue_id")
			.sort({ date: -1, createdAt: -1 })
			.lean();

		return NextResponse.json({ bookings }, { status: 200 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Internal server error";
		const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

		console.error("Get booking history error:", error);
		return NextResponse.json({ message }, { status });
	}
}

//! this is the main booking route 
export async function POST(request: Request,) {
	//& * algoritgm
	//* check the user is logged in or not 
	//* then check the booking data which we are giving in request 
	//* then connect the db
	//* then check the user and venue is valid or not 
	//* check booking student jo user ne mention kiya hai not more then the booking capacity of the venue
	//* starting or ending time check kar alag to nai 
	//* check confict 
	//* if no conflict then create a booking 
	try {
		const userId = getUserId(await IsLoggedIn());

		if (!userId) {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		const bookingData = parseBookingData(await request.json());
		console.log("Booking data:", bookingData);
		if (!bookingData) {
			return NextResponse.json(
				{ message: "venueId, date, valid time range, numberOfStudents and reason are required" },
				{ status: 400 }
			);
		}
		if (bookingData.date < getTodayIST()) {
			return NextResponse.json(
				{ message: "Bookings cannot be made for a previous date" },
				{ status: 400 }
			);
		}

		await dbConnect();

		const [user, venue] = await Promise.all([
			UserModel.findById(userId).select("_id").lean(),
			VenueModel.findById(bookingData.venueId).lean(),
		]);

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		if (!venue) {
			return NextResponse.json({ message: "Venue not found" }, { status: 404 });
		}
		if (bookingData.numberOfStudents > venue.capacity) {
			return NextResponse.json(
				{ message: "Number of students exceeds venue capacity" },
				{ status: 400 }
			);
		}
		const availableResources = venue.resources ?? [];
		if (bookingData.resources.some((resource) => !availableResources.includes(resource))) {
			return NextResponse.json(
				{ message: "One or more selected resources are not available in this venue" },
				{ status: 400 },
			);
		}

		const existingBookings = await BookingModel.find({
			venue_id: bookingData.venueId,
			// Booking dates are stored as YYYY-MM-DD strings, so compare the exact day.
			date: bookingData.date,
			status: { $in: bookingStatuses },
		}).select("starting_time ending_time").lean();

		const requestedStart = validTimes.indexOf(bookingData.startingTime);
		const requestedEnd = validTimes.indexOf(bookingData.endingTime);


		const hasConflict = existingBookings.some((booking) => {
			const existingStart = validTimes.indexOf(booking.starting_time);
			const existingEnd = validTimes.indexOf(booking.ending_time);
			return requestedStart < existingEnd && requestedEnd > existingStart;
		});



		if (hasConflict) {
			return NextResponse.json(
				{ message: "Venue is already booked for that time" },
				{ status: 409 },
			);
		}
		const slotKeys = validTimes
			.slice(requestedStart, requestedEnd)
			.map(
				(time) =>
					`${bookingData.venueId}_${bookingData.date}_${time}`
			);


		try {
			const booking = await BookingModel.create({
				venue_id: bookingData.venueId,
				user_id: userId,
				starting_time: bookingData.startingTime,
				ending_time: bookingData.endingTime,
				date: bookingData.date,
				numberofStudents: bookingData.numberOfStudents,
				resources: bookingData.resources,
				slot_keys: slotKeys,
				reason: bookingData.reason,
			});

	
		 await UserModel.findByIdAndUpdate(userId, { $addToSet: { history: booking._id } });

		 return NextResponse.json(
			{ message: "Venue booking created successfully", booking },
			{ status: 201 }
		);
		}
		catch (error : unknown) {
			console.error("Error creating booking:", error);

			if (typeof error === "object" && 
				error !== null &&
				"code" in error && 
				(error as { code: number }).code === 11000) {
				return NextResponse.json(
					{
						success: false,
						message: "This slot has already been booked.",
					},
					{ status: 409 }
				);
			}
			return NextResponse.json(
				{
					success: false,
					message: "An error occurred while creating the booking.",
				},
				{ status: 500 }
			);
		}


	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Internal server error";
		const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

		console.error("Create booking error:", error);
		return NextResponse.json({ message }, { status });
	}
}
