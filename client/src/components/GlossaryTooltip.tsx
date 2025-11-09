import { useState } from "react";

interface GlossaryTooltipProps {
  word: string;
  definition: string;
  children: React.ReactNode;
  variant?: "detective" | "normal";
}

export function GlossaryTooltip({ word, definition, children, variant = "normal" }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const textColor = variant === "detective" 
    ? "text-white decoration-white/60 hover:decoration-white" 
    : "text-blue-600 decoration-blue-400 hover:decoration-blue-600";

  return (
    <>
      <span className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className={`underline decoration-dotted underline-offset-2 cursor-help font-medium inline ${textColor}`}
        >
          {children}
        </button>
      </span>
      
      {isOpen && (
        <span
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          onClick={() => setIsOpen(false)}
        >
          <span className="bg-slate-800 text-white rounded-xl p-4 shadow-2xl border border-slate-600 max-w-xs pointer-events-auto">
            <span className="block text-xs font-bold text-blue-300 mb-2">{word}</span>
            <span className="block text-sm leading-relaxed">{definition}</span>
          </span>
        </span>
      )}
    </>
  );
}

export function parseTextWithGlossary(text: string, variant: "detective" | "normal" = "normal"): React.ReactNode[] {
  const glossary: Record<string, string> = {
    "overpowered": "A character or item that is too strong compared to others in the game",
    "win rate": "The percentage of games won by players using a specific character",
    "abnormally": "In an unusual or unexpected way",
    "deliberately": "Done on purpose, not by accident",
    "manipulated": "Changed or controlled in a dishonest way",
    "balance": "Making sure all characters are equally fair and fun to play",
    "algorithm": "A set of rules or steps a computer follows to solve a problem",
    "stats": "Short for statistics - numbers that show game performance",
    "access": "Permission to use or see something",
    "database": "A digital storage system where information is kept organized",
    "logged in": "Signed into a computer system using a username and password",
    "server logs": "Records that show what happened on a computer server",
    "anonymously": "Without revealing your name or identity",
    "crunch": "A stressful period of long working hours to finish a project",
    "perfectionist": "Someone who wants everything to be perfect",
    "burnout": "Feeling extremely tired and stressed from too much work",
    "suspicious": "Making you think something wrong or dishonest is happening",
    "evidence": "Information or facts that help prove something is true",
    "analyze": "To examine something carefully to understand it better",
    "incident": "An event, especially an unusual or bad one",
  };

  const parts: React.ReactNode[] = [];
  let remainingText = text;
  let keyIndex = 0;

  const sortedWords = Object.keys(glossary).sort((a, b) => b.length - a.length);

  while (remainingText.length > 0) {
    let foundMatch = false;

    for (const word of sortedWords) {
      const lowerText = remainingText.toLowerCase();
      const wordLower = word.toLowerCase();
      const index = lowerText.indexOf(wordLower);

      if (index === 0) {
        const actualWord = remainingText.substring(0, word.length);
        parts.push(
          <GlossaryTooltip key={`glossary-${keyIndex++}`} word={word} definition={glossary[word]} variant={variant}>
            {actualWord}
          </GlossaryTooltip>
        );
        remainingText = remainingText.substring(word.length);
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
      let nextMatch = -1;
      let nextWord = "";

      for (const word of sortedWords) {
        const index = remainingText.toLowerCase().indexOf(word.toLowerCase());
        if (index > 0 && (nextMatch === -1 || index < nextMatch)) {
          nextMatch = index;
          nextWord = word;
        }
      }

      if (nextMatch > 0) {
        parts.push(remainingText.substring(0, nextMatch));
        remainingText = remainingText.substring(nextMatch);
      } else {
        parts.push(remainingText);
        remainingText = "";
      }
    }
  }

  return parts;
}
