"use client";
import React from "react";
import { CldUploadButton } from "next-cloudinary";

const UploadButton = () => {
  return <CldUploadButton uploadPreset="ml_default" />;
};

export default UploadButton;
