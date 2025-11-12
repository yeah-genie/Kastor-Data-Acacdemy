import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, Send, Lock, Clock } from "lucide-react";
import { ChoiceButton, type EnhancedChoice } from "./ChoiceButton";
import { EvidenceModal, type EvidenceModalItem } from "../files/EvidenceModal";
import { useTabContext } from "@/contexts/TabContext";

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

const EvidenceAction = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.04em;
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

const ChoiceSection = styled(motion.div)`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem 0;
`;

const ChoiceLead = styled.span`
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.lightGray};
  opacity: 0.8;
`;

const ChoiceGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const FeedbackBanner = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.lightGray};
  opacity: 0.8;
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

const evidenceLibrary: Record<string, EvidenceModalItem> = {
  "ev-001": {
    id: "ev-001",
    title: "03:00 AM Server Access Log",
    type: "log",
    tag: "CRITICAL",
      detail: {
        kind: "log",
        summary: "Anomalous high-volume transfers were detected on the DMZ server at 03:00 AM.",
        body: [
          "- 03:02:12 | svc_boundary | 192.168.10.37 -> 52.18.74.4 | 18.4 MB/s",
          "- 03:02:36 | svc_boundary | 192.168.10.37 -> 52.18.74.4 | 22.1 MB/s",
          "- 03:02:48 | svc_boundary | 192.168.10.37 -> 178.34.22.9 | 432 MB/s",
          "- 03:02:51 | svc_boundary | 192.168.10.37 -> 178.34.22.9 | 487 MB/s",
          "- 03:03:02 | svc_boundary | 192.168.10.37 -> 178.34.22.9 | 512 MB/s",
          "- 03:03:14 | svc_boundary | 192.168.10.37 -> 178.34.22.9 | 525 MB/s",
        ],
        highlights: ["03:02:48 | svc_boundary | 192.168.10.37 -> 178.34.22.9 | 432 MB/s"],
      },
    metadata: [
      { label: "Source", value: "Edge Firewall Sensor" },
      { label: "Severity", value: "High" },
    ],
    relatedCharacters: ["Maya Zhang"],
  },
  "ev-002": {
    id: "ev-002",
    title: "Incident Briefing Notes",
    type: "document",
    detail: {
      kind: "document",
        summary: "Key takeaways captured during the initial incident response huddle.",
      body: [
          "- 03:01 AM: Automated IDS issued abnormal transfer alert",
          "- 03:02 AM: Kastor estimated 1.2 TB of data exfiltration",
          "- Unidentified account `svc_boundary` performed high-volume download in DMZ server",
          "- Next steps: filter logs, review CCTV, audit door access records",
      ],
    },
    metadata: [
      { label: "Prepared By", value: "Marcus Chen" },
      { label: "Created", value: "03:04 AM" },
    ],
    relatedCharacters: ["Marcus Chen", "Camille Beaumont"],
  },
  "ev-003": {
    id: "ev-003",
    title: "SOC Alert Email",
    type: "email",
    detail: {
      kind: "email",
      headers: {
        from: "SOC Automation <soc@legendarena.com>",
        to: ["incident-response@legendarena.com"],
        cc: ["kastor@legendarena.com", "camille.beaumont@legendarena.com"],
        subject: "[URGENT] Data Exfiltration Detected - Ticket #5741",
        timestamp: "03:03 AM (UTC+9)",
      },
        body: [
          "Team,",
          "The FW-DMZ-02 sensor detected a massive data upload at 03:02 AM.",
          "Initial analysis points to an anonymized overseas VPS. Estimated volume: ~1.2 TB.",
          "Immediately block the transfer and capture related logs plus user activity.",
          "- SOC Automation",
        ],
    },
    relatedCharacters: ["Camille Beaumont"],
  },
  "ev-004": {
    id: "ev-004",
    title: "Server Room Snapshot",
    type: "image",
    detail: {
      kind: "image",
      src: "/office-scene.jpg",
        caption: "CCTV still captured right after the 03:00 AM shift change in the server room.",
      metadata: [
        { label: "Camera", value: "CCTV-SV-03" },
          { label: "Exposure", value: "1/60s | ISO 400" },
        { label: "Detected", value: "Human silhouette near rack #5" },
      ],
    },
    metadata: [{ label: "Captured", value: "03:00:42 AM" }],
  },
  "ev-005": {
    id: "ev-005",
    title: "Outbound Transfer Summary",
    type: "document",
    detail: {
      kind: "data",
      headers: ["Timestamp", "User", "Destination", "Volume", "Flag"],
      rows: [
        ["02:58:16", "svc_boundary", "52.18.74.4", "38 GB", "Baseline"],
        ["03:02:12", "svc_boundary", "178.34.22.9", "480 GB", "Anomaly"],
        ["03:02:36", "svc_boundary", "178.34.22.9", "512 GB", "Anomaly"],
        ["03:03:02", "svc_boundary", "178.34.22.9", "540 GB", "Critical"],
      ],
      insights: [
          "The same user attempted high-volume transfers three times within 120 seconds.",
          "Destination `178.34.22.9` shows no activity over the last 30 days.",
      ],
        footnote: "Kastor HyperLog assigns a risk score of 9.4 out of 10.",
    },
    metadata: [
      { label: "Generated", value: "Kastor HyperLog" },
      { label: "Confidence", value: "92%" },
    ],
  },
};

const formatTimestamp = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface ChoiceResponsePayload {
  author?: Author;
  name?: string;
  avatar?: string;
  content: string;
  kind?: MessageKind;
}

interface ScriptedChoice extends EnhancedChoice {
  response?: ChoiceResponsePayload;
  followUpChoices?: ScriptedChoice[];
  unlocksEvidence?: string;
}

const scriptedChoices: ScriptedChoice[] = [
  {
    id: "choice-check-logs",
    text: "Start with the system logs",
    icon: "🗂️",
    variant: "standard",
    response: {
      author: "kastor",
      content: "Great call! I'll open the log viewer and flag any suspicious access immediately.",
    },
    unlocksEvidence: "ev-001",
    followUpChoices: [
      {
        id: "choice-deep-scan",
        text: "Run a deep scan",
        icon: "🛰️",
        variant: "consequence",
        consequence: {
          relationshipChange: {
            maya: 1,
          },
        },
        response: {
          author: "maya",
          name: "Maya Zhang",
          avatar: "🛰️",
            content: "Smart move! I'll share the suspicious IP ranges right away.",
        },
      },
      {
        id: "choice-present-evidence",
          text: "Present the log evidence",
        icon: "📑",
        variant: "requires-evidence",
        requiredEvidence: ["ev-001"],
        response: {
          author: "marcus",
          name: "Marcus Chen",
          avatar: "🖥️",
            content: "I'll update the firewall rules based on that evidence.",
        },
      },
    ],
  },
  {
    id: "choice-brief-team",
      text: "Request a team briefing",
    icon: "👥",
    variant: "consequence",
    consequence: {
      relationshipChange: {
        marcus: 1,
      },
    },
    response: {
      author: "marcus",
      name: "Marcus Chen",
      avatar: "🖥️",
        content: "Understood. I'll compile the network forensics data and share it.",
    },
  },
  {
    id: "choice-hold",
      text: "Hold and observe briefly",
    icon: "⏳",
    variant: "timed",
    timerSeconds: 12,
    response: {
      author: "kastor",
        content: "Got it. Monitoring for new anomalies over the next ten seconds.",
    },
  },
  {
    id: "choice-evidence-locked",
      text: "Submit the server access log",
    icon: "🔒",
    variant: "requires-evidence",
    requiredEvidence: ["ev-001"],
    response: {
      author: "camille",
      name: "Camille Beaumont",
      avatar: "🛡️",
        content: "Alert level raised based on the log. Let's keep collecting supporting evidence!",
    },
  },
];

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
        "Team, we just caught a data breach in progress! 1.2 TB blasted out of the network, 312% above baseline flow. Data is not supposed to laugh at us... right?",
  },
  {
    id: "maya-1",
    kind: "text",
    author: "maya",
    name: "Maya Zhang",
    avatar: "🛰️",
    timestamp: "03:02",
    content:
        "Checking the server room CCTV now. Share the list of who was on the overnight shift.",
  },
  {
    id: "player-1",
    kind: "text",
    author: "player",
    name: "Player",
    avatar: "🕵️‍♂️",
    timestamp: "03:03",
    content:
        "Let's inspect the logs first. Which system initiated the transfer?",
  },
  {
    id: "kastor-2",
    kind: "evidence",
    author: "kastor",
    name: "Kastor",
    avatar: "🦊",
    timestamp: "03:03",
      content: "Pulled the server logs right away. Want to review a sample?",
    attachments: [
      {
        id: "ev-001",
        title: "03:00 AM Server Access Log",
        type: "log",
      },
    ],
  },
  {
    id: "kastor-3",
    kind: "evidence",
    author: "kastor",
    name: "Kastor",
    avatar: "🦊",
    timestamp: "03:04",
      content: "Adding briefing notes, the alert email, a CCTV snapshot, and a summary dataset!",
    attachments: [
      {
        id: "ev-002",
        title: "Incident Briefing Notes",
        type: "document",
      },
      {
        id: "ev-003",
        title: "SOC Alert Email",
        type: "email",
      },
      {
        id: "ev-004",
        title: "Server Room Snapshot",
        type: "image",
      },
      {
        id: "ev-005",
        title: "Outbound Transfer Summary",
        type: "document",
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
      content: "💡 New evidence has been stored under the `Files` tab.",
  },
];

export function ChatView() {
  const { addNotification } = useTabContext();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isAwaitingKastor, setIsAwaitingKastor] = useState(false);
  const [collectedEvidenceIds, setCollectedEvidenceIds] = useState<string[]>([]);
  const [relationshipScores, setRelationshipScores] = useState<Record<string, number>>({
    maya: 3,
    marcus: 3,
    camille: 2,
    kastor: 5,
  });
  const [activeChoices, setActiveChoices] = useState<ScriptedChoice[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [expiredChoiceIds, setExpiredChoiceIds] = useState<string[]>([]);
  const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [modalEvidenceIds, setModalEvidenceIds] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollAreaRef.current;
    if (!node) return;

    node.scrollTo({
      top: node.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const timer = window.setTimeout(() => setActiveChoices(scriptedChoices), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!choiceFeedback) return;
    const timer = window.setTimeout(() => setChoiceFeedback(null), 3200);
    return () => window.clearTimeout(timer);
  }, [choiceFeedback]);

  useEffect(() => {
    setExpiredChoiceIds([]);
  }, [activeChoices]);

  useEffect(() => {
    const initialEvidenceIds = initialMessages.flatMap((message) =>
      message.attachments?.map((attachment) => attachment.id) ?? [],
    );
    if (initialEvidenceIds.length === 0) return;
    setCollectedEvidenceIds((prev) => {
      const next = [...prev];
      let hasNew = false;
      initialEvidenceIds.forEach((id) => {
        if (!next.includes(id)) {
          next.push(id);
          hasNew = true;
          addNotification("files");
        }
      });
      return hasNew ? next : prev;
    });
  }, [addNotification]);

  const modalEvidenceItems = useMemo(
    () =>
      modalEvidenceIds
        .map((id) => evidenceLibrary[id])
        .filter((item): item is EvidenceModalItem => Boolean(item)),
    [modalEvidenceIds],
  );

  useEffect(() => {
    if (!isEvidenceModalOpen) return;
    if (modalEvidenceItems.length === 0) {
      setIsEvidenceModalOpen(false);
      return;
    }
    if (modalIndex >= modalEvidenceItems.length) {
      setModalIndex(0);
    }
  }, [isEvidenceModalOpen, modalEvidenceItems, modalIndex]);

  const isSendDisabled = isAwaitingKastor || input.trim().length === 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendDisabled) return;
    const timestamp = formatTimestamp();

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
          timestamp: formatTimestamp(),
          content:
              "Sharp catch! How about we filter the dataset to logs between 02:00 and 04:00?",
        },
      ]);
      setIsAwaitingKastor(false);
    }, 1800);
  };

  const handleAddEvidence = (id: string, announcement?: string) => {
    setCollectedEvidenceIds((prev) => {
      if (prev.includes(id)) return prev;
      if (announcement) {
        setChoiceFeedback(announcement);
      }
      addNotification("files");
      return [...prev, id];
    });
  };

  const handleEvidenceCardClick = (attachments: EvidenceAttachment[], attachmentIndex: number) => {
    const target = attachments[attachmentIndex];
    if (!target) return;
    handleAddEvidence(target.id, `📁 Evidence secured: '${target.title}'.`);
    const ids = attachments
      .map((item) => item.id)
      .filter((id, index, array) => array.indexOf(id) === index && Boolean(evidenceLibrary[id]));
    if (ids.length === 0) {
      setChoiceFeedback("🗂️ Detailed view not available yet for this evidence.");
      return;
    }
    const initialIndex = Math.max(0, ids.indexOf(target.id));
    setModalEvidenceIds(ids);
    setModalIndex(initialIndex);
    setIsEvidenceModalOpen(true);
  };

  const handleModalNavigate = (nextIndex: number) => {
    const total = modalEvidenceItems.length;
    if (total === 0) return;
    const normalized = (nextIndex % total + total) % total;
    setModalIndex(normalized);
  };

  const handleChoiceSelect = (rawChoice: EnhancedChoice) => {
    const choice = rawChoice as ScriptedChoice;
    if (selectedChoiceId) return;

    const requiresEvidenceMissing =
      choice.variant === "requires-evidence" &&
      choice.requiredEvidence?.some((id) => !collectedEvidenceIds.includes(id));

    if (requiresEvidenceMissing) {
    setChoiceFeedback("🔒 Collect the required evidence before using this choice.");
      return;
    }

    if (expiredChoiceIds.includes(choice.id)) {
    setChoiceFeedback("⏱️ This choice expired and is no longer available.");
      return;
    }

    setChoiceFeedback(null);
    setSelectedChoiceId(choice.id);

    const timestamp = formatTimestamp();
    setMessages((prev) => [
      ...prev,
      {
        id: `player-choice-${choice.id}`,
        kind: "text",
        author: "player",
        name: "Player",
        avatar: "🕵️‍♂️",
        timestamp,
        content: choice.text,
      },
    ]);

    if (choice.consequence?.relationshipChange) {
      setRelationshipScores((prev) => {
        const next = { ...prev };
        Object.entries(choice.consequence!.relationshipChange!).forEach(([characterId, delta]) => {
          next[characterId] = (next[characterId] ?? 0) + delta;
        });
        return next;
      });
    }

    const responseDelay = choice.variant === "timed" ? 700 : 850;

      window.setTimeout(() => {
        setSelectedChoiceId(null);
        setMessages((prev) => {
          const nextMessages = [...prev];
          if (choice.response) {
            nextMessages.push({
              id: `choice-response-${choice.id}`,
              kind: choice.response.kind ?? "text",
              author: choice.response.author ?? "kastor",
              name: choice.response.name ?? "Kastor",
              avatar: choice.response.avatar ?? "🦊",
              timestamp: formatTimestamp(),
              content: choice.response.content,
            });
          }
          if (choice.unlocksEvidence) {
            nextMessages.push({
              id: `system-evidence-${choice.id}`,
              kind: "system",
              author: "system",
              name: "System",
              avatar: "ℹ️",
              timestamp: formatTimestamp(),
                content: "New evidence has been secured.",
            });
          }
          return nextMessages;
        });

        if (choice.unlocksEvidence) {
        handleAddEvidence(choice.unlocksEvidence, "✅ New evidence secured.");
        }

        setActiveChoices(choice.followUpChoices ?? []);
        setExpiredChoiceIds([]);
      }, responseDelay);
  };

  const handleChoiceTimeout = (rawChoice: EnhancedChoice) => {
    const choice = rawChoice as ScriptedChoice;
    if (expiredChoiceIds.includes(choice.id) || selectedChoiceId) return;

    setExpiredChoiceIds((prev) => [...prev, choice.id]);
    const timestamp = formatTimestamp();
    setMessages((prev) => [
      ...prev,
      {
        id: `timeout-${choice.id}`,
        kind: "system",
        author: "system",
        name: "System",
        avatar: "⏱️",
        timestamp,
          content: `Choice "${choice.text}" expired.`,
      },
    ]);
      setChoiceFeedback(`⏱️ Choice "${choice.text}" has expired.`);
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
    <>
      <Wrapper>
        <Header>
          <div>
            <Title>Incident Response Channel</Title>
            <Status>
              <Clock size={16} />
                03:05 AM - Active investigation
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
                      {message.content && <BubbleBody>{message.content}</BubbleBody>}
                      {message.attachments && (
                        <AttachmentsList>
                          {message.attachments.map((attachment, index, array) => (
                            <EvidenceCard
                              key={attachment.id}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEvidenceCardClick(array, index);
                              }}
                            >
                              <EvidenceIcon>{evidenceIconMap[attachment.type]}</EvidenceIcon>
                              <EvidenceMeta>
                                <EvidenceTitle>{attachment.title}</EvidenceTitle>
                                <EvidenceType>{attachment.type}</EvidenceType>
                              </EvidenceMeta>
                                <EvidenceAction>View</EvidenceAction>
                            </EvidenceCard>
                          ))}
                        </AttachmentsList>
                      )}
                    </Bubble>
                  </MessageItem>
                );
              })}
            </AnimatePresence>
            <AnimatePresence>
              {activeChoices.length > 0 && (
                <ChoiceSection
                  key="active-choices"
                  onClick={(event) => event.stopPropagation()}
                  initial={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -12 }}
                  layout
                >
                    <ChoiceLead>Choose your next move</ChoiceLead>
                  <ChoiceGrid>
                    {activeChoices.map((choice) => {
                      const evidenceMissing =
                        choice.variant === "requires-evidence" &&
                        choice.requiredEvidence?.some((id) => !collectedEvidenceIds.includes(id));
                      const isExpired = expiredChoiceIds.includes(choice.id);
                      const isSelected = selectedChoiceId === choice.id;
                      const disabled =
                        evidenceMissing ||
                        isExpired ||
                        (selectedChoiceId !== null && selectedChoiceId !== choice.id);
                        const disabledReason = evidenceMissing
                          ? "You need to collect the required evidence."
                          : isExpired
                          ? "This choice has timed out."
                          : null;
                      return (
                        <ChoiceButton
                          key={choice.id}
                          choice={choice}
                          disabled={disabled || (isSelected && selectedChoiceId !== null)}
                          disabledReason={disabledReason}
                          isSelected={isSelected}
                          isExpired={isExpired}
                          onSelect={handleChoiceSelect}
                          onExpire={handleChoiceTimeout}
                          relationshipMap={relationshipScores}
                        />
                      );
                    })}
                  </ChoiceGrid>
                  {choiceFeedback && <FeedbackBanner>{choiceFeedback}</FeedbackBanner>}
                </ChoiceSection>
              )}
            </AnimatePresence>
            {typingIndicator}
          </MessageScrollArea>

          <InputBar onSubmit={handleSubmit}>
              <IconButton type="button" aria-label="Add attachment" disabled>
              <Paperclip size={20} />
            </IconButton>

            <InputField
                placeholder="Type your message..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isAwaitingKastor}
            />

              <IconButton type="submit" aria-label="Send message" $variant="primary" disabled={isSendDisabled}>
              <Send size={20} />
            </IconButton>
          </InputBar>
        </ChatShell>

        <FooterHint>Ctrl + Enter to send quickly - Click an evidence card to open the detailed view.</FooterHint>
      </Wrapper>
      <EvidenceModal
        isOpen={isEvidenceModalOpen && modalEvidenceItems.length > 0}
        evidenceItems={modalEvidenceItems}
        activeIndex={
          modalEvidenceItems.length === 0
            ? 0
            : Math.min(modalIndex, Math.max(modalEvidenceItems.length - 1, 0))
        }
        onClose={() => {
          setIsEvidenceModalOpen(false);
          setModalEvidenceIds([]);
          setModalIndex(0);
        }}
        onNavigate={handleModalNavigate}
      />
    </>
  );
}

export default ChatView;
