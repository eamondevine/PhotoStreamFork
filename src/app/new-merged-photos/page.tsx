"use client";

import ImageUpload from "@/components/ImageUpload";
import PhotoMap from "@/components/Maps/PhotoMap";
import { useResources } from "@/hooks/use-resources1";
import Image from "next/image";
import { useState } from "react";

export default function Gallery() {
  const { data, isLoading, error } = useResources(); // the data here is grabbed from ["resources"] the query key in the tan stack hook
  const [mapMarkers, setMapMarkers] = useState<{ lat: number; lng: number }[]>(
    []
  );

  const toggleMarker = (lat: number, lng: number) => {
    setMapMarkers((prev) => {
      const exists = prev.some((loc) => loc.lat === lat && loc.lng === lng);
      if (exists) {
        return prev.filter((loc) => loc.lat !== lat && loc.lng !== lng);
      } else {
        return [...prev, { lat, lng }];
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-column">
      <div className="m-auto mb-10">
        <ImageUpload />
        {data?.map((r) => (
          <div key={r.key}>
            <h2>{r.title}</h2>
            <p>{r.note}</p>
            <p>{r.key}</p>
            <p>
              <span className="text-[1.5rem] underline">Date and Time: </span>
              {r.time}
            </p>
            <p>
              <span className="text-[1.5rem] underline">lattitude: </span>
              {r.gps?.lat}
            </p>
            <p>
              <span className="text-[1.5rem] underline">longitude: </span>
              {r.gps?.lng}
            </p>
            <a href={r.signedUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={r.signedUrl}
                alt={r.key}
                width={300}
                height={0}
                style={{ height: "auto" }}
              />
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${r.gps?.lat},${r.gps?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Map Location
            </a>
            <br />
            <button
              className="text-[1.3] text-blue-700"
              onClick={() => {
                if (r.gps?.lat == null || r.gps?.lng == null) {
                  return;
                }
                toggleMarker(r.gps.lat, r.gps.lng);
              }}
            >
              Toggle Map Marker
            </button>
            <br />
            <br />
          </div>
        ))}
        <PhotoMap locationMarkers={mapMarkers} />
      </div>
    </div>
  );
}
