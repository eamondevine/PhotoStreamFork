import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbconnect";
import TestModel from "@/app/models/TestSchema";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { keys } = await req.json();

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: "No keys provided" }, { status: 400 });
    }

    if (keys.length === 1) {
      // Single delete
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: keys[0],
          })
        );
      } catch (err) {
        console.error(`Error deleting ${keys[0]} from S3:`, err);
      }
    } else {
      // Multi-delete
      try {
        await s3Client.send(
          new DeleteObjectsCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Delete: {
              Objects: keys.map((key) => ({ Key: key })),
              // Quiet: false to return details for each key
              Quiet: false,
            },
          })
        );
      } catch (err) {
        console.error("Error deleting multiple keys from S3:", err);
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
