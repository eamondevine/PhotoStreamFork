"use client";
import { useState } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState<File[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setFile(Array.from(selectedFiles));
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
    console.log("1st in array post response: ", data[0]);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        alt="input for file"
        accept="image"
        onChange={handleFileChange}
      />
    </div>
  );
}
