import { NextResponse } from "next/server";

import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

import { uploadVenueImage, deleteVenueImage } from "@/lib/venue-images";

import dbConnect from "@/lib/monodb";
import VenueModel from "@/modal/venue.modal";
import { IsLoggedIn } from "@/app/middleware/isloggedin";
import { VENUE_RESOURCES } from "@/lib/resources";
import { getRedisClient } from "@/lib/redis";

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

  let temporaryDirectory = ""; // top level declaration so that every fnc can access this 

  const uploadedImages: { // top level declaration so that every fnc can access this 
    url: string;
    fileId: string;
  }[] = [];

  try {
    const user = await IsLoggedIn(); // check if logged in

    if (!user || typeof user !== "object" || user.role !== "admin") {
      return NextResponse.json({ message: "Only admins can create venues" }, { status: 403 });
    }

    const formData = await request.formData(); // data parsing

    const name = String(formData.get("name") || "").trim();
    const building = String(formData.get("building") || "").trim();
    const capacity = Number(formData.get("capacity"));
    const resourcesValue = String(formData.get("resources") || "[]");
    let resources: string[];

    try {
      const parsedResources: unknown = JSON.parse(resourcesValue);
      resources = Array.isArray(parsedResources)
        ? parsedResources.filter(
            (resource): resource is string =>
              typeof resource === "string" &&
              VENUE_RESOURCES.includes(resource as (typeof VENUE_RESOURCES)[number]),
          )
        : [];
    } catch {
      return NextResponse.json({ message: "Resources must be a valid list" }, { status: 400 });
    }

    const files = formData.getAll("images").filter((value): value is File => value instanceof File);

    if (!name || !building || !Number.isInteger(capacity) || capacity < 1) {
      return NextResponse.json(
        {
          message: "name, building and a positive integer capacity are required",
        },
        { status: 400 }
      );
    }

    if (files.length > 10) { // limit
      return NextResponse.json({ message: "Maximum 10 images are allowed" }, { status: 400 });
    }

    for (const file of files) { // only image allowed
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
      }
    }

    temporaryDirectory = join(tmpdir(), `venue-${randomUUID()}`);
    await mkdir(temporaryDirectory, { recursive: true });

    for (const file of files) {
      const uploadedImage = await uploadVenueImage(file, temporaryDirectory);

      uploadedImages.push(uploadedImage);
    }

    const imageUrls = uploadedImages.map((image) => image.url);

    //image upload done here
    await dbConnect();

    const venue = await VenueModel.create({
      name,
      building,
      capacity,
      resources: [...new Set(resources)],
      images: imageUrls,
    });

    try {
      const redis = await getRedisClient();
      await redis.del("venues:all");
    } catch (cacheError) {
      console.error("Unable to invalidate venue cache after creation:", cacheError);
    }

    return NextResponse.json(
      {
        message: "Venue created successfully",
        venue,
      },
      { status: 201 }
    );
    
  } catch (error: unknown) { // error handeling
    const message = error instanceof Error ? error.message : "Internal server error";

    if (temporaryDirectory) {
      await rm(temporaryDirectory, {
        recursive: true,
        force: true,
      });
    }

    if (uploadedImages) {
      await Promise.all(
        uploadedImages.map((image) =>
          deleteVenueImage(image.fileId).catch((deleteError) => {
            console.error("Failed to delete ImageKit file:", deleteError);
          })
        )
      );
    }

    const status = message === "No token provided" || message === "Invalid token" ? 401 : 500;

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
