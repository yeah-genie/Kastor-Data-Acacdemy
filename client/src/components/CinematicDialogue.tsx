import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FastForward, SkipForward, History } from "lucide-react";

interface DialogueChoice {
  id: string;
  text: string;
  onSelect: () => void;
}

interface CinematicDialogueProps {
  speakerName: string;
  speakerImage: string;
  dialogueText: string;
  backgroundImage?: string;
  choices?: DialogueChoice[];
  onAdvance?: () => void;
  showControls?: boolean;
  onHistory?: () => void;
  onSkip?: () => void;
}

export default function CinematicDialogue({
  speakerName,
  speakerImage,
  dialogueText,
  backgroundImage,
  choices,
  onAdvance,
  showControls = true,
  onHistory,
  onSkip
}: CinematicDialogueProps) {
  const [isTextComplete, setIsTextComplete] = useState(false);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#1a1a2e]">
      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/50 to-transparent" />
        </div>
      )}

      {/* Control buttons (top right) */}
      {showControls && (
        <div className="relative z-20 flex justify-end gap-2 px-4 py-3">
          {onHistory && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onHistory}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <History className="h-5 w-5" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <FastForward className="h-5 w-5" />
          </motion.button>
          {onSkip && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSkip}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SkipForward className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      )}

      {/* Main content area */}
      <div className="relative z-10 flex h-full w-full flex-1 items-end">
        <div className="flex h-full w-full items-end gap-4 p-4">
          {/* Character portrait (left side) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden h-[400px] w-[300px] flex-shrink-0 md:block"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={speakerImage}
                alt={speakerName}
                className="h-full w-full object-cover"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 border-2 border-[#00d9ff]/30 shadow-[0_0_20px_rgba(0,217,255,0.3)]" />
            </div>
          </motion.div>

          {/* Dialogue box and choices */}
          <div className="flex flex-1 flex-col justify-end gap-3 pb-4">
            {/* Choices (if available) */}
            {choices && choices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-2"
              >
                {choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={choice.onSelect}
                    className="group flex h-11 w-full max-w-[480px] cursor-pointer items-center justify-start overflow-hidden rounded-lg border border-[#00d9ff]/50 bg-black/30 px-4 text-left text-white shadow-lg backdrop-blur-sm transition-all hover:bg-[#00d9ff] hover:text-[#1a1a2e] hover:shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                  >
                    <span className="truncate font-bold tracking-wide">
                      → {choice.text}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Dialogue box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onAdvance}
              className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e]/95 p-5 shadow-2xl backdrop-blur-lg ${
                onAdvance ? "cursor-pointer" : ""
              }`}
            >
              {/* Speaker name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-2 flex items-center gap-2"
              >
                <div className="h-1 w-1 rounded-full bg-[#00d9ff]" />
                <span className="text-sm font-bold uppercase tracking-wider text-[#00d9ff]">
                  {speakerName}
                </span>
              </motion.div>

              {/* Dialogue text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base leading-relaxed text-white md:text-lg"
              >
                {dialogueText}
              </motion.p>

              {/* Continue indicator */}
              {onAdvance && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-3 right-3"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
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
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile character portrait (bottom overlay) */}
      <div className="pointer-events-none absolute bottom-0 left-4 h-[200px] w-[150px] md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full overflow-hidden rounded-t-xl"
        >
          <img
            src={speakerImage}
            alt={speakerName}
            className="h-full w-full object-cover object-top"
          />
        </motion.div>
      </div>
    </div>
  );
}
