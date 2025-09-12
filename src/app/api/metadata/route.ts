import { NextRequest, NextResponse, userAgent } from "next/server";
import exifr from "exifr";
import dbConnect from "@/lib/dbconnect";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import TestModel from "@/app/models/TestSchema";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Process each file with exiftool
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const key = `pictures/${Date.now()}-${file.name}`;
          await s3Client.send(
            new PutObjectCommand({
              Bucket: "eamon-test-bucket-1",
              Key: key,
              Body: buffer,
              ContentType: "image/jpeg",
              ContentDisposition: "inline",
            })
          );
          const metadata = await exifr.parse(arrayBuffer, [
            "GPSLatitude",
            "GPSLongitude",
            "DateTimeOriginal",
          ]);
          const gps =
            metadata.latitude && metadata.longitude
              ? { lat: metadata.latitude, lng: metadata.longitude }
              : undefined;
          console.log("gps", gps);
          const time = metadata.DateTimeOriginal
            ? metadata.DateTimeOriginal
            : undefined;
          console.log("time", time);
          const doc = await TestModel.create({
            key,
            gps,
            time,
          });
          return { success: true, doc };
        } catch (fileErr: any) {
          // Return per-file error without stopping the entire batch
          console.error("File upload error:", file.name, fileErr);
          return { success: false, file: file.name, error: fileErr.message };
        }
      })
    );

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    console.log("POST handler error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json(); // expect JSON from frontend
    const { key, updates } = body; // { key: "...", updates: { note: "new note" } }

    // optional: restrict which fields can be updated
    const allowedFields = ["gps", "time", "note"];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowedFields.includes(k))
    );

    // optional: restrict which fields can be updated
    /*   const allowedFields = ["gps", "time", "note"];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowedFields.includes(k))
    );

    const updatedFile = await TestModel.findOneAndUpdate(
      { key },
      { $set: safeUpdates },
      { new: true }
    ); */

    const updatedFile = await TestModel.findOneAndUpdate(
      { key },
      { $set: updates },
      { new: true }
    );
    if (!updatedFile) {
      return NextResponse.json(
        { error: "Can't change this file" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedFile },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
