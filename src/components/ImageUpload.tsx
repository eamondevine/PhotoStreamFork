"use client";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ImageUpload() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append("files", file));

    setUploading(true);

    try {
      const res = await fetch("/api/metadata", {
        method: "POST",
        body: formData,
      });
      const dataRes = await res.json();

      if (!res.ok || !dataRes?.data) {
        console.error("Upload failed:", dataRes?.error);
        return;
      }

      // Invalidate query to refresh gallery
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    } catch (err: any) {
      console.error("Upload error:", err.message || err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gap-2 mb-5 flex flex-col w-fit items-center">
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={uploading}
      />
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <Upload className="h-10 w-10" />
      </label>
    </div>
  );
}
