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

function responseWithToken(body: object, token: string, status: number) {
    const response = NextResponse.json(body, { status });
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
    });
    return response;
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const loginId = typeof body.loginId === "string" ? body.loginId.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const role = body.role as UserRole;

        if (!loginId || !password || !role) {
            return NextResponse.json({ message: "loginId, password and role are required" }, { status: 400 });
        }

        if (role !== "student" && role !== "admin") {
            return NextResponse.json({ message: "Invalid role. Use student or admin." }, { status: 400 });
        }

        const user = await UserModel.findOne({ loginId, role }).select("+password").lean();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        return responseWithToken(
            {
                message: "Login successful",
                user: { id: user._id.toString(), name: user.name, loginId: user.loginId, role: user.role },
            },
            createToken(user),
            200
        );
    } catch (error: unknown) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}