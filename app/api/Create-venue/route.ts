import { NextResponse } from "next/server";

import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

import imageKit from "@/lib/imagekit";

import dbConnect from "@/lib/monodb";
import VenueModel from "@/modal/venue.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";

export async function GET() {
	try {
		await dbConnect();

		const venues = await VenueModel.find({}).sort({ createdAt: -1 }).lean();

		return NextResponse.json(
			{
				venues,
			},
			{ status: 200 }
		);
	} catch (error: unknown) {
		console.error("Get venues error:", error);

		return NextResponse.json(
			{
				message: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}

// create venue with file handeling up to 10 images 
export const runtime = "nodejs";
export async function POST(request: Request) {
    let temporaryDirectory = "";

    try {
        const user = await IsLoggedIn();
		
        if (!user || typeof user !== "object" || user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admins can create venues" },
                { status: 403 }
            );
        }

        const formData = await request.formData();

        const name = String(formData.get("name") || "").trim();
        const building = String(formData.get("building") || "").trim();
        const capacity = Number(formData.get("capacity"));

        const files = formData
            .getAll("images")
            .filter((value): value is File => value instanceof File);

        if (!name || !building || !Number.isInteger(capacity) || capacity < 1) {
            return NextResponse.json(
                {
                    message:
                        "name, building and a positive integer capacity are required",
                },
                { status: 400 }
            );
        }

        temporaryDirectory = join(tmpdir(), `venue-${randomUUID()}`);
        await mkdir(temporaryDirectory, { recursive: true });

        const imageUrls: string[] = [];

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                return NextResponse.json(
                    { message: "Only image files are allowed" },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const temporaryFilePath = join(
                temporaryDirectory,
                `${randomUUID()}-${file.name}`
            );

            // Store the image temporarily on the local server.
            await writeFile(temporaryFilePath, buffer);

            // Upload the same image to ImageKit.
            const uploadedImage = await imageKit.upload({
                file: buffer,
                fileName: file.name || "venue-image.jpg",
                folder: "/venues",
                useUniqueFileName: true,
            });

            imageUrls.push(uploadedImage.url);
        }

        await dbConnect();

        const venue = await VenueModel.create({
            name,
            building,
            capacity,
            images: imageUrls,
        });

        return NextResponse.json(
            {
                message: "Venue created successfully",
                venue,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        const status =
            message === "No token provided" || message === "Invalid token"
                ? 401
                : 500;

        console.error("Create venue error:", error);

        return NextResponse.json({ message }, { status });
    } finally {
        if (temporaryDirectory) {
            await rm(temporaryDirectory, {
                recursive: true,
                force: true,
            });
        }
    }
}