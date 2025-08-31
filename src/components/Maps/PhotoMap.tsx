"use client";

import React from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
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

  const [hasDragged, setHasDragged] = useState(false);
  useEffect(() => {
    setHasDragged(false);
  }, [locationMarkers]);

  return (
    <div className="w-[600px] h-[600px]">
      <Map
        defaultZoom={8}
        defaultCenter={{ lat: 24.14434779767916, lng: 121.01165256305426 }}
        center={
          hasDragged ? undefined : locationMarkers[locationMarkers.length - 1]
        }
        mapId="DEMO_MAP_ID"
        onDrag={() => setHasDragged(true)}
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
          <AdvancedMarker position={loc} key={idx}>
            <div className="default-marker text-center ">
              <p className="m-auto">I'm here</p>
            </div>
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}
