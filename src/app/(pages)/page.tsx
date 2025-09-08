"use client";

import MediaGallery from "@/components/MediaGallery";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function Home() {
  return (
    <div className="h-full mt-6">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <MediaGallery />
      </APIProvider>
    </div>
  );
}
