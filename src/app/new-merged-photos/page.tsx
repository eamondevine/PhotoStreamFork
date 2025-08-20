"use client";

import { useResources } from "@/hooks/use-resources1";
import Image from "next/image";

export default function Gallery() {
  const { data, isLoading, error } = useResources();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div>
      {data?.map((r) => (
        <div key={r.key}>
          <h2>{r.title}</h2>
          <p>{r.note}</p>
          <p>{r.key}</p>
          <p>{r.time}</p>
          <Image src={r.signedUrl} alt={r.key} width={300} height={200} />
        </div>
      ))}
    </div>
  );
}
