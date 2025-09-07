import { useQuery } from "@tanstack/react-query";
import { Test } from "@/app/models/TestSchema";

type Resource = Test & { url: string };

async function fetchResources(): Promise<Resource[]> {
  const res = await fetch("/api/test");
  if (!res.ok) throw new Error("Failed to fetch resource metadata");
  return res.json();
}

export function useResources() {
  return useQuery<Resource[]>({
    queryKey: ["resources"], // the queryFn grabs the withUrls array and passes it here to the query key
    queryFn: fetchResources,
    staleTime: 43200000, //half day?
  });
}
