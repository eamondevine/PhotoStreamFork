import MediaViewer from "@/components/MediaViewer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function Resource({ params }: { params: { publicId: string } }) {
  const resource = await cloudinary.api.resource(params.publicId, {
    media_metadata: true,
  });
  console.log("resource-w-metadata", resource);
  return <MediaViewer resource={resource} />;
}

export default Resource;

/* cloudinary.v2.api.resource(public_id, options).then(callback); */
