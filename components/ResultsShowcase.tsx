"use client";
import { motion, useInView, easeOut } from "framer-motion";
import { useRef, useState } from "react";
import { PiEye, PiSparkle, PiArrowRight, PiPlay } from "react-icons/pi";

type Result = {
  id: number;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  processingTime: string;
};

const Results = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const results: Result[] = [
    {
      id: 1,
      title: "Object Removal",
      description: "Seamlessly remove unwanted objects from your photos",
      beforeImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      afterImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&sat=-100",
      category: "Cleanup",
      processingTime: "2.3s",
    },
    {
      id: 2,
      title: "Background Replacement",
      description: "Transform scenes with AI-powered background generation",
      beforeImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      afterImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&sepia=100",
      category: "Enhancement",
      processingTime: "1.8s",
    },
    {
      id: 3,
      title: "Content Addition",
      description:
        "Add realistic elements that blend perfectly with your image",
      beforeImage:
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop",
      afterImage:
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop&hue=180",
      category: "Creative",
      processingTime: "3.1s",
    },
    {
      id: 4,
      title: "Style Transfer",
      description: "Apply artistic styles while maintaining image integrity",
      beforeImage:
        "https://images.unsplash.com/photo-1418065460487-3444bc7c2c44?w=400&h=300&fit=crop",
      afterImage:
        "https://images.unsplash.com/photo-1418065460487-3444bc7c2c44?w=400&h=300&fit=crop&blur=2",
      category: "Artistic",
      processingTime: "2.7s",
    },
    {
      id: 5,
      title: "Texture Repair",
      description: "Fix damaged areas with intelligent texture matching",
      beforeImage:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop",
      afterImage:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop&contrast=150",
      category: "Restoration",
      processingTime: "1.9s",
    },
    {
      id: 6,
      title: "Color Correction",
      description: "Perfect color balance and lighting adjustments",
      beforeImage:
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
      afterImage:
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop&brightness=120",
      category: "Enhancement",
      processingTime: "1.4s",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: easeOut,
      },
    },
  };

  const BeforeAfterCard = ({ result }: { result: Result }) => {
    const [showAfter, setShowAfter] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group relative bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-md overflow-hidden transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-neutral-900 text-white z-10">
          {result.category}
        </div>
        <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-white/80 text-black backdrop-blur z-10">
          ⚡ {result.processingTime}
        </div>

        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {/* Before Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{
              backgroundImage: `url(${result.beforeImage})`,
              opacity: showAfter ? 0 : 1,
            }}
          >
            <div className="text-white dark:text-white text-center">
              <div className="text-sm font-semibold">BEFORE</div>
              <div className="text-xs opacity-75">{result.title}</div>
            </div>
          </div>

          {/* After Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{
              backgroundImage: `url(${result.afterImage})`,
              opacity: showAfter ? 1 : 0,
            }}
          >
            <div className="text-black dark:text-black text-center">
              <div className="text-sm font-semibold">AFTER</div>
              <div className="text-xs opacity-75">{result.title}</div>
            </div>
          </div>

          {/* Toggle Button */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <motion.button
              onClick={() => setShowAfter(!showAfter)}
              aria-label="Toggle Before/After"
              className="bg-white dark:bg-neutral-900 text-black dark:text-white px-4 py-2 text-xs rounded-full shadow backdrop-blur-sm transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PiEye className="inline mr-2" />
              {showAfter ? "Show Before" : "Show After"}
            </motion.button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            {result.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {result.description}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black py-16">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-14" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center gap-2 text-white bg-neutral-900 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
            variants={itemVariants}
          >
            <PiSparkle className="w-4 h-4" />
            AI-Powered Results
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white"
            variants={itemVariants}
          >
            See the{" "}
            <span className="underline decoration-neutral-400 underline-offset-4">
              Magic
            </span>{" "}
            in Action
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4"
            variants={itemVariants}
          >
            Hover over each card to toggle between before and after. Experience
            real-time results powered by AI.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {results.map((r) => (
            <BeforeAfterCard key={r.id} result={r} />
          ))}
        </motion.div>

        <motion.div className="text-center mt-14" variants={itemVariants}>
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-sm sm:text-base hover:opacity-90 transition"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <PiPlay className="w-4 h-4" />
            Try It Yourself
            <PiArrowRight className="w-4 h-4" />
          </motion.button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No signup required — edit instantly with AI.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;
