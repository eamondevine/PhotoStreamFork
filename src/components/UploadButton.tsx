"use client";
import React from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Upload } from "lucide-react";

import { useResources } from "@/hooks/use-resources";

import { CloudinaryResource } from "@/types/cloudinary";

const UploadButton = () => {
  const { addResources } = useResources();
  function handleOnSuccess(results: CloudinaryUploadWidgetResults) {
    addResources([results.info as CloudinaryResource]);
    console.log("results", results);
  }
  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{ autoMinimize: true }}
      onSuccess={handleOnSuccess}
    >
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
