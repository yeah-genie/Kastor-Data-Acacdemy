import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { CharacterEvidence } from "@/lib/stores/useDetectiveGame";
import { Star } from "lucide-react";
import { forwardRef } from "react";

interface CharacterCardProps {
  evidence: CharacterEvidence;
  delay?: number;
  isHighlighted?: boolean;
}

export const CharacterCard = forwardRef<HTMLDivElement, CharacterCardProps>(
  ({ evidence, delay = 0, isHighlighted = false }, ref) => {
    return (
      <BaseEvidenceCard delay={delay} isHighlighted={isHighlighted} ref={ref}>
        <div className="flex flex-col">
          <div className="flex gap-3 md:gap-4 mb-3">
            {evidence.photo && (
              <img 
                src={evidence.photo} 
                alt={evidence.name} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover object-center border-2 border-blue-400 shadow-md flex-shrink-0" 
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1 truncate">{evidence.name}</h4>
              <p className="text-xs md:text-sm text-blue-600 font-semibold mb-2 line-clamp-2">{evidence.role}</p>
              {evidence.suspicionLevel !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-medium">Suspicion:</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 md:w-4 md:h-4 ${i < (evidence.suspicionLevel || 0) ? 'fill-red-400 text-red-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-lg p-2.5 md:p-3 border border-blue-100">
              <p className="text-[10px] md:text-xs font-bold text-blue-700 mb-1">PROFILE</p>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{evidence.description}</p>
            </div>
            
            {evidence.personality && (
              <div className="bg-purple-50 rounded-lg p-2.5 md:p-3 border border-purple-100">
                <p className="text-[10px] md:text-xs font-bold text-purple-700 mb-1">PERSONALITY</p>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{evidence.personality}</p>
              </div>
            )}
          </div>
        </div>
      </BaseEvidenceCard>
    );
  }
);

CharacterCard.displayName = "CharacterCard";
