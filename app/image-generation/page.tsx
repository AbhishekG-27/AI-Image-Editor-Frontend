"use client";
import { ModelSelector } from "@/components/ModelSelector";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageCount, setImageCount] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageDimension, setImageDimension] = useState("1:1");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [strength, setStrength] = useState(0.8);
  const [numInferenceSteps, setNumInferenceSteps] = useState(30);

  // A simple spinner component for loading states
  const Loader = () => (
    <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
  );

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImages([]);

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (imageCount) formData.append("image_count", imageCount.toString());
    if (imageDimension) formData.append("image_dimension", imageDimension);
    if (guidanceScale)
      formData.append("guidance_scale", guidanceScale.toString());
    if (strength) formData.append("strength", strength.toString());
    if (numInferenceSteps)
      formData.append("num_inference_steps", numInferenceSteps.toString());

    try {
      const response = await fetch(
        "https://subtle-prepared-vulture.ngrok-free.app/generate",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Server error");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      // setResponseImage(url);
    } catch (err) {
      console.error("Upload failed:", err);
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

  // Handler to enforce the min/max for the Strength input
  const handleStrengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "") {
      setStrength(0);
      return;
    }
    let numValue = parseFloat(value);
    if (numValue > 1) numValue = 1;
    if (numValue < 0) numValue = 0;
    setStrength(numValue);
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

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="flex flex-col md:flex-row text-white bg-black p-6 gap-6 w-[90%] mx-auto">
        {/* Left Panel */}
        <div className="md:w-[30%] bg-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-4 mt-20">
          <h2 className="text-2xl font-bold mb-2">Image Generation Panel</h2>

          <label className="text-sm">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="bg-black border border-white/20 p-3 rounded-lg resize-none h-24 placeholder-gray-400"
          />

          <div className="flex w-full flex-col gap-2">
            <label className="text-sm">Image model</label>
            <ModelSelector />
          </div>

          <label className="text-sm mt-3">Image Dimensions</label>
          <div className="w-full flex gap-4">
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
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white ${
                  imageDimension === dim.ratio
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white/10 hover:border-indigo-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div
                    style={{ height: dim.height, width: dim.width }}
                    className={`border transition-colors ${
                      imageDimension == dim.ratio
                        ? "border-black"
                        : "border-white"
                    }`}
                  ></div>
                  <span
                    className={`text-xs mt-1 ${
                      imageDimension === dim.ratio ? "text-black" : "text-white"
                    }`}
                  >
                    {dim.ratio}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <label className="text-sm">Number of Images</label>
          <div className="w-full flex gap-4">
            {[1, 2, 3, 4, 5].map((count) => (
              <label
                key={count}
                onClick={() => setImageCount(count)}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200
        border-white 
        ${
          imageCount === count
            ? "bg-indigo-50 border-indigo-400 text-black"
            : "bg-white/10 hover:border-indigo-400"
        }`}
              >
                {count}
              </label>
            ))}
          </div>

          {/* Advanced Options Toggle */}
          <div className="mt-4">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="cursor-pointer text-sm font-semibold flex items-center justify-between w-full bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-lg"
            >
              Advanced Options
              <span
                className={`transform transition-transform ${
                  isAdvancedOpen ? "rotate-90" : ""
                }`}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </span>
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
                  <div className="mt-4 flex flex-col gap-4 text-white">
                    <label className="text-sm">
                      Guidance Scale{" "}
                      <span className="text-xs text-gray-400">
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
                      className="bg-black border border-white/20 px-4 py-2 rounded-lg placeholder-gray-400"
                    />

                    <label className="text-sm">
                      Strength{" "}
                      <span className="text-xs text-gray-400">
                        (range: 0-1)
                      </span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.1}
                      value={strength}
                      onChange={handleStrengthChange}
                      className="bg-black border border-white/20 px-4 py-2 rounded-lg placeholder-gray-400"
                    />
                    <label className="text-sm">
                      Number of Inference Steps{" "}
                      <span className="text-xs text-gray-400">
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
                      className="bg-black border border-white/20 px-4 py-2 rounded-lg placeholder-gray-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={loading}
            size="lg"
            className="mt-4 bg-white text-black py-6 rounded-lg font-semibold hover:border-indigo-400 transition-all cursor-pointer"
          >
            {loading ? "Generating..." : "Generate Image"}
          </Button>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white/5 rounded-2xl p-6 shadow-xl mt-20">
          <h2 className="text-2xl font-bold mb-4">Generated Image Results</h2>
          {loading && (
            <div className="flex items-center justify-center mb-4">
              <Loader />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generatedImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Generated ${index}`}
                className="w-full rounded-lg border border-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
