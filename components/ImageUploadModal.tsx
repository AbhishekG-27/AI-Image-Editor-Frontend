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
    }, 300);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        className="w-full px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-2 pt-16">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent my-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              AI Inpainting Studio
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Upload an image and use our advanced AI to seamlessly remove or
              modify objects with precision and creativity
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-12">
          {/* Upload Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-black flex items-center">
                  <motion.div
                    className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Upload className="text-white" size={24} />
                  </motion.div>
                  Upload & Edit
                </h2>
                <AnimatePresence>
                  {imageElement && (
                    <motion.button
                      onClick={clearImage}
                      className="group p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-gray-200"
                      title="Clear image"
                      type="button"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X
                        size={24}
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
                    className={`relative flex flex-col items-center justify-center min-h-96 px-8 py-16 text-center transition-all duration-300 border-2 border-dashed rounded-2xl overflow-hidden ${
                      isDragOver
                        ? "border-black bg-gray-50 scale-[1.02] shadow-lg"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Subtle background pattern */}
                    <motion.div
                      className="absolute inset-0 opacity-5"
                      animate={{
                        background: isDragOver
                          ? "radial-gradient(circle, #000 1px, transparent 1px)"
                          : "radial-gradient(circle, #666 1px, transparent 1px)",
                      }}
                      style={{
                        backgroundSize: "20px 20px",
                      }}
                    />

                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer relative z-10 group"
                    >
                      <motion.div
                        className={`mb-8 p-6 rounded-2xl transition-all duration-300 ${
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
                            size={56}
                          />
                        </motion.div>
                      </motion.div>
                      <h3
                        className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                          isDragOver
                            ? "text-black"
                            : "text-gray-700 group-hover:text-black"
                        }`}
                      >
                        {isDragOver
                          ? "Drop it like it's hot! 🔥"
                          : "Upload Your Image"}
                      </h3>
                      <p className="text-gray-500 mb-6 text-lg">
                        {isDragOver
                          ? "Release to upload your image"
                          : "Drag & drop or click to select an image file"}
                      </p>
                      <div className="flex flex-wrap justify-center gap-3 text-sm">
                        {["PNG", "JPG", "JPEG", "WEBP"].map((format, index) => (
                          <motion.span
                            key={format}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-medium transition-colors duration-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
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
                    className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 overflow-hidden"
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
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8 flex items-center">
                <motion.div
                  className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-md"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Limage className="text-white" size={24} />
                </motion.div>
                AI Results
              </h2>

              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center min-h-96 flex items-center justify-center overflow-hidden">
                {/* Subtle animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  animate={{
                    backgroundPosition: ["0px 0px", "20px 20px"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

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
                          className="max-w-full max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[32rem] xl:max-h-[36rem] 2xl:max-h-[40rem] mx-auto rounded-2xl shadow-lg object-contain border-2 border-gray-200"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <motion.div
                        className="mt-8 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-lg font-semibold text-black flex items-center justify-center">
                          <motion.svg
                            className="w-6 h-6 mr-3 text-green-600"
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
                        <p className="text-gray-600 mt-2">
                          Right-click on the image to save it to your device
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
                        className="mb-8 p-6 bg-gray-100 rounded-2xl inline-block"
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
                        <Limage className="mx-auto text-gray-400" size={56} />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        Waiting for Magic ✨
                      </h3>
                      <p className="text-gray-500 mb-3 text-lg">
                        Your AI-processed image will appear here
                      </p>
                      <p className="text-gray-400">
                        Upload an image and start painting to see the results
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {responseImage && (
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = responseImage;
                        link.download = "ai-inpainted-image.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex-1 py-4 px-8 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Image
                    </motion.button>
                    <motion.button
                      onClick={() => setResponseImage(null)}
                      className="py-4 px-8 bg-white hover:bg-gray-50 text-black border-2 border-black hover:border-gray-800 rounded-xl transition-all duration-200 font-semibold hover:scale-105 flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X size={20} />
                      Clear Result
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
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
};

export default InpaintEditor;
