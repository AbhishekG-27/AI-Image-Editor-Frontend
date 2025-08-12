"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, DownloadIcon } from "lucide-react";
import JSZip from "jszip";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageCount, setImageCount] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageDimension, setImageDimension] = useState("1:1");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [numInferenceSteps, setNumInferenceSteps] = useState(30);
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Enhanced spinner component with black and white theme
  const Loader = () => (
    <div className="w-6 h-6 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
  );

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImages([]);

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (negativePrompt) formData.append("negative_prompt", negativePrompt);
    if (imageCount) formData.append("image_count", imageCount.toString());
    if (imageDimension) formData.append("image_dimension", imageDimension);
    if (guidanceScale)
      formData.append("guidance_scale", guidanceScale.toString());
    if (numInferenceSteps)
      formData.append("num_inference_steps", numInferenceSteps.toString());
    if (negativePrompt) {
      if (showSensitiveContent) {
        formData.append("negative_prompt", negativePrompt);
      } else {
        formData.append(
          "negative_prompt",
          `NSFW, adult content, sensitive content ${negativePrompt}`
        );
      }
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL!}/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      if (data && data.images_base64 && Array.isArray(data.images_base64)) {
        setGeneratedImages(
          data.images_base64.map(
            (b64: string) => `data:image/png;base64,${b64}`
          )
        );
      } else {
        setGeneratedImages([]);
      }
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler to enforce the min/max for the Guidance Scale input
  const handleGuidanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "") {
      setGuidanceScale(1);
      return;
    }
    let numValue = parseFloat(value);
    if (numValue > 20) numValue = 20;
    if (numValue < 1) numValue = 1;
    setGuidanceScale(numValue);
  };

  const handleNumInferenceStepsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    if (value === "") {
      setNumInferenceSteps(20);
      return;
    }
    let numValue = parseInt(value);
    if (numValue > 50) numValue = 50;
    if (numValue < 20) numValue = 20;
    setNumInferenceSteps(numValue);
  };

  const downloadAllImages = async () => {
    setIsDownloading(true);
    if (generatedImages.length === 0) {
      setIsDownloading(false);
      return;
    }
    if (generatedImages.length === 1) {
      const imageSrc = generatedImages[0];
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = `generated-image-1.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
      return;
    }

    const zip = new JSZip();
    generatedImages.forEach((imageSrc, index) => {
      const base64Data = imageSrc.split(",")[1];
      zip.file(`generated-image-${index + 1}.png`, base64Data, {
        base64: true,
      });
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "generated-images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
    setIsDownloading(false);
  };

  const downloadSingleImage = (imageSrc: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `generated-image-${index + 1}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Page Header */}
      <div className="pt-24 pb-8 text-center">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent my-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          AI Image Generator
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Transform your ideas into stunning visuals with our advanced AI
          technology
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row text-black bg-white p-6 gap-8 max-w-7xl mx-auto">
        {/* Left Panel */}
        <motion.div
          className="lg:w-[35%] bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col gap-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-2 text-black">
            Generation Settings
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black p-4 rounded-xl resize-none h-24 placeholder-gray-400 transition-all duration-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between w-full">
            <label className="text-sm font-medium text-gray-700">
              Show Sensitive Content
            </label>
            <button
              onClick={() => setShowSensitiveContent(!showSensitiveContent)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                showSensitiveContent ? "bg-black" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showSensitiveContent ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Image Dimensions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { ratio: "1:1", width: "16px", height: "16px" },
                { ratio: "16:9", width: "20px", height: "11.25px" },
                { ratio: "9:16", width: "11.25px", height: "20px" },
                { ratio: "3:2", width: "20px", height: "13.3333px" },
                { ratio: "2:3", width: "13.3333px", height: "20px" },
              ].map((dim) => (
                <label
                  key={dim.ratio}
                  onClick={() => setImageDimension(dim.ratio)}
                  className={`flex items-center justify-center h-16 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    imageDimension === dim.ratio
                      ? "bg-black border-black text-white"
                      : "bg-gray-50 border-gray-200 hover:border-black hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div
                      style={{ height: dim.height, width: dim.width }}
                      className={`border transition-colors ${
                        imageDimension === dim.ratio
                          ? "border-white"
                          : "border-black"
                      }`}
                    ></div>
                    <span className="text-xs mt-1 font-medium">
                      {dim.ratio}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Number of Images
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((count) => (
                <label
                  key={count}
                  onClick={() => setImageCount(count)}
                  className={`flex items-center justify-center h-16 rounded-xl border-2 cursor-pointer transition-all duration-200 font-bold text-lg ${
                    imageCount === count
                      ? "bg-black border-black text-white"
                      : "bg-gray-50 border-gray-200 hover:border-black hover:bg-gray-100"
                  }`}
                >
                  {count}
                </label>
              ))}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="space-y-4">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full text-sm font-semibold flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-black transition-all px-6 py-4 rounded-xl"
            >
              <span className="text-gray-700">Advanced Options</span>
              <motion.div
                animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div
                  key="advanced-options"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-2">
                    {/* Negative Prompt */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Negative Prompt{" "}
                        <span className="text-xs text-gray-500">
                          (things to avoid)
                        </span>
                      </label>
                      <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Describe what you don't want to see in the image..."
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black p-4 rounded-xl resize-none h-20 placeholder-gray-400 transition-all duration-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Guidance Scale{" "}
                        <span className="text-xs text-gray-500">
                          (range: 1-20)
                        </span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        step={0.5}
                        value={guidanceScale}
                        onChange={handleGuidanceChange}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3 rounded-xl placeholder-gray-400 transition-all duration-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Number of Inference Steps{" "}
                        <span className="text-xs text-gray-500">
                          (range: 20-50)
                        </span>
                      </label>
                      <input
                        type="number"
                        min={20}
                        max={50}
                        step={5}
                        value={numInferenceSteps}
                        onChange={handleNumInferenceStepsChange}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3 rounded-xl placeholder-gray-400 transition-all duration-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            size="lg"
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader />
                Generating...
              </div>
            ) : (
              "Generate Images"
            )}
          </Button>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className="flex-1 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Generated Results</h2>
            {loading && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>

          {generatedImages.length === 0 && !loading && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  No images generated yet
                </p>
                <p className="text-gray-400 text-sm">
                  Enter a prompt and click generate to get started
                </p>
              </div>
            </div>
          )}

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {generatedImages.map((src, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center relative group"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="relative w-full">
                  <motion.img
                    src={src}
                    alt={`Generated ${index}`}
                    className="w-full h-auto rounded-xl border-2 border-gray-200 object-contain shadow-md"
                    style={{
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                    initial={{ filter: "blur(10px)" }}
                    animate={{ filter: "blur(0px)" }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2 + 0.3,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => downloadSingleImage(src, index)}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors duration-200 cursor-pointer shadow-lg"
                    >
                      <DownloadIcon className="w-6 h-6 text-black" />
                    </button>
                  </motion.div>
                </div>
                <motion.p
                  className="text-sm text-gray-500 mt-3 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2 + 0.5,
                  }}
                >
                  Image {index + 1}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {generatedImages.length > 0 && (
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                onClick={() => {
                  setGeneratedImages([]);
                  setPrompt("");
                }}
                className="bg-white hover:bg-gray-50 border-2 border-black hover:border-gray-800 text-black px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                Clear All
              </Button>
              <Button
                onClick={downloadAllImages}
                disabled={isDownloading}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader />
                    Downloading...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    {generatedImages.length > 1
                      ? `Download All (${generatedImages.length})`
                      : "Download Image"}
                    {generatedImages.length > 1 && (
                      <span className="text-xs opacity-75">.zip</span>
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

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
