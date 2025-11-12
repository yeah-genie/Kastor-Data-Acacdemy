import type { Episode, Scene, Message, Evidence } from "@/types";

const sharedEvidence: Record<string, Evidence> = {
  "server-log": {
    id: "server-log",
    type: "log",
    title: "Security Operations Center Log",
    content:
      "03:00:47 - Unusual outbound transfer detected\n03:00:48 - Alert escalated to on-call analyst\n03:00:55 - Connection tunnel established from remote workstation",
    dateCollected: "2024-08-21T03:05:00Z",
    relatedTo: ["camille-beaumont"],
    importance: "critical",
    isNew: true,
  },
  "vpn-session": {
    id: "vpn-session",
    type: "document",
    title: "VPN Session Summary",
    content:
      "Session ID: 4e7f-29ab\nUser: isabella.torres\nDuration: 00:11:48\nBytes sent: 1.2 TB",
    dateCollected: "2024-08-21T03:06:00Z",
    relatedTo: ["isabella-torres"],
    importance: "high",
    isNew: true,
  },
};

const openingMessages: Message[] = [
  {
    id: "op-1",
    sender: "system",
    content: "Legend Arena HQ · Security Operations Center · 03:00 AM",
    timestamp: "03:00",
    type: "system",
  },
  {
    id: "op-2",
    sender: "camille-beaumont",
    content: "Another quiet night... maybe I can actually finish that podcast episode.",
    timestamp: "03:00",
    type: "text",
  },
  {
    id: "op-3",
    sender: "system",
    content: "🚨 WARNING · Large outbound transfer detected",
    timestamp: "03:00",
    type: "system",
  },
  {
    id: "op-4",
    sender: "camille-beaumont",
    content: "Hold on—that's not scheduled. Kastor, are you seeing this?",
    timestamp: "03:00",
    type: "text",
  },
  {
    id: "op-5",
    sender: "kastor",
    content: "Woah! Data's flying out faster than my daily caffeine intake! Investigators, we need eyes on this pronto!",
    timestamp: "03:00",
    type: "text",
  },
];

const emergencyMessages: Message[] = [
  {
    id: "em-1",
    sender: "maya-zhang",
    content: "Team, status report. Camille?",
    timestamp: "03:02",
    type: "text",
  },
  {
    id: "em-2",
    sender: "camille-beaumont",
    content: "Unscheduled transfer. Source traced to Engineering. 1.2TB moving through a VPN tunnel.",
    timestamp: "03:02",
    type: "text",
    attachments: [sharedEvidence["server-log"]],
  },
  {
    id: "em-3",
    sender: "kastor",
    content: "1.2TB?! That's like... 280,000 cat GIFs. Or, you know, a catastrophic data breach.",
    timestamp: "03:03",
    type: "text",
  },
  {
    id: "em-4",
    sender: "maya-zhang",
    content: "Isabella, you’re on network duty tonight. Confirm?",
    timestamp: "03:03",
    type: "text",
  },
  {
    id: "em-5",
    sender: "isabella-torres",
    content: "Checking now. The tunnel keys look… familiar. Give me 60 seconds.",
    timestamp: "03:03",
    type: "text",
  },
  {
    id: "em-6",
    sender: "system",
    content: "💡 Kastor shared new evidence: VPN Session Summary",
    timestamp: "03:04",
    type: "system",
    attachments: [sharedEvidence["vpn-session"]],
  },
];

const emergencyChoices = [
  {
    id: "choice-check-logs",
    text: "Pull the security logs now",
    nextScene: "log-analysis",
    consequence: { evidenceUnlock: ["server-log"] },
  },
  {
    id: "choice-lockdown",
    text: "Initiate containment procedures",
    nextScene: "containment-briefing",
    consequence: { relationshipChange: { "maya-zhang": 1 } },
  },
];

const logMessages: Message[] = [
  {
    id: "log-1",
    sender: "isabella-torres",
    content: "Found the session. Credentials used: admin-core-01. That’s not standard.",
    timestamp: "03:05",
    type: "evidence",
    attachments: [sharedEvidence["vpn-session"]],
  },
  {
    id: "log-2",
    sender: "kastor",
    content: "Investigators, we need patterns. Who's triggering what, and when.",
    timestamp: "03:05",
    type: "choice",
  },
];

const logScene: Scene = {
  id: "log-analysis",
  type: "data",
  title: "Log Analysis",
  messages: logMessages,
  dataContent: {
    type: "log-table",
    data: [
      {
        time: "02:57",
        user: "admin-core-01",
        action: "Authentication Success",
        location: "VPN Gateway",
      },
      {
        time: "02:58",
        user: "admin-core-01",
        action: "Privilege Escalation",
        location: "Data Lake",
      },
      {
        time: "03:00",
        user: "admin-core-01",
        action: "Bulk Export",
        location: "R&D Secure Storage",
      },
    ],
    puzzle: {
      type: "find-pattern",
      correctPattern: "Repeated elevated access from admin-core-01",
      hints: [
        "Filter the logs by high-privilege actions.",
        "Check which account triggered the export.",
        "Correlate timestamps around 03:00.",
      ],
    },
  },
  nextScene: "pattern-detected",
};

const episode4Scenes: Scene[] = [
  {
    id: "opening",
    type: "chat",
    title: "03:00 AM · Security Breach",
    messages: openingMessages,
    nextScene: "emergency-briefing",
  },
  {
    id: "emergency-briefing",
    type: "chat",
    title: "Emergency Response",
    messages: emergencyMessages,
    requirements: {
      evidence: ["server-log"],
    },
    choices: emergencyChoices,
  },
  logScene,
  {
    id: "pattern-detected",
    type: "chat",
    title: "Pattern Confirmed",
    messages: [
      {
        id: "pd-1",
        sender: "kastor",
        content: "Pattern locked! Whoever used admin-core-01 knew exactly which vault to hit.",
        timestamp: "03:08",
        type: "text",
      },
      {
        id: "pd-2",
        sender: "maya-zhang",
        content: "Then we focus on whoever had those credentials. Investigators, prioritize suspects.",
        timestamp: "03:08",
        type: "text",
      },
    ],
    nextScene: "team-strategy",
  },
  {
    id: "team-strategy",
    type: "team",
    title: "Team Strategy",
    messages: [
      {
        id: "ts-1",
        sender: "kastor",
        content: "Time to sync with the team. Profiles updated in the Team tab—use them.",
        timestamp: "03:10",
        type: "system",
      },
    ],
  },
];

export const episode4: Episode = {
  id: "episode-4",
  number: 4,
  title: "The Data Breach",
  description: "1.2TB of company data has been stolen. Find the culprit.",
  difficulty: 5,
  estimatedTime: "60-75 minutes",
  scenes: episode4Scenes,
  characters: [
    "kastor",
    "maya-zhang",
    "camille-beaumont",
    "isabella-torres",
    "alex-reeves",
  ],
  evidence: Object.values(sharedEvidence),
  learningObjectives: [
    "Trace data exfiltration through security logs",
    "Collaborate with cross-functional teams during incidents",
    "Identify anomalies in privilege escalation patterns",
  ],
};

export const scenesById = episode4Scenes.reduce<Record<string, Scene>>((acc, scene) => {
  acc[scene.id] = scene;
  return acc;
}, {});
