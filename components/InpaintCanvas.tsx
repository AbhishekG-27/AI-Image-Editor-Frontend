import { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
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
  const [numInferenceSteps, setNumInferenceSteps] = useState<
    number | undefined
  >(30);
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

  const handleNumInferenceStepsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const value = Math.max(1, Math.min(60, Number(e.target.value)));
      setNumInferenceSteps(value);
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
    if (numInferenceSteps)
      formData.append("num_inference_steps", numInferenceSteps.toString());

    try {
      const response = await fetch(`${process.env.BACKEND_URL!}/inpaint`, {
        method: "POST",
        body: formData,
      });

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
    <div className="flex flex-col items-center justify-center gap-8 p-6 w-full min-h-screen bg-white">
      {/* Header */}
      <motion.div
        className="text-center mb-6 max-w-4xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent mb-4">
          AI Image Inpainting
        </h2>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Draw on the areas you want to modify, then describe what you'd like to
          see
        </p>
      </motion.div>

      {/* Canvas Container */}
      <motion.div
        className="relative group"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-black/20"
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
                  stroke="rgba(0, 0, 0, 0.8)"
                  strokeWidth={20}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                  opacity={0.7}
                  shadowColor="rgba(0, 0, 0, 0.3)"
                  shadowBlur={10}
                />
              ))}
            </Layer>
          </Stage>

          {/* Canvas Instructions Overlay */}
          {lines.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-2xl pointer-events-none">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">
                  Click and drag to paint areas you want to modify
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Use your mouse or touch to draw
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="w-full max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Describe what you want to see
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to see in the painted areas..."
            className="w-full px-6 py-4 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-md focus:outline-none focus:shadow-lg transition-all duration-300 text-lg"
          />
        </div>

        {/* Advanced Options Toggle */}
        <div className="space-y-4">
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="flex items-center gap-3 text-lg font-semibold text-gray-700 hover:text-black focus:outline-none transition-colors duration-300 bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-black/20 w-full justify-between"
          >
            <span>Advanced Options</span>
            <motion.div
              animate={{ rotate: showOptions ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                key="advanced-options"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border-2 border-gray-200 rounded-xl shadow-md p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Image Count (1-4)
                    </label>
                    <input
                      max={4}
                      min={1}
                      type="number"
                      value={imageCount}
                      placeholder="1"
                      onChange={handleCountChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-sm focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Inference Steps (1-60)
                    </label>
                    <input
                      max={60}
                      min={1}
                      type="number"
                      value={numInferenceSteps}
                      placeholder="30"
                      onChange={handleNumInferenceStepsChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-sm focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width || ""}
                      placeholder="Auto"
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-sm focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height || ""}
                      placeholder="Auto"
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-sm focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Guidance Scale
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={guidanceScale || ""}
                      placeholder="7.5"
                      onChange={(e) => setGuidanceScale(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-sm focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Strength
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={strength || ""}
                      placeholder="0.8"
                      onChange={(e) => setStrength(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black text-black placeholder-gray-400 rounded-xl shadow-sm focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={sendToBackend}
            disabled={!prompt || isLoading || lines.length === 0}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-200 font-semibold text-lg min-w-[160px] ${
              prompt && !isLoading && lines.length > 0
                ? "bg-black hover:bg-gray-800 text-white border-2 border-black hover:scale-105 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-200"
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
                  className="w-5 h-5"
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
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-200 font-semibold text-lg border-2 ${
              lines.length > 0
                ? "bg-white hover:bg-gray-50 text-black border-black hover:border-gray-800 hover:scale-105 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
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
            Clear Canvas
          </button>
        </div>

        {/* Status Messages */}
        {lines.length > 0 && !prompt && (
          <motion.div
            className="text-center bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="font-medium">
                Add a description to generate your image
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Subtle floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-32 left-10 w-2 h-2 bg-black/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-1 h-1 bg-black/8 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-black/12 rounded-full"
          animate={{
            y: [0, -25, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </div>
  );
}
