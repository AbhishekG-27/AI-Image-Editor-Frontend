import { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import Spinner from "./Spinner";

interface InpaintCanvasProps {
  uploadedImage: HTMLImageElement;
  setResponseImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function InpaintCanvas({
  uploadedImage,
  setResponseImage,
}: InpaintCanvasProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lines, setLines] = useState<{ points: number[] }[]>([]);
  const [prompt, setPrompt] = useState("");
  const [imageCount, setImageCount] = useState<number | undefined>(1);
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [guidanceScale, setGuidanceScale] = useState<number | undefined>();
  const [strength, setStrength] = useState<number | undefined>();
  const [showOptions, setShowOptions] = useState(false);

  const isDrawing = useRef(false);
  const imageRef = useRef<any>(null);
  const drawingLayerRef = useRef<any>(null);
  const imageLayerRef = useRef<any>(null);

  const containerWidth = Math.min(window.innerWidth - 32, 800);
  const containerHeight = Math.min(window.innerHeight / 1.8, 600);

  const imageWidth = uploadedImage.width;
  const imageHeight = uploadedImage.height;

  const scale = Math.min(
    containerWidth / imageWidth,
    containerHeight / imageHeight
  );
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  const offsetX = (containerWidth - scaledWidth) / 2;
  const offsetY = (containerHeight - scaledHeight) / 2;

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const dataURLToBlob = (dataURL: string): Blob => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = Math.max(1, Math.min(4, Number(e.target.value)));
      setImageCount(value);
    } catch (error) {}
  };

  const sendToBackend = async () => {
    if (!uploadedImage || !imageRef.current) return;
    setIsLoading(true);

    imageLayerRef.current?.visible(false);
    const maskDataUrl = imageRef.current
      .getStage()
      .toDataURL({ mimeType: "image/png" });
    imageLayerRef.current?.visible(true);

    const maskBlob = dataURLToBlob(maskDataUrl);

    const canvas = document.createElement("canvas");
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(uploadedImage, 0, 0);

    const imageBlob: Blob = await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), "image/png")
    );

    const formData = new FormData();
    formData.append("image", imageBlob, "image.png");
    formData.append("mask", maskBlob, "mask.png");
    formData.append("prompt", prompt);
    if (imageCount) formData.append("image_count", imageCount.toString());
    if (width) formData.append("width", width.toString());
    if (height) formData.append("height", height.toString());
    if (guidanceScale)
      formData.append("guidance_scale", guidanceScale.toString());
    if (strength) formData.append("strength", strength.toString());

    try {
      const response = await fetch(
        "https://subtle-prepared-vulture.ngrok-free.app/inpaint",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Server error");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setResponseImage(url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCanvas = () => {
    setLines([]);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 w-full min-h-screen">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-black mb-2">
          AI Image Inpainting
        </h2>
        <p className="text-black text-lg">
          Draw on the areas you want to modify, then describe what you'd like to
          see
        </p>
      </div>

      {/* Canvas Container */}
      <div className="relative group">
        <div
          className="relative overflow-hidden rounded-lg border-2 border-white/20 transition-all duration-300 group-hover:border-white/40"
          style={{ width: containerWidth, height: containerHeight }}
        >
          <Stage
            width={containerWidth}
            height={containerHeight}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            className="relative z-10 cursor-crosshair"
          >
            <Layer ref={imageLayerRef}>
              <KonvaImage
                image={uploadedImage}
                ref={imageRef}
                x={offsetX}
                y={offsetY}
                width={scaledWidth}
                height={scaledHeight}
              />
            </Layer>
            <Layer ref={drawingLayerRef}>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth={20}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                  opacity={0.7}
                  shadowColor="rgba(255, 255, 255, 0.3)"
                  shadowBlur={10}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Prompt Input */}
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to see in the painted areas..."
            className="w-full px-6 py-4 border-2 border-white/20 text-black placeholder-gray-400 rounded-lg shadow-lg focus:outline-none focus:border-white/40 transition-all duration-300 text-lg"
          />
        </div>
        {/* More Options Toggle */}
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="flex items-center gap-2 text-lg font-semibold text-black focus:outline-none transition-colors duration-300"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                showOptions ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            More Options
          </button>

          <div
            className={`grid transition-all duration-500 overflow-hidden ${
              showOptions
                ? "max-h-[800px] mt-4 opacity-100"
                : "max-h-0 opacity-0"
            } grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 border-2 border-white/20 rounded-lg shadow-lg p-4`}
          >
            <input
              max={4}
              min={1}
              type="number"
              value={imageCount}
              placeholder="Image Count (1–4)"
              onChange={handleCountChange}
              className="w-full px-4 py-3 border-2 border-white/20 text-black placeholder-gray-400 rounded-lg shadow focus:outline-none focus:border-white/40 transition-all duration-300 text-md"
            />
            <input
              type="number"
              value={width || ""}
              placeholder="Width (in px)"
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-white/20 text-black placeholder-gray-400 rounded-lg shadow focus:outline-none focus:border-white/40 transition-all duration-300 text-md"
            />
            <input
              type="number"
              value={height || ""}
              placeholder="Height (in px)"
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-white/20 text-black placeholder-gray-400 rounded-lg shadow focus:outline-none focus:border-white/40 transition-all duration-300 text-md"
            />
            <input
              type="number"
              value={guidanceScale || ""}
              placeholder="Guidance Scale"
              onChange={(e) => setGuidanceScale(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-white/20 text-black placeholder-gray-400 rounded-lg shadow focus:outline-none focus:border-white/40 transition-all duration-300 text-md"
            />
            <input
              type="number"
              step="0.1"
              value={strength || ""}
              placeholder="Strength"
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-white/20 text-black placeholder-gray-400 rounded-lg shadow focus:outline-none focus:border-white/40 transition-all duration-300 text-md"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={sendToBackend}
            disabled={!prompt || isLoading || lines.length === 0}
            className={`flex items-center justify-center gap-1 px-6 py-3 rounded-lg shadow-lg transition-all duration-200 font-medium text-lg min-w-[140px] border-1 ${
              prompt && !isLoading && lines.length > 0
                ? "bg-white text-black cursor-pointer border-white hover:bg-gray-100 hover:text-green-600 transform hover:scale-105"
                : "bg-black text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className={`w-5 h-5 ${
                    prompt && !isLoading && lines.length > 0
                      ? "text-yellow-600"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Generate</span>
              </>
            )}
          </button>
          <button
            onClick={clearCanvas}
            disabled={lines.length === 0}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-lg transition-all duration-200 font-medium text-lg border-1 bg-white ${
              lines.length > 0
                ? "hover:text-red-600 text-black cursor-pointer border-white/30 hover:border-red-600/50"
                : "text-gray-500 cursor-not-allowed border-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear
          </button>
        </div>

        {/* Status Messages */}
        {lines.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            Start by painting areas you want to modify
          </div>
        )}
        {lines.length > 0 && !prompt && (
          <div className="text-center text-gray-300 text-sm">
            Add a description to generate your image
          </div>
        )}
      </div>
    </div>
  );
}
