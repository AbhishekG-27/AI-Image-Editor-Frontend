import React, { useRef, useState } from "react";
import InpaintCanvas from "./InpaintCanvas";

const InpaintEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );
  const [responseImage, setResponseImage] = useState<string | null>(null); // base64 or blob URL

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setImageElement(img);
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex w-full h-[90vh] overflow-hidden">
      {/* Left - Upload & Canvas */}
      <div className="w-1/2 bg-gray-50 p-6 flex flex-col overflow-auto border-r">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Inpaint Tool</h2>

        {!imageElement && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer border-2 border-dashed border-blue-400 text-blue-600 px-8 py-16 rounded-xl text-center transition hover:bg-blue-50"
            >
              <p className="text-lg font-medium">Click to upload an image</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, or JPEG</p>
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
        )}

        {imageElement && (
          <div className="flex-1 border rounded-xl">
            <InpaintCanvas
              uploadedImage={imageElement}
              setResponseImage={setResponseImage}
            />
          </div>
        )}
      </div>

      {/* Right - Response Display */}
      <div className="w-1/2 bg-white p-6 flex flex-col items-center justify-center overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>

        {!responseImage ? (
          <p className="text-gray-500">
            Your inpainted image will appear here.
          </p>
        ) : (
          <img
            src={responseImage}
            alt="Inpainted Result"
            className="max-w-full max-h-full rounded-xl border shadow"
          />
        )}
      </div>
    </div>
  );
};

export default InpaintEditor;
