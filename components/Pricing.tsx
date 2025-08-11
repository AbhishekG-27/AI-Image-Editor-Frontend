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
      buttonStyle:
        "bg-black hover:bg-gray-800 text-white border-2 border-black hover:border-gray-800",
      cardStyle: "bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl",
      popular: false,
      textColor: "text-black",
      descriptionColor: "text-gray-600",
      featureColor: "text-gray-700",
      iconBg: "bg-black text-white",
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
        "bg-white hover:bg-gray-100 text-black border-2 border-white hover:border-gray-300",
      cardStyle: "bg-black border-2 border-white shadow-2xl hover:shadow-3xl",
      popular: true,
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      featureColor: "text-gray-200",
      iconBg: "bg-white text-black",
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
    <div className="relative min-h-screen bg-white py-20 px-4 sm:px-6 md:px-10 lg:px-12">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent">
            Choose Your Plan
          </motion.h2>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Unlock the power of AI-driven image editing with plans designed for
            every creator
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                plan.cardStyle
              } ${plan.popular ? "transform scale-105 lg:scale-110" : ""}`}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: plan.popular ? 1.02 : 1.01,
                transition: { duration: 0.3 },
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${plan.iconBg} rounded-2xl mb-6 shadow-md`}
                >
                  {plan.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${plan.textColor}`}>
                  {plan.name}
                </h3>
                <p
                  className={`${plan.descriptionColor} text-sm leading-relaxed`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span
                    className={`text-5xl md:text-6xl font-bold ${plan.textColor}`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && (
                    <span className={`${plan.descriptionColor} ml-2 text-lg`}>
                      /mo
                    </span>
                  )}
                </div>
                <p className={`${plan.descriptionColor} text-sm mt-2`}>
                  {plan.period}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0">
                      <PiCheck
                        className={`w-5 h-5 mr-3 mt-0.5 ${
                          plan.popular ? "text-green-400" : "text-green-600"
                        }`}
                      />
                    </div>
                    <span className={`${plan.featureColor} leading-relaxed`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${plan.buttonStyle} shadow-lg hover:shadow-xl`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-16" variants={itemVariants}>
          <p className="text-gray-600 mb-6 text-lg">
            Need a custom solution? We're here to help.
          </p>
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </motion.div>

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

export default Pricing;
