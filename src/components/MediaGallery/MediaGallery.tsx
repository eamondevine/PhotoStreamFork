"use client";

import { useState, useRef } from "react";
import { useResources } from "@/hooks/use-resources1";
import { useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import PatchForm from "../PatchForm";
import PhotoMap from "../Maps/PhotoMap";

interface Marker {
  position?: { lat: number; lng: number };
  note?: string;
  url: string;
  title?: string;
  key: string;
}

export default function MediaGallery() {
  const { data, isLoading, error } = useResources();
  const [mapMarkers, setMapMarkers] = useState<Marker[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [creation, setCreation] = useState();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);

  // Sort newest-first
  const sortedItems = Array.isArray(data)
    ? [...data].sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeB - timeA;
      })
    : [];

  const virtualizer = useVirtualizer({
    count: sortedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320, // approx height including image + text
    overscan: 5,
  });

  const toggleMarker = (marker: Marker) => {
    setMapMarkers((prev) =>
      prev.some((m) => m.key === marker.key)
        ? prev.filter((m) => m.key !== marker.key)
        : [...prev, marker]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) return;
    if (!confirm(`Are you sure you want to delete ${selected.length} file(s)?`))
      return;

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      queryClient.setQueryData(["resources"], (oldData: any) =>
        oldData.filter((item: any) => !selected.includes(item.key))
      );
      setSelected([]);
      alert("Deleted successfully!");
    } catch (err: any) {
      alert("Error deleting files: " + err.message);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <>
      {/* Management Navbar */}
      {selected.length > 0 && (
        <Container className="fixed z-50 top-0 left-0 w-full h-16 flex items-center justify-between gap-4 bg-white shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelected([])}>
              <X className="h-6 w-6" />
              <span className="sr-only">Clear Selected</span>
            </Button>
            <p>{selected.length} Selected</p>
          </div>
          <Button variant="ghost" onClick={handleDeleteSelected}>
            DELETE
          </Button>
        </Container>
      )}

      {/* Virtualized Gallery */}
      <Container ref={parentRef} className="h-[80vh] overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const r = sortedItems[virtualRow.index];
            const isChecked = selected.includes(r.key);

            function handleOnSelectResource(checked: boolean) {
              setSelected((prev) =>
                checked ? [...prev, r.key] : prev.filter((k) => k !== r.key)
              );
            }

            return (
              <div
                key={r.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="bg-white dark:bg-zinc-700 p-2"
              >
                <div className="relative group">
                  <label
                    className={`absolute ${
                      isChecked ? "opacity-100" : "opacity-0"
                    } group-hover:opacity-100 transition-opacity top-3 left-3 p-1`}
                    htmlFor={r.key}
                  >
                    <span className="sr-only">
                      Select Image &quot;{r.key}&quot;
                    </span>
                    <Checkbox
                      id={r.key}
                      checked={isChecked}
                      onCheckedChange={handleOnSelectResource}
                    />
                  </label>

                  <h2>{r.title}</h2>
                  <p>
                    {!r.time
                      ? "no timestamp"
                      : `Date 日期: ${format(new Date(r.time), "yyyy/MM/dd")}`}
                  </p>

                  <Link href={`/resources/${r.key}`}>
                    <Image src={r.url} alt={r.key} width={300} height={200} />
                  </Link>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${r.gps?.lat},${r.gps?.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Google Map Location
                  </a>

                  <button
                    className="text-[1.3] text-blue-700"
                    onClick={() => r.gps && toggleMarker(r)}
                  >
                    Toggle Map Marker
                  </button>

                  {selected.length === 1 && selected[0] === r.key && (
                    <PatchForm
                      fileKey={selected[0]}
                      initialNote={
                        sortedItems.find((r) => r.key === selected[0])?.note
                      }
                      initialTitle={
                        sortedItems.find((r) => r.key === selected[0])?.title
                      }
                      onSuccess={(updated) =>
                        console.log("File updated:", updated)
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      <PhotoMap markers={mapMarkers} />
    </>
  );
}
