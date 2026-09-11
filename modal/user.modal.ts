import mongoose, { Schema } from "mongoose";

export type UserRole = "student" | "admin";

export interface UserDocument {
  name: string;
  loginId: string; // we will create a unique login id for each user, this will be used to login to the system
  password: string; // hashed password of the user, not selected by default
  mobileNo: string;
  role: UserRole; 
  history: mongoose.Types.ObjectId[];
  isAuthorized: boolean; // if role !== "admin" then this need to be true, otherwise cannot book a venue
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true }, // name of the user
    loginId: { type: String, required: true, unique: true, trim: true },//login id of the user, unique and trim
    password: { type: String, required: true, select: false }, // hashed password of the user, not selected by default
    mobileNo: { type: String, required: true, trim: true , unique: true}, // unique karna hai 
    role: { 
      type: String,
      enum: ["student", "admin"], // by default student, admin will be created by the system (us)
      default: "student",
    },
    history: [{ type: Schema.Types.ObjectId, ref: "Booking" }],

  // isAuthorized: { type: Boolean, default: false },  // is authorized by admin or not, if not authorized then cannot book a venue
  },
  {
    timestamps: true, // createdAt and updatedAt will be automatically added to the document
  }
);

const UserModel =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;