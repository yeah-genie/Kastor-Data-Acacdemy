import { motion } from "framer-motion";
import { User, FileText, Mail } from "lucide-react";
import { Message } from "@/data/case1-episode-final";
import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { parseTextWithGlossary } from "./GlossaryTooltip";
import { TypewriterText } from "./TypewriterText";

interface ChatMessageProps {
  message: Message;
  index: number;
  onTypingStateChange?: (isTyping: boolean) => void;
  onTypingComplete?: () => void;
  onCharacterTyped?: () => void;
}

function shouldUseTypewriter(speaker: string): boolean {
  return ["maya", "chris", "ryan", "client", "kaito", "lukas", "diego"].includes(speaker);
}

export function ChatMessage({ message, index, onTypingStateChange, onTypingComplete, onCharacterTyped }: ChatMessageProps) {
  const { playMessageSound } = useAudio();
  const { typewriterSpeed } = useDetectiveGame();

  useEffect(() => {
    playMessageSound();

    // Play sound effect if specified
    if (message.soundEffect) {
      playSoundEffect(message.soundEffect);
    }
  }, []);

  const playSoundEffect = (effect: string) => {
    try {
      const audio = new Audio(`/sounds/${effect}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Silently fail if sound can't play
      });
    } catch (error) {
      // Silently fail if sound file doesn't exist
    }
  };
  
  const getSpeakerName = () => {
    if (message.characterName) return message.characterName;
    
    switch (message.speaker) {
      case "detective":
        return "Detective";
      case "maya":
        return "Maya";
      case "chris":
        return "Chris";
      case "ryan":
        return "Ryan";
      case "client":
        return "Client";
      case "narrator":
        return "Kastor";
      case "system":
        return "System";
    }
  };
  
  const getSpeakerAvatar = () => {
    switch (message.speaker) {
      case "detective":
        return "/detective.jpg";
      case "maya":
        return "/characters/maya.jpg";
      case "chris":
        return "/characters/chris.jpg";
      case "ryan":
        return "/characters/ryan.jpg";
      default:
        return null;
    }
  };

  const isDetective = message.speaker === "detective";
  const isSystem = message.speaker === "system";
  const isNarrator = message.speaker === "narrator";
  const isCharacter = ["maya", "chris", "ryan"].includes(message.speaker);
  const avatarUrl = getSpeakerAvatar();
  const useTypewriter = shouldUseTypewriter(message.speaker);

  // System messages (centered notifications) or Email
  if (isSystem) {
    // Email layout
    if (message.email) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.4 }}
          className="flex justify-center my-4"
        >
          <div className="w-full max-w-[90%] md:max-w-[85%] bg-white border-2 border-gray-300 rounded-2xl shadow-xl overflow-hidden">
            {/* Email Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-white" />
              <div className="text-white font-bold text-lg">New Message</div>
            </div>

            {/* Email Content */}
            <div className="p-6 space-y-4">
              {/* From */}
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-gray-600 min-w-[60px]">From:</span>
                <span className="text-sm text-gray-900 font-medium">{message.email.from}</span>
              </div>

              {/* Subject */}
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-gray-600 min-w-[60px]">Subject:</span>
                <span className="text-base font-bold text-gray-900">{message.email.subject}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Body with Typewriter Effect */}
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                <TypewriterText
                  text={message.email.body}
                  speed={typewriterSpeed}
                  onTypingStateChange={onTypingStateChange}
                  onTypingComplete={onTypingComplete}
                  onCharacterTyped={onCharacterTyped}
                  bypassTypewriter={false}
                  glossaryMode="normal"
                />
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Regular system message
    return (
      <>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.3 }}
            className="flex justify-center my-2"
          >
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-semibold text-center whitespace-pre-wrap">
              <TypewriterText
                text={message.text}
                speed={typewriterSpeed}
                onTypingStateChange={undefined}
                bypassTypewriter={true}
                glossaryMode="none"
              />
            </div>
          </motion.div>
        )}

        {message.photo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
            className="flex justify-center my-3"
          >
            <img
              src={message.photo}
              alt="Scene"
              className="max-w-[85%] rounded-3xl shadow-lg border-2 border-gray-200"
            />
          </motion.div>
        )}
      </>
    );
  }

  // Kastor hint box / Narrator actions
  if (isNarrator) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.3 }}
          className="flex justify-center my-3"
        >
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg max-w-[90%] md:max-w-[85%] shadow-sm">
            <div className="flex items-start gap-2">
              <div className="text-xl md:text-lg">💡</div>
              <div className="flex-1">
                <div className="text-sm md:text-xs font-semibold text-amber-700 mb-1">Kastor's Hint</div>
                <p className="text-base md:text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {parseTextWithGlossary(message.text || "")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Image for narrator actions */}
        {message.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
            className="flex justify-center my-3"
          >
            <img
              src={message.image}
              alt="Scene"
              className="max-w-[85%] rounded-2xl shadow-lg border-2 border-gray-200"
            />
          </motion.div>
        )}
      </>
    );
  }

  // Regular chat messages
  return (
    <motion.div
      initial={{ opacity: 0, x: isDetective ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, duration: 0.3 }}
      className={`flex gap-2 ${isDetective ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={getSpeakerName()} 
            className={`w-10 h-10 md:w-8 md:h-8 rounded-full object-cover ${isDetective ? 'object-top' : 'object-center'}`}
          />
        ) : (
          <div className={`w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
            isDetective ? "bg-blue-500" : isNarrator ? "bg-purple-500" : "bg-gray-500"
          }`}>
            {isDetective ? "👮" : isNarrator ? <FileText className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col max-w-[80%] md:max-w-[75%] ${isDetective ? "items-end" : "items-start"}`}>
        <div className="text-xs md:text-[11px] text-gray-500 mb-1 px-2">
          {getSpeakerName()} • {message.timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className={`rounded-2xl px-4 py-3 md:py-2 ${
          isDetective 
            ? "bg-blue-500 text-white rounded-tr-sm" 
            : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
        }`}>
          <p className="text-base md:text-sm leading-relaxed whitespace-pre-wrap">
            <TypewriterText
              text={message.text || ""}
              speed={typewriterSpeed}
              onTypingStateChange={useTypewriter ? onTypingStateChange : undefined}
              onTypingComplete={useTypewriter ? onTypingComplete : undefined}
              onCharacterTyped={useTypewriter ? onCharacterTyped : undefined}
              bypassTypewriter={!useTypewriter}
              glossaryMode={isDetective ? "detective" : "normal"}
            />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
