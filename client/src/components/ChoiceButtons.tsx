import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  nextNode: string;
  feedback: string;
}

interface ChoiceButtonsProps {
  question: string;
  choices: Choice[];
  onChoiceSelected: (choice: Choice) => void;
}

export function ChoiceButtons({ question, choices, onChoiceSelected }: ChoiceButtonsProps) {
  const { visitedCharacters } = useDetectiveGame();
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const filteredChoices = choices.filter(choice => {
    if (choice.text.includes("Talk to")) {
      const characterMatch = choice.text.match(/Talk to (\w+)/);
      if (characterMatch) {
        const character = characterMatch[1].toLowerCase();
        return !visitedCharacters.includes(character);
      }
    }
    return true;
  });

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    
    setTimeout(() => {
      onChoiceSelected(choice);
      setShowFeedback(false);
      setSelectedChoice(null);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-6"
    >
      <div className="bg-slate-800/95 border-2 border-slate-600 rounded-xl p-4 mb-4 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-2xl">🔍</span>
          <p className="text-slate-100 font-bold flex-1 text-base leading-relaxed">{question}</p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredChoices.map((choice, index) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !showFeedback && handleChoice(choice)}
            disabled={showFeedback}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all shadow-md ${
              showFeedback && selectedChoice?.id === choice.id
                ? choice.isCorrect
                  ? "bg-green-500/20 border-green-500 text-white"
                  : "bg-red-500/20 border-red-500 text-red-100"
                : "bg-slate-800/90 border-slate-600 text-slate-100 hover:bg-slate-700/90 hover:border-slate-500 hover:shadow-lg"
            } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-3">
              {showFeedback && selectedChoice?.id === choice.id && (
                <div>
                  {choice.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
              )}
              <span className="flex-1 font-medium">{choice.text}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {showFeedback && selectedChoice && selectedChoice.feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border-2 shadow-md ${
            selectedChoice.isCorrect
              ? "bg-green-500/20 border-green-500 text-white"
              : "bg-red-500/20 border-red-500 text-red-100"
          }`}
        >
          <p className="text-sm font-medium">{selectedChoice.feedback}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
