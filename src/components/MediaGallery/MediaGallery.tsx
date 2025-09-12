"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, X, Save } from "lucide-react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useResources } from "@/hooks/use-resources1";
import PhotoMap from "../Maps/PhotoMap";

interface Marker {
  position?: {
    lat: number;
    lng: number;
  };
  note?: string;
  url: string;
  title?: string;
  key: string;
}

export default function MediaGallery() {
  const { data, isLoading, error } = useResources(); // the data here is grabbed from ["resources"] the query key in the tan stack hook
  const [mapMarkers, setMapMarkers] = useState<Marker[]>([]);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [creation, setCreation] = useState();

  const toggleMarker = (marker: Marker) => {
    setMapMarkers((prev) => {
      console.log("Toggling marker:", marker);
      const exists = prev.some((m) => m.key === marker.key);
      if (exists) {
        return prev.filter((m) => m.key !== marker.key);
      } else {
        return [...prev, marker];
      }
    });
  };

  /**
   * handleOnClearSelection
   */

  function handleOnClearSelection() {
    setSelected([]);
  }

  /**
   * handleOnCreationOpenChange
   */

  function handleOnCreationOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setCreation(undefined);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <>
      <Dialog open={!!creation} onOpenChange={handleOnCreationOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your creation?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-end sm:justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/** Management navbar presented when assets are selected */}

      {selected.length > 0 && (
        <Container className="fixed z-50 top-0 left-0 w-full h-16 flex items-center justify-between gap-4 bg-white shadow-lg">
          <div className="flex items-center gap-4">
            <ul>
              <li>
                <Button variant="ghost" onClick={handleOnClearSelection}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Clear Selected</span>
                </Button>
              </li>
            </ul>
            <p>
              <span>{selected?.length} Selected</span>
            </p>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Create New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <span>Option</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </Container>
      )}

      {/** Gallery */}
      <Container>
        {Array.isArray(data) && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
            {" "}
            {/* grid fixed for 1 col */}
            {data.map((r) => {
              const isChecked = selected.includes(r.key);

              function handleOnSelectResource(checked: boolean) {
                setSelected((prev) => {
                  if (checked) {
                    return Array.from(new Set([...(prev || []), r.key]));
                  } else {
                    return prev.filter((key) => key !== r.key);
                  }
                });
              }

              return (
                <li key={r.key} className="bg-white dark:bg-zinc-700">
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
                        className={`w-6 h-6 rounded-full bg-white shadow ${
                          isChecked ? "border-blue-500" : "border-zinc-200"
                        }`}
                        id={r.key}
                        onCheckedChange={handleOnSelectResource}
                        checked={isChecked}
                      />
                    </label>
                    <div key={r.key}>
                      <h2>{r.title}</h2>
                      <p>{r.note}</p>
                      <p>{r.key}</p>
                      <p>
                        <span className="text-[1.5rem] underline">
                          Date and Time:{" "}
                        </span>
                        {r.time}
                      </p>
                      <p>
                        <span className="text-[1.5rem] underline">
                          lattitude:{" "}
                        </span>
                        {r.gps?.lat}
                      </p>
                      <p>
                        <span className="text-[1.5rem] underline">
                          longitude:{" "}
                        </span>
                        {r.gps?.lng}
                      </p>
                      <Link href={`/resources/${r.key}`}>
                        <Image
                          src={r.url}
                          alt={r.key}
                          width={300}
                          height={200}
                        />
                      </Link>

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
                          if (r.gps == null) {
                            return;
                          }
                          toggleMarker(r);
                        }}
                      >
                        Toggle Map Marker
                      </button>
                      <br />
                      <br />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <PhotoMap markers={mapMarkers} />
      </Container>
    </>
  );
}
