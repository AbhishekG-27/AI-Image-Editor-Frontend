import { useState } from "react";
import ImageUploadModal from "../components/ImageUploadModal";
import "./App.css";

export default function App() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="p-8">
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload Image for Inpainting
      </button>

      <ImageUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
