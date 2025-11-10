import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";

interface BaseEvidenceCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  isHighlighted?: boolean;
}

export const BaseEvidenceCard = forwardRef<HTMLDivElement, BaseEvidenceCardProps>(
  ({ children, delay = 0, className = "", isHighlighted = false }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`bg-white rounded-xl p-4 border-2 shadow-sm transition-all ${
          isHighlighted 
            ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200' 
            : 'border-gray-200'
        } ${className}`}
      >
        {children}
      </motion.div>
    );
  }
);

BaseEvidenceCard.displayName = "BaseEvidenceCard";
