import { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";

interface InpaintCanvasProps {
  uploadedImage: HTMLImageElement;
}

export default function InpaintCanvas({ uploadedImage }: InpaintCanvasProps) {
  const [lines, setLines] = useState<{ points: number[] }[]>([]);
  const isDrawing = useRef(false);
  const imageRef = useRef<any>(null);
  const drawingLayerRef = useRef<any>(null);
  const imageLayerRef = useRef<any>(null);

  const containerWidth = 800;
  const containerHeight = 600;

  const imageWidth = uploadedImage.width;
  const imageHeight = uploadedImage.height;

  const scale = Math.max(
    containerWidth / imageWidth,
    containerHeight / imageHeight
  );
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  const offsetX = (scaledWidth - containerWidth) / 2;
  const offsetY = (scaledHeight - containerHeight) / 2;

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

  const extractMask = (): void => {
    if (imageLayerRef.current) {
      imageLayerRef.current.visible(false);
    }

    const stage = imageRef.current.getStage();
    const dataURL = stage.toDataURL({ mimeType: "image/png", pixelRatio: 1 });

    if (imageLayerRef.current) {
      imageLayerRef.current.visible(true);
    }

    // Create a download link
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "mask.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="border rounded overflow-hidden"
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
              x={-offsetX}
              y={-offsetY}
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
                opacity={1}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Extract Mask Button */}
      <button
        onClick={extractMask}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Extract Mask
      </button>
    </div>
  );
}
