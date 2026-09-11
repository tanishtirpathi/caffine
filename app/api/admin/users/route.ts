import { NextResponse } from "next/server";

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
