import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CloudinaryResource } from "@/types/cloudinary";

interface UseResources {
  initialResources?: Array<CloudinaryResource>;
  disableFetch?: boolean;
  tag?: string;
}

export function useResources(options?: UseResources) {
  const queryClient = useQueryClient();
  const { disableFetch = false } = options || {};
  const { data: resources } = useQuery({
    queryKey: ["resources", options?.tag],
    queryFn: async () => {
      const { data } = await fetch("/api/resources").then((r) => r.json());
      return data;
    },
    initialData: options?.initialResources,
    enabled: !disableFetch,
  });
  function addResources(results: Array<CloudinaryResource>) {
    // this function is merging new results on client with old
    queryClient.setQueryData(
      ["resources", String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG)],
      (old: Array<CloudinaryResource>) => {
        return [...results, ...old];
      }
    );
    queryClient.invalidateQueries({
      // GET request checking server side - this is called optimistic updates
      queryKey: [
        "resources",
        String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG),
      ],
    });
  }
  return {
    resources,
    addResources,
  };
}
