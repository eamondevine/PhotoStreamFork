"use client";

import ImageUpload from "@/components/ImageUpload";
import { useResources } from "@/hooks/use-resources1";
import Image from "next/image";

export default function Gallery() {
  const { data, isLoading, error } = useResources(); // the data here is grabbed from ["resources"] the query key in the tan stack hook

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div>
      <ImageUpload />
      {data?.map((r) => (
        <div key={r.key}>
          <h2>{r.title}</h2>
          <p>{r.note}</p>
          <p>{r.key}</p>
          <p>{r.time}</p>
          <p>lattitude: {r.gps?.lat}</p>
          <p>longitude: {r.gps?.lng}</p>
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
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
