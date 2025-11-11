import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { History, Settings, FastForward } from "lucide-react";

type PortraitPosition = "left" | "center" | "right";
type Expression = "neutral" | "happy" | "sad" | "angry" | "surprised";

interface Character {
  name: string;
  portrait: string;
  position: PortraitPosition;
  expression?: Expression;
  isActive?: boolean; // Speaking or not
}

interface Choice {
  id: string;
  text: string;
  icon?: string;
  onSelect: () => void;
}

interface VisualNovelDialogueProps {
  background: string;
  characters: Character[];
  speakerName: string;
  dialogueText: string;
  choices?: Choice[];
  onAdvance?: () => void;
  onHistory?: () => void;
  onSettings?: () => void;
  autoAdvance?: boolean;
  textSpeed?: number; // 1-3 (slow-fast)
  showSkip?: boolean;
}

export default function VisualNovelDialogue({
  background,
  characters,
  speakerName,
  dialogueText,
  choices,
  onAdvance,
  onHistory,
  onSettings,
  autoAdvance = false,
  textSpeed = 2,
  showSkip = true
}: VisualNovelDialogueProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [skipText, setSkipText] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (skipText) {
      setDisplayedText(dialogueText);
      setIsTextComplete(true);
      return;
    }

    setDisplayedText("");
    setIsTextComplete(false);

    let currentIndex = 0;
    const speed = [50, 30, 15][textSpeed - 1]; // Convert speed 1-3 to ms

    const interval = setInterval(() => {
      if (currentIndex < dialogueText.length) {
        setDisplayedText(dialogueText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTextComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [dialogueText, textSpeed, skipText]);

  // Auto-advance
  useEffect(() => {
    if (autoAdvance && isTextComplete && onAdvance && !choices) {
      const timer = setTimeout(onAdvance, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, isTextComplete, onAdvance, choices]);

  const handleClick = () => {
    if (!isTextComplete) {
      setSkipText(true);
    } else if (onAdvance && !choices) {
      onAdvance();
    }
  };

  const getPortraitPosition = (position: PortraitPosition) => {
    switch (position) {
      case "left":
        return "left-8";
      case "center":
        return "left-1/2 -translate-x-1/2";
      case "right":
        return "right-8";
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black">
      {/* TOP 50%: Character portraits + background */}
      <div className="relative h-1/2 w-full overflow-hidden">
        {/* Background */}
        <motion.div
          key={background}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${background})`,
              filter: "brightness(0.7)"
            }}
          />
        </motion.div>

        {/* Character portraits */}
        <div className="absolute inset-0">
          {characters.map((character, index) => (
            <motion.div
              key={`${character.name}-${character.position}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: character.isActive ? 1 : 0.5,
                y: 0,
                scale: character.isActive ? 1 : 0.95,
                filter: character.isActive
                  ? "brightness(1)"
                  : "brightness(0.7)"
              }}
              transition={{ duration: 0.3 }}
              className={`absolute bottom-0 ${getPortraitPosition(
                character.position
              )} h-[90%] w-auto`}
            >
              <img
                src={character.portrait}
                alt={character.name}
                className="h-full w-auto object-contain"
                style={{ imageRendering: "crisp-edges" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Top UI controls */}
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          {onHistory && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onHistory}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <History className="h-5 w-5" />
            </motion.button>
          )}
          {showSkip && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSkipText(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <FastForward className="h-5 w-5" />
            </motion.button>
          )}
          {onSettings && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSettings}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <Settings className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* BOTTOM 50%: Dialogue box */}
      <div className="relative flex h-1/2 w-full items-end bg-gradient-to-t from-black via-black to-transparent p-6">
        {/* Dialogue container */}
        <div className="w-full space-y-3">
          {/* Choices (if available) */}
          {choices && choices.length > 0 && isTextComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              {choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={choice.onSelect}
                  className="flex items-center gap-3 rounded-lg border-2 border-[#00d9ff]/50 bg-black/80 px-5 py-3 text-left text-white shadow-lg backdrop-blur-sm transition-all hover:border-[#00d9ff] hover:bg-[#00d9ff]/20 hover:shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                >
                  {choice.icon && (
                    <span className="text-xl">{choice.icon}</span>
                  )}
                  <span className="flex-1 font-medium">{choice.text}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#00d9ff]"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Dialogue box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleClick}
            className={`relative min-h-[140px] rounded-2xl border border-white/20 bg-black/90 p-6 backdrop-blur-lg ${
              !choices || !isTextComplete ? "cursor-pointer" : ""
            }`}
          >
            {/* Name plate */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -top-4 left-6 rounded-full border border-[#00d9ff]/50 bg-black/90 px-4 py-1 backdrop-blur-sm"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-[#00d9ff]">
                {speakerName}
              </span>
            </motion.div>

            {/* Dialogue text */}
            <div className="min-h-[80px] pt-2">
              <p className="text-lg leading-relaxed text-white">
                {displayedText}
                {!isTextComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="ml-1 inline-block"
                  >
                    ▮
                  </motion.span>
                )}
              </p>
            </div>

            {/* Continue indicator */}
            {isTextComplete && onAdvance && !choices && (
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white/60"
              >
                <span>Click to continue</span>
                <svg
                  width="16"
                  height="16"
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
  );
}
