"use client";
import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
export default function ApiProvider() {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      onLoad={() => console.log("Maps API has loaded.")}
    ></APIProvider>
  );
}
