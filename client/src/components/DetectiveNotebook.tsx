import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lightbulb, Star } from "lucide-react";
import { useDetectiveGame, Clue } from "@/lib/stores/useDetectiveGame";

interface DetectiveNotebookProps {
  isOpen: boolean;
  onClose: () => void;
  onShowHint?: () => void;
  hintAvailable?: boolean;
}

export function DetectiveNotebook({ isOpen, onClose, onShowHint, hintAvailable }: DetectiveNotebookProps) {
  const { cluesCollected, score, hintsUsed, maxHints, useHint } = useDetectiveGame();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          
          <div
            className="fixed inset-4 md:inset-10 bg-gradient-to-br from-amber-900/90 to-slate-900/90 border-2 border-amber-600/50 rounded-lg z-50 overflow-hidden flex flex-col"
          >
            <div className="bg-amber-800/50 border-b border-amber-600/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-300" />
                <h2 className="text-xl font-bold text-amber-100">Detective Notes</h2>
              </div>
              <button
                onClick={onClose}
                className="text-amber-200 hover:text-amber-100 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-amber-200 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Progress
                  </h3>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Score Earned</span>
                    <span className="text-amber-400 font-bold">{score} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Clues Collected</span>
                    <span className="text-blue-400 font-bold">{cluesCollected.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Hints Used</span>
                    <span className="text-purple-400 font-bold">{hintsUsed} / {maxHints}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-200 mb-4">Collected Clues</h3>
                {cluesCollected.length === 0 ? (
                  <div className="bg-slate-800/30 rounded-lg p-6 text-center text-slate-400">
                    No clues collected yet.
                    <br />
                    Answer questions correctly to collect clues!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cluesCollected.map((clue: Clue, index: number) => (
                      <motion.div
                        key={clue.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/70 border border-amber-600/30 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🔍</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-amber-200 mb-1">{clue.title}</h4>
                            <p className="text-sm text-slate-300">{clue.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/70 border-t border-slate-700 px-6 py-4 space-y-3">
              {onShowHint && hintsUsed < maxHints && hintAvailable && (
                <button
                  onClick={() => {
                    useHint();
                    onShowHint();
                  }}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-5 h-5" />
                  Show Hint ({maxHints - hintsUsed} remaining)
                </button>
              )}
              
              {onShowHint && hintsUsed < maxHints && !hintAvailable && (
                <div className="w-full bg-slate-700/50 text-slate-400 font-semibold py-3 rounded-lg text-center border border-slate-600">
                  No hint available for this step
                </div>
              )}
              
              <button
                onClick={onClose}
                className="w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Close Notes
              </button>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
