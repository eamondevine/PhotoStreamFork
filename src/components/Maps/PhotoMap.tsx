"use client";

import React, { useCallback, useState, useEffect } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

interface Resource {
  note?: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface PhotoMapProps {
  locationMarkers: Location[];
  resources: Resource[];
}

function MarkerWithInfoWindow({
  position,
  note,
}: {
  position: Location;
  note: string;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        <div className="default-marker text-center">
          <p className="m-auto">Hi</p>
        </div>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>Title</h2>
          <p>{note ?? "no note available"}</p>
        </InfoWindow>
      )}
    </>
  );
}

export default function PhotoMap({
  locationMarkers,
  resources,
}: PhotoMapProps) {
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
        mapId={process.env.NEXT_PUBLIC_MAP_ID}
        onDrag={() => setHasDragged(true)}
        reuseMaps={true}
      >
        {locationMarkers.map((loc, idx) => (
          <MarkerWithInfoWindow
            key={idx}
            position={loc}
            note={resources[idx]?.note ?? ""}
          />
        ))}
      </Map>
    </div>
  );
}
