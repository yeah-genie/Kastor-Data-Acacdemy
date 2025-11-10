import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  text: string;
  keep: boolean; // true = important evidence, false = noise
}

interface LogFilteringSequenceProps {
  data: {
    entries: LogEntry[];
  };
  onComplete: (userSelections: string[]) => void;
}

export function LogFilteringSequence({ data, onComplete }: LogFilteringSequenceProps) {
  const [arrivedLogs, setArrivedLogs] = useState<LogEntry[]>([]);
  const [deletedLogs, setDeletedLogs] = useState<Set<string>>(new Set());
  const [lastDeleted, setLastDeleted] = useState<string | null>(null);
  const [undoCount, setUndoCount] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Sequential arrival animation
  useEffect(() => {
    data.entries.forEach((entry, index) => {
      setTimeout(() => {
        setArrivedLogs((prev) => [...prev, entry]);
        // Play "ding" sound
        playSound("notification");
      }, index * 500); // 0.5 second interval
    });
  }, [data.entries]);

  const playSound = (soundName: string) => {
    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {}
  };

  const handleDelete = (logId: string, shouldKeep: boolean) => {
    setDeletedLogs((prev) => new Set([...prev, logId]));
    setLastDeleted(logId);

    // Show warning if user deleted an important log
    if (shouldKeep) {
      setShowWarning(true);
      playSound("warning-beep");
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const handleUndo = () => {
    if (lastDeleted && undoCount > 0) {
      setDeletedLogs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lastDeleted);
        return newSet;
      });
      setLastDeleted(null);
      setUndoCount(0);
      playSound("click");
    }
  };

  const handleSubmit = () => {
    const remainingLogs = arrivedLogs
      .filter((log) => !deletedLogs.has(log.id))
      .map((log) => log.id);

    setIsComplete(true);

    // Pass results after brief delay
    setTimeout(() => {
      onComplete(remainingLogs);
    }, 1000);
  };

  const remainingCount = arrivedLogs.length - deletedLogs.size;
  const allArrived = arrivedLogs.length === data.entries.length;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">📋 SERVER LOGS - DAY 28</h3>
          <div className="text-sm">
            {arrivedLogs.length} / {data.entries.length} loaded
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 my-4 flex items-start gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </motion.div>
            <div className="flex-1">
              <div className="font-bold text-yellow-800">⚠️ Warning: Critical Evidence Removed</div>
              <div className="text-sm text-yellow-700 mt-1">
                This log contains key timestamps. Deletion may affect case resolution.
              </div>
              <div className="text-sm text-yellow-600 mt-2 font-semibold">
                Use "Undo" to restore.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Entries */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-b-2xl p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {arrivedLogs.map((entry, index) => {
            const isDeleted = deletedLogs.has(entry.id);
            const isImportant = entry.keep;
            const shouldShowCheck = !isDeleted && isComplete;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={
                  isDeleted
                    ? {
                        opacity: 0,
                        x: -100,
                        height: 0,
                        marginBottom: 0,
                        transition: { duration: 0.3 },
                      }
                    : { opacity: 1, x: 0 }
                }
                exit={{ opacity: 0, height: 0 }}
                className={`${isDeleted ? "" : "mb-3"}`}
              >
                {!isDeleted && (
                  <div
                    className={`bg-white border-2 rounded-xl p-4 flex items-center gap-3 ${
                      isImportant
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Log Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>

                    {/* Log Text */}
                    <div className="flex-1 text-sm md:text-base text-gray-800 font-mono">
                      {entry.text}
                    </div>

                    {/* Checkmark for completed state */}
                    {shouldShowCheck && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="flex-shrink-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-2xl">✅</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Delete Button (only show before completion) */}
                    {!isComplete && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(entry.id, entry.keep)}
                        className="flex-shrink-0 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:inline">Remove</span>
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {arrivedLogs.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">⏳</div>
            <div>Loading logs...</div>
          </div>
        )}
      </div>

      {/* Actions */}
      {allArrived && !isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 justify-between"
        >
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={!lastDeleted || undoCount === 0}
            className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              lastDeleted && undoCount > 0
                ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Undo ({undoCount}x)</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            ✓ Clean Logs Complete ({remainingCount} kept)
          </button>
        </motion.div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-2">✅</div>
          <div className="font-bold text-green-800">Logs Filtered Successfully!</div>
          <div className="text-sm text-green-700 mt-1">
            {remainingCount} important logs preserved
          </div>
        </motion.div>
      )}
    </div>
  );
}
