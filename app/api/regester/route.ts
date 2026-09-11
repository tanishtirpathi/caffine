import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dbConnect from "@/lib/monodb";
import UserModel, { UserRole } from "@/modal/user.modal";

function createToken(user: { _id: { toString(): string }; name: string; loginId: string; role: UserRole }) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

    return jwt.sign(
        { userId: user._id.toString(), name: user.name, loginId: user.loginId, role: user.role },
        jwtSecret,
        { expiresIn: "1d" }
    );
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const loginId = typeof body.loginId === "string" ? body.loginId.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const mobileNo = typeof body.mobileNo === "string" ? body.mobileNo.trim() : "";
        const role = body.role as UserRole;

        if (!name || !loginId || !password || !mobileNo || !role) {
            return NextResponse.json(
                { message: "name, loginId, password, mobileNo and role are required" },
                { status: 400 }
            );
        }

        if (role !== "student" && role !== "admin") {
            return NextResponse.json({ message: "Invalid role. Use student or admin." }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ $or: [{ loginId }, { mobileNo }] }).lean();
        if (existingUser) {
            return NextResponse.json({ message: "Login ID or mobile number already exists" }, { status: 409 });
        }

        const user = await UserModel.create({
            name,
            loginId,
            password: await bcrypt.hash(password, 12),
            mobileNo,
            role,
        });

        const response = NextResponse.json(
            {
                message: "Registration successful",
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    loginId: user.loginId,
                    mobileNo: user.mobileNo,
                    role: user.role,
                },
            },
            { status: 201 }
        );

        response.cookies.set("token", createToken(user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}