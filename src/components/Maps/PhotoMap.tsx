"use client";

import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

interface Marker {
  gps?: {
    lat: number;
    lng: number;
  };
  note?: string;
  url: string;
  title?: string;
  key: string;
}

interface PhotoMapProps {
  markers: Marker[];
}

function MarkerWithInfoWindow({ gps, note, url, title }: Marker) {
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
        position={gps}
        onClick={handleMarkerClick}
      >
        <div className="default-marker text-center">
          <p className="m-auto">Hi</p>
        </div>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>{title ?? "no title"}</h2>
          <p>{note ?? "no note available"}</p>
          <Image src={url} alt={title ?? "no title"} width={300} height={200} />
        </InfoWindow>
      )}
    </>
  );
}

export default function PhotoMap({ markers }: PhotoMapProps) {
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    setHasDragged(false);
  }, [markers]);

  return (
    <div className="w-[600px] h-[600px]">
      <Map
        defaultZoom={8}
        defaultCenter={{ lat: 24.14434779767916, lng: 121.01165256305426 }}
        center={
          hasDragged || markers.length === 0
            ? undefined
            : markers[markers.length - 1]?.gps
        }
        mapId={process.env.NEXT_PUBLIC_MAP_ID}
        onDrag={() => setHasDragged(true)}
        reuseMaps={true}
      >
        {markers.map((marker) => (
          <MarkerWithInfoWindow
            key={marker.key}
            gps={marker.gps}
            note={marker.note}
            url={marker.url}
            title={marker.title}
          />
        ))}
      </Map>
    </div>
  );
}
