"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";

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
        <ul className="flex items-center gap-4"></ul>
      </Container>

      <div className="relative flex justify-center items-center align-center w-full h-full">
        <Image src={resource.url} alt={resource.key} width={300} height={200} />
      </div>
    </div>
  );
};

export default MediaViewer;
