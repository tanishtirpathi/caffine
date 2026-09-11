import { NextResponse } from "next/server";

export async function POST() {
try {
        const response = NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
    );

    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
    });

    return response;
}
catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json(
        { message: error instanceof Error ? error.message : "Internal server error" },
        { status: 500 }
    );

}}
