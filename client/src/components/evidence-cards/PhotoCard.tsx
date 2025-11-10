import { forwardRef } from "react";
import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { PhotoEvidence } from "@/lib/stores/useDetectiveGame";

interface PhotoCardProps {
  evidence: PhotoEvidence;
  delay?: number;
  isHighlighted?: boolean;
  collapsed?: boolean;
}

export const PhotoCard = forwardRef<HTMLDivElement, PhotoCardProps>(
  ({ evidence, delay = 0, isHighlighted = false, collapsed = false }, ref) => {
    if (collapsed) {
      return (
        <div className="p-2">
          <img 
            src={evidence.imageUrl} 
            alt={evidence.caption} 
            className="w-20 h-20 object-cover rounded-lg" 
          />
        </div>
      );
    }

    return (
      <BaseEvidenceCard delay={delay} isHighlighted={isHighlighted} ref={ref} className="overflow-hidden p-0">
        <img 
          src={evidence.imageUrl} 
          alt={evidence.caption} 
          className="w-full h-32 md:h-40 object-cover" 
        />
        <div className="p-3 md:p-4">
          <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1">{evidence.title}</h4>
          <p className="text-xs md:text-sm text-gray-600">{evidence.caption}</p>
        </div>
      </BaseEvidenceCard>
    );
  }
);

PhotoCard.displayName = "PhotoCard";
