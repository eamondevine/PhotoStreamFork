"use client";

import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useState } from "react";
interface Location {
  lat: number;
  lng: number;
}

interface PhotoMapProps {
  locationMarkers: Location[];
}

export default function PhotoMap({ locationMarkers }: PhotoMapProps) {
  /* if(!locations || locations.length === 0){
    return <p>No locations to show on the map.</p>;
  } */

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <div className="w-[600px] h-[600px]">
        <Map
          defaultZoom={8}
          defaultCenter={{ lat: 24.14434779767916, lng: 121.01165256305426 }}
          /* onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            )
          } */
          reuseMaps={true}
        >
          {locationMarkers.map((loc, idx) => (
            <Marker position={loc} key={idx} />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
