import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings, Lightbulb, FolderOpen, Star } from "lucide-react";
import { useState } from "react";

interface GameHUDProps {
  episodeTitle: string;
  hintsUsed: number;
  maxHints: number;
  evidenceCollected: number;
  totalEvidence: number;
  score: number;
  onBack: () => void;
  onSettings: () => void;
  onHintsClick?: () => void;
  onEvidenceClick?: () => void;
}

export default function GameHUD({
  episodeTitle,
  hintsUsed,
  maxHints,
  evidenceCollected,
  totalEvidence,
  score,
  onBack,
  onSettings,
  onHintsClick,
  onEvidenceClick
}: GameHUDProps) {
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#1a1a2e]/95 backdrop-blur-sm">
        {/* Main bar */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          {/* Center: Episode title */}
          <div className="flex-1 px-2 text-center">
            <h2 className="truncate text-sm font-bold text-white">
              {episodeTitle}
            </h2>
          </div>

          {/* Right: Settings button */}
          <button
            onClick={onSettings}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <Settings className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-around border-t border-white/5 bg-black/20 px-3 py-2 text-xs">
          {/* Hints */}
          <button
            onClick={onHintsClick}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-white/10"
          >
            <Lightbulb
              className={`h-4 w-4 ${
                hintsUsed < maxHints ? "text-amber-400" : "text-white/30"
              }`}
            />
            <span className="font-medium text-white">
              {hintsUsed}/{maxHints}
            </span>
          </button>

          {/* Evidence */}
          <button
            onClick={onEvidenceClick}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-white/10"
          >
            <FolderOpen className="h-4 w-4 text-blue-400" />
            <span className="font-medium text-white">
              {evidenceCollected}/{totalEvidence}
            </span>
          </button>

          {/* Score */}
          <div className="flex items-center gap-1.5 rounded-lg px-2 py-1">
            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
            <span className="font-medium text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* Expanded stats panel (optional) */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-4 right-4 top-24 z-50 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e]/95 p-4 backdrop-blur-lg"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Investigation Progress</h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-white/70">Hints Remaining</span>
                  <span className="font-bold text-amber-400">
                    {maxHints - hintsUsed}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{
                      width: `${((maxHints - hintsUsed) / maxHints) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-white/70">Evidence Collected</span>
                  <span className="font-bold text-blue-400">
                    {evidenceCollected}/{totalEvidence}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-400"
                    style={{
                      width: `${(evidenceCollected / totalEvidence) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
