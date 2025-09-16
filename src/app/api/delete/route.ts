import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
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

    console.log("Deleting from bucket:", "eamon-test-bucket-1");
    console.log("Keys to delete:", keys);

    try {
      const s3Response = await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: "eamon-test-bucket-1",
          Delete: {
            Objects: keys.map((key) => ({ Key: key })), // use keys as-is
            Quiet: false,
          },
        })
      );
      console.log("S3 delete response:", s3Response);
    } catch (s3Err) {
      console.error("Error deleting from S3:", s3Err);
      return NextResponse.json(
        { error: "Failed to delete from S3" },
        { status: 500 }
      );
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
