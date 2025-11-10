import { useState, useEffect, useRef } from "react";
import { TypewriterSpeed } from "@/lib/stores/useDetectiveGame";
import { parseTextWithGlossary } from "./GlossaryTooltip";

interface TypewriterTextProps {
  text: string;
  speed: TypewriterSpeed;
  onTypingComplete?: () => void;
  onTypingStateChange?: (isTyping: boolean) => void;
  bypassTypewriter?: boolean;
  className?: string;
  glossaryMode?: "detective" | "normal" | "none";
}

export function TypewriterText({ 
  text, 
  speed, 
  onTypingComplete, 
  onTypingStateChange,
  bypassTypewriter = false,
  className = "",
  glossaryMode = "normal"
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const timerRef = useRef<number | null>(null);
  const isActivelyTyping = useRef(false);

  const speedMs = {
    off: 0,
    fast: 30,
    normal: 50,
  };

  const currentSpeed = speedMs[speed];

  useEffect(() => {
    setIsSkipped(false);
    
    if (bypassTypewriter || speed === 'off') {
      setDisplayedText(text);
      setIsTyping(false);
      isActivelyTyping.current = false;
      onTypingStateChange?.(false);
      onTypingComplete?.();
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    isActivelyTyping.current = true;
    onTypingStateChange?.(true);
    
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timerRef.current = window.setTimeout(typeNextChar, currentSpeed);
      } else {
        setIsTyping(false);
        isActivelyTyping.current = false;
        onTypingStateChange?.(false);
        onTypingComplete?.();
      }
    };

    timerRef.current = window.setTimeout(typeNextChar, currentSpeed);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (isActivelyTyping.current) {
        isActivelyTyping.current = false;
        onTypingStateChange?.(false);
      }
    };
  }, [text, speed, bypassTypewriter]);

  const handleSkip = () => {
    if (isTyping && !isSkipped) {
      setIsSkipped(true);
      setDisplayedText(text);
      setIsTyping(false);
      isActivelyTyping.current = false;
      onTypingStateChange?.(false);
      onTypingComplete?.();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  const renderedText = glossaryMode === "none" 
    ? displayedText 
    : parseTextWithGlossary(displayedText, glossaryMode === "detective" ? "detective" : "normal");

  if (bypassTypewriter || speed === 'off') {
    const fullText = glossaryMode === "none" 
      ? text 
      : parseTextWithGlossary(text, glossaryMode === "detective" ? "detective" : "normal");
    return <span className={className}>{fullText}</span>;
  }

  return (
    <span 
      className={className} 
      onClick={handleSkip}
      style={{ cursor: isTyping ? 'pointer' : 'default' }}
    >
      {renderedText}
      {isTyping && <span className="animate-pulse">▋</span>}
    </span>
  );
}
