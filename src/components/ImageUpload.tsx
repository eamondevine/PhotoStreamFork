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
    setPreviewUrl(URL.createObjectURL(selectedFiles));

    const formData = new FormData();
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });
    }

    const res = await fetch("/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setExifData(data);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        alt="input for file"
        accept="image"
        onChange={handleFileChange}
      />
      {/* Output file preview and exif data about file */}
      {previewUrl && <Image src={previewUrl} alt="preview" width={300} />}
      {exifData && (
        <div>
          <p>Latitude: {exifData.GPSLatitude}</p>
          <p>Longitude: {exifData.GPSLongitude}</p>
          <p>Date Taken: {exifData.DateTimeOriginal}</p>
          {/* You can output more fields from exiftool here */}
        </div>
      )}
    </div>
  );
}
