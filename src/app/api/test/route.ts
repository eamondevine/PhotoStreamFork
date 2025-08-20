import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dbConnect from "@/lib/dbconnect";
import Test from "@/app/models/TestSchema";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const metadata = await Test.find().lean();

    const withUrls = await Promise.all(
      metadata.map(async (item) => {
        const command = new GetObjectCommand({
          Bucket: "eamon-test-bucket-1",
          Key: item.key,
        });
        console.log("S3 Key:", item.key);
        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        return { ...item, signedUrl };
      })
    );

    return NextResponse.json(withUrls);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
