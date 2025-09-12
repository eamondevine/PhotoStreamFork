import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Test from "@/app/models/TestSchema";

export async function GET() {
  try {
    await dbConnect();
    const metadata = await Test.find().lean();

    const withUrls = await Promise.all(
      metadata.map((item) => {
        const url = `https://eamon-test-bucket-1.s3.ap-southeast-1.amazonaws.com/${item.key}`;
        return { ...item, url };
      })
    );

    return NextResponse.json(withUrls); //new array of objects that includes the signedUrls
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
