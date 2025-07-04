import { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import Spinner from ".././components/Spinner";

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
  const isDrawing = useRef(false);
  const imageRef = useRef<any>(null);
  const drawingLayerRef = useRef<any>(null);
  const imageLayerRef = useRef<any>(null);

  const containerWidth = 800;
  const containerHeight = 600;

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

  const sendToBackend = async () => {
    if (!uploadedImage || !imageRef.current) return;
    setIsLoading(true); // Start spinner

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
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 w-full h-full">
      <div
        className="flex items-center justify-center"
        style={{ width: containerWidth, height: containerHeight }}
      >
        <Stage
          width={containerWidth}
          height={containerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
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
                stroke="white"
                strokeWidth={20}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
                opacity={0.5}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="flex gap-4 w-full justify-center items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt for inpainting..."
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendToBackend}
          disabled={!prompt || isLoading}
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg shadow transition ${
            prompt && !isLoading
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          {isLoading ? <Spinner /> : "Inpaint"}
        </button>
      </div>
    </div>
  );
}
