"use client";

import React from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Marker,
} from "@vis.gl/react-google-maps";

export default function PhotoMap() {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        defaultZoom={8}
        defaultCenter={{ lat: 24.14434779767916, lng: 121.01165256305426 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
      ></Map>
    </APIProvider>
  );
}
