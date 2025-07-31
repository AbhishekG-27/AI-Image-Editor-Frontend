"use client";
import { ModelSelector } from "@/components/ModelSelector";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageCount, setImageCount] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageDimension, setImageDimension] = useState("1:1");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImages([]);

    // Simulate image generation for demo
    setTimeout(() => {
      const dummyImage = "/carousel-1.png";
      setGeneratedImages(Array(imageCount).fill(dummyImage));
      setLoading(false);
    }, 1500);
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

          <label className="text-sm">Image model</label>
          <ModelSelector />

          <label className="text-sm mt-3">Image Dimensions</label>
          <div className="w-full flex gap-4">
            {["1:1", "16:9", "9:16", "3:2", "2:3"].map((dim) => (
              <label
                key={dim}
                onClick={() => setImageDimension(dim)}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white ${
                  imageDimension === dim
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white/10 hover:border-indigo-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div
                    className={`border transition-colors h-5 w-5 ${
                      imageDimension == dim ? "border-black" : "border-white"
                    }`}
                  ></div>
                  <span
                    className={`text-xs mt-1 ${
                      imageDimension === dim ? "text-black" : "text-white"
                    }`}
                  >
                    {dim}
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
              className="text-sm font-semibold flex items-center justify-between w-full bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-lg"
            >
              Advanced Options
              <span
                className={`transform transition-transform ${
                  isAdvancedOpen ? "rotate-90" : ""
                }`}
              >
                ▶
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
                    {/* Guidance Scale */}
                    <label className="text-sm">Guidance Scale</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      step={0.5}
                      placeholder="7.5"
                      className="bg-black border border-white/20 px-4 py-2 rounded-lg placeholder-gray-400"
                    />

                    {/* Strength */}
                    <label className="text-sm">Strength</label>
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.1}
                      placeholder="0.8"
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
          {loading && <p className="text-gray-400">Generating images...</p>}

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
