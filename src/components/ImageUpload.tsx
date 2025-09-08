"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

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
    <div className="gap-2 mb-5 flex flex-col w-fit items-center">
      <input
        id="file-upload"
        type="file"
        multiple
        alt="input for file"
        accept="image"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {/* <h1 className="text-[2rem] m-0">Upload files here</h1> */}
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <Upload className="h-10 w-10" />
      </label>
    </div>
  );
}
