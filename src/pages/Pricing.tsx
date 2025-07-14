"use client";
import { motion, useInView, easeOut } from "framer-motion";
import { useRef } from "react";
import { PiCheck, PiLightning, PiStar } from "react-icons/pi";

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Free",
      price: "Free",
      period: "Forever",
      description: "Perfect for getting started with AI editing",
      icon: <PiStar className="w-6 h-6" />,
      features: [
        "5 AI edits per month",
        "Basic filters and effects",
        "720p export quality",
        "Community support",
        "Watermark on exports",
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-white text-black hover:bg-gray-200",
      cardStyle: "bg-gray-900 border border-gray-700",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For creators who want unlimited possibilities",
      icon: <PiLightning className="w-6 h-6" />,
      features: [
        "Unlimited AI edits",
        "Advanced AI tools & filters",
        "4K export quality",
        "Priority support",
        "No watermarks",
        "Batch processing",
        "Custom presets",
      ],
      buttonText: "Go Pro",
      buttonStyle:
        "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600",
      cardStyle:
        "bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500 shadow-lg",
      popular: true,
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
        staggerChildren: 0.2,
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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
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

  return (
    <div className="relative min-h-screen bg-black py-20 px-4 sm:px-6 md:px-10 lg:px-12 text-white">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Choose Your Plan
          </motion.h2>
          <motion.p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Unlock the power of AI-driven image editing with plans designed for
            every creator
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                plan.cardStyle
              } ${plan.popular ? "transform scale-105 lg:scale-110" : ""}`}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-black rounded-xl mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "Free" && (
                    <span className="text-gray-400 ml-2">/mo</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">{plan.period}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <PiCheck className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                    <span className="text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${plan.buttonStyle}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-16" variants={itemVariants}>
          <p className="text-gray-400 mb-4">
            Need a custom solution? We're here to help.
          </p>
          <motion.button
            className="inline-flex items-center px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing;
