"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";

interface Resource {
  key: string;
  gps?: {
    lat: number;
    lng: number;
  };
  note?: string;
  title?: string;
  tags?: string[];
  time?: string;
  url: string;
}

const MediaViewer = ({ resource }: { resource: Resource }) => {
  return (
    <div className="h-screen bg-black px-0">
      {/** Asset management navbar */}

      <Container className="fixed z-10 top-0 left-0 w-full h-16 flex items-center justify-between gap-4 bg-gradient-to-b from-black">
        <div className="flex items-center gap-4">
          <ul>
            <li>
              <Link
                href="/"
                className={`${buttonVariants({ variant: "ghost" })} text-white`}
              >
                <ChevronLeft className="h-6 w-6" />
                Back
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="relative flex flex-col justify-center items-center align-center w-full h-full">
        <ul className="flex flex-col items-center mb-4">
          <li className="underline mb-2 text-white text-[2rem]">
            {resource.title ?? "no title"}
          </li>
          <li className="text-white text-[1.2rem]">
            Date 日期:{" "}
            {resource.time
              ? format(new Date(`${resource.time}`), "yyyy/MM/dd")
              : "no time found :("}
          </li>
          <li className="text-white text-[1.1rem]">
            Time 時間:{" "}
            {resource.time
              ? format(new Date(`${resource.time}`), "p")
              : "so sad"}
          </li>
          <li className="border p-2 rounded-md border-grey-300 mt-2 text-white text-[1.1rem]">
            {resource.note ?? "no note"}
          </li>
        </ul>
        <Image src={resource.url} alt={resource.key} width={300} height={200} />
      </div>
    </div>
  );
};

export default MediaViewer;
