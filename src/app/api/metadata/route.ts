import { NextRequest, NextResponse } from "next/server";
import exifr from "exifr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as Blob[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Process each file with exiftool
    const results = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const metadata = await exifr.parse(arrayBuffer, [
          "GPSLatitude",
          "GPSLongitude",
          "DateTimeOriginal",
        ]);
        console.log("metadata", metadata);
        return metadata;
      })
    );

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
