import { NextResponse } from "next/server";

import dbConnect from "@/lib/monodb";
import UserModel from "@/modal/user.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";

export async function GET() {
    try {
        const session = await IsLoggedIn();
        const userId =
            typeof session === "object" && session !== null && "userId" in session
                ? session.userId
                : null;

        if (typeof userId !== "string" || !userId) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        await dbConnect();

        const user = await UserModel.findById(userId)
            .select("-password")
            .lean();

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    loginId: user.loginId,
                    mobileNo: user.mobileNo,
                    role: user.role,
                    isAuthorized: user.isAuthorized,
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

        console.error("Get current user error:", error);
        return NextResponse.json({ message }, { status });
    }
}
