import { motion } from "framer-motion";
import { User, FileText, Mail } from "lucide-react";
import { Message } from "@/data/episode-types";
import { useEffect, useState } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { parseTextWithGlossary } from "./GlossaryTooltip";
import { TypewriterText } from "./TypewriterText";
import { EmailNotificationModal } from "./EmailNotificationModal";
import { VoicemailPlayer } from "./VoicemailPlayer";

interface ChatMessageProps {
  message: Message;
  index: number;
  onTypingStateChange?: (isTyping: boolean) => void;
  onTypingComplete?: () => void;
  onCharacterTyped?: () => void;
}

function shouldUseTypewriter(speaker: string): boolean {
  // No typewriter for any character - only emails use typewriter
  return false;
}

export function ChatMessage({ message, index, onTypingStateChange, onTypingComplete, onCharacterTyped }: ChatMessageProps) {
  const { playMessageSound } = useAudio();
  const { typewriterSpeed } = useDetectiveGame();
  const [showEmailModal, setShowEmailModal] = useState(false);

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
      case "kastor":
        return "Kastor";
      case "maya":
        return "Maya";
      case "kaito":
        return "Kaito";
      case "lukas":
        return "Lukas";
      case "diego":
        return "Diego";
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
      // Episode 2 characters
      case "marcus":
        return "Marcus Chen";
      case "elena":
        return "Elena Kovač";
      case "nina":
        return "Nina Reyes";
      case "camille":
        return "Camille Beaumont";
      // Episode 3 characters
      case "jake":
        return "Jake Morrison";
      case "alex":
        return "Alex Torres";
      case "harrison":
        return "Harrison Webb";
      case "luna":
        return "Luna Park";
      case "fixer":
        return "???";
      default:
        return "Unknown";
    }
  };
  
  const getSpeakerAvatar = () => {
    switch (message.speaker) {
      case "detective":
        return "/detective.jpg";
      case "kastor":
        return "/detective.jpg"; // Using detective image for Kastor temporarily
      case "maya":
        return "/characters/maya.jpg";
      case "kaito":
        return "/characters/kaito.jpg";
      case "lukas":
        return "/characters/lukas.jpg";
      case "diego":
        return "/characters/diego.jpg";
      case "chris":
        return "/characters/chris.jpg";
      case "ryan":
        return "/characters/ryan.jpg";
      // Episode 2 characters
      case "marcus":
        return "/characters/marcus.jpg";
      case "elena":
        return "/characters/elena.jpg";
      case "nina":
        return "/characters/nina.jpg";
      case "camille":
        return "/characters/camille.jpg";
      // Episode 3 characters
      case "jake":
        return "/characters/jake.jpg";
      case "alex":
        return "/characters/alex.jpg";
      case "harrison":
        return "/characters/harrison.jpg";
      case "luna":
        return "/characters/luna.jpg";
      case "fixer":
        return "/characters/fixer.jpg";
      default:
        return null;
    }
  };

  const isDetective = message.speaker === "detective";
  const isSystem = message.speaker === "system";
  const isNarrator = message.speaker === "narrator";
  const isKastor = message.speaker === "kastor";
  const isCharacter = ["maya", "chris", "ryan", "kaito", "lukas", "diego", "kastor", "marcus", "elena", "nina", "camille", "jake", "alex", "harrison", "luna", "fixer"].includes(message.speaker);
  const avatarUrl = getSpeakerAvatar();
  const useTypewriter = shouldUseTypewriter(message.speaker);

  // Check if message is a thought (starts with "(" and ends with ")")
  const isThought = message.text?.trim().startsWith("(") && message.text?.trim().endsWith(")");

  // System messages (centered notifications) or Email
  if (isSystem) {
    // Email notification - clickable to open modal
    if (message.email) {
      return (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5, type: "spring" }}
            className="flex justify-center my-4"
          >
            <motion.button
              onClick={() => setShowEmailModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 cursor-pointer"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Mail className="w-6 h-6" />
              </motion.div>
              <div className="text-left">
                <div className="text-sm font-semibold">📧 New Email</div>
                <div className="text-xs opacity-90">From: {message.email.from.split('<')[0].trim()}</div>
                <div className="text-xs opacity-90 font-bold mt-1">{message.email.subject}</div>
              </div>
            </motion.button>
          </motion.div>

          <EmailNotificationModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            from={message.email.from}
            subject={message.email.subject}
            body={message.email.body}
          />
        </>
      );
    }

    // Voicemail player
    if (message.voicemail) {
      return (
        <VoicemailPlayer
          from={message.voicemail.from}
          timestamp={message.voicemail.timestamp}
          text={message.voicemail.text}
          index={index}
          autoPlay={message.voicemail.autoPlay}
        />
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
            className="py-2 text-center"
          >
            <p className="text-xs font-normal leading-normal text-[#b0b0b0]">
              <TypewriterText
                text={message.text}
                speed={typewriterSpeed}
                onTypingStateChange={undefined}
                bypassTypewriter={true}
                glossaryMode="none"
              />
            </p>
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
              className="max-w-[85%] rounded-xl shadow-lg border border-white/10"
            />
          </motion.div>
        )}
      </>
    );
  }

  // Narrator scene description (gray box)
  if (isNarrator) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.3 }}
          className="flex justify-center my-3"
        >
          <div className="bg-[#2a2d3a]/50 border border-white/10 text-[#b0b0b0] px-4 py-3 rounded-xl max-w-[90%] md:max-w-[85%] shadow-md">
            <p className="text-sm md:text-xs leading-relaxed break-words whitespace-pre-wrap italic">
              {parseTextWithGlossary(message.text || "")}
            </p>
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
              className="max-w-[85%] rounded-xl shadow-lg border border-white/10"
            />
          </motion.div>
        )}
      </>
    );
  }

  // Regular chat messages
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.3 }}
      className={`flex items-end gap-3 ${isDetective ? "max-w-[70%] self-end" : "max-w-[75%] self-start"}`}
    >
      {/* Avatar - only for NPC messages */}
      {!isDetective && (
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <div className="relative">
              <img
                src={avatarUrl}
                alt={getSpeakerName()}
                className="h-9 w-9 rounded-full object-cover"
              />
              {/* Cyan glow for Kastor */}
              {isKastor && (
                <div className="absolute inset-0 rounded-full border border-primary shadow-[0_0_8px_0_rgba(6,220,249,0.5)]"></div>
              )}
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full flex items-center justify-center bg-[#2a2d3a] text-white text-xs font-semibold">
              <User className="w-4 h-4" />
            </div>
          )}
        </div>
      )}

      {/* Message bubble */}
      <div className="flex flex-col gap-1.5">
        {/* Speaker name - only for NPC messages */}
        {!isDetective && (
          <p className="text-xs font-normal text-[#b0b0b0]">
            {getSpeakerName()}
          </p>
        )}

        <div className="relative">
          <div className={`rounded-xl px-4 py-3 shadow-md ${
            isThought
              ? isDetective
                ? "bg-[#2a2d3a]/50 text-[#b0b0b0] border-2 border-dashed border-primary/30 rounded-br-none italic"
                : "bg-[#2a2d3a]/30 text-[#b0b0b0] border-2 border-dashed border-white/20 rounded-bl-none italic"
              : isDetective
                ? "rounded-br-none bg-gradient-to-br from-[#00d9ff] to-[#0097b2] text-white shadow-[0_4px_12px_rgba(0,217,255,0.2)]"
                : "rounded-bl-none bg-[#2a2d3a] text-white"
          }`}>
            <p className="text-[15px] font-normal leading-snug whitespace-pre-wrap">
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

          {/* Reaction Sticker */}
          {message.reaction && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200 }}
              className={`absolute -bottom-2 ${isDetective ? "-left-3" : "-right-3"} bg-[#1a1a2e] rounded-full p-1.5 shadow-lg border-2 border-primary/30`}
            >
              <span className="text-2xl leading-none">{message.reaction}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
