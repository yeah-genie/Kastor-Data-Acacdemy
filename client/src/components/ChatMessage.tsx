import { motion } from "framer-motion";
import { User, FileText } from "lucide-react";
import { Message } from "@/data/case1-story";
import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const { playMessageSound } = useAudio();
  
  useEffect(() => {
    playMessageSound();
  }, []);
  
  const getSpeakerName = () => {
    switch (message.speaker) {
      case "detective":
        return "Detective Miles";
      case "client":
        return "Client";
      case "narrator":
        return "Forensic Analyst";
      case "system":
        return "System";
    }
  };

  const isDetective = message.speaker === "detective";
  const isSystem = message.speaker === "system";
  const isNarrator = message.speaker === "narrator";

  // System messages (centered notifications)
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2, duration: 0.3 }}
        className="flex justify-center my-2"
      >
        <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-semibold">
          {message.text}
        </div>
      </motion.div>
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
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
          isDetective ? "bg-blue-500" : isNarrator ? "bg-purple-500" : "bg-gray-500"
        }`}>
          {isDetective ? "👮" : isNarrator ? <FileText className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col max-w-[75%] ${isDetective ? "items-end" : "items-start"}`}>
        <div className="text-xs text-gray-500 mb-1 px-2">
          {getSpeakerName()} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className={`rounded-2xl px-4 py-2 ${
          isDetective 
            ? "bg-blue-500 text-white rounded-tr-sm" 
            : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </motion.div>
  );
}
