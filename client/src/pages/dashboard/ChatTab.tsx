import { useMemo, useState } from "react";
import ChatView, { ParticipantProfile } from "@/components/chat/ChatView";
import type { Message, Evidence, Choice } from "@/types";
import type { ChoiceMetadata } from "@/components/chat/ChoiceButton";
import { useGameStore } from "@/store/gameStore";

type RichChoice = Choice & { metadata?: ChoiceMetadata };

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;

const initialEvidence: Evidence[] = [
  {
    id: "evidence-server-log",
    type: "log",
    title: "Server Access Log · 02:00-04:00",
    content: `03:14:22  user:isabella.torres  action:DOWNLOAD  source:secure-vault-03
03:18:09  user:isabella.torres  action:DOWNLOAD  source:secure-vault-03
03:19:55  user:isabella.torres  action:DELETE    source:secure-vault-03`,
    dateCollected: new Date().toISOString(),
    relatedTo: ["isabella-torres"],
    importance: "critical",
    isNew: true,
  },
  {
    id: "evidence-encrypted-drive",
    type: "document",
    title: "Encrypted Drive Manifest",
    content: `Device ID: LA-VALKYRIE-07
Checksum: 77b1e4b5a2d9
Notes: Drive removed from server room at 03:22.`,
    dateCollected: new Date().toISOString(),
    relatedTo: ["isabella-torres", "alex-reeves"],
    importance: "high",
    isNew: true,
  },
];

const initialMessages: Message[] = [
  {
    id: "msg-1",
    sender: "system",
    content: "🛰️ Incident Channel synced · Episode 4 · The Data Breach",
    timestamp: new Date().toISOString(),
    type: "system",
  },
  {
    id: "msg-2",
    sender: "kastor",
    content:
      "Good morning, Agent! According to my calculations... well, after 600 milliseconds of panic... we have a massive data leak. 1.2 terabytes gone. That's, like, 300,000 cat videos worth of data! 🐱",
    timestamp: new Date().toISOString(),
    type: "text",
  },
  {
    id: "msg-3",
    sender: "camille-beaumont",
    content:
      "Focus, Kastor. The breach path points to the analytics vault. We need to figure out which insider account orchestrated the download.",
    timestamp: new Date().toISOString(),
    type: "text",
  },
  {
    id: "msg-4",
    sender: "kastor",
    content:
      "Right! Right... Data first, panic later. I'm sharing the suspicious log bursts we spotted. They glow in the dark. Okay, not literally.",
    timestamp: new Date().toISOString(),
    type: "evidence",
    attachments: [initialEvidence[0]],
  },
  {
    id: "msg-5",
    sender: "kastor",
    content: "And here's the manifest of the encrypted drive that vanished. It's like a heist movie, but with spreadsheets.",
    timestamp: new Date().toISOString(),
    type: "evidence",
    attachments: [initialEvidence[1]],
  },
];

const initialChoices: RichChoice[] = [
  {
    id: "choice-investigate-logs",
    text: "Review Isabella's recent activity logs.",
    nextScene: "ep4-log-dive",
    consequence: {
      relationshipChange: {
        "camille-beaumont": 1,
      },
      evidenceUnlock: ["evidence-server-log"],
    },
    metadata: {
      type: "consequence",
      consequence: {
        outcome: "positive",
        description: "Earn Camille's trust. Unlock deeper log filters.",
      },
    },
  },
  {
    id: "choice-question-staff",
    text: "Convene an emergency interview with night-shift staff.",
    nextScene: "ep4-staff-briefing",
    consequence: {
      sceneUnlock: ["ep4-interview-branch"],
    },
    metadata: {
      type: "timed",
      timed: {
        durationSeconds: 25,
      },
      consequence: {
        outcome: "neutral",
        description: "Shift focus to interviews. Potentially miss log anomalies.",
      },
    },
  },
];

export const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [choices, setChoices] = useState<RichChoice[]>(initialChoices);
  const [typingIndicator, setTypingIndicator] = useState<{ senderId: string } | undefined>();
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const addEvidenceToStore = useGameStore((state) => state.addEvidence);
  const recordChoice = useGameStore((state) => state.makeChoice);

  const participants = useMemo<Record<string, ParticipantProfile>>(
    () => ({
      player: {
        id: "player",
        name: "You",
        accentColor: "#2196F3",
      },
      kastor: {
        id: "kastor",
        name: "Kastor",
        role: "AI Investigator",
        accentColor: "#00D1FF",
      },
      "camille-beaumont": {
        id: "camille-beaumont",
        name: "Camille Beaumont",
        role: "Security Chief",
        accentColor: "#FF9800",
      },
    }),
    [],
  );

  const pushMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const simulateKastorReply = (content: string, extraMessages: Message[] = []) => {
    setTypingIndicator({ senderId: "kastor" });
    setTimeout(() => {
      pushMessage({
        id: generateId("msg"),
        sender: "kastor",
        content,
        timestamp: new Date().toISOString(),
        type: "text",
      });
        extraMessages.forEach((message) => {
          pushMessage(message);
          (message.attachments ?? []).forEach((attachment) => addEvidenceToStore(attachment));
        });
      setTypingIndicator(undefined);
      setIsWaitingResponse(false);
    }, 1500);
  };

  const handleSendMessage = async (content: string) => {
    const playerMessage: Message = {
      id: generateId("msg"),
      sender: "player",
      content,
      timestamp: new Date().toISOString(),
      type: "text",
    };
    pushMessage(playerMessage);
    setIsWaitingResponse(true);

    simulateKastorReply(
      "Got it! Logging your insight… I’ll cross-match it with anomaly signatures. Give me a second!",
    );
  };

  const handleChoiceSelect = async (choice: RichChoice) => {
    const playerChoiceMessage: Message = {
      id: generateId("msg"),
      sender: "player",
      content: `▶ ${choice.text}`,
      timestamp: new Date().toISOString(),
      type: "choice",
    };
    pushMessage(playerChoiceMessage);
    setChoices([]);
    setIsWaitingResponse(true);

    recordChoice(choice);

    simulateKastorReply(
      choice.id === "choice-investigate-logs"
        ? "Excellent! I’ve highlighted Isabella’s activity bursts. Notice how the deletions follow the downloads? That’s not subtle. 🕵️‍♂️"
        : "Interview mode engaged! I’ll notify HR, but keep your questions sharp—night shift fatigue is real, but so is sabotage.",
      choice.consequence?.evidenceUnlock?.length
        ? [
            {
              id: generateId("msg"),
              sender: "system",
              content: "🔓 New evidence added to your Files view.",
              timestamp: new Date().toISOString(),
              type: "system",
              attachments: initialEvidence.filter((item) =>
                choice.consequence?.evidenceUnlock?.includes(item.id),
              ),
            },
          ]
        : [],
    );
  };

  return (
    <ChatView
      messages={messages}
      participants={participants}
      onSendMessage={handleSendMessage}
      isWaitingResponse={isWaitingResponse}
      typingIndicator={typingIndicator}
      choices={choices}
      onChoiceSelect={handleChoiceSelect}
      attachmentsEnabled
      onAttachmentRequest={() => {
        pushMessage({
          id: generateId("msg"),
          sender: "system",
          content: "📁 Evidence attachment coming soon.",
          timestamp: new Date().toISOString(),
          type: "system",
        });
      }}
    />
  );
};

export default ChatTab;
