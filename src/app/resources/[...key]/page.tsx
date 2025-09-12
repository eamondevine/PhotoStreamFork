"use client";

import { useResources } from "@/hooks/use-resources1";
import MediaViewer from "@/components/MediaViewer";

interface ResourcePageProps {
  params: { key: string[] }; // key is now an array of path segments
}

export default function ResourcePage({ params }: ResourcePageProps) {
  const key = params.key.join("/"); // reconstruct the full S3 path
  const { data } = useResources();

  const resource = data?.find((r) => r.key === key);

  if (!resource) return <p>Loading...</p>;

  return <MediaViewer resource={resource} />;
}
