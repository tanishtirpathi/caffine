import mongoose, { Schema } from "mongoose";

export type BookingStatus =
	| "pending" // by default 
	| "approved" // by admin
	| "rejected" // by admin
	| "cancelled" // by user under 15 minutes
	| "completed"; // after the booking is done and time is over, will be marked as completed by the system

export interface BookingDocument {
	venue_id: mongoose.Types.ObjectId;
	user_id: mongoose.Types.ObjectId;
	starting_time: string;
	ending_time: string;
	date: Date;
	numberofStudents: number;
	status: BookingStatus;
	reason: string;
	createdAt: Date;
	updatedAt: Date;
}

const BookingSchema = new Schema<BookingDocument>(
	{
		venue_id: { 
			type: Schema.Types.ObjectId,
			ref: "Venue",
			required: true,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		starting_time: { type: String, required: true,  enum: [ "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},
		ending_time: { type: String, required: true , enum: [ "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},
		date: { type:String, required: true },
		numberofStudents: { type: Number, min: 1, required: true },
		 // ~~~ no of students that will be attending the event, 
		// ~~~ if numberOfStudents > venue's capacity,reject the booking 
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "cancelled", "completed"], // approved by admin, rejected by admin, cancelled by user, completed after the booking is done
			default: "pending", // pending by default, will be approved or rejected by admin
		},
		reason: { type: String, required: true, trim: true }, // reason for booking the venue, will be shown to admin while approving or rejecting the booking
	},
	{ timestamps: true }
);

const BookingModel =
	mongoose.models.Booking ||
	mongoose.model<BookingDocument>("Booking", BookingSchema);

export default BookingModel;
