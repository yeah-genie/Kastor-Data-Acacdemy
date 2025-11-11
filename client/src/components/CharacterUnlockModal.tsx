import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface CharacterData {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  icon: string; // emoji or icon name
  accentColor: string; // hex color for the top bar
  tags: { label: string; variant: "default" | "accent" }[];
  firstAppearance: string;
  description?: string;
}

interface CharacterUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterData;
}

export default function CharacterUnlockModal({
  isOpen,
  onClose,
  character
}: CharacterUnlockModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300
              }}
              className="relative w-full max-w-sm"
            >
              {/* Unlock Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute -top-8 left-1/2 z-10 -translate-x-1/2"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 px-4 py-1.5 shadow-lg">
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      Character Unlocked!
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-5xl"
                  >
                    🎉
                  </motion.div>
                </div>
              </motion.div>

              {/* Card */}
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1a2133] shadow-2xl shadow-black/50">
                {/* Top accent bar */}
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: character.accentColor }}
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 p-6 pt-12">
                  {/* Header with avatar */}
                  <div className="relative mb-6 flex items-start">
                    <div className="relative flex-shrink-0">
                      <div
                        className="h-24 w-24 rounded-lg bg-cover bg-center bg-no-repeat ring-2 ring-white/10"
                        style={{ backgroundImage: `url(${character.avatarUrl})` }}
                      />
                      {/* Icon badge */}
                      <div
                        className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-4 ring-[#1a2133]"
                        style={{ backgroundColor: character.accentColor }}
                      >
                        <span className="text-2xl">{character.icon}</span>
                      </div>
                    </div>

                    <div className="ml-4 flex-1">
                      <h2 className="text-2xl font-bold text-white">
                        {character.name}
                      </h2>
                      <p className="text-base font-medium text-white/70">
                        {character.role}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="my-6 flex flex-wrap items-center gap-2">
                    {character.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex h-7 shrink-0 items-center justify-center gap-x-1.5 rounded px-2.5 py-1 ${
                          tag.variant === "accent"
                            ? "text-white"
                            : "bg-white/10 text-white"
                        }`}
                        style={
                          tag.variant === "accent"
                            ? {
                                backgroundColor: `${character.accentColor}20`,
                                color: character.accentColor
                              }
                            : {}
                        }
                      >
                        <p className="text-sm font-medium uppercase tracking-wide">
                          {tag.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <hr className="border-white/10" />

                  {/* First appearance */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 flex flex-col gap-1"
                  >
                    <p className="text-sm font-normal uppercase tracking-wider text-white/60">
                      First Appearance
                    </p>
                    <p className="text-base font-medium text-white">
                      {character.firstAppearance}
                    </p>
                  </motion.div>

                  {/* Description */}
                  {character.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 flex flex-col gap-1"
                    >
                      <p className="text-sm font-normal leading-relaxed text-white/80">
                        {character.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Close button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg py-3 font-bold text-white transition-all"
                    style={{ backgroundColor: character.accentColor }}
                  >
                    Continue Investigation
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
