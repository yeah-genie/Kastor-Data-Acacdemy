import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TitleSplashProps {
  onComplete: () => void;
}

export default function TitleSplash({ onComplete }: TitleSplashProps) {
  const [showTapToStart, setShowTapToStart] = useState(false);

  useEffect(() => {
    // Show "Tap to Start" after 2 seconds
    const timer = setTimeout(() => {
      setShowTapToStart(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a2e] overflow-hidden"
      onClick={showTapToStart ? onComplete : undefined}
      style={{ cursor: showTapToStart ? "pointer" : "default" }}
    >
      {/* Circuit background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 217, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "2rem 2rem"
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle, rgba(0, 217, 255, 0.4) 0%, transparent 70%)"
            }}
          />

          {/* Logo image placeholder - replace with actual logo */}
          <div className="relative flex flex-col items-center gap-2">
            <motion.div
              animate={{
                textShadow: [
                  "0 0 10px rgba(0, 217, 255, 0.5)",
                  "0 0 20px rgba(0, 217, 255, 0.8)",
                  "0 0 10px rgba(0, 217, 255, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[48px] font-bold text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              KASTOR
            </motion.div>
            <div className="text-[#00d9ff] text-sm font-medium uppercase tracking-[0.3em]">
              DATA ACADEMY
            </div>
          </div>
        </motion.div>

        {/* Tap to Start */}
        {showTapToStart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Tap to Start
            </p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#00d9ff]"
              >
                <path
                  d="M12 5V19M12 19L5 12M12 19L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Version number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-white/30 text-xs"
      >
        v1.0.0 BETA
      </motion.div>
    </motion.div>
  );
}
