"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [file, setFile] = useState<File[]>([]);
  const [exifData, setExifData] = useState<any[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setFile(Array.from(selectedFiles));
    setPreviewUrl(URL.createObjectURL(selectedFiles[0]));
    console.log("file", file);

    const formData = new FormData();
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });
    }

    const res = await fetch("api/metadata", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setExifData(data);
  };
  const lat = exifData[0]?.latitude;
  const long = exifData[0]?.longitude;

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        alt="input for file"
        accept="image"
        onChange={handleFileChange}
      />
      {/* Output file preview and exif data about file */}

      {previewUrl ? (
        <a href={previewUrl} target="_blank" rel="noopener noreferrer">
          <Image
            src={previewUrl}
            alt="preview"
            width={300}
            height={0}
            style={{ height: "auto" }}
          />
        </a>
      ) : (
        <div>hi, nothing here</div>
      )}
      {exifData.length > 0 ? (
        <div>
          <p>Latitude: {exifData[0]?.latitude}</p>
          <p>Longitude: {exifData[0]?.longitude}</p>
          <p>Date Taken: {exifData[0]?.DateTimeOriginal}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${long}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google Map Location
          </a>
          {/* You can output more fields from exiftool here */}
        </div>
      ) : (
        <div>Hi, nothing here yet</div>
      )}
      <br />
      <hr />
    </div>
  );
}
