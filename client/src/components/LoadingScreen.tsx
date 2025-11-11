import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  text?: string;
  tips?: string[];
}

export default function LoadingScreen({
  text = "Analyzing Data...",
  tips = [
    "💡 Tip: Always check the timestamps in server logs",
    "💡 Tip: Data patterns reveal the truth",
    "💡 Tip: Evidence connections are key",
    "💡 Tip: Look for outliers in the data"
  ]
}: LoadingScreenProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const dataStreamTexts = [
    "010110010111010101",
    "EVIDENCE",
    "110100100110101010",
    "ANALYSIS",
    "001101110101001011",
    "PATTERN",
    "101110010110101001",
    "TIMESTAMP",
    "011010101101001011"
  ];

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0A192F] p-6 text-white">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10, 25, 47, 0.95), rgba(10, 25, 47, 0.95)),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FFFF' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `
        }}
      />

      {/* Data Stream Animation */}
      <div className="absolute inset-0 z-0 flex justify-around overflow-hidden opacity-10">
        {dataStreamTexts.map((text, i) => (
          <motion.span
            key={i}
            className="text-primary text-xs leading-loose"
            initial={{ y: "100%", opacity: 0 }}
            animate={{
              y: ["-100%", "100%"],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 15 + (i * 2),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          >
            {text}
          </motion.span>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-12 text-center">
        {/* Loading Icon */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Background icon */}
          <motion.div
            className="absolute text-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <svg width="112" height="112" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
            </svg>
          </motion.div>

          {/* Rotating search icon */}
          <motion.div
            className="absolute text-white"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="flex w-full flex-col gap-3">
          <motion.p
            className="text-2xl font-bold tracking-wide text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {text}
          </motion.p>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Rotating Tips */}
        <div className="relative h-16 w-full">
          {tips.map((tip, index) => (
            <motion.p
              key={index}
              className="absolute inset-0 flex items-center justify-center text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentTipIndex ? 1 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              {tip}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}
