import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { useDetectiveGame, type Choice } from "@/lib/stores/useDetectiveGame";

interface ChoiceButtonsProps {
  question: string;
  choices: Choice[];
  onChoiceSelected: (choice: Choice) => void;
}

export function ChoiceButtons({ question, choices, onChoiceSelected }: ChoiceButtonsProps) {
  const { visitedCharacters, openHintNotebook } = useDetectiveGame();
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setHintUsed(false);
    setSelectedChoice(null);
    setShowFeedback(false);
  }, [question]);

  const hasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF]/.test(question);

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
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-6"
    >
      <div className="bg-[#1f2a40] border-2 border-white/20 rounded-xl p-4 mb-4 shadow-lg">
        <div className="flex items-start gap-3">
          {!hasEmoji && <span className="text-[#00d9ff] text-2xl md:text-xl">🔍</span>}
          <p className="text-white font-bold flex-1 text-lg md:text-base leading-relaxed">{question}</p>
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
            className={`w-full text-left p-4 rounded-xl border-2 transition-all shadow-md min-h-[56px] ${
              showFeedback && selectedChoice?.id === choice.id
                ? choice.isCorrect
                  ? "bg-green-500/20 border-green-500 text-green-100"
                  : "bg-red-500/20 border-red-500 text-red-100"
                : "bg-[#2a2d3a] border-white/20 text-white hover:bg-white/10 hover:border-[#00d9ff]/50 hover:shadow-lg hover:shadow-[#00d9ff]/10"
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
              <span className="flex-1 font-medium text-base md:text-sm">{choice.text}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {showFeedback && selectedChoice && selectedChoice.feedback && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border-2 shadow-md ${
              selectedChoice.isCorrect
                ? "bg-green-500/20 border-green-500 text-green-100"
                : "bg-red-500/20 border-red-500 text-red-100"
            }`}
          >
            <p className="text-base md:text-sm font-medium">{selectedChoice.feedback}</p>
          </motion.div>

          {!selectedChoice.isCorrect && selectedChoice.hintEvidenceId && !hintUsed && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                openHintNotebook(selectedChoice.hintEvidenceId!);
                setHintUsed(true);
              }}
              className="mt-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>💡 View Hint (Open Evidence Notebook)</span>
            </motion.button>
          )}

          {hintUsed && selectedChoice.hintText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 bg-amber-900/30 border-2 border-amber-500/50 rounded-xl"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-100 font-medium">{selectedChoice.hintText}</p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
