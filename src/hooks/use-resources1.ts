import { useQuery, QueryClientProvider } from "@tanstack/react-query";
import { Test } from "@/app/models/TestSchema";

type Resource = Test & { signedUrl: string };

async function fetchResources(): Promise<Resource[]> {
  const res = await fetch("/api/test");
  if (!res.ok) throw new Error("Failed to fetch resource metadata");
  return res.json();
}

export function useResources() {
  return useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: fetchResources,
  });
}
