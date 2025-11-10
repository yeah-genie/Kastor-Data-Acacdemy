import { forwardRef } from "react";
import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { DialogueEvidence } from "@/lib/stores/useDetectiveGame";
import { MessageSquare } from "lucide-react";

interface DialogueCardProps {
  evidence: DialogueEvidence;
  delay?: number;
  isHighlighted?: boolean;
  collapsed?: boolean;
}

export const DialogueCard = forwardRef<HTMLDivElement, DialogueCardProps>(
  ({ evidence, delay = 0, isHighlighted = false, collapsed = false }, ref) => {
    if (collapsed) {
      const preview = evidence.keyPoints[0] || evidence.summary;
      return (
        <div className="flex gap-4 p-5 min-w-[200px] max-w-[260px]">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 shadow-md border-2 border-purple-300">
            <MessageSquare className="w-7 h-7 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-purple-600 mb-1.5 truncate">{evidence.character}</p>
            <p className="text-sm text-gray-700 line-clamp-2 leading-tight">{preview}</p>
          </div>
        </div>
      );
    }

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
