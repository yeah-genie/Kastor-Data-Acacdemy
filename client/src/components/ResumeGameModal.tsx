import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

interface ResumeGameModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onStartOver: () => void;
}

export function ResumeGameModal({ isOpen, onContinue, onStartOver }: ResumeGameModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl p-6 z-50 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Detective, the case is not finished.
              </h2>
              <p className="text-gray-600">
                Would you like to continue where you left off?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={onContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Continue
              </button>
              
              <button
                onClick={onStartOver}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
