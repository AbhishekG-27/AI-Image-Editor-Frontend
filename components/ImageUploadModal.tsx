"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Image as Limage,
  Pen,
  Eraser,
  RotateCcw,
  Palette,
} from "lucide-react";
import InpaintCanvas from "./InpaintCanvas";

const InpaintEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );
  const [responseImage, setResponseImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300); // Small delay ensures DOM is updated
  };

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, or JPEG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => setImageElement(img);
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const dragHandlers = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    onDrop: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
  };

  const clearImage = () => {
    setImageElement(null);
    setResponseImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.div
        className="w-full px-4 sm:px-6 lg:px-8 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-white mt-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              AI Inpainting Studio
            </motion.h1>
            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto my-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Upload an image and use our advanced AI to seamlessly remove or
              modify objects
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-black flex items-center">
                  <motion.div
                    className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Upload className="text-white" size={20} />
                  </motion.div>
                  Inpaint Tool
                </h2>
                <AnimatePresence>
                  {imageElement && (
                    <motion.button
                      onClick={clearImage}
                      className="group p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-200"
                      title="Clear image"
                      type="button"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X
                        size={20}
                        className="group-hover:rotate-90 transition-transform duration-200"
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {!imageElement ? (
                  <motion.div
                    key="upload"
                    {...dragHandlers}
                    className={`relative flex flex-col items-center justify-center min-h-96 px-6 py-12 text-center transition-all duration-300 border-2 border-dashed rounded-2xl overflow-hidden ${
                      isDragOver
                        ? "border-black bg-gray-50 scale-[1.02] shadow-lg"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated background pattern */}
                    <motion.div
                      className="absolute inset-0 opacity-5"
                      animate={{
                        background: isDragOver
                          ? "linear-gradient(45deg, #000 25%, transparent 25%)"
                          : "linear-gradient(45deg, #666 25%, transparent 25%)",
                      }}
                    >
                      <div className="absolute inset-0 bg-black transform rotate-12 scale-150"></div>
                    </motion.div>

                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer relative z-10 group"
                    >
                      <motion.div
                        className={`mb-6 p-4 rounded-2xl transition-all duration-300 ${
                          isDragOver
                            ? "bg-black scale-110"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={isDragOver ? { y: [0, -10, 0] } : {}}
                          transition={{
                            duration: 0.6,
                            repeat: isDragOver ? Infinity : 0,
                          }}
                        >
                          <Upload
                            className={`mx-auto transition-all duration-300 ${
                              isDragOver
                                ? "text-white"
                                : "text-gray-600 group-hover:text-black"
                            }`}
                            size={48}
                          />
                        </motion.div>
                      </motion.div>
                      <h3
                        className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                          isDragOver
                            ? "text-black"
                            : "text-gray-700 group-hover:text-black"
                        }`}
                      >
                        {isDragOver
                          ? "Drop it like it's hot! 🔥"
                          : "Upload Your Image"}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {isDragOver
                          ? "Release to upload your image"
                          : "Drag & drop or click to select"}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                        {["PNG", "JPG", "JPEG"].map((format, index) => (
                          <motion.span
                            key={format}
                            className="px-2 py-1 bg-gray-200 rounded-full"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            {format}
                          </motion.span>
                        ))}
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="canvas"
                    className="bg-gray-100 rounded-2xl p-2 sm:p-4 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full flex items-center justify-center overflow-hidden">
                      <InpaintCanvas
                        uploadedImage={imageElement}
                        setResponseImage={(url) => {
                          setResponseImage(url);
                          scrollToResults();
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Response Section */}
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 flex items-center">
                <motion.div
                  className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-3"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Limage className="text-white" size={20} />
                </motion.div>
                AI Results
              </h2>

              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center min-h-96 flex items-center justify-center overflow-hidden">
                {/* Animated background for empty state */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  animate={{
                    background:
                      "linear-gradient(45deg, #000 25%, transparent 25%)",
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute inset-0 bg-black transform -rotate-12 scale-150"></div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {responseImage ? (
                    <motion.div
                      key="result"
                      className="w-full relative z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative group">
                        <motion.img
                          src={responseImage}
                          alt="AI Processing Result"
                          className="max-w-full max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[32rem] xl:max-h-[36rem] 2xl:max-h-[40rem] mx-auto rounded-2xl shadow-lg object-contain"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <motion.div
                        className="mt-6 p-4 bg-gray-100 rounded-xl border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-sm font-medium text-black flex items-center justify-center">
                          <motion.svg
                            className="w-4 h-4 mr-2 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.5,
                              type: "spring",
                              stiffness: 500,
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                          Processing Complete! Your image has been enhanced by
                          AI
                        </p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="text-gray-500 relative z-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <motion.div
                        className="mb-6 p-4 bg-gray-100 rounded-2xl inline-block"
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Limage className="mx-auto text-gray-400" size={48} />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Waiting for Magic ✨
                      </h3>
                      <p className="text-gray-500 mb-2">
                        Your AI-processed image will appear here
                      </p>
                      <p className="text-sm text-gray-400">
                        Upload an image and start painting to see the results
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {responseImage && (
                  <motion.button
                    onClick={() => setResponseImage("")}
                    className="w-full mt-6 py-3 px-6 bg-white text-black rounded-xl hover:text-red-600 hover:border-red-600/50 transition-all duration-200 font-medium border border-gray-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear Result
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #000;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #000;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default InpaintEditor;
