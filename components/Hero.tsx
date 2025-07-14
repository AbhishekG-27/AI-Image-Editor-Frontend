"use client";
import Button from "./Button";
import { PiLightning } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Get responsive values based on current window width
  const getResponsiveValues = () => {
    if (windowWidth >= 1280) {
      return { halfWidth: 288, spacing: 180 };
    } else if (windowWidth >= 1024) {
      return { halfWidth: 240, spacing: 160 };
    } else if (windowWidth >= 768) {
      return { halfWidth: 192, spacing: 150 };
    } else {
      return { halfWidth: 160, spacing: 140 };
    }
  };

  const heading = "Let's Edit";
  const subHeading =
    "Next-Gen AI Image Editor: Seamless, Smart, and Intuitive Visual Editing";

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      <div className="relative z-10 h-dvh w-screen overflow-hidden ">
        <img
          src="black-background.jpg"
          alt="black background"
          className="absolute top-0 left-0 size-full z-20 object-cover object-center"
        />
      </div>

      {/* Text Content */}
      <motion.div
        className="absolute z-30 top-[12%] sm:top-[15%] lg:top-[13%] left-1/2 translate-x-[-50%] flex flex-col gap-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-white text-2xl sm:text-3xl md:text-5xl font-medium w-full text-center break-words"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {heading}
        </motion.h1>
        <motion.span
          className="text-white text-xl w-full text-center break-words"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {subHeading}
        </motion.span>
        <motion.div
          className="text-white text-3xl flex gap-4 items-center justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button
            id="launch-button"
            title="Try it Free"
            containerClass="bg-blue-50 flex items-center cursor-pointer justify-center gap-1"
            onClick={() => {}}
            disabled={false}
          />
          <Button
            id="launch-button"
            title="Go Pro"
            containerClass="bg-blue-50 flex items-center cursor-pointer justify-center gap-1 text-xl"
            leftIcon={<PiLightning />}
            onClick={() => {}}
            disabled={false}
          />
        </motion.div>
      </motion.div>

      {/* 3D Carousel */}
      <motion.div
        className="absolute z-25 top-[55%] sm:top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      >
        <div
          className="relative w-96 h-64 md:w-[32rem] md:h-80 lg:w-[40rem] lg:h-96 xl:w-[48rem] xl:h-[28rem]"
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence mode="wait">
            {carouselImages.map((imageData, index) => {
              const isActive = index === currentIndex;
              const isPrev =
                index ===
                (currentIndex - 1 + carouselImages.length) %
                  carouselImages.length;
              const isNext =
                index === (currentIndex + 1) % carouselImages.length;

              if (!isActive && !isPrev && !isNext) return null;

              const { halfWidth, spacing } = getResponsiveValues();

              let xPosition = 0;
              if (isPrev) {
                xPosition = -spacing;
              } else if (isNext) {
                xPosition = spacing;
              }

              return (
                <motion.div
                  key={index}
                  className="absolute top-0 w-80 h-56 md:w-96 md:h-72 lg:w-[30rem] lg:h-80 xl:w-[36rem] xl:h-96 rounded-lg overflow-hidden shadow-2xl"
                  initial={{
                    x: xPosition - halfWidth,
                    rotateY: isActive ? 0 : isPrev ? -25 : 25,
                    z: isActive ? 0 : -50,
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.85,
                  }}
                  animate={{
                    x: xPosition - halfWidth,
                    rotateY: isActive ? 0 : isPrev ? -25 : 25,
                    z: isActive ? 0 : -50,
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.85,
                  }}
                  exit={{
                    x: isPrev ? -200 : 200,
                    rotateY: isPrev ? -45 : 45,
                    z: -100,
                    opacity: 0,
                    scale: 0.6,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    left: "50%",
                    zIndex: isActive ? 30 : 20,
                  }}
                >
                  <img
                    src={imageData.src}
                    alt={`Carousel image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Carousel indicators */}
          <div className="absolute -bottom-8 md:-bottom-5 lg:-bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Animated Caption */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-center"
              >
                <p className="text-white text-lg sm:text-xl md:text-2xl font-medium">
                  {carouselImages[currentIndex].caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
