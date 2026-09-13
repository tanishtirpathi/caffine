import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import dbConnect from "@/lib/monodb";
import UserModel from "@/modal/user.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";

export async function GET() {
    try {
        const user = await IsLoggedIn();

        if (!user || typeof user !== "object" || user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admins can view users" },
                { status: 403 }
            );
        }

        await dbConnect();
        const users = await UserModel.find({})
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

        console.error("Get users error:", error);
        return NextResponse.json({ message }, { status });
    }
}

export async function POST(request: Request) {
    try {
        const session = await IsLoggedIn();

        if (!session || typeof session !== "object" || session.role !== "admin") {
            return NextResponse.json({ message: "Only admins can create users" }, { status: 403 });
        }

        const body = await request.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const mobileNo = typeof body.mobileNo === "string" ? body.mobileNo.trim() : "";
        const role = body.role === "admin" ? "admin" : "student";

        if (name.length < 2 || password.length < 8 || !mobileNo) {
            return NextResponse.json(
                { message: "Name, mobile number, and a password of at least 8 characters are required" },
                { status: 400 },
            );
        }

        await dbConnect();

        let loginId = "";
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const candidate = `${name.replace(/\s+/g, "")}${Math.floor(10000 + Math.random() * 90000)}`;
            const existing = await UserModel.exists({ loginId: candidate });
            if (!existing) {
                loginId = candidate;
                break;
            }
        }

        if (!loginId) {
            return NextResponse.json({ message: "Unable to generate a unique login ID" }, { status: 500 });
        }

        const existingMobile = await UserModel.exists({ mobileNo });
        if (existingMobile) {
            return NextResponse.json({ message: "Mobile number already exists" }, { status: 409 });
        }

        const user = await UserModel.create({
            name,
            loginId,
            password: await bcrypt.hash(password, 12),
            mobileNo,
            role,
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: { _id: user._id, name: user.name, loginId: user.loginId, mobileNo: user.mobileNo, role: user.role, createdAt: user.createdAt },
            },
            { status: 201 },
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

        console.error("Create user error:", error);
        return NextResponse.json({ message }, { status });
    }
}
