import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hint } from "../data/episode-types";

interface HintSystemProps {
  hints: Hint[];
  onHintUsed?: (level: number) => void;
}

export default function HintSystem({ hints, onHintUsed }: HintSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(new Set());

  if (!hints || hints.length === 0) {
    return null; // No hints available
  }

  const availableHints = hints.length;

  const handleUnlockHint = (level: 1 | 2 | 3) => {
    setUnlockedLevels(new Set([...unlockedLevels, level]));
    onHintUsed?.(level);
  };

  const getHintForLevel = (level: 1 | 2 | 3) => {
    return hints.find((h) => h.level === level);
  };

  const getLevelColor = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-orange-400";
      case 3:
        return "text-red-400";
    }
  };

  const getLevelIcon = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1:
        return "💡";
      case 2:
        return "🔍";
      case 3:
        return "🔥";
    }
  };

  const getLevelBgColor = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1:
        return "bg-yellow-400/10 border-yellow-400/20";
      case 2:
        return "bg-orange-400/10 border-orange-400/20";
      case 3:
        return "bg-red-400/10 border-red-400/20";
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background-dark shadow-[0_0_15px_5px_rgba(0,217,255,0.4)] transition-all hover:shadow-[0_0_20px_8px_rgba(0,217,255,0.6)]"
      >
        <span className="text-3xl">💡</span>
        {availableHints > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {availableHints}
          </span>
        )}
      </motion.button>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-hidden rounded-t-xl bg-background-dark"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300d9ff' stroke-width='0.3'%3E%3Cpath d='M80 40 L60 40 M20 40 L0 40'/%3E%3Cpath d='M40 80 L40 60 M40 20 L40 0'/%3E%3Crect width='20' height='20' x='30' y='30'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "100px 100px",
                backgroundPosition: "center",
              }}
            >
              {/* Handle */}
              <div className="flex h-5 w-full items-center justify-center pt-3">
                <div className="h-1 w-9 rounded-full bg-white/20"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-3 pt-5">
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-white">
                  HINTS
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 px-4">
                {[1, 2, 3].map((level) => {
                  const hint = getHintForLevel(level as 1 | 2 | 3);
                  if (!hint) return null;

                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level as 1 | 2 | 3)}
                      className={`flex flex-1 flex-col items-center justify-center gap-1 border-b-[3px] pb-[7px] pt-2.5 transition-colors ${
                        selectedLevel === level
                          ? `border-primary ${getLevelColor(level as 1 | 2 | 3)}`
                          : "border-transparent text-white/50"
                      }`}
                    >
                      <span className="text-2xl">{getLevelIcon(level as 1 | 2 | 3)}</span>
                      <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                        Level {level}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedLevel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(() => {
                      const hint = getHintForLevel(selectedLevel);
                      if (!hint) return null;

                      const isUnlocked = unlockedLevels.has(selectedLevel);

                      return (
                        <div
                          className={`rounded-lg border p-4 ${getLevelBgColor(selectedLevel)}`}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h3
                              className={`text-lg font-bold ${getLevelColor(selectedLevel)}`}
                            >
                              {hint.title}
                            </h3>
                            <span className="text-2xl">{getLevelIcon(selectedLevel)}</span>
                          </div>

                          {isUnlocked ? (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                              {hint.content}
                            </p>
                          ) : (
                            <div className="text-center">
                              <div className="mb-4 text-4xl">🔒</div>
                              <p className="mb-4 text-sm text-white/70">
                                Click to unlock this hint
                              </p>
                              <button
                                onClick={() => handleUnlockHint(selectedLevel)}
                                className={`rounded-lg px-6 py-2 font-bold text-background-dark transition-all hover:scale-105 ${
                                  selectedLevel === 1
                                    ? "bg-yellow-400 hover:bg-yellow-300"
                                    : selectedLevel === 2
                                    ? "bg-orange-400 hover:bg-orange-300"
                                    : "bg-red-400 hover:bg-red-300"
                                }`}
                              >
                                Unlock Hint {hint.cost ? `(-${hint.cost} pts)` : ""}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
