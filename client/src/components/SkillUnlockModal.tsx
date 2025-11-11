import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface SkillData {
  id: string;
  name: string;
  description: string;
  icon: string; // Material Symbols icon name
  xpReward?: number;
  realWorldApplication?: string;
}

interface SkillUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillData;
}

export default function SkillUnlockModal({
  isOpen,
  onClose,
  skill
}: SkillUnlockModalProps) {
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
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
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
                  <div className="mb-2 rounded-full bg-gradient-to-br from-primary to-cyan-600 px-4 py-1.5 shadow-[0_0_20px_5px_rgba(0,217,255,0.4)]">
                    <p className="text-xs font-bold uppercase tracking-wider text-background-dark">
                      New Skill Unlocked!
                    </p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-5xl"
                  >
                    ⚡
                  </motion.div>
                </div>
              </motion.div>

              {/* Card */}
              <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-[#1f1f3a] shadow-2xl shadow-primary/20">
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(0,217,255,0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 100%, rgba(0,217,255,0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 0%, rgba(0,217,255,0.3) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 p-6 pt-12">
                  {/* Skill Icon and Info */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center gap-4"
                  >
                    {/* Icon */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-2 ring-primary/30">
                      <span className="material-symbols-outlined text-5xl text-primary">
                        {skill.icon}
                      </span>
                    </div>

                    {/* Skill Name */}
                    <h2 className="text-center text-2xl font-bold leading-tight tracking-[-0.015em] text-white">
                      {skill.name}
                    </h2>

                    {/* Description */}
                    <p className="text-center text-sm font-normal leading-normal text-zinc-400">
                      {skill.description}
                    </p>
                  </motion.div>

                  {/* XP Reward */}
                  {skill.xpReward && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="my-6 flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-3"
                    >
                      <span className="text-2xl">✨</span>
                      <p className="text-lg font-bold text-primary">
                        +{skill.xpReward} XP
                      </p>
                    </motion.div>
                  )}

                  {/* Real World Application */}
                  {skill.realWorldApplication && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 rounded-lg bg-black/30 p-4"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        Real-World Application
                      </p>
                      <p className="text-sm leading-relaxed text-white/90">
                        {skill.realWorldApplication}
                      </p>
                    </motion.div>
                  )}

                  {/* Continue button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg bg-primary py-3 font-bold text-background-dark shadow-[0_4px_12px_rgba(0,217,255,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(0,217,255,0.4)]"
                  >
                    Continue Learning
                  </motion.button>
                </div>
              </div>

              {/* Floating particles effect */}
              <div className="pointer-events-none absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-primary"
                    initial={{
                      x: "50%",
                      y: "50%",
                      opacity: 1
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      opacity: 0,
                      scale: [1, 2, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5 + i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
