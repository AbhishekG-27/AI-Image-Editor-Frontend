import React, { useRef, useState } from "react";
import InpaintCanvas from "./InpaintCanvas";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImageUploadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-4xl max-h-[90%] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload an Image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg font-bold"
          >
            ×
          </button>
        </div>

        {!imageElement && (
          <div className="space-y-4 text-center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>
        )}

        {imageElement && (
          <div className="mt-4 overflow-auto max-h-[70vh] max-w-full border rounded flex justify-center">
            <InpaintCanvas uploadedImage={imageElement} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadModal;
