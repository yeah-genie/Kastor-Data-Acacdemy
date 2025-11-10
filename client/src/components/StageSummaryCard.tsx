import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, TrendingUp, Users, Search, Scale } from "lucide-react";

interface StageSummary {
  stage: number;
  title: string;
  keyFindings: string[];
  evidenceCount: number;
  nextStageHint?: string;
}

interface StageSummaryCardProps {
  summary: StageSummary;
  onContinue: () => void;
}

const stageIcons = {
  1: TrendingUp,
  2: Users,
  3: Search,
  4: Scale,
  5: CheckCircle,
};

export function StageSummaryCard({ summary, onContinue }: StageSummaryCardProps) {
  const StageIcon = stageIcons[summary.stage as keyof typeof stageIcons] || CheckCircle;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onContinue}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <StageIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">
                  Stage {summary.stage} Complete
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">{summary.title}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Key Findings
              </h4>
              <ul className="space-y-4">
                {summary.keyFindings.map((finding, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-gray-900"
                  >
                    <span className="text-blue-500 mt-1 text-xl font-bold">•</span>
                    <span className="text-base leading-loose flex-1 font-medium">{finding}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-5 border-t border-gray-200">
              <div className="text-lg text-gray-800 font-medium">
                Evidence Collected: <span className="text-blue-600 font-bold">{summary.evidenceCount}</span>
              </div>
              {summary.nextStageHint && (
                <div className="text-sm text-gray-500 italic leading-relaxed">
                  💡 {summary.nextStageHint}
                </div>
              )}
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-lg"
            >
              Continue to Next Stage →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
