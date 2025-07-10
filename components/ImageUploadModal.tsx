"use client";

import React, { useRef, useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import InpaintCanvas from "./InpaintCanvas";

const InpaintEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );
  const [responseImage, setResponseImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, or JPEG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => setImageElement(img);
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const dragHandlers = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    onDrop: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
  };

  const clearImage = () => {
    setImageElement(null);
    setResponseImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-auto">
      {/* Upload Section */}
      <section className="w-full lg:w-1/2 p-6 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Inpaint Tool
          </h2>
          {imageElement && (
            <button
              onClick={clearImage}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
              title="Clear image"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!imageElement ? (
          <div
            {...dragHandlers}
            className={`flex flex-col items-center justify-center flex-1 px-6 py-12 text-center transition-all ${
              isDragOver
                ? "border-blue-500 bg-blue-50 scale-[1.02]"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <label htmlFor="file-upload" className="cursor-pointer border-2 border-dashed rounded-xl px-6 py-4">
              <Upload className="mx-auto mb-4 text-blue-600" size={48} />
              <p className="text-lg font-medium text-blue-600 mb-1">
                {isDragOver
                  ? "Drop image here"
                  : "Click or drag image to upload"}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG supported</p>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-grow overflow-hidden items-center">
            <InpaintCanvas
              uploadedImage={imageElement}
              setResponseImage={setResponseImage}
            />
          </div>
        )}
      </section>
      {/* Response Section */}
      <section className="w-full lg:w-1/2 p-6 flex flex-col justify-center items-center bg-white border-t lg:border-t-0 lg:border-l">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Result
        </h2>
        {!responseImage ? (
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="text-gray-400" size={24} />
            </div>
            <p className="text-base md:text-lg">
              Your inpainted image will appear here
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Upload an image to get started
            </p>
          </div>
        ) : (
          <img
            src={responseImage}
            alt="Inpainted Result"
            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md border"
          />
        )}
      </section>
    </div>
  );
};

export default InpaintEditor;
