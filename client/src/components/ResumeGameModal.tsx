import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

interface ResumeGameModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onStartOver: () => void;
  onClose: () => void;
  isBackButton?: boolean;
}

export function ResumeGameModal({ isOpen, onContinue, onStartOver, onClose, isBackButton = false }: ResumeGameModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-relaxed">
                Detective,<br />the case is not finished.
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
                {isBackButton ? "Continue, Detective" : "Continue"}
              </button>
              
              <button
                onClick={onStartOver}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                {isBackButton ? "Exit" : "Start Over"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
