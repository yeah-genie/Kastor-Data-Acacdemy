import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Award, TrendingUp } from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useDetectiveGame, type Grade } from "@/lib/stores/useDetectiveGame";

interface CaseClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber: number;
  caseTitle: string;
}

export function CaseClosedModal({ isOpen, onClose, caseNumber, caseTitle }: CaseClosedModalProps) {
  const calculateGrade = useDetectiveGame((state) => state.calculateGrade);
  const completeCase = useDetectiveGame((state) => state.completeCase);
  const setPhase = useDetectiveGame((state) => state.setPhase);
  const hintsUsed = useDetectiveGame((state) => state.hintsUsed);
  const evidenceCollected = useDetectiveGame((state) => state.evidenceCollected);
  const sessionMetrics = useDetectiveGame((state) => state.sessionMetrics);

  const [grade, setGrade] = useState<Grade>('B');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (isOpen) {
      const calculatedGrade = calculateGrade();
      setGrade(calculatedGrade);

      // Complete the case and unlock next episode
      const stars = calculatedGrade === 'S' ? 3 : calculatedGrade === 'A' ? 2 : calculatedGrade === 'B' ? 1 : 0;
      completeCase(stars);
    }
  }, [isOpen, calculateGrade, completeCase]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gradeColors = {
    'S': { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-400', gradient: 'from-yellow-400 to-amber-500' },
    'A': { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-400', gradient: 'from-green-400 to-emerald-500' },
    'B': { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-400', gradient: 'from-blue-400 to-indigo-500' },
    'C': { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-400', gradient: 'from-gray-400 to-slate-500' },
  };

  const gradeMessages = {
    'S': "Wow! You're a natural! 🌟 I'm impressed!",
    'A': "Nice work! You got most of it right! 👍",
    'B': "Not bad! Some mistakes, but you solved it! 😊",
    'C': "Well... you finished. That's something! 😅",
  };

  const kastorReactions = {
    'S': "Seriously, 99% perfect! (I never say 100%, aliens exist.)",
    'A': "Solid detective work! Just a few details missed.",
    'B': "You got the culprit, but the journey was... rocky.",
    'C': "Hmm... you need more practice. A lot more.",
  };

  const correctDecisions = sessionMetrics.decisions.filter(d => d.isCorrect).length;
  const totalDecisions = sessionMetrics.decisions.length;
  const evidenceRate = sessionMetrics.totalEvidenceInCase > 0
    ? Math.round((evidenceCollected.length / sessionMetrics.totalEvidenceInCase) * 100)
    : 100;

  const handleContinue = () => {
    onClose();
    setPhase("menu");

    // Scroll to next case after a short delay
    setTimeout(() => {
      const nextCaseElement = document.querySelector(`[data-case-id="${caseNumber + 1}"]`);
      if (nextCaseElement) {
        nextCaseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti effect */}
          {(grade === 'S' || grade === 'A') && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={grade === 'S' ? 500 : 300}
              gravity={0.3}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Modal - Chat Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  <img src="/detective.jpg" alt="Kastor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Kastor</h3>
                  <p className="text-indigo-200 text-xs">Data Detective Partner</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Case Closed Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0">
                  <img
                    src="/detective.jpg"
                    alt="Kastor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-gray-800 font-semibold mb-1">🎉 CASE CLOSED!</p>
                    <p className="text-gray-600 text-sm">{caseTitle}</p>
                  </div>

                  {/* Stamp Effect */}
                  <motion.div
                    initial={{ scale: 3, rotate: -30, opacity: 0 }}
                    animate={{ scale: 1, rotate: -12, opacity: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    className="absolute -right-4 -top-4 pointer-events-none"
                  >
                    <div className="relative">
                      <div className="border-4 border-red-500 rounded-full w-20 h-20 flex items-center justify-center bg-red-50/80">
                        <span className="text-red-500 font-bold text-xs leading-tight text-center">
                          CASE<br/>CLOSED
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Grade Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center my-6"
              >
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradeColors[grade].gradient} flex items-center justify-center border-4 ${gradeColors[grade].border} shadow-xl`}>
                  <span className="text-7xl font-bold text-white">{grade}</span>
                </div>
              </motion.div>

              {/* Kastor's First Reaction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0">
                  <img
                    src="/detective.jpg"
                    alt="Kastor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-gray-800">{gradeMessages[grade]}</p>
                  </div>
                </div>
              </motion.div>

              {/* Performance Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200"
              >
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Correct Decisions</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      {correctDecisions}/{totalDecisions}
                      {correctDecisions === totalDecisions && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Evidence Collected</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      {evidenceRate}%
                      {evidenceRate === 100 && <Award className="w-4 h-4 text-blue-500" />}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hints Used</span>
                    <span className="font-semibold text-gray-900">{hintsUsed}/3</span>
                  </div>
                </div>
              </motion.div>

              {/* Kastor's Second Reaction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0">
                  <img
                    src="/detective.jpg"
                    alt="Kastor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-gray-800 text-sm">{kastorReactions[grade]}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Button */}
            <div className="p-6 pt-0">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                Continue to Next Case
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
