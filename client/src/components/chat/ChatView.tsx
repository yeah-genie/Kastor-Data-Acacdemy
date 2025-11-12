import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  useGameStore,
  selectMessages,
  selectChoices,
  selectTypingIndicator,
  selectIsAwaitingResponse,
} from "@/store/gameStore";
import type { Message, Evidence } from "@/types";
import EvidenceCard from "./EvidenceCard";
import EvidenceModal from "./EvidenceModal";

const ChatLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1.25rem;
  background: linear-gradient(180deg, rgba(35, 47, 68, 0.22), transparent),
    rgba(20, 21, 34, 0.75);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const MessageRow = styled.div<{ $align: "left" | "right" | "center" }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) =>
    $align === "left" ? "flex-start" : $align === "right" ? "flex-end" : "center"};
  gap: 0.4rem;
`;

const Bubble = styled(motion.div)<{ $variant: "player" | "kastor" | "system" | "default" }>`
  max-width: min(520px, 75%);
  padding: 0.95rem 1.15rem;
  border-radius: 18px;
  line-height: 1.5;
  font-size: 0.95rem;
  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "player":
        return theme.colors.white;
      case "kastor":
        return theme.colors.white;
      case "system":
        return theme.colors.lightGray;
      default:
        return theme.colors.white;
    }
  }};
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case "player":
        return `linear-gradient(135deg, ${theme.colors.primary}, rgba(33, 150, 243, 0.8))`;
      case "kastor":
        return "linear-gradient(135deg, rgba(77, 182, 172, 0.2), rgba(29, 233, 182, 0.08))";
      case "system":
        return "transparent";
      default:
        return "rgba(255, 255, 255, 0.05)";
    }
  }};
  border: ${({ $variant }) => ($variant === "system" ? "none" : "1px solid rgba(255,255,255,0.05)")};
  box-shadow: ${({ $variant }) =>
    $variant === "player"
      ? "0 12px 28px rgba(33, 150, 243, 0.35)"
      : $variant === "kastor"
        ? "0 12px 28px rgba(77, 182, 172, 0.18)"
        : "none"};
  text-align: ${({ $variant }) => ($variant === "system" ? "center" : "left")};
`;

const MessageMeta = styled.div`
  display: flex;
  gap: 0.35rem;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-weight: 500;
`;

const SenderLabel = styled.span<{ $variant: "player" | "kastor" | "system" | "default" }>`
  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "player":
        return "rgba(255,255,255,0.82)";
      case "kastor":
        return "#21ffd0";
      case "system":
        return theme.colors.lightGray;
      default:
        return theme.colors.primary;
    }
  }};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const AttachmentStack = styled.div`
  margin-top: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: min(520px, 75%);
`;

const ChoiceShelf = styled(AnimatePresence)`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChoiceButton = styled(motion.button)`
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border: 2px solid rgba(33, 150, 243, 0.6);
  background: rgba(33, 150, 243, 0.06);
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 30px rgba(33, 150, 243, 0.22);
    background: rgba(33, 150, 243, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;

const InputDock = styled.form`
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const ChatInput = styled.textarea`
  flex: 1;
  min-height: 52px;
  max-height: 150px;
  resize: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.85rem 1rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  line-height: 1.4;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: border 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.18);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 10px 20px rgba(33, 150, 243, 0.18);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SendButton = styled(IconButton)<{ $primary?: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: rgba(33, 150, 243, 0.9);
  }
`;

const dots = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
`;

const TypingBubble = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.85rem;
  border-radius: 12px;
  background: rgba(33, 150, 243, 0.12);
  gap: 0.35rem;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(33, 150, 243, 0.6);
  animation: ${dots} 1.4s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const ChoiceHint = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-weight: 500;
`;

const actorProfiles: Record<
  string,
  { displayName: string; avatar: string; variant: "player" | "kastor" | "default" }
> = {
  player: { displayName: "You", avatar: "🕵️", variant: "player" },
  kastor: { displayName: "Kastor", avatar: "🦉", variant: "kastor" },
  "maya-zhang": { displayName: "Maya Zhang", avatar: "🧠", variant: "default" },
  "camille-beaumont": { displayName: "Camille Beaumont", avatar: "📡", variant: "default" },
  "isabella-torres": { displayName: "Isabella Torres", avatar: "🖥️", variant: "default" },
  "alex-reeves": { displayName: "Alex Reeves", avatar: "🔐", variant: "default" },
  system: { displayName: "System", avatar: "⚙️", variant: "default" },
};

const messageVariants: Record<"player" | "kastor" | "system" | "default", "player" | "kastor" | "system" | "default"> = {
  player: "player",
  kastor: "kastor",
  system: "system",
  default: "default",
};

const bubbleMotion = {
  initial: { opacity: 0, y: 12, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const choiceMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const ChatView = () => {
  const messages = useGameStore(selectMessages);
  const choices = useGameStore(selectChoices);
  const typingIndicator = useGameStore(selectTypingIndicator);
  const isAwaitingResponse = useGameStore(selectIsAwaitingResponse);
  const sendPlayerMessage = useGameStore((state) => state.sendPlayerMessage);
  const makeChoice = useGameStore((state) => state.makeChoice);
  const startEpisode = useGameStore((state) => state.startEpisode);

  const [inputValue, setInputValue] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      startEpisode("episode-4");
    }
  }, [messages.length, startEpisode]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typingIndicator, choices]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    sendPlayerMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  const classifiedMessages = useMemo(() => {
    return messages.map((message): { data: Message; variant: "player" | "kastor" | "system" | "default"; align: "left" | "right" | "center"; profile: (typeof actorProfiles)[string] } => {
      if (message.type === "system") {
        return { data: message, variant: "system", align: "center", profile: actorProfiles.system };
      }
      const profile = actorProfiles[message.sender] ?? {
        displayName: message.sender,
        avatar: "👤",
        variant: "default",
      };
      const variant = messageVariants[profile.variant];
      const align =
        variant === "player"
          ? "right"
          : variant === "system"
            ? "center"
            : "left";
      return {
        data: message,
        variant,
        align,
        profile,
      };
    });
  }, [messages]);

  return (
    <ChatLayout>
      <ScrollArea ref={scrollRef}>
        {classifiedMessages.map(({ data, variant, align, profile }) => (
          <MessageRow key={data.id} $align={align}>
            {variant !== "system" && (
              <MessageMeta>
                <span>{profile.avatar}</span>
                <SenderLabel $variant={variant}>{profile.displayName}</SenderLabel>
                {data.timestamp && <span>· {data.timestamp}</span>}
              </MessageMeta>
            )}
            <Bubble
              $variant={variant}
              variants={bubbleMotion}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {data.content && <span>{data.content}</span>}
              {data.attachments && data.attachments.length > 0 && (
                <AttachmentStack>
                  {data.attachments.map((attachment) => (
                    <EvidenceCard
                      key={`${data.id}-${attachment.id}`}
                      evidence={attachment}
                      onView={setSelectedEvidence}
                    />
                  ))}
                </AttachmentStack>
              )}
            </Bubble>
          </MessageRow>
        ))}
        {typingIndicator && (
          <MessageRow $align="left">
            <MessageMeta>
              <span>🦉</span>
              <SenderLabel $variant="kastor">{typingIndicator.actor}</SenderLabel>
              <span>· typing</span>
            </MessageMeta>
            <TypingBubble>
              <Dot />
              <Dot />
              <Dot />
            </TypingBubble>
          </MessageRow>
        )}
      </ScrollArea>

      <ChoiceShelf>
        <AnimatePresence>
          {choices.length > 0 && (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <ChoiceHint>Choose a response:</ChoiceHint>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {choices.map((choice) => (
                  <ChoiceButton
                    key={choice.id}
                    variants={choiceMotion}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    onClick={() => makeChoice(choice.id)}
                  >
                    {choice.text}
                  </ChoiceButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ChoiceShelf>

      <InputDock onSubmit={handleSubmit}>
        <ChatInput
          placeholder={isAwaitingResponse ? "Waiting for Kastor..." : "Type your response…"}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAwaitingResponse}
          aria-label="chat-input"
        />
        <IconButton type="button" disabled title="Attach evidence (Coming soon)">
          📎
        </IconButton>
        <SendButton type="submit" disabled={!inputValue.trim() || isAwaitingResponse} $primary>
          ➤
        </SendButton>
      </InputDock>

      <EvidenceModal evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
    </ChatLayout>
  );
};

export default ChatView;
