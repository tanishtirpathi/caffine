import { NextResponse } from "next/server";

import dbConnect from "@/lib/monodb";
import UserModel from "@/modal/user.modal";

import { IsLoggedIn } from "@/app/middleware/isloggedin";
import { IsAdmin } from "@/app/middleware/isadmin";

export async function POST(request: Request) {
    try {
        // Connect to database
        await dbConnect();

        // Check if user is logged in
        const user = await IsLoggedIn();

        // Check if logged-in user is admin
        IsAdmin(user);

        // Get request body
        const {
            name,
            loginId,
            password,
            mobileNo,
            isAuthorized = false,
        } = await request.json();

        // Validate required fields
        if (!name || !loginId || !password || !mobileNo) {
            return NextResponse.json(
                {
                    message: "Name, loginId, password and mobileNo are required",
                },
                { status: 400 }
            );
        }

        // Check if loginId already exists
        const existingLoginId = await UserModel.findOne({ loginId });

        if (existingLoginId) {
            return NextResponse.json(
                {
                    message: "Login ID already exists",
                },
                { status: 409 }
            );
        }


        // Create new student
        const newStudent = new UserModel({
            name,
            loginId,
            password,
            mobileNo,
            role: "student",
            isAuthorized,
        });

        await newStudent.save();

        return NextResponse.json(
            {
                message: "Student created successfully",
                user: {
                    id: newStudent._id,
                    name: newStudent.name,
                    loginId: newStudent.loginId,
                    mobileNo: newStudent.mobileNo,
                    role: newStudent.role,
                    isAuthorized: newStudent.isAuthorized,
                },
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Create student error:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 }
        );
    }
}