"use client";
import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

const UploadButton = () => {
  return (
    <CldUploadWidget signatureEndpoint="/api/sign-cloudinary-params">
      {({ open }) => {
        return (
          <button onClick={() => open()}>
            <Upload className="h-10 w-10 mr-10" />
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadButton;
