"use client";
import { ModelSelector } from "@/components/ModelSelector";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState<number>(512);
  const [height, setHeight] = useState<number>(512);
  const [imageCount, setImageCount] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="border transition-colors border-white h-5 w-5"></div>
                <span className="text-xs mt-1 text-white">1:1</span>
              </div>
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="border transition-colors border-white h-[11.25px] w-[20px]"></div>
                <span className="text-xs mt-1 text-white">16:9</span>
              </div>
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="border transition-colors border-white h-[20px] w-[11.25px]"></div>
                <span className="text-xs mt-1 text-white">9:16</span>
              </div>
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="border transition-colors border-white h-[13.3333px] w-[20px]"></div>
                <span className="text-xs mt-1 text-white">3:2</span>
              </div>
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="border transition-colors border-white h-[20px] w-[13.3333px]"></div>
                <span className="text-xs mt-1 text-white">2:3</span>
              </div>
            </label>
          </div>

          <label className="text-sm">Number of Images</label>
          <div className="w-full flex gap-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              1
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              2
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              3
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              4
            </label>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center w-16 h-16 rounded-md border cursor-pointer transition-all duration-200 border-white bg-white/10 hover:border-indigo-400">
              5
            </label>
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
