import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Paperclip,
  Send,
  ShieldAlert,
} from "lucide-react";
import styled, { css } from "styled-components";
import type { Choice, Evidence, Message } from "@/types";
import { ChoiceButton, ChoiceMetadata, RichChoice } from "./ChoiceButton";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceModal } from "./EvidenceModal";
import { useAudio } from "@/lib/stores/useAudio";
import { listItemVariants, reducedMotionEnabled, scaleOnHover } from "@/utils/animations";

export interface ParticipantProfile {
  id: string;
  name: string;
  avatar?: string;
  accentColor?: string;
  role?: string;
}

export interface ChatViewProps {
  messages: Message[];
  participants: Record<string, ParticipantProfile>;
  onSendMessage: (content: string) => Promise<void> | void;
  isWaitingResponse?: boolean;
  typingIndicator?: {
    senderId: string;
    message?: string;
  };
  choices?: Array<Choice & { metadata?: ChoiceMetadata }>;
  onChoiceSelect?: (choice: RichChoice) => Promise<void> | void;
  attachmentsEnabled?: boolean;
  onAttachmentRequest?: () => void;
  onEvidenceOpen?: (evidence: Evidence) => void;
}

const ChatShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 620px;
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: clamp(1rem, 2vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  scroll-behavior: smooth;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-bottom: 2.5rem;
  }
`;

const MessageGroup = styled(motion.div)<{ $align: "left" | "right" | "center" }>`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: ${({ $align }) =>
    $align === "right" ? "flex-end" : $align === "center" ? "center" : "flex-start"};
`;

const MessageBubble = styled(motion.div)<{
  $variant: "player" | "ai" | "character" | "system";
  $accent?: string;
}>`
  max-width: min(480px, 75%);
  width: fit-content;
  padding: 0.9rem 1.25rem;
  border-radius: 20px;
  line-height: 1.55;
  font-size: 0.95rem;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.35);
  background: rgba(30, 30, 30, 0.9);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.08);

  ${({ $variant, theme }) =>
    $variant === "player" &&
    css`
      background: linear-gradient(
        135deg,
        rgba(33, 150, 243, 0.95),
        rgba(33, 150, 243, 0.6)
      );
      box-shadow: 0 18px 40px rgba(33, 150, 243, 0.35);
      border: none;
    `}

  ${({ $variant, $accent }) =>
    $variant === "character" &&
    $accent &&
    css`
      border-left: 4px solid ${$accent};
    `}

  ${({ $variant }) =>
    $variant === "system" &&
    css`
      max-width: 100%;
      text-align: center;
      font-weight: 600;
      letter-spacing: 0.02em;
      padding: 0.85rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px dashed rgba(255, 255, 255, 0.2);
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 85%;
    font-size: 0.92rem;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Avatar = styled.div<{ $src?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.darkGray};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.4);

  ${({ $src }) =>
    $src &&
    css`
      background-image: url(${$src});
      background-size: cover;
      background-position: center;
    `}
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
`;

const TypingIndicatorBubble = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
`;

const Dot = styled(motion.span)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  margin-top: 0.5rem;
`;

const InputBar = styled.form`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem clamp(1rem, 3vw, 2rem);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(12, 12, 12, 0.85);
  backdrop-filter: blur(12px);
`;

const InputField = styled.textarea`
  flex: 1;
  resize: none;
  min-height: 52px;
  max-height: 140px;
  border-radius: 14px;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(20, 20, 20, 0.7);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.25);
  }
`;

const IconButton = styled.button<{ $variant?: "default" | "primary" }>`
  border: none;
  border-radius: 12px;
  padding: 0.65rem 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.primary : "rgba(255, 255, 255, 0.1)"};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ $variant }) =>
        $variant === "primary"
          ? "0 10px 25px rgba(33, 150, 243, 0.35)"
          : "0 10px 25px rgba(0,0,0,0.3)"};
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AttachmentHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
`;

const EvidenceWrapper = styled.div`
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const getVariant = (message: Message, participants: Record<string, ParticipantProfile>) => {
  if (message.type === "system") return "system";
  if (message.sender === "player") return "player";
  if (message.sender === "kastor") return "ai";
  if (participants[message.sender]) return "character";
  return "ai";
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const ChatView = ({
  messages,
  participants,
  onSendMessage,
  isWaitingResponse,
  typingIndicator,
  choices,
  onChoiceSelect,
  attachmentsEnabled = true,
  onAttachmentRequest,
  onEvidenceOpen,
}: ChatViewProps) => {
  const [inputValue, setInputValue] = useState("");
  const [choiceLocked, setChoiceLocked] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const playMessageSound = useAudio((state) => state.playMessageSound);
  const playChoiceSound = useAudio((state) => state.playHit);
  const prefersReducedMotion = useMemo(() => reducedMotionEnabled(), []);

  useEffect(() => {
    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
    messageEndRef.current?.scrollIntoView({ behavior });
  }, [messages, prefersReducedMotion, typingIndicator]);

  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender !== "player") {
      playMessageSound();
    }
  }, [messages, playMessageSound]);

  useEffect(() => {
    if (!choices?.length) {
      setChoiceLocked(false);
    }
  }, [choices]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!inputValue.trim()) return;
      await onSendMessage(inputValue.trim());
      setInputValue("");
    },
    [inputValue, onSendMessage],
  );

  const handleChoiceClick = useCallback(
    async (choice: RichChoice) => {
      if (choiceLocked) return;
      setChoiceLocked(true);
      playChoiceSound();
      await onChoiceSelect?.(choice);
    },
    [choiceLocked, onChoiceSelect, playChoiceSound],
  );

  const typingProfile = typingIndicator?.senderId
    ? participants[typingIndicator.senderId]
    : undefined;

  const renderMessageContent = (message: Message): ReactNode => {
    if (message.type === "system") {
      return message.content;
    }
    return message.content;
  };

  const handleEvidenceView = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    onEvidenceOpen?.(evidence);
  };

  const relatedEvidence = useMemo(() => {
    if (!selectedEvidence) return [];
    const relatedIds = new Set(selectedEvidence.relatedTo);
    return messages
      .flatMap((msg) => msg.attachments ?? [])
      .filter((item) => relatedIds.has(item.id) && item.id !== selectedEvidence.id);
  }, [messages, selectedEvidence]);

  return (
    <ChatShell>
        <MessageArea>
        <AnimatePresence initial={false}>
            {messages.map((message, index) => {
            const variant = getVariant(message, participants);
            const profile = participants[message.sender];
            const align =
              variant === "player" ? "right" : variant === "system" ? "center" : "left";
            return (
              <MessageGroup
                key={message.id}
                $align={align}
                  variants={prefersReducedMotion ? undefined : listItemVariants}
                  initial={prefersReducedMotion ? undefined : "hidden"}
                  animate={prefersReducedMotion ? undefined : "visible"}
                  exit={prefersReducedMotion ? undefined : "hidden"}
                  custom={index}
              >
                {variant !== "player" && variant !== "system" ? (
                  <MessageHeader>
                    <Avatar $src={profile?.avatar}>
                      {profile?.avatar ? null : profile?.name?.[0] ?? "?"}
                    </Avatar>
                    <div>
                      <strong>{profile?.name ?? message.sender}</strong>
                      {profile?.role ? <div style={{ fontSize: "0.7rem" }}>{profile.role}</div> : null}
                    </div>
                    <Timestamp>{formatTimestamp(message.timestamp)}</Timestamp>
                  </MessageHeader>
                ) : null}

                  <MessageBubble
                    $variant={variant as "player" | "ai" | "character" | "system"}
                    $accent={profile?.accentColor}
                    initial={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, y: 12, scale: 0.98 }
                    }
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : { scale: 1.02, boxShadow: "0 18px 32px rgba(33, 150, 243, 0.18)" }
                    }
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                  {variant === "player" ? (
                    <Timestamp style={{ display: "block", marginBottom: "0.25rem", textAlign: "right" }}>
                      {formatTimestamp(message.timestamp)}
                    </Timestamp>
                  ) : null}
                  {renderMessageContent(message)}
                  {message.attachments?.length ? (
                    <EvidenceWrapper>
                      {message.attachments.map((item) => (
                        <EvidenceCard
                          key={item.id}
                          evidence={item}
                          onView={handleEvidenceView}
                        />
                      ))}
                    </EvidenceWrapper>
                  ) : null}
                </MessageBubble>
              </MessageGroup>
            );
          })}
        </AnimatePresence>

        {typingIndicator ? (
          <MessageGroup $align="left">
            <TypingIndicatorBubble
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Dot animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
              <Dot
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              />
              <Dot
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              />
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                {typingProfile?.name ?? "Someone"} is typing…
              </span>
            </TypingIndicatorBubble>
          </MessageGroup>
        ) : null}

        <div ref={messageEndRef} />
      </MessageArea>

      {choices?.length ? (
        <ChoiceContainer>
          <AnimatePresence>
            {choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                disabled={choiceLocked}
                onSelect={handleChoiceClick}
              />
            ))}
          </AnimatePresence>
        </ChoiceContainer>
      ) : null}

      <InputBar onSubmit={handleSubmit}>
        <InputField
          value={inputValue}
          placeholder={isWaitingResponse ? "Waiting for Kastor…" : "Type your response…"}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isWaitingResponse}
          rows={1}
        />
        {attachmentsEnabled ? (
          <div>
            <IconButton
              type="button"
              onClick={onAttachmentRequest}
              disabled={isWaitingResponse}
              title="Attach evidence"
            >
              <Paperclip size={18} />
            </IconButton>
            <AttachmentHint>
              <ShieldAlert size={14} />
              Attach evidence to bolster your case
            </AttachmentHint>
          </div>
        ) : null}
        <IconButton
          type="submit"
          $variant="primary"
          disabled={isWaitingResponse || !inputValue.trim()}
        >
          <Send size={18} />
        </IconButton>
      </InputBar>

      <EvidenceModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        relatedEvidence={relatedEvidence}
        onNavigate={(id) => {
          const target = messages
            .flatMap((msg) => msg.attachments ?? [])
            .find((item) => item.id === id);
          if (target) {
            setSelectedEvidence(target);
          }
        }}
      />
    </ChatShell>
  );
};

export default ChatView;
