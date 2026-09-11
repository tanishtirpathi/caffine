import mongoose, { Schema } from "mongoose";

export interface VenueDocument {
	capacity: number;
	images: string[];
	name: string;
	building: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const VenueSchema = new Schema<VenueDocument>(
	{
		capacity: { type: Number, required: true, min: 1 },  // no of students that can be accomodated in the venue
		images: { type: [String], default:[] }, // images of the venue, imagekit will be used to upload the image and get the url, this url will be stored in the database
		name: { type: String, required: true, trim: true }, // name of the venue/room
		building: { type: String, required: true, trim: true },  // builidng in which the venue is located
	},
	{ timestamps: true }  // createdAt and updatedAt will be automatically added to the document
);

const VenueModel =
	mongoose.models.Venue || mongoose.modelSWSW<VenueDocument>("Venue", VenueSchema);

export default VenueModel;
