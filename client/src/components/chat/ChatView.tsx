import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, Send, Lock, Clock } from "lucide-react";

type MessageKind = "text" | "evidence" | "system";

type Author =
  | "kastor"
  | "player"
  | "marcus"
  | "maya"
  | "camille"
  | "system";

interface EvidenceAttachment {
  id: string;
  title: string;
  type: "document" | "log" | "email" | "image" | "video";
}

interface ChatMessage {
  id: string;
  kind: MessageKind;
  author: Author;
  name: string;
  avatar: string;
  timestamp: string;
  content?: string;
  attachments?: EvidenceAttachment[];
}

const characterAccent: Partial<Record<Author, string>> = {
  kastor: "#2196F3",
  player: "#9E9E9E",
  marcus: "#7C4DFF",
  maya: "#FF9800",
  camille: "#26A69A",
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1.25rem;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.mediumGray};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const Status = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.lightGray};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  opacity: 0.75;
`;

const ChatShell = styled.section`
  flex: 1;
  min-height: 0;
  border-radius: 1.25rem;
  background: linear-gradient(
    160deg,
    rgba(33, 150, 243, 0.08),
    rgba(33, 33, 33, 0.65)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 45px rgba(0, 0, 0, 0.45);
`;

const MessageScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
  }
`;

const messageBase = css<{ $author: Author }>`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  max-width: 70%;

  ${({ $author }) =>
    $author === "player" &&
    css`
      margin-left: auto;
      flex-direction: row-reverse;
      text-align: right;
    `}

  ${({ $author }) =>
    $author === "system" &&
    css`
      margin: 0 auto;
      flex-direction: column;
      align-items: center;
      max-width: 65%;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 85%;
  }
`;

const MessageItem = styled(motion.div)<{ $author: Author }>`
  ${messageBase}
`;

const Avatar = styled.div<{ $author: Author }>`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: ${({ theme, $author }) =>
    $author === "player"
      ? theme.colors.mediumGray
      : characterAccent[$author] ?? theme.colors.darkGray};
  color: ${({ $author }) => ($author === "player" ? "#1E1E1E" : "#FFFFFF")};
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.35);
`;

const Bubble = styled.div<{
  $author: Author;
}>`
  background: ${({ theme, $author }) => {
    if ($author === "player") return "rgba(158, 158, 158, 0.18)";
    if ($author === "system") return "rgba(189, 195, 199, 0.12)";
    const accent = characterAccent[$author] ?? theme.colors.darkGray;
    return `${accent}1F`;
  }};
  border: 1px solid ${({ theme, $author }) => {
    if ($author === "player") return "rgba(255, 255, 255, 0.12)";
    if ($author === "system") return "transparent";
    const accent = characterAccent[$author] ?? theme.colors.mediumGray;
    return `${accent}55`;
  }};
  border-radius: 1.25rem;
  padding: 0.85rem 1.1rem;
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 100%;

  ${({ $author }) =>
    $author === "player" &&
    css`
      border-bottom-right-radius: 0.35rem;
    `}

  ${({ $author }) =>
    $author === "system" &&
    css`
      border-radius: 1.5rem;
      backdrop-filter: blur(6px);
    `}
`;

const BubbleHeader = styled.div<{ $author: Author }>`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.8;
  color: ${({ theme, $author }) =>
    $author === "system"
      ? theme.colors.lightGray
      : `rgba(255, 255, 255, 0.65)`};

  ${({ $author }) =>
    $author === "player" &&
    css`
      justify-content: flex-end;
    `}
`;

const BubbleBody = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const EvidenceCard = styled.button`
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(33, 150, 243, 0.12);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  font-weight: 500;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(33, 150, 243, 0.2);
  }
`;

const EvidenceIcon = styled.span`
  font-size: 1.25rem;
`;

const EvidenceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const EvidenceTitle = styled.span`
  font-weight: 600;
`;

const EvidenceType = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.65;
`;

const SystemMessage = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.lightGray};
  text-transform: uppercase;
  font-weight: 600;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.4rem 0.35rem;
  border-radius: 999px;
  background: rgba(33, 150, 243, 0.18);
  align-items: center;
  justify-content: center;

  span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.75);
    animation: typing 1.2s infinite ease-in-out;
  }

  span:nth-child(2) {
    animation-delay: 0.15s;
  }

  span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes typing {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const InputBar = styled.form`
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InputField = styled.input`
  flex: 1;
  padding: 0.85rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.35);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
`;

const IconButton = styled.button<{ $variant?: "primary" | "ghost" }>`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? css`
          background: linear-gradient(
            135deg,
            ${theme.colors.primary},
            #42a5f5
          );
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(33, 150, 243, 0.3);
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);
        `}

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;

const FooterHint = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.75rem;
  opacity: 0.65;
`;

const messageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

const evidenceIconMap: Record<EvidenceAttachment["type"], string> = {
  document: "📄",
  log: "🧾",
  email: "✉️",
  image: "🖼️",
  video: "📹",
};

const initialMessages: ChatMessage[] = [
  {
    id: "sys-1",
    kind: "system",
    author: "system",
    name: "System",
    avatar: "⚠️",
    timestamp: "03:01",
    content: "LEGEND ARENA HQ // INCIDENT CHANNEL",
  },
  {
    id: "kastor-1",
    kind: "text",
    author: "kastor",
    name: "Kastor",
    avatar: "🦊",
    timestamp: "03:02",
    content:
      "팀, 데이터 브리치를 감지했어요! 방금 1.2TB가 외부로 빠져나갔어요. 평균 전송량 대비 312% 상승이에요. 숫자가 웃고 있진 않겠죠?",
  },
  {
    id: "maya-1",
    kind: "text",
    author: "maya",
    name: "Maya Zhang",
    avatar: "🛰️",
    timestamp: "03:02",
    content:
      "서버실 CCTV 확인할게. 야간 교대했던 사람 명단 공유해줘.",
  },
  {
    id: "player-1",
    kind: "text",
    author: "player",
    name: "Player",
    avatar: "🕵️‍♂️",
    timestamp: "03:03",
    content:
      "일단 로그부터 확인하죠. 어떤 시스템에서 전송이 시작됐나요?",
  },
  {
    id: "kastor-2",
    kind: "evidence",
    author: "kastor",
    name: "Kastor",
    avatar: "🦊",
    timestamp: "03:03",
    content: "서버 로그를 바로 가져왔어요. 샘플을 확인해볼까요?",
    attachments: [
      {
        id: "ev-001",
        title: "03:00 AM Server Access Log",
        type: "log",
      },
    ],
  },
  {
    id: "system-2",
    kind: "system",
    author: "system",
    name: "System",
    avatar: "ℹ️",
    timestamp: "03:04",
    content: "💡 새로운 증거가 `Files` 탭에 저장되었습니다.",
  },
];

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isAwaitingKastor, setIsAwaitingKastor] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollAreaRef.current;
    if (!node) return;

    node.scrollTo({
      top: node.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const isSendDisabled = isAwaitingKastor || input.trim().length === 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendDisabled) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const playerMessage: ChatMessage = {
      id: `player-${Date.now()}`,
      kind: "text",
      author: "player",
      name: "Player",
      avatar: "🕵️‍♂️",
      timestamp,
      content: input.trim(),
    };

    setMessages((prev) => [...prev, playerMessage]);
    setInput("");
    setIsAwaitingKastor(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `kastor-auto-${Date.now()}`,
          kind: "text",
          author: "kastor",
          name: "Kastor",
          avatar: "🦊",
          timestamp,
          content:
            "좋은 관찰이에요! 데이터를 필터링해서 02:00-04:00 로그만 추려볼까요?",
        },
      ]);
      setIsAwaitingKastor(false);
    }, 1800);
  };

  const typingIndicator = useMemo(
    () =>
      isAwaitingKastor && (
        <MessageItem
          key="typing-indicator"
          $author="kastor"
          variants={messageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          <Avatar $author="kastor">🦊</Avatar>
          <Bubble $author="kastor">
            <TypingDots>
              <span />
              <span />
              <span />
            </TypingDots>
          </Bubble>
        </MessageItem>
      ),
    [isAwaitingKastor],
  );

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>Incident Response Channel</Title>
          <Status>
            <Clock size={16} />
            03:05 AM • Active Investigation
          </Status>
        </div>
        <Status>
          <Lock size={16} />
          Secured by Kastor Shield
        </Status>
      </Header>

      <ChatShell>
        <MessageScrollArea ref={scrollAreaRef}>
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              if (message.kind === "system") {
                return (
                  <MessageItem
                    key={message.id}
                    $author="system"
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                  >
                    <SystemMessage>{message.content}</SystemMessage>
                  </MessageItem>
                );
              }

              return (
                <MessageItem
                  key={message.id}
                  $author={message.author}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  <Avatar $author={message.author}>{message.avatar}</Avatar>
                  <Bubble $author={message.author}>
                    <BubbleHeader $author={message.author}>
                      <strong>{message.name}</strong>
                      <span>{message.timestamp}</span>
                    </BubbleHeader>
                    {message.content && (
                      <BubbleBody>{message.content}</BubbleBody>
                    )}
                    {message.attachments && (
                      <AttachmentsList>
                        {message.attachments.map((attachment) => (
                          <EvidenceCard key={attachment.id} type="button">
                            <EvidenceIcon>
                              {evidenceIconMap[attachment.type]}
                            </EvidenceIcon>
                            <EvidenceMeta>
                              <EvidenceTitle>
                                {attachment.title}
                              </EvidenceTitle>
                              <EvidenceType>{attachment.type}</EvidenceType>
                            </EvidenceMeta>
                          </EvidenceCard>
                        ))}
                      </AttachmentsList>
                    )}
                  </Bubble>
                </MessageItem>
              );
            })}
          </AnimatePresence>
          {typingIndicator}
        </MessageScrollArea>

        <InputBar onSubmit={handleSubmit}>
          <IconButton type="button" aria-label="첨부 파일 추가" disabled>
            <Paperclip size={20} />
          </IconButton>

          <InputField
            placeholder="메시지를 입력하세요…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isAwaitingKastor}
          />

          <IconButton
            type="submit"
            aria-label="메시지 전송"
            $variant="primary"
            disabled={isSendDisabled}
          >
            <Send size={20} />
          </IconButton>
        </InputBar>
      </ChatShell>

      <FooterHint>Ctrl + Enter로 빠르게 전송 • 증거 첨부는 곧 지원됩니다</FooterHint>
    </Wrapper>
  );
}

export default ChatView;
