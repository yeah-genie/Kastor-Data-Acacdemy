import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, FileText, Users, MessageSquare, Image, File } from "lucide-react";
import { useDetectiveGame, type Evidence, type EvidenceType } from "@/lib/stores/useDetectiveGame";

interface EvidencePresentationModalProps {
  isOpen: boolean;
  prompt: string;
  npcStatement?: string;
  npcCharacter?: string;
  correctEvidenceId: string;
  correctFeedback?: string;
  wrongFeedback?: string;
  onCorrect: () => void;
  onWrong: () => void;
  onClose: () => void;
}

const evidenceTypeIcons: Record<EvidenceType, any> = {
  CHARACTER: Users,
  DATA: FileText,
  DIALOGUE: MessageSquare,
  PHOTO: Image,
  DOCUMENT: File,
};

const evidenceTypeColors: Record<EvidenceType, string> = {
  CHARACTER: "text-purple-600 bg-purple-50 border-purple-200",
  DATA: "text-blue-600 bg-blue-50 border-blue-200",
  DIALOGUE: "text-green-600 bg-green-50 border-green-200",
  PHOTO: "text-amber-600 bg-amber-50 border-amber-200",
  DOCUMENT: "text-gray-600 bg-gray-50 border-gray-200",
};

export function EvidencePresentationModal({
  isOpen,
  prompt,
  npcStatement,
  npcCharacter,
  correctEvidenceId,
  correctFeedback,
  wrongFeedback,
  onCorrect,
  onWrong,
  onClose,
}: EvidencePresentationModalProps) {
  const evidenceCollected = useDetectiveGame((state) => state.evidenceCollected);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handlePresentEvidence = () => {
    if (!selectedEvidence) return;

    const correct = selectedEvidence === correctEvidenceId;
    setIsCorrect(correct);
    setShowResult(true);
    setFeedbackText(correct ? (correctFeedback || "Correct!") : (wrongFeedback || "Wrong!"));

    setTimeout(() => {
      if (correct) {
        onCorrect();
      } else {
        onWrong();
      }
      resetAndClose();
    }, 2500);
  };

  const resetAndClose = () => {
    setSelectedEvidence(null);
    setShowResult(false);
    setIsCorrect(false);
    setFeedbackText("");
    onClose();
  };

  const getEvidenceIcon = (type: EvidenceType) => {
    const IconComponent = evidenceTypeIcons[type];
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={showResult ? undefined : resetAndClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-3xl">⚡</span>
                    Present Evidence
                  </h2>
                  <p className="text-red-100 text-sm mt-1">Choose the right evidence to prove your point!</p>
                </div>
                <button
                  onClick={resetAndClose}
                  disabled={showResult}
                  className="text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {npcStatement && (
                <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">
                      💬
                    </div>
                    <div className="flex-1">
                      {npcCharacter && (
                        <p className="font-semibold text-amber-900 mb-1">{npcCharacter}</p>
                      )}
                      <p className="text-amber-800 italic">"{npcStatement}"</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-medium">🎯 {prompt}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evidenceCollected.map((evidence) => {
                  const Icon = evidenceTypeIcons[evidence.type];
                  const isSelected = selectedEvidence === evidence.id;
                  
                  return (
                    <motion.button
                      key={evidence.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvidence(evidence.id)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-50 shadow-lg'
                          : `border-gray-200 bg-white hover:border-gray-300 hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${evidenceTypeColors[evidence.type]}`}>
                          {getEvidenceIcon(evidence.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">
                            {evidence.title}
                          </h4>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {evidence.type}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {evidenceCollected.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No evidence collected yet</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={handlePresentEvidence}
                disabled={!selectedEvidence || showResult}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedEvidence && !showResult
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {showResult ? 'Processing...' : 'Present Evidence! ⚡'}
              </button>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={`p-8 rounded-2xl max-w-md ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <div className="text-center text-white">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                          <h3 className="text-3xl font-bold mb-2">Correct!</h3>
                          <p className="text-lg">{feedbackText}</p>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-20 h-20 mx-auto mb-4" />
                          <h3 className="text-3xl font-bold mb-2">Wrong!</h3>
                          <p className="text-lg">{feedbackText}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
