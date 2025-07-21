import InpaintEditor from "@/components/ImageUploadModal";

const ImageEditor = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
      {/* Side Panel */}
      <aside className="hidden lg:block w-full max-w-[220px] sticky top-6 self-start h-fit bg-white/10 backdrop-blur border border-white/20 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3 text-black">Tools & Apps</h2>
        <ul className="space-y-2 text-black text-sm">
          <li className="hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded px-2 py-1">
            Image Upscaler
          </li>
          <li className="hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded px-2 py-1">
            Background Remover
          </li>
          <li className="hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded px-2 py-1">
            AI Sketch
          </li>
          <li className="hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded px-2 py-1">
            Batch Generator
          </li>
          <li className="hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded px-2 py-1">
            Prompt Library
          </li>
        </ul>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1">
        <InpaintEditor />
      </div>
    </div>
  );
};

export default ImageEditor;
