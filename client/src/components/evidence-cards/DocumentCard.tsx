import { forwardRef } from "react";
import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { DocumentEvidence } from "@/lib/stores/useDetectiveGame";
import { FileText } from "lucide-react";

interface DocumentCardProps {
  evidence: DocumentEvidence;
  delay?: number;
  isHighlighted?: boolean;
}

export const DocumentCard = forwardRef<HTMLDivElement, DocumentCardProps>(
  ({ evidence, delay = 0, isHighlighted = false }, ref) => {
    return (
      <BaseEvidenceCard delay={delay} isHighlighted={isHighlighted} ref={ref}>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
          <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">{evidence.title}</h4>
        </div>
        <p className="text-xs md:text-sm text-gray-700 whitespace-pre-line leading-relaxed">{evidence.content}</p>
      </BaseEvidenceCard>
    );
  }
);

DocumentCard.displayName = "DocumentCard";
