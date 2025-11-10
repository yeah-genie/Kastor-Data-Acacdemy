import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { CharacterEvidence } from "@/lib/stores/useDetectiveGame";
import { User } from "lucide-react";
import { forwardRef } from "react";

interface CharacterCardProps {
  evidence: CharacterEvidence;
  delay?: number;
  isHighlighted?: boolean;
  collapsed?: boolean;
}

export const CharacterCard = forwardRef<HTMLDivElement, CharacterCardProps>(
  ({ evidence, delay = 0, isHighlighted = false, collapsed = false }, ref) => {
    if (collapsed) {
      return (
        <div className="flex flex-col items-center justify-center p-5 min-w-[150px]">
          {evidence.photo ? (
            <img 
              src={evidence.photo} 
              alt={evidence.name} 
              className="w-20 h-20 rounded-full object-cover object-top border-3 border-blue-500 mb-3 shadow-lg" 
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-3 border-blue-500 mb-3 shadow-lg">
              <User className="w-10 h-10 text-blue-600" />
            </div>
          )}
          <p className="text-lg font-bold text-gray-900 text-center line-clamp-2 leading-tight">{evidence.name}</p>
        </div>
      );
    }

    return (
      <BaseEvidenceCard delay={delay} isHighlighted={isHighlighted} ref={ref}>
        <div className="flex flex-col">
          <div className="flex gap-3 md:gap-4 mb-3">
            {evidence.photo && (
              <img 
                src={evidence.photo} 
                alt={evidence.name} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover object-top border-2 border-blue-400 shadow-md flex-shrink-0" 
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1 truncate">{evidence.name}</h4>
              <p className="text-xs md:text-sm text-blue-600 font-semibold line-clamp-2">{evidence.role}</p>
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
