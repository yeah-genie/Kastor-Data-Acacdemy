import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useDetectiveGame, Evidence, CharacterEvidence, DataEvidence, DialogueEvidence, PhotoEvidence, DocumentEvidence } from "@/lib/stores/useDetectiveGame";

export function EvidenceUnlockModal() {
  const { isEvidenceModalOpen, setEvidenceModalOpen, evidenceCollected, recentEvidenceId } = useDetectiveGame();
  
  const recentEvidence = evidenceCollected.find(e => e.id === recentEvidenceId);
  
  if (!recentEvidence) return null;

  const renderEvidencePreview = () => {
    switch (recentEvidence.type) {
      case "CHARACTER":
        const charEvidence = recentEvidence as CharacterEvidence;
        return (
          <div className="flex items-center gap-4">
            {charEvidence.photo && (
              <img src={charEvidence.photo} alt={charEvidence.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-400" />
            )}
            <div>
              <div className="font-bold text-lg text-white">{charEvidence.name}</div>
              <div className="text-sm text-blue-200">{charEvidence.role}</div>
            </div>
          </div>
        );
      
      case "DATA":
        const dataEvidence = recentEvidence as DataEvidence;
        return (
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm text-slate-300">Data Visualization</div>
          </div>
        );
      
      case "DIALOGUE":
        const dialogueEvidence = recentEvidence as DialogueEvidence;
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">💬</div>
              <span className="font-semibold text-white">{dialogueEvidence.character}</span>
            </div>
            <p className="text-sm text-slate-300 line-clamp-2">{dialogueEvidence.summary}</p>
          </div>
        );
      
      case "PHOTO":
        const photoEvidence = recentEvidence as PhotoEvidence;
        return (
          <div>
            <img src={photoEvidence.imageUrl} alt={photoEvidence.caption} className="w-full h-32 object-cover rounded-lg mb-2" />
            <p className="text-sm text-slate-300">{photoEvidence.caption}</p>
          </div>
        );
      
      case "DOCUMENT":
        return (
          <div className="text-center">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-sm text-slate-300">Document Evidence</div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isEvidenceModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={() => setEvidenceModalOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl p-6 z-50 shadow-2xl"
          >
            <button
              onClick={() => setEvidenceModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Evidence Found!</h3>
              <p className="text-sm text-gray-500">New evidence has been added to your notebook</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                {recentEvidence.type}
              </div>
              <div className="text-lg font-bold text-gray-800 mb-3">{recentEvidence.title}</div>
              {renderEvidencePreview()}
            </div>

            <button
              onClick={() => setEvidenceModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Continue Investigation
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
