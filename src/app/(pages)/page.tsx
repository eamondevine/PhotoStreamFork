import MediaGallery from "@/components/MediaGallery";
import dbConnect from "@/lib/dbconnect";
import { v2 as cloudinary } from "cloudinary";
import TestModel from "../models/TestSchema";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function Home() {
  await dbConnect();
  const testData = await TestModel.find({});
  const stringifiedTestData = JSON.parse(JSON.stringify(testData));

  const { resources } = await cloudinary.api.resources_by_tag(
    String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG)
  );
  console.log("resources", resources);

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("Missing AWS credentials in environment variables");
  }

  const s3 = new S3Client({
    region: "ap-southeast-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Fetch all images from S3
  const listCommand = new ListObjectsV2Command({
    Bucket: "eamon-test-bucket-1",
    Prefix: "Screenshots 1/", // optional: folder path
  });
  const response = await s3.send(listCommand);

  const signedUrls = await Promise.all(
    response.Contents?.map(async (obj) => {
      const getCommand = new GetObjectCommand({
        Bucket: "eamon-test-bucket-1",
        Key: obj.Key!,
      });
      return await getSignedUrl(s3, getCommand, { expiresIn: 300 }); // 5 min
    }) || []
  );

  // Generate URLs for images, but these are unsigned (can grab these from ListObjectsV2Command)
  /* const s3Images = response.Contents?.map((obj) => {
    return `https://eamon-test-bucket-1.s3.ap-southeast-1.amazonaws.com/${obj.Key}`;
  }); */

  return (
    <div className="h-full mt-6">
      <MediaGallery
        resources={resources}
        tag={String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG)}
        testData={stringifiedTestData}
        awsResponse={signedUrls}
      />
    </div>
  );
}
