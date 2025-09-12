// app/api/delete/route.ts (Next.js App Router) or pages/api/delete.ts (Pages Router)
import { NextRequest, NextResponse } from "next/server"; // App Router
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbconnect";
import TestModel from "@/app/models/TestSchema";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { keys } = body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: "No keys provided" }, { status: 400 });
    }

    // Delete from S3
    for (const key of keys) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key, // exact key, including slashes
          })
        );
      } catch (err) {
        console.error(`Error deleting ${key} from S3:`, err);
        // Optional: continue deleting others or fail immediately
      }
    }

    // Delete from MongoDB
    const deleteResult = await TestModel.deleteMany({ key: { $in: keys } });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.deletedCount,
      keysDeleted: keys,
    });
  } catch (err: any) {
    console.error("Delete API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
