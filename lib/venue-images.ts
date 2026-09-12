import { randomUUID } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import imageKit from "@/lib/imagekit";

export async function uploadVenueImage(file: File, temporaryDirectory: string) {
  const temporaryFilePath = join(temporaryDirectory, `${randomUUID()}-${file.name}`);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(temporaryFilePath, buffer);

  try {
    const temporaryFile = await readFile(temporaryFilePath);

    const uploadedImage = await imageKit.upload({
      file: temporaryFile,
      fileName: file.name || "venue-image.jpg",
      folder: "BookSpot/Venues",
      useUniqueFileName: true,
    });

    return {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
    };
  } finally {
    await rm(temporaryFilePath, { force: true });
  }
}

export async function deleteVenueImage(fileId: string) {
  await imageKit.deleteFile(fileId);
}
