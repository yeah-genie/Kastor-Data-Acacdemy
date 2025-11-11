import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

type TransitionType = "fade" | "slide-left" | "slide-right" | "slide-up" | "slide-down" | "zoom";

interface SceneTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  show: boolean;
}

export default function SceneTransition({
  children,
  type = "fade",
  duration = 0.5,
  show
}: SceneTransitionProps) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    "slide-left": {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "-100%" }
    },
    "slide-right": {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "100%" }
    },
    "slide-up": {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "-100%" }
    },
    "slide-down": {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "100%" }
    },
    zoom: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 }
    }
  };

  const currentVariant = variants[type];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={type}
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          exit={currentVariant.exit}
          transition={{ duration, ease: "easeInOut" }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Special effect components

interface EvidenceRevealProps {
  evidenceName: string;
  evidenceIcon: string;
  onComplete: () => void;
}

export function EvidenceReveal({
  evidenceName,
  evidenceIcon,
  onComplete
}: EvidenceRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 217, 255, 0.5)",
              "0 0 40px rgba(0, 217, 255, 0.8)",
              "0 0 20px rgba(0, 217, 255, 0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00d9ff] text-5xl"
        >
          {evidenceIcon}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#00d9ff]">
            Evidence Acquired
          </p>
          <p className="text-2xl font-bold text-white">{evidenceName}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface CharacterCloseupProps {
  characterImage: string;
  expression?: string;
  duration?: number;
}

export function CharacterCloseup({
  characterImage,
  expression = "surprised",
  duration = 2000
}: CharacterCloseupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 overflow-hidden bg-black"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="h-full w-full"
      >
        <img
          src={characterImage}
          alt="Character closeup"
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.8)" }}
        />
      </motion.div>

      {/* Expression indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="rounded-full bg-[#00d9ff] px-6 py-2 text-lg font-bold text-black">
          {expression}!
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ScreenShakeProps {
  children: ReactNode;
  intensity?: number;
  duration?: number;
}

export function ScreenShake({
  children,
  intensity = 10,
  duration = 0.5
}: ScreenShakeProps) {
  return (
    <motion.div
      animate={{
        x: [0, -intensity, intensity, -intensity, intensity, 0],
        y: [0, intensity, -intensity, intensity, -intensity, 0]
      }}
      transition={{ duration, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
