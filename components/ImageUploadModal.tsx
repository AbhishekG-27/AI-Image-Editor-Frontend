import React, { useRef, useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import InpaintCanvas from "./InpaintCanvas";

// Type definitions
// interface InpaintCanvasProps {
//   uploadedImage: HTMLImageElement;
//   setResponseImage: (image: string | null) => void;
// }

interface DragEventHandlers {
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const InpaintEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );
  const [responseImage, setResponseImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const processFile = useCallback((file: File): void => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, or JPEG)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const img = new Image();
      img.onload = (): void => setImageElement(img);
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const clearImage = (): void => {
    setImageElement(null);
    setResponseImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const dragHandlers: DragEventHandlers = {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return (
    <div className="flex lg:flex-row w-full min-h-screen lg:h-screen overflow-hidden">
      {/* Left - Upload & Canvas */}
      <div className="w-full lg:w-1/2 bg-gray-50 p-4 md:p-6 flex flex-col overflow-auto border-b lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Inpaint Tool
          </h2>
          {imageElement && (
            <button
              onClick={clearImage}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              title="Clear image"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!imageElement && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] lg:min-h-0">
            <div
              {...dragHandlers}
              className={`
                w-full max-w-md mx-auto cursor-pointer border-2 border-dashed rounded-xl 
                text-center transition-all duration-200 ease-in-out
                ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 scale-105"
                    : "border-blue-400 hover:bg-blue-50"
                }
              `}
            >
              <label
                htmlFor="file-upload"
                className="block px-6 py-12 md:px-8 md:py-16 cursor-pointer"
              >
                <Upload className="mx-auto mb-4 text-blue-600" size={48} />
                <p className="text-lg font-medium text-blue-600 mb-2">
                  {isDragOver
                    ? "Drop image here"
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, or JPEG</p>
              </label>
            </div>
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
          <div className="flex-1 border rounded-xl overflow-hidden min-h-[300px] lg:min-h-0">
            <InpaintCanvas
              uploadedImage={imageElement}
              setResponseImage={setResponseImage}
            />
          </div>
        )}
      </div>

      {/* Right - Response Display */}
      <div className="w-full lg:w-1/2 bg-white p-4 md:p-6 flex flex-col items-center justify-center overflow-auto min-h-[300px] lg:min-h-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Result
        </h2>

        {!responseImage ? (
          <div className="text-center text-gray-500 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="text-gray-400" size={24} />
            </div>
            <p className="text-base md:text-lg">
              Your inpainted image will appear here
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Upload an image to get started
            </p>
          </div>
        ) : (
          <div className="w-full max-w-full flex items-center justify-center">
            <img
              src={responseImage}
              alt="Inpainted Result"
              className="max-w-full max-h-[60vh] lg:max-h-full object-contain rounded-xl border shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InpaintEditor;
