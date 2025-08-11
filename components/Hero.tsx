"use client";
import Button from "./Button";
import { PiLightning } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isHovered, setIsHovered] = useState(false);

  // Sample images for the carousel - replace with your actual images
  const carouselImages = [
    {
      src: "/carousel-1.png",
      caption: "Advanced AI-Powered Editing Tools",
    },
    {
      src: "/carousel-2.png",
      caption: "Seamless Creative Workflows",
    },
    {
      src: "/carousel-3.png",
      caption: "Professional Photo Enhancement",
    },
  ];

  // Get responsive values based on current window width
  const getResponsiveValues = useCallback(() => {
    if (windowWidth >= 1280) {
      return { halfWidth: 288, spacing: 200 };
    } else if (windowWidth >= 1024) {
      return { halfWidth: 240, spacing: 180 };
    } else if (windowWidth >= 768) {
      return { halfWidth: 192, spacing: 160 };
    } else {
      return { halfWidth: 160, spacing: 140 };
    }
  }, [windowWidth]);

  const heading = "Let's Edit";
  const subHeading =
    "Next-Gen AI Image Editor: Seamless, Smart, and Intuitive Visual Editing";

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
  }, []);

  // Handle window resize with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Auto-rotate carousel (pause on hover)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000); // Increased interval for better UX

    return () => clearInterval(interval);
  }, [carouselImages.length, isHovered]);

  if (!mounted) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Clean white background */}
      <div className="absolute inset-0 bg-white" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        {/* Text Content */}
        <motion.div
          className="text-center mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent mb-2 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {heading}
          </motion.h1>

          <motion.p
            className="text-gray-700 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {subHeading}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Button
              id="try-free-button"
              title="Try it Free"
              containerClass="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium border-2 border-black"
              onClick={() => {}}
              disabled={false}
            />
            <Button
              id="go-pro-button"
              title="Go Pro"
              containerClass="bg-white hover:bg-gray-50 border-2 border-black hover:border-gray-800 text-black px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              leftIcon={<PiLightning className="w-5 h-5" />}
              onClick={() => {}}
              disabled={false}
            />
          </motion.div>
        </motion.div>

        {/* 3D Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="relative flex items-center justify-center w-80 h-56 sm:w-96 sm:h-64 md:w-[32rem] md:h-80 lg:w-[40rem] lg:h-96 xl:w-[48rem] xl:h-[28rem]"
            style={{ perspective: "1200px" }}
          >
            <AnimatePresence>
              {carouselImages.map((imageData, index) => {
                const isActive = index === currentIndex;
                const isPrev =
                  index ===
                  (currentIndex - 1 + carouselImages.length) %
                    carouselImages.length;
                const isNext =
                  index === (currentIndex + 1) % carouselImages.length;

                if (!isActive && !isPrev && !isNext) return null;

                const { spacing } = getResponsiveValues();

                let xPosition = 0;
                if (isPrev) {
                  xPosition = -spacing;
                } else if (isNext) {
                  xPosition = spacing;
                }

                return (
                  <motion.div
                    key={index}
                    className="absolute top-0 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                    style={{
                      width: "clamp(280px, 80vw, 36rem)",
                      height: "clamp(200px, 60vw, 24rem)",
                      transformStyle: "preserve-3d",
                      zIndex: isActive ? 30 : 20,
                    }}
                    initial={{
                      x: xPosition,
                      rotateY: isActive ? 0 : isPrev ? -30 : 30,
                      z: isActive ? 0 : -80,
                      opacity: isActive ? 1 : 0.6,
                      scale: isActive ? 1 : 0.8,
                    }}
                    animate={{
                      x: xPosition,
                      rotateY: isActive ? 0 : isPrev ? -30 : 30,
                      z: isActive ? 0 : -80,
                      opacity: isActive ? 1 : 0.6,
                      scale: isActive ? 1 : 0.8,
                    }}
                    exit={{
                      x: isPrev ? -300 : 300,
                      rotateY: isPrev ? -60 : 60,
                      z: -150,
                      opacity: 0,
                      scale: 0.5,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{
                      scale: isActive ? 1.05 : 0.85,
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={imageData.src}
                      alt={`Carousel image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Glow effect for active image */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl shadow-2xl ring-2 ring-black/30" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/10 backdrop-blur-md border border-black/20 flex items-center justify-center text-black hover:bg-black/20 transition-all duration-200 hover:scale-110"
              onClick={() =>
                setCurrentIndex(
                  (currentIndex - 1 + carouselImages.length) %
                    carouselImages.length
                )
              }
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/10 backdrop-blur-md border border-black/20 flex items-center justify-center text-black hover:bg-black/20 transition-all duration-200 hover:scale-110"
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % carouselImages.length)
              }
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Modern carousel indicators */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {carouselImages.map((_, index) => (
                <motion.button
                  key={index}
                  className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 h-3 bg-black"
                      : "w-3 h-3 bg-black/30 hover:bg-black/50"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-0 bg-black rounded-full"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Animated Caption with modern styling */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-center"
              >
                <p className="text-gray-600 text-lg sm:text-xl font-medium px-4">
                  {carouselImages[currentIndex].caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-black/20 rounded-full"
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
          className="absolute top-40 right-20 w-1 h-1 bg-black/15 rounded-full"
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
          className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-black/18 rounded-full"
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

export default Hero;
