import { forwardRef } from "react";
import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { DialogueEvidence } from "@/lib/stores/useDetectiveGame";
import { MessageSquare } from "lucide-react";

interface DialogueCardProps {
  evidence: DialogueEvidence;
  delay?: number;
  isHighlighted?: boolean;
}

export const DialogueCard = forwardRef<HTMLDivElement, DialogueCardProps>(
  ({ evidence, delay = 0, isHighlighted = false }, ref) => {
    return (
      <BaseEvidenceCard delay={delay} isHighlighted={isHighlighted} ref={ref}>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
          <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">{evidence.title}</h4>
        </div>
        <p className="text-xs md:text-sm font-medium text-purple-600 mb-3">With: {evidence.character}</p>
        <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
          {evidence.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-purple-600 font-bold flex-shrink-0">•</span>
              <span className="flex-1">{point}</span>
            </li>
          ))}
        </ul>
      </BaseEvidenceCard>
    );
  }
);

DialogueCard.displayName = "DialogueCard";
