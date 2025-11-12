import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  BookmarkPlus,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  Filter,
  Folder,
  ClipboardCopy,
  Highlighter,
  Image as ImageIcon,
  Info,
  LayoutGrid as LayoutGridIcon,
  LayoutList,
  Mail,
  MoreHorizontal,
  Search,
  Download as DownloadIcon,
  Printer,
  RefreshCw,
  RotateCcw,
  Share2,
  ShieldAlert,
  Sparkles,
  Star,
  StarOff,
  Table2,
  Video,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type EvidenceType = "document" | "log" | "email" | "image" | "video" | "data" | "encrypted";
type EvidenceImportance = "low" | "medium" | "high" | "critical";
type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG" | "CRITICAL";

interface EvidencePreviewBase {
  kind: "document" | "log" | "email" | "data" | "image" | "video" | "encrypted";
}

interface DocumentPreview extends EvidencePreviewBase {
  kind: "document";
  body: string[];
  language?: string;
  filenameHint?: string;
}

interface LogPreview extends EvidencePreviewBase {
  kind: "log";
  lines: string[];
  language?: string;
  highlight?: number[];
}

interface EmailAttachment {
  filename: string;
  size: string;
  type: string;
  suspicious?: boolean;
}

interface EmailPreview extends EvidencePreviewBase {
  kind: "email";
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string[];
  attachments?: EmailAttachment[];
  thread?: Array<{ sender: string; timestamp: string; summary: string }>;
  flaggedPhrases?: string[];
}

interface TablePreview extends EvidencePreviewBase {
  kind: "data";
  headers: string[];
  rows: string[][];
  insight?: string;
}

interface ImagePreview extends EvidencePreviewBase {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
  metadata?: {
    resolution?: string;
    capturedAt?: string;
    device?: string;
  };
}

interface VideoPreview extends EvidencePreviewBase {
  kind: "video";
  duration: string;
  url?: string;
  summary: string;
}

interface EncryptedPreview extends EvidencePreviewBase {
  kind: "encrypted";
  hint: string;
  requiredKey: string;
}

type EvidencePreview =
  | DocumentPreview
  | LogPreview
  | EmailPreview
  | TablePreview
  | ImagePreview
  | VideoPreview
  | EncryptedPreview;

interface EvidenceFile {
  id: string;
  title: string;
  filename: string;
  folderPath: string[];
  type: EvidenceType;
  importance: EvidenceImportance;
  isNew?: boolean;
  dateAdded: string;
  size: string;
  tags: string[];
  related: string[];
  summary: string;
  preview: EvidencePreview;
}

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const FOLDER_TREE: FolderNode = {
  id: "episode-4",
  name: "Episode 4: The Data Breach",
  children: [
    {
      id: "suspects",
      name: "Suspects",
      children: [
        { id: "suspects-key", name: "Key Profiles" },
        { id: "suspects-notes", name: "Interrogation Notes" },
      ],
    },
    {
      id: "digital-evidence",
      name: "Digital Evidence",
      children: [
        { id: "digital-logs", name: "System Logs" },
        { id: "digital-data", name: "Analytics & Data" },
        { id: "digital-media", name: "Media & Screenshots" },
      ],
    },
    {
      id: "communications",
      name: "Communications",
      children: [
        { id: "communications-briefings", name: "Briefings" },
        { id: "communications-email", name: "Email Threads" },
        { id: "communications-chat", name: "Chat Transcripts" },
      ],
    },
    {
      id: "timeline",
      name: "Timeline",
      children: [
        { id: "timeline-incidents", name: "Incident Timeline" },
        { id: "timeline-controls", name: "Containment Actions" },
      ],
    },
  ],
};

interface AnnotationBookmark {
  id: string;
  label: string;
  target: string;
}

interface AnnotationEntry {
  highlights: string[];
  bookmarks: AnnotationBookmark[];
}

type AnnotationState = Record<string, AnnotationEntry>;

const ANNOTATIONS_STORAGE_KEY = "kastor-files-annotations";
const NOTES_STORAGE_KEY = "kastor-files-notes";

const createDefaultAnnotation = (): AnnotationEntry => ({
  highlights: [],
  bookmarks: [],
});

const loadAnnotationsFromStorage = (): AnnotationState => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(ANNOTATIONS_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as AnnotationState;
    return parsed ?? {};
  } catch (error) {
    console.warn("Failed to parse annotations from storage", error);
    return {};
  }
};

const loadNotesFromStorage = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<string, string>;
    return parsed ?? {};
  } catch (error) {
    console.warn("Failed to parse notes from storage", error);
    return {};
  }
};

const createBookmarkId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const deriveLogLevel = (line: string): LogLevel => {
  const lower = line.toLowerCase();
  if (lower.includes("critical") || lower.includes("severe") || lower.includes("**")) {
    return "CRITICAL";
  }
  if (/\b(error|failed|denied|panic)\b/.test(lower)) {
    return "ERROR";
  }
  if (/\b(warn|anomaly|suspicious)\b/.test(lower)) {
    return "WARN";
  }
  if (/\b(debug|trace)\b/.test(lower)) {
    return "DEBUG";
  }
  return "INFO";
};

const EVIDENCE_FILES: EvidenceFile[] = [
  {
    id: "ev-001",
    title: "Server Access Log - DMZ Edge 02",
    filename: "03-00-am-dmz-log.txt",
    folderPath: ["episode-4", "digital-evidence", "digital-logs"],
    type: "log",
    importance: "critical",
    isNew: true,
    dateAdded: "2025-11-12 03:05",
    size: "184 KB",
    tags: ["network", "exfiltration", "svc_boundary"],
    related: ["ev-005", "ev-010"],
    summary: "Chronological log of outbound traffic bursts leading to the 1.2 TB breach.",
    preview: {
      kind: "log",
      lines: [
        "03:02:12  svc_boundary  192.168.10.37  ->  52.18.74.4   TRANSFER 18.4 MB/s",
        "03:02:36  svc_boundary  192.168.10.37  ->  52.18.74.4   TRANSFER 22.1 MB/s",
        "03:02:48  svc_boundary  192.168.10.37  ->  178.34.22.9  TRANSFER 432 MB/s  **",
        "03:02:51  svc_boundary  192.168.10.37  ->  178.34.22.9  TRANSFER 487 MB/s  **",
        "03:03:02  svc_boundary  192.168.10.37  ->  178.34.22.9  TRANSFER 512 MB/s  **",
        "03:03:14  svc_boundary  192.168.10.37  ->  178.34.22.9  TRANSFER 525 MB/s  **",
      ],
      highlight: [2, 3, 4, 5],
    },
  },
  {
    id: "ev-002",
    title: "Incident Briefing Notes",
    filename: "soc-briefing-notes.md",
    folderPath: ["episode-4", "communications", "communications-briefings"],
    type: "document",
    importance: "high",
    dateAdded: "2025-11-12 03:10",
    size: "92 KB",
    tags: ["summary", "action-items", "soc"],
    related: ["ev-001", "ev-007"],
    summary: "Concise recap from the emergency SOC huddle with immediate action items.",
    preview: {
      kind: "document",
      body: [
        "- IDS escalation triggered at 03:01 when outbound bandwidth spiked.",
        "- Kastor estimates 1.2 TB of data already streamed to an external VPS.",
        "- Unlisted service account `svc_boundary` leveraged DMZ Edge 02.",
        "- Next steps include CCTV review, badge access correlation, and isolating the host.",
      ],
    },
  },
  {
    id: "ev-003",
    title: "SOC Alert Email",
    filename: "alert-ticket-5741.eml",
    folderPath: ["episode-4", "communications", "communications-email"],
    type: "email",
    importance: "medium",
    isNew: true,
    dateAdded: "2025-11-12 03:12",
    size: "64 KB",
    tags: ["notification", "ticket", "automation"],
    related: ["ev-002"],
    summary: "Automated breach notification sent to the response distribution list.",
    preview: {
      kind: "email",
      from: "SOC Automation <soc@legendarena.com>",
      to: ["incident-response@legendarena.com"],
      cc: ["kastor@legendarena.com", "camille.beaumont@legendarena.com"],
      subject: "[URGENT] Data Exfiltration Detected - Ticket #5741",
      flaggedPhrases: ["1.2 tb", "immediate containment"],
      attachments: [
        { filename: "dmz-edge-02.log", size: "512 KB", type: "log", suspicious: true },
        { filename: "containment-playbook.pdf", size: "184 KB", type: "pdf" },
      ],
      thread: [
        { sender: "Camille Beaumont", timestamp: "03:12", summary: "Acknowledged. Warming war room." },
        { sender: "Kastor", timestamp: "03:13", summary: "Running badge access correlation now." },
      ],
      body: [
        "Team,",
        "FW-DMZ-02 flagged sustained uploads at 03:02 AM. Estimated volume currently 1.2 TB.",
        "Immediate containment requested: block transfer, secure logs, snapshot user activity.",
        "- SOC Automation",
      ],
    },
  },
  {
    id: "ev-004",
    title: "Server Room CCTV Snapshot",
    filename: "cctv-sv-03-0300.png",
    folderPath: ["episode-4", "digital-evidence", "digital-media"],
    type: "image",
    importance: "medium",
    dateAdded: "2025-11-12 03:02",
    size: "1.8 MB",
    tags: ["cctv", "night-shift", "physical"],
    related: ["ev-011"],
    summary: "Still frame captured seconds after the shift handover in the server room.",
    preview: {
      kind: "image",
      src: "/office-scene.jpg",
      alt: "Server room CCTV still",
      caption: "Unknown silhouette appears near rack #5 at 03:00:42 AM.",
      metadata: {
        resolution: "1920 x 1080",
        capturedAt: "2025-11-12 03:00:42",
        device: "CCTV Node SV-03",
      },
    },
  },
  {
    id: "ev-005",
    title: "Outbound Transfer Summary",
    filename: "outbound-transfer.csv",
    folderPath: ["episode-4", "digital-evidence", "digital-data"],
    type: "data",
    importance: "high",
    dateAdded: "2025-11-12 03:15",
    size: "46 KB",
    tags: ["analytics", "export", "csv"],
    related: ["ev-001"],
    summary: "Aggregated table highlighting the spike in outbound data movements.",
    preview: {
      kind: "data",
      headers: ["Timestamp", "User", "Destination", "Volume", "Flag"],
      rows: [
        ["02:58:16", "svc_boundary", "52.18.74.4", "38 GB", "Baseline"],
        ["03:02:12", "svc_boundary", "178.34.22.9", "480 GB", "Anomaly"],
        ["03:02:36", "svc_boundary", "178.34.22.9", "512 GB", "Anomaly"],
        ["03:03:02", "svc_boundary", "178.34.22.9", "540 GB", "Critical"],
      ],
      insight: "Same endpoint repeated within 120 seconds. Destination dormant for 30 days prior.",
    },
  },
  {
    id: "ev-006",
    title: "Isabella Torres Dossier",
    filename: "isabella-torres-profile.pdf",
    folderPath: ["episode-4", "suspects", "suspects-key"],
    type: "document",
    importance: "medium",
    dateAdded: "2025-11-11 22:18",
    size: "512 KB",
    tags: ["employee", "ml-team", "background"],
    related: ["ev-008"],
    summary: "Background file on Isabella including system access roles and recent activity notes.",
      preview: {
        kind: "document",
        body: [
          "- Principal ML engineer with privileged model deployment access.",
          "- Recently requested elevated permissions to the DMZ analytics node.",
          "- Logs show late-night accesses aligning with breach window.",
          "- Maintains close collaboration with service account owners.",
        ],
    },
  },
  {
    id: "ev-007",
    title: "Incident Timeline Board",
    filename: "incident-timeline.json",
    folderPath: ["episode-4", "timeline", "timeline-incidents"],
    type: "data",
    importance: "high",
    dateAdded: "2025-11-12 03:20",
    size: "28 KB",
    tags: ["timeline", "sequence", "analysis"],
    related: ["ev-002", "ev-010"],
    summary: "Minute-by-minute timeline tracing detection, containment, and escalation events.",
      preview: {
        kind: "document",
        body: [
        "03:00 — Shift handover completed; surveillance status nominal.",
        "03:02 — DMZ Edge anomaly detected; ticket #5741 generated.",
        "03:05 — Incident response channel activated; evidence sweep initiated.",
        "03:12 — Temporary containment rules deployed; forensic imaging scheduled.",
      ],
    },
  },
  {
    id: "ev-008",
    title: "Isabella Interview Transcript",
    filename: "interview-torres-raw.txt",
    folderPath: ["episode-4", "suspects", "suspects-notes"],
    type: "log",
    importance: "medium",
    dateAdded: "2025-11-12 04:05",
    size: "76 KB",
    tags: ["interview", "transcript", "suspect"],
    related: ["ev-006"],
    summary: "Transcript of the initial debrief with Isabella referencing late-night lab access.",
    preview: {
      kind: "log",
      lines: [
        "Q: Confirm your access to the DMZ research node at 02:45.",
        "A: I queued a model export—standard procedure before the tournament patch.",
        "Q: Why use svc_boundary credentials?",
        "A: Those are automated scripts. I did not run them manually.",
        "Q: Do you recognize 178.34.22.9?",
        "A: No. That IP does not belong to any of our partners.",
      ],
    },
  },
  {
    id: "ev-009",
    title: "Containment Walkthrough Recording",
    filename: "containment-briefing.mp4",
    folderPath: ["episode-4", "timeline", "timeline-controls"],
    type: "video",
    importance: "low",
    dateAdded: "2025-11-12 05:40",
    size: "148 MB",
    tags: ["training", "video", "containment"],
    related: [],
    summary: "Screen capture summarizing firewall changes and host isolation procedures.",
    preview: {
      kind: "video",
      duration: "06:42",
      summary: "Highlights rule updates for outbound traffic, forensic imaging protocol, and escalation chain.",
    },
  },
  {
    id: "ev-010",
    title: "Event Buffer Tamper Notice",
    filename: "event-buffer-alert.json",
    folderPath: ["episode-4", "digital-evidence", "digital-logs"],
    type: "log",
    importance: "critical",
    dateAdded: "2025-11-12 03:18",
    size: "24 KB",
    tags: ["tampering", "alerts", "buffer"],
    related: ["ev-001", "ev-007"],
    summary: "Alert generated when the external IP attempted to purge the security event buffer.",
    preview: {
      kind: "log",
      lines: [
        "03:09:51  event-buffer watchdog  action=DELETE_REQUEST  source=178.34.22.9  status=BLOCKED",
        "03:09:52  event-buffer watchdog  action=DELETE_REQUEST  source=178.34.22.9  status=BANNED",
        "03:09:54  soc-alert  severity=CRITICAL  rule=event-buffer-protected",
      ],
      highlight: [0, 1],
    },
  },
  {
    id: "ev-011",
    title: "Badge Access Extract",
    filename: "badge-access.csv",
    folderPath: ["episode-4", "timeline", "timeline-incidents"],
    type: "data",
    importance: "medium",
    dateAdded: "2025-11-12 02:50",
    size: "33 KB",
    tags: ["physical", "security", "badge"],
    related: ["ev-004"],
    summary: "Badge entries for the secure wing around the incident window.",
    preview: {
      kind: "data",
      headers: ["Timestamp", "Employee", "Door", "Result"],
      rows: [
        ["02:41", "camille.beaumont", "Server Wing 2F", "Granted"],
        ["02:54", "svc_boundary", "Lab Access Proxy", "System Override"],
        ["03:01", "unknown", "Server Wing 2F", "Denied"],
      ],
      insight: "System override coincides with automation account activity; potential credential misuse.",
    },
  },
  {
    id: "ev-012",
    title: "Encrypted Payload Capture",
    filename: "payload-fragment.enc",
    folderPath: ["episode-4", "digital-evidence", "digital-data"],
    type: "encrypted",
    importance: "critical",
    dateAdded: "2025-11-12 03:25",
    size: "8.6 MB",
    tags: ["encrypted", "payload", "needs-decryption"],
    related: ["ev-001"],
    summary: "Partial payload recovered mid-transfer. Requires decryption key from boundary controller.",
    preview: {
      kind: "encrypted",
      hint: "Captured midstream via inline proxy. AES-256 with rotating key schedule.",
      requiredKey: "Boundary controller master key or rotation log",
    },
  },
];

const importanceOrder: Record<EvidenceImportance, number> = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4,
};

const typeIconMap: Record<EvidenceType, JSX.Element> = {
  document: <FileText size={18} />,
  log: <FileCode size={18} />,
  email: <Mail size={18} />,
  image: <ImageIcon size={18} />,
  video: <Video size={18} />,
  data: <Table2 size={18} />,
  encrypted: <ShieldAlert size={18} />,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.45rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.92rem;
  max-width: 680px;
  line-height: 1.5;
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 360px;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 220px 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FolderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.92rem;
  font-weight: 600;
`;

const FolderScroll = styled.div`
  overflow-y: auto;
  max-height: 540px;
  padding: 0.35rem 0.6rem 1rem;
`;

const FolderItem = styled.button<{ $depth: number; $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem 0.45rem ${({ $depth }) => 0.6 + $depth * 0.85}rem;
  border-radius: 0.75rem;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? "rgba(33, 150, 243, 0.18)" : "transparent"};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
`;

const SearchField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex: 1 1 220px;
  background: rgba(0, 0, 0, 0.28);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.55rem 0.75rem;
  color: ${({ theme }) => theme.colors.white};

  svg {
    opacity: 0.6;
  }
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.85rem;
  outline: none;
`;

const Select = styled.select`
  appearance: none;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.85rem;
  padding: 0.55rem 0.85rem;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ViewToggle = styled.div`
  display: inline-flex;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.24)" : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : "rgba(255, 255, 255, 0.65)")};
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const ContentList = styled.div<{ $isGrid?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isGrid }) => ($isGrid ? "repeat(auto-fill, minmax(220px, 1fr))" : "1fr")};
  gap: 0.6rem;
  padding: 0.75rem;
  overflow-y: auto;
  max-height: 520px;
`;

const FileRow = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ $selected }) => ($selected ? "auto 1fr auto" : "auto 1fr auto")};
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.85rem;
  border: 1px solid ${({ $selected }) => ($selected ? "rgba(33, 150, 243, 0.4)" : "rgba(255, 255, 255, 0.06)")};
  background: ${({ $selected }) => ($selected ? "rgba(33, 150, 243, 0.1)" : "rgba(255, 255, 255, 0.04)")};
  color: ${({ theme }) => theme.colors.white};
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const FileIcon = styled.div<{ $type: EvidenceType }>`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: ${({ $type }) => {
    switch ($type) {
      case "document":
        return "rgba(66, 165, 245, 0.18)";
      case "log":
        return "rgba(255, 138, 101, 0.2)";
      case "email":
        return "rgba(129, 199, 132, 0.2)";
      case "image":
        return "rgba(244, 143, 177, 0.2)";
      case "data":
        return "rgba(149, 117, 205, 0.2)";
      case "video":
        return "rgba(255, 214, 102, 0.22)";
      case "encrypted":
        return "rgba(255, 82, 82, 0.2)";
      default:
        return "rgba(255, 255, 255, 0.12)";
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FileName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const FileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
`;

const Badge = styled.span<{ $tone: "new" | EvidenceImportance }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ $tone }) => {
    switch ($tone) {
      case "critical":
        return "rgba(244, 67, 54, 0.2)";
      case "high":
        return "rgba(255, 152, 0, 0.18)";
      case "medium":
        return "rgba(33, 150, 243, 0.18)";
      case "low":
        return "rgba(76, 175, 80, 0.2)";
      case "new":
      default:
        return "rgba(129, 199, 132, 0.22)";
    }
  }};
  color: ${({ $tone }) => {
    switch ($tone) {
      case "critical":
        return "#ef9a9a";
      case "high":
        return "#ffcc80";
      case "medium":
        return "#90caf9";
      case "low":
        return "#a5d6a7";
      case "new":
      default:
        return "#c5e1a5";
    }
  }};
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const Tag = styled.span`
  padding: 0.2rem 0.45rem;
  border-radius: 0.65rem;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
`;

const PreviewPanel = styled(Panel)`
  min-height: 520px;
  position: relative;
`;

const PreviewBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  overflow-y: auto;
`;

const PreviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PreviewTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const PreviewSummary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PreviewMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.6rem;
`;

const MetaCard = styled.div`
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.78rem;

  span:first-child {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.55);
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Paragraph = styled.p<{ $highlighted?: boolean }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ $highlighted }) => ($highlighted ? "rgba(33, 150, 243, 0.18)" : "transparent")};
  border: ${({ $highlighted }) => ($highlighted ? "1px solid rgba(33, 150, 243, 0.35)" : "1px solid transparent")};
  padding: 0.65rem 0.85rem;
  border-radius: 0.75rem;
  font-size: 0.88rem;
  line-height: 1.6;
  transition: background 0.2s ease, border 0.2s ease;
  position: relative;

  &:hover {
    background: ${({ $highlighted }) => ($highlighted ? "rgba(33, 150, 243, 0.24)" : "rgba(255, 255, 255, 0.06)")};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.35);

  th,
  td {
    padding: 0.65rem 0.75rem;
    font-size: 0.8rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: ${({ theme }) => theme.colors.white};
    text-align: left;
    white-space: nowrap;
  }

  th {
    background: rgba(255, 255, 255, 0.06);
    text-transform: uppercase;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
  }
`;

const ViewerToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const ParagraphRow = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
`;

const ParagraphActions = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.2rem;
`;

const InlineIconButton = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 1px solid ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.6)" : "rgba(255, 255, 255, 0.12)")};
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.18)" : "rgba(255, 255, 255, 0.06)")};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 0.6rem;
  padding: 0.25rem;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease;
  display: inline-flex;

  &:hover {
    background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.26)" : "rgba(255, 255, 255, 0.12)")};
  }
`;

const ToolbarGroup = styled.div`
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
`;

const ToolbarButton = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
  appearance: none;
  border-radius: 999px;
  border: ${({ $variant }) => {
    if ($variant === "ghost") return "1px solid rgba(255, 255, 255, 0.18)";
    if ($variant === "danger") return "1px solid rgba(244, 67, 54, 0.4)";
    return "1px solid transparent";
  }};
  background: ${({ $variant, theme }) => {
    if ($variant === "primary") return theme.colors.primary;
    if ($variant === "danger") return "rgba(244, 67, 54, 0.18)";
    return "rgba(255, 255, 255, 0.06)";
  }};
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "rgba(255, 255, 255, 0.85)")};
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.2s ease, border 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $variant, theme }) => {
      if ($variant === "primary") return theme.colors.primary;
      if ($variant === "danger") return "rgba(244, 67, 54, 0.28)";
      return "rgba(255, 255, 255, 0.12)";
    }};
  }
`;

const MiniInput = styled.input`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.6rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MiniSelect = styled.select`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.6rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  min-width: 120px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const InlineBadge = styled.span<{ $tone?: "info" | "warning" | "danger" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
  color: ${({ $tone }) => {
    switch ($tone) {
      case "warning":
        return "#ffd54f";
      case "danger":
        return "#ef9a9a";
      default:
        return "#90caf9";
    }
  }};
  background: ${({ $tone }) => {
    switch ($tone) {
      case "warning":
        return "rgba(255, 193, 7, 0.18)";
      case "danger":
        return "rgba(244, 67, 54, 0.18)";
      default:
        return "rgba(33, 150, 243, 0.18)";
    }
  }};
`;

const ImageCanvas = styled.div`
  width: 100%;
  height: 320px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  position: relative;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const ActionBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "ghost" }>`
  appearance: none;
  border: ${({ $variant }) => ($variant === "ghost" ? "1px solid rgba(255, 255, 255, 0.12)" : "none")};
  background: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.primary : "rgba(255, 255, 255, 0.04)"};
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "rgba(255, 255, 255, 0.85)")};
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.primary : "rgba(255, 255, 255, 0.1)"};
  }
`;

const NoteArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.85rem;
  padding: 0.75rem;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RelatedList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.3rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.85rem;
`;

const BookmarkList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.4rem;
`;

const BookmarkItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.white};
`;

const BookmarkActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.85rem;
  background: rgba(0, 0, 0, 0.35);
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
`;

const BarWrapper = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const Bar = styled.div<{ $value: number }>`
  height: 16px;
  border-radius: 0.65rem;
  background: linear-gradient(90deg, rgba(33, 150, 243, 0.65) 0%, rgba(33, 150, 243, 1) ${({ $value }) => Math.min($value, 100)}%, rgba(255, 255, 255, 0.08) ${({ $value }) =>
      Math.min($value, 100)}%);
  transition: background 0.3s ease;
`;

const BarLabel = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: space-between;
`;

const Toast = styled(motion.div)`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(33, 150, 243, 0.24);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.65rem 1rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(33, 150, 243, 0.4);
  font-size: 0.82rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  pointer-events: none;
`;

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safe})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={`${part}-${index}`}>{part}</mark> : part,
  );
}

function flattenFolders(node: FolderNode, depth = 0, parentIds: string[] = []) {
  const entry = { id: node.id, name: node.name, depth, parentPath: parentIds };
  const children =
    node.children?.flatMap((child) => flattenFolders(child, depth + 1, [...parentIds, node.id])) ?? [];
  return [entry, ...children];
}

const FLATTENED_FOLDERS = flattenFolders(FOLDER_TREE);

interface EmailViewerProps {
  preview: EmailPreview;
  globalQuery: string;
  highlightedKeys: Set<string>;
  onToggleHighlight: (targetKey: string, label: string) => void;
  onAddBookmark: (label: string, target: string) => void;
}

function EmailViewer({ preview, globalQuery, highlightedKeys, onToggleHighlight, onAddBookmark }: EmailViewerProps) {
  const [localQuery, setLocalQuery] = useState("");
  const activeQuery = localQuery || globalQuery;
  const flaggedSet = useMemo(
    () => new Set((preview.flaggedPhrases ?? []).map((phrase) => phrase.toLowerCase())),
    [preview.flaggedPhrases],
  );

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <ViewerToolbar>
        <ToolbarGroup>
          <MiniInput
            value={localQuery}
            placeholder="Search email content..."
            onChange={(event) => setLocalQuery(event.target.value)}
            aria-label="Search within email"
          />
          {localQuery && (
            <ToolbarButton $variant="ghost" onClick={() => setLocalQuery("")}>
              <RefreshCw size={14} />
              Clear
            </ToolbarButton>
          )}
        </ToolbarGroup>
        {preview.attachments?.length ? (
          <InlineBadge $tone="warning">
            <AlertTriangle size={12} />
            Attachments ({preview.attachments.length})
          </InlineBadge>
        ) : null}
      </ViewerToolbar>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <MetaCard>
          <span>From</span>
          <span>{preview.from}</span>
        </MetaCard>
        <MetaCard>
          <span>To</span>
          <span>{preview.to.join(", ")}</span>
        </MetaCard>
        {preview.cc && preview.cc.length > 0 && (
          <MetaCard>
            <span>CC</span>
            <span>{preview.cc.join(", ")}</span>
          </MetaCard>
        )}
        <MetaCard>
          <span>Subject</span>
          <span>{highlightText(preview.subject, activeQuery)}</span>
        </MetaCard>
      </div>

      {preview.attachments && preview.attachments.length > 0 && (
        <div>
          <h4 style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>Attachments</h4>
          <BookmarkList>
            {preview.attachments.map((attachment) => (
              <BookmarkItem key={attachment.filename}>
                <span>
                  {attachment.filename} ({attachment.size}) — {attachment.type}
                </span>
                {attachment.suspicious && (
                  <InlineBadge $tone="danger">
                    <AlertTriangle size={12} />
                    Suspicious
                  </InlineBadge>
                )}
              </BookmarkItem>
            ))}
          </BookmarkList>
        </div>
      )}

      {preview.flaggedPhrases && preview.flaggedPhrases.length > 0 && (
        <InlineBadge $tone="danger">
          <AlertTriangle size={12} />
          Suspicious phrasing detected: {preview.flaggedPhrases.join(", ")}
        </InlineBadge>
      )}

      <div style={{ display: "grid", gap: "0.5rem" }}>
        {preview.body.map((line, index) => {
          const targetKey = `email-body-${index}`;
          const label = `Email line ${index + 1}`;
          const highlighted = highlightedKeys.has(targetKey);
          const lowerLine = line.toLowerCase();
          const autoFlagged = Array.from(flaggedSet).some((phrase) => lowerLine.includes(phrase));

          return (
            <ParagraphRow key={targetKey}>
              <Paragraph
                data-annotation-target={targetKey}
                $highlighted={highlighted || autoFlagged}
                onClick={() => onToggleHighlight(targetKey, label)}
              >
                {highlightText(line, activeQuery)}
              </Paragraph>
              <ParagraphActions>
                <InlineIconButton
                  $active={highlighted}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleHighlight(targetKey, label);
                  }}
                  aria-label={highlighted ? "Remove highlight" : "Highlight email line"}
                >
                  <Highlighter size={14} />
                </InlineIconButton>
                <InlineIconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddBookmark(label, targetKey);
                  }}
                  aria-label="Bookmark email line"
                >
                  <BookmarkPlus size={14} />
                </InlineIconButton>
              </ParagraphActions>
            </ParagraphRow>
          );
        })}
      </div>

      {preview.thread && preview.thread.length > 0 && (
        <div style={{ display: "grid", gap: "0.45rem" }}>
          <h4 style={{ margin: "0", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>Thread history</h4>
          <BookmarkList>
            {preview.thread.map((message, index) => (
              <BookmarkItem key={`${message.sender}-${index}`}>
                <span>
                  <strong>{message.sender}</strong> — {message.timestamp}
                  <br />
                  {highlightText(message.summary, activeQuery)}
                </span>
              </BookmarkItem>
            ))}
          </BookmarkList>
        </div>
      )}
    </div>
  );
}

interface DocumentViewerProps {
  preview: DocumentPreview;
  filename: string;
  globalQuery: string;
  highlightedKeys: Set<string>;
  onToggleHighlight: (targetKey: string, label: string) => void;
  onAddBookmark: (label: string, target: string) => void;
}

function DocumentViewer({
  preview,
  filename,
  globalQuery,
  highlightedKeys,
  onToggleHighlight,
  onAddBookmark,
}: DocumentViewerProps) {
  const [localQuery, setLocalQuery] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const activeQuery = localQuery || globalQuery;

  const documentText = useMemo(() => preview.body.join("\n\n"), [preview.body]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (error) {
      console.warn("Failed to copy document content", error);
    }
  }, [documentText]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([documentText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = preview.filenameHint ?? filename.replace(/\.[^/.]+$/, ".txt");
    anchor.click();
    URL.revokeObjectURL(url);
  }, [documentText, preview.filenameHint, filename]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    printWindow.document.write(`<pre style="font-family: 'Inter', sans-serif; white-space: pre-wrap;">${preview.body
      .map((paragraph) => paragraph.replace(/[&<>"']/g, (match) => `&#${match.charCodeAt(0)};`))
      .join("\n\n")}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, [preview.body]);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <ViewerToolbar>
        <ToolbarGroup>
          <MiniInput
            value={localQuery}
            placeholder="Search within document..."
            onChange={(event) => setLocalQuery(event.target.value)}
            aria-label="Search within document"
          />
          {localQuery && (
            <ToolbarButton $variant="ghost" onClick={() => setLocalQuery("")}>
              <RefreshCw size={14} />
              Clear
            </ToolbarButton>
          )}
        </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarButton $variant="ghost" onClick={handleCopy}>
              <ClipboardCopy size={14} />
              {copyState === "copied" ? "Copied" : "Copy text"}
            </ToolbarButton>
          <ToolbarButton $variant="ghost" onClick={handleDownload}>
            <DownloadIcon size={14} />
            Download
          </ToolbarButton>
          <ToolbarButton $variant="ghost" onClick={handlePrint}>
            <Printer size={14} />
            Print
          </ToolbarButton>
        </ToolbarGroup>
      </ViewerToolbar>

      {preview.body.map((paragraph, index) => {
        const targetKey = `paragraph-${index}`;
        const label = `Paragraph ${index + 1}`;
        const highlighted = highlightedKeys.has(targetKey);

        return (
          <ParagraphRow key={targetKey}>
            <Paragraph
              data-annotation-target={targetKey}
              $highlighted={highlighted}
              onClick={() => onToggleHighlight(targetKey, label)}
            >
              {highlightText(paragraph, activeQuery)}
            </Paragraph>
            <ParagraphActions>
              <InlineIconButton
                $active={highlighted}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleHighlight(targetKey, label);
                }}
                aria-label={highlighted ? "Remove highlight" : "Highlight paragraph"}
              >
                <Highlighter size={14} />
              </InlineIconButton>
              <InlineIconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onAddBookmark(label, targetKey);
                }}
                aria-label="Bookmark paragraph"
              >
                <BookmarkPlus size={14} />
              </InlineIconButton>
            </ParagraphActions>
          </ParagraphRow>
        );
      })}
    </div>
  );
}

interface LogViewerProps {
  preview: LogPreview;
  globalQuery: string;
  highlightedKeys: Set<string>;
  onToggleHighlight: (targetKey: string, label: string) => void;
  onAddBookmark: (label: string, target: string) => void;
}

function LogViewer({ preview, globalQuery, highlightedKeys, onToggleHighlight, onAddBookmark }: LogViewerProps) {
  const [levelFilter, setLevelFilter] = useState<LogLevel | "ALL">("ALL");
  const [localQuery, setLocalQuery] = useState("");
  const [jumpTarget, setJumpTarget] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultHighlightSet = useMemo(
    () => new Set((preview.highlight ?? []).map((lineIndex) => lineIndex + 1)),
    [preview.highlight],
  );

  const enrichedLines = useMemo(
    () =>
      preview.lines.map((line, index) => ({
        lineNumber: index + 1,
        content: line,
        level: deriveLogLevel(line),
      })),
    [preview.lines],
  );

  const globalNeedle = globalQuery.trim().toLowerCase();

  const filteredLines = useMemo(() => {
    const queryLower = localQuery.trim().toLowerCase();
    return enrichedLines.filter((entry) => {
      if (levelFilter !== "ALL" && entry.level !== levelFilter) return false;
      if (queryLower && !entry.content.toLowerCase().includes(queryLower)) return false;
      return true;
    });
  }, [enrichedLines, levelFilter, localQuery]);

  const exportFiltered = useCallback(() => {
    const blob = new Blob([filteredLines.map((entry) => entry.content).join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "filtered-log.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [filteredLines]);

  const handleJump = useCallback(() => {
    const targetLine = Number.parseInt(jumpTarget, 10);
    if (Number.isNaN(targetLine)) return;
    const element = containerRef.current?.querySelector<HTMLElement>(`[data-line-number="${targetLine}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.animate(
        [
          { backgroundColor: "rgba(33, 150, 243, 0.45)" },
          { backgroundColor: "rgba(33, 150, 243, 0.0)" },
        ],
        { duration: 800 },
      );
    }
  }, [jumpTarget]);

  const combinedCode = filteredLines.map((entry) => entry.content).join("\n");

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <ViewerToolbar>
        <ToolbarGroup>
          <MiniSelect value={levelFilter} onChange={(event) => setLevelFilter(event.target.value as LogLevel | "ALL")}>
            <option value="ALL">All levels</option>
            <option value="INFO">Info</option>
            <option value="DEBUG">Debug</option>
            <option value="WARN">Warn</option>
            <option value="ERROR">Error</option>
            <option value="CRITICAL">Critical</option>
          </MiniSelect>
          <MiniInput
            value={localQuery}
            placeholder="Filter log lines..."
            onChange={(event) => setLocalQuery(event.target.value)}
            aria-label="Filter log lines"
          />
          {localQuery && (
            <InlineIconButton
              onClick={() => setLocalQuery("")}
              aria-label="Clear log filter"
              style={{ padding: "0.35rem" }}
            >
              <RefreshCw size={14} />
            </InlineIconButton>
          )}
        </ToolbarGroup>
        <ToolbarGroup>
          <MiniInput
            value={jumpTarget}
            onChange={(event) => setJumpTarget(event.target.value)}
            placeholder="Jump to line..."
            aria-label="Jump to log line"
            style={{ minWidth: "110px" }}
          />
          <ToolbarButton $variant="ghost" onClick={handleJump}>
            Go
          </ToolbarButton>
          <ToolbarButton $variant="ghost" onClick={exportFiltered}>
            <DownloadIcon size={14} />
            Export filtered
          </ToolbarButton>
        </ToolbarGroup>
      </ViewerToolbar>

      <InlineBadge $tone="info">Click to highlight, right-click to bookmark specific log lines.</InlineBadge>

      <div ref={containerRef} style={{ maxHeight: 280, overflow: "auto", borderRadius: "0.75rem" }}>
        {filteredLines.length === 0 ? (
          <div style={{ padding: "1rem", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
            No log entries match the current filters.
          </div>
        ) : (
          <SyntaxHighlighter
            language={preview.language ?? "bash"}
            style={oneDark}
            showLineNumbers
            wrapLines
            customStyle={{ borderRadius: "0.75rem", background: "rgba(0, 0, 0, 0.45)" }}
            lineNumberStyle={{ color: "rgba(255,255,255,0.45)" }}
            lineProps={(lineIndex) => {
              const entry = filteredLines[lineIndex - 1];
              if (!entry) return {};
              const targetKey = `log-${entry.lineNumber}`;
              const isHighlighted =
                highlightedKeys.has(targetKey) || defaultHighlightSet.has(entry.lineNumber);
              const matchesGlobal = globalNeedle && entry.content.toLowerCase().includes(globalNeedle);
              return {
                "data-line-number": entry.lineNumber,
                style: {
                  cursor: "pointer",
                  background: isHighlighted
                    ? "rgba(33, 150, 243, 0.18)"
                    : matchesGlobal
                    ? "rgba(255, 193, 7, 0.12)"
                    : "transparent",
                  borderLeft: defaultHighlightSet.has(entry.lineNumber) ? "2px solid #ffcc80" : undefined,
                },
                onClick: () => onToggleHighlight(targetKey, `Log line ${entry.lineNumber}`),
                onContextMenu: (event: MouseEvent<HTMLSpanElement>) => {
                  event.preventDefault();
                  onAddBookmark(`Log line ${entry.lineNumber}`, targetKey);
                },
                title: "Click to toggle highlight. Right-click to bookmark.",
              };
            }}
          >
            {combinedCode || "// no filtered content"}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}

interface ImageViewerProps {
  preview: ImagePreview;
}

function ImageViewer({ preview }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointerState = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      pointerState.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        baseX: offset.x,
        baseY: offset.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [offset],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!pointerState.current.active) return;
      const deltaX = (event.clientX - pointerState.current.startX) / zoom;
      const deltaY = (event.clientY - pointerState.current.startY) / zoom;
      setOffset({
        x: pointerState.current.baseX + deltaX,
        y: pointerState.current.baseY + deltaY,
      });
    },
    [zoom],
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (pointerState.current.active) {
      pointerState.current.active = false;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const applyZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.min(3, Math.max(1, Number.parseFloat((prev + delta).toFixed(2)))));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <ViewerToolbar>
        <ToolbarGroup>
          <ToolbarButton $variant="ghost" onClick={() => applyZoom(0.2)}>
            <ZoomIn size={14} />
            Zoom in
          </ToolbarButton>
          <ToolbarButton $variant="ghost" onClick={() => applyZoom(-0.2)}>
            <ZoomOut size={14} />
            Zoom out
          </ToolbarButton>
          <ToolbarButton $variant="ghost" onClick={resetView}>
            <RotateCcw size={14} />
            Reset
          </ToolbarButton>
        </ToolbarGroup>
        <InlineBadge $tone="info">Drag image to pan when zoomed in.</InlineBadge>
      </ViewerToolbar>

      <ImageCanvas
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img
          src={preview.src}
          alt={preview.alt}
          style={{
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: "center center",
            transition: pointerState.current.active ? "none" : "transform 0.2s ease",
          }}
        />
      </ImageCanvas>

      {preview.caption && <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem" }}>{preview.caption}</span>}

      {preview.metadata && (
        <PreviewMeta>
          {preview.metadata.resolution && (
            <MetaCard>
              <span>Resolution</span>
              <span>{preview.metadata.resolution}</span>
            </MetaCard>
          )}
          {preview.metadata.capturedAt && (
            <MetaCard>
              <span>Captured</span>
              <span>{preview.metadata.capturedAt}</span>
            </MetaCard>
          )}
          {preview.metadata.device && (
            <MetaCard>
              <span>Device</span>
              <span>{preview.metadata.device}</span>
            </MetaCard>
          )}
        </PreviewMeta>
      )}
    </div>
  );
}

interface DataTableViewerProps {
  preview: TablePreview;
  globalQuery: string;
  highlightedKeys: Set<string>;
  onToggleHighlight: (targetKey: string, label: string) => void;
  onAddBookmark: (label: string, target: string) => void;
}

function DataTableViewer({
  preview,
  globalQuery,
  highlightedKeys,
  onToggleHighlight,
  onAddBookmark,
}: DataTableViewerProps) {
  const [sortColumn, setSortColumn] = useState<string>(preview.headers[0] ?? "");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [chartColumn, setChartColumn] = useState<string>(preview.headers[0] ?? "");
  const [showChart, setShowChart] = useState<boolean>(false);

  const rows = useMemo(
    () =>
      preview.rows.map((cells, index) => {
        const record: Record<string, string> = {};
        preview.headers.forEach((header, headerIndex) => {
          record[header] = cells[headerIndex] ?? "";
        });
        return { id: index, cells, record };
      }),
    [preview.headers, preview.rows],
  );

  const filteredRows = useMemo(() => {
    if (!filterColumn || !filterValue.trim()) return rows;
    const needle = filterValue.trim().toLowerCase();
    return rows.filter((row) => (row.record[filterColumn] ?? "").toLowerCase().includes(needle));
  }, [filterColumn, filterValue, rows]);

  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows;
    const accessor = (value: string) => {
      const numeric = Number.parseFloat(value.replace(/[^\d.-]/g, ""));
      if (!Number.isNaN(numeric) && /\d/.test(value)) return numeric;
      return value.toLowerCase();
    };

    const clone = [...filteredRows];
    clone.sort((a, b) => {
      const first = accessor(a.record[sortColumn] ?? "");
      const second = accessor(b.record[sortColumn] ?? "");
      if (typeof first === "number" && typeof second === "number") {
        return sortDirection === "asc" ? first - second : second - first;
      }
      return sortDirection === "asc"
        ? String(first).localeCompare(String(second))
        : String(second).localeCompare(String(first));
    });
    return clone;
  }, [filteredRows, sortColumn, sortDirection]);

  const exportCsv = useCallback(() => {
    const csvLines = [
      preview.headers.join(","),
      ...sortedRows.map((row) => row.cells.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "evidence-data.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [preview.headers, sortedRows]);

  const chartData = useMemo(() => {
    if (!showChart) return [];
    const counts = new Map<string, number>();
    sortedRows.forEach((row) => {
      const key = row.record[chartColumn] ?? "Unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const maxValue = Math.max(...Array.from(counts.values()), 1);
    return Array.from(counts.entries()).map(([label, value]) => ({
      label,
      value,
      percentage: (value / maxValue) * 100,
    }));
  }, [sortedRows, showChart, chartColumn]);

  const activeQuery = globalQuery.toLowerCase();

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <ViewerToolbar>
        <ToolbarGroup>
          <MiniSelect value={sortColumn} onChange={(event) => setSortColumn(event.target.value)}>
            {preview.headers.map((header) => (
              <option key={`sort-${header}`} value={header}>
                Sort by {header}
              </option>
            ))}
          </MiniSelect>
          <MiniSelect value={sortDirection} onChange={(event) => setSortDirection(event.target.value as "asc" | "desc")}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </MiniSelect>
        </ToolbarGroup>
        <ToolbarGroup>
          <MiniSelect value={filterColumn} onChange={(event) => setFilterColumn(event.target.value)}>
            <option value="">No filter</option>
            {preview.headers.map((header) => (
              <option key={`filter-${header}`} value={header}>
                Filter {header}
              </option>
            ))}
          </MiniSelect>
          <MiniInput
            value={filterValue}
            placeholder="Filter value..."
            onChange={(event) => setFilterValue(event.target.value)}
            aria-label="Filter data table"
          />
          {filterValue && (
            <InlineIconButton
              onClick={() => setFilterValue("")}
              aria-label="Clear filter"
              style={{ padding: "0.35rem" }}
            >
              <RefreshCw size={14} />
            </InlineIconButton>
          )}
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton $variant="ghost" onClick={() => setShowChart((prev) => !prev)}>
            <Table2 size={14} />
            {showChart ? "Hide chart" : "Generate chart"}
          </ToolbarButton>
          <ToolbarButton $variant="ghost" onClick={exportCsv}>
            <DownloadIcon size={14} />
            Export CSV
          </ToolbarButton>
        </ToolbarGroup>
      </ViewerToolbar>

      <TableWrapper>
        <DataTable>
          <thead>
            <tr>
              {preview.headers.map((header) => (
                <th key={`header-${header}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const targetKey = `data-row-${row.id}`;
              const highlighted = highlightedKeys.has(targetKey);
              return (
                <tr
                  key={`row-${row.id}`}
                  data-annotation-target={targetKey}
                  style={{
                    background: highlighted ? "rgba(33, 150, 243, 0.18)" : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => onToggleHighlight(targetKey, `Row ${row.id + 1}`)}
                  onDoubleClick={() => onAddBookmark(`Row ${row.id + 1}`, targetKey)}
                >
                  {row.cells.map((cell, cellIndex) => {
                    const cellContent = cell;
                    const shouldHighlight = activeQuery && cellContent.toLowerCase().includes(activeQuery);
                    return (
                      <td key={`cell-${row.id}-${cellIndex}`}>
                        {shouldHighlight ? highlightText(cellContent, globalQuery) : cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </TableWrapper>

      {showChart && chartData.length > 0 && (
        <ChartContainer>
          <ToolbarGroup>
            <MiniSelect value={chartColumn} onChange={(event) => setChartColumn(event.target.value)}>
              {preview.headers.map((header) => (
                <option key={`chart-${header}`} value={header}>
                  Chart by {header}
                </option>
              ))}
            </MiniSelect>
            <InlineBadge $tone="info">
              <Sparkles size={12} />
              Frequency distribution
            </InlineBadge>
          </ToolbarGroup>
          <BarWrapper>
            {chartData.map((entry) => (
              <div key={`bar-${entry.label}`}>
                <BarLabel>
                  <span>{entry.label}</span>
                  <span>{entry.value}</span>
                </BarLabel>
                <Bar $value={entry.percentage} />
              </div>
            ))}
          </BarWrapper>
        </ChartContainer>
      )}

      {preview.insight && (
        <Paragraph $highlighted={false}>
          <Sparkles size={14} style={{ marginRight: "0.35rem" }} />
          {preview.insight}
        </Paragraph>
      )}
    </div>
  );
}

export function FilesView() {
  const [activeFolderId, setActiveFolderId] = useState<string>("episode-4");
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set(["episode-4"]));
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | EvidenceType>("all");
  const [importanceFilter, setImportanceFilter] = useState<"all" | EvidenceImportance>("all");
  const [sortOption, setSortOption] = useState<"date" | "name" | "importance">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedFileId, setSelectedFileId] = useState<string>(EVIDENCE_FILES[0].id);
  const [importantIds, setImportantIds] = useState<Set<string>>(new Set(["ev-001", "ev-010", "ev-012"]));
  const [annotations, setAnnotations] = useState<AnnotationState>(() => loadAnnotationsFromStorage());
  const [notes, setNotes] = useState<Record<string, string>>(() => loadNotesFromStorage());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(annotations));
  }, [annotations]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const handleFolderToggle = (folderId: string) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const folderFilterList = useMemo(
    () => [
      { id: "all", name: "All folders", depth: 0, parentPath: [] as string[] },
      ...FLATTENED_FOLDERS,
    ],
    [],
  );

  const folderNameMap = useMemo(() => {
    const map = new Map<string, string>();
    folderFilterList.forEach((folder) => map.set(folder.id, folder.name));
    return map;
  }, [folderFilterList]);

  const filteredFiles = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();
    return EVIDENCE_FILES.filter((file) => {
      const matchesFolder =
        activeFolderId === "all" || file.folderPath.includes(activeFolderId) || file.folderPath.at(-1) === activeFolderId;
      if (!matchesFolder) return false;

      const matchesType = typeFilter === "all" || file.type === typeFilter;
      if (!matchesType) return false;

      const matchesImportance = importanceFilter === "all" || file.importance === importanceFilter;
      if (!matchesImportance) return false;

      if (!lowerQuery) return true;

      return (
        file.title.toLowerCase().includes(lowerQuery) ||
        file.filename.toLowerCase().includes(lowerQuery) ||
        file.summary.toLowerCase().includes(lowerQuery) ||
        file.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }).sort((a, b) => {
      if (sortOption === "importance") {
        const delta =
          importanceOrder[a.importance] - importanceOrder[b.importance] || a.title.localeCompare(b.title);
        return sortDirection === "asc" ? delta : -delta;
      }

      if (sortOption === "name") {
        const delta = a.title.localeCompare(b.title);
        return sortDirection === "asc" ? delta : -delta;
      }

      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      const delta = dateA - dateB;
      return sortDirection === "asc" ? delta : -delta;
    });
  }, [activeFolderId, importanceFilter, searchQuery, sortDirection, sortOption, typeFilter]);

  const selectedFileFallback = filteredFiles.find((file) => file.id === selectedFileId) ?? filteredFiles[0] ?? null;
  const selectedFile = selectedFileFallback ?? null;

  const emptyAnnotation = useMemo(() => createDefaultAnnotation(), []);
  const currentAnnotations = selectedFile ? annotations[selectedFile.id] ?? emptyAnnotation : emptyAnnotation;
  const highlightedKeys = useMemo(
    () => new Set(currentAnnotations.highlights),
    [currentAnnotations.highlights],
  );

  const folderBreadcrumb = useMemo(() => {
    if (!selectedFile) return [];
    return selectedFile.folderPath.map((folderId) => folderNameMap.get(folderId) ?? folderId);
  }, [selectedFile, folderNameMap]);

  const handleToggleImportant = () => {
    if (!selectedFile) return;
    setImportantIds((prev) => {
      const next = new Set(prev);
      if (next.has(selectedFile.id)) {
        next.delete(selectedFile.id);
        setToastMessage("Removed from important evidence list.");
      } else {
        next.add(selectedFile.id);
        setToastMessage("Marked as important. Kastor will prioritise it.");
      }
      return next;
    });
  };

  const handleShareWithKastor = () => {
    if (!selectedFile) return;
    setToastMessage(`Shared '${selectedFile.title}' with Kastor for follow-up.`);
  };

  const handleToggleAnnotationHighlight = useCallback(
    (targetKey: string, label: string) => {
      if (!selectedFile) return;
      let message = "";
      setAnnotations((prev) => {
        const entry = prev[selectedFile.id] ?? createDefaultAnnotation();
        const hasHighlight = entry.highlights.includes(targetKey);
        message = hasHighlight ? `Removed highlight (${label}).` : `Highlighted ${label}.`;
        const highlights = hasHighlight
          ? entry.highlights.filter((key) => key !== targetKey)
          : [...entry.highlights, targetKey];
        return {
          ...prev,
          [selectedFile.id]: { ...entry, highlights },
        };
      });
      if (message) {
        setToastMessage(message);
      }
    },
    [selectedFile],
  );

  const handleAddBookmark = useCallback(
    (label: string, target: string) => {
      if (!selectedFile) return;
      let message = "";
      setAnnotations((prev) => {
        const entry = prev[selectedFile.id] ?? createDefaultAnnotation();
        if (entry.bookmarks.some((bookmark) => bookmark.target === target)) {
          message = "Bookmark already exists.";
          return prev;
        }
        const bookmark = { id: createBookmarkId(), label, target };
        message = `Bookmarked ${label}.`;
        return {
          ...prev,
          [selectedFile.id]: { ...entry, bookmarks: [...entry.bookmarks, bookmark] },
        };
      });
      if (message) {
        setToastMessage(message);
      }
    },
    [selectedFile],
  );

  const handleRemoveBookmark = useCallback(
    (bookmarkId: string) => {
      if (!selectedFile) return;
      setAnnotations((prev) => {
        const entry = prev[selectedFile.id] ?? createDefaultAnnotation();
        return {
          ...prev,
          [selectedFile.id]: { ...entry, bookmarks: entry.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId) },
        };
      });
      setToastMessage("Bookmark removed.");
    },
    [selectedFile],
  );

  const handleNavigateToBookmark = useCallback((target: string) => {
    const element = document.querySelector<HTMLElement>(`[data-annotation-target="${target}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.animate(
        [
          { backgroundColor: "rgba(33, 150, 243, 0.45)" },
          { backgroundColor: "rgba(33, 150, 243, 0.0)" },
        ],
        { duration: 600 },
      );
    }
  }, []);

  const handleNoteChange = (value: string) => {
    if (!selectedFile) return;
    setNotes((prev) => ({ ...prev, [selectedFile.id]: value }));
  };

  return (
    <Wrapper>
      <Header>
        <TitleGroup>
          <Title>Evidence Archive</Title>
          <Subtitle>
            Browse every asset collected during the Episode 4 breach investigation. Filter by evidence type, compare
            metadata side-by-side, and jot down your deductions before escalating to the team.
          </Subtitle>
        </TitleGroup>
        <ActionButton
          $variant="ghost"
          onClick={() => {
            setSearchQuery("");
            setTypeFilter("all");
            setImportanceFilter("all");
            setSortOption("date");
            setSortDirection("desc");
            setActiveFolderId("episode-4");
          }}
        >
          <Filter size={16} />
          Reset filters
        </ActionButton>
      </Header>

      <LayoutGrid>
        <Panel>
          <FolderHeader>
            <span>
              <Folder size={16} style={{ marginRight: "0.5rem" }} />
              Folder structure
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{EVIDENCE_FILES.length} files</span>
          </FolderHeader>
          <FolderScroll>
            {folderFilterList.map((folder) => {
              const hasChildren = FLATTENED_FOLDERS.some((child) => child.parentPath.includes(folder.id));
              const isExpanded = expandedFolderIds.has(folder.id);
              const isActive = activeFolderId === folder.id;
              const depth = folder.depth;

              return (
                <Fragment key={folder.id}>
                  <FolderItem
                    $depth={depth}
                    $active={isActive}
                    onClick={() => {
                      setActiveFolderId(folder.id);
                      if (hasChildren) {
                        handleFolderToggle(folder.id);
                      }
                    }}
                  >
                    {hasChildren ? (
                      isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )
                    ) : (
                      <span style={{ width: 14 }} />
                    )}
                    {folder.id === "all" ? <Sparkles size={16} /> : <Folder size={14} />}
                    <span>{folder.name}</span>
                  </FolderItem>
                </Fragment>
              );
            })}
          </FolderScroll>
        </Panel>

        <Panel>
          <ControlsBar>
            <SearchField>
              <Search size={16} />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search file name, tags, or summary..."
              />
            </SearchField>
            <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}>
              <option value="all">All types</option>
              <option value="document">Document</option>
              <option value="log">Log</option>
              <option value="email">Email</option>
              <option value="image">Image</option>
              <option value="data">Data</option>
              <option value="video">Video</option>
              <option value="encrypted">Encrypted</option>
            </Select>
            <Select
              value={importanceFilter}
              onChange={(event) => setImportanceFilter(event.target.value as typeof importanceFilter)}
            >
              <option value="all">All importance</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Select
              value={`${sortOption}-${sortDirection}`}
              onChange={(event) => {
                const [option, direction] = event.target.value.split("-");
                setSortOption(option as typeof sortOption);
                setSortDirection(direction as typeof sortDirection);
              }}
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="importance-asc">Importance ascending</option>
              <option value="importance-desc">Importance descending</option>
            </Select>
            <ViewToggle>
              <ViewButton $active={viewMode === "list"} onClick={() => setViewMode("list")}>
                <LayoutList size={16} />
              </ViewButton>
              <ViewButton $active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                <LayoutGridIcon size={16} />
              </ViewButton>
            </ViewToggle>
          </ControlsBar>
          <ContentList $isGrid={viewMode === "grid"}>
            {filteredFiles.length === 0 ? (
              <div
                style={{
                  padding: "2.5rem 1rem",
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.9rem",
                }}
              >
                No evidence matches the current filters. Adjust the folder, type, or search query to continue.
              </div>
            ) : (
              filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                return (
                  <FileRow key={file.id} $selected={isSelected} onClick={() => setSelectedFileId(file.id)}>
                    <FileIcon $type={file.type}>{typeIconMap[file.type]}</FileIcon>
                    <FileInfo>
                      <FileName>{highlightText(file.title, searchQuery)}</FileName>
                      <FileMeta>
                        <span>{file.filename}</span>
                        <span>
                          <Calendar size={12} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} />
                          {file.dateAdded}
                        </span>
                        <span>{file.size}</span>
                      </FileMeta>
                      <TagList>
                        <Badge $tone={file.importance}>{file.importance.toUpperCase()}</Badge>
                        {file.isNew && <Badge $tone="new">NEW</Badge>}
                        {importantIds.has(file.id) && (
                          <Badge $tone="high">
                            <Star size={12} />
                            Pinned
                          </Badge>
                        )}
                        {file.tags.map((tag) => (
                          <Tag key={`${file.id}-${tag}`}>{highlightText(tag, searchQuery)}</Tag>
                        ))}
                      </TagList>
                    </FileInfo>
                    <MoreHorizontal size={16} color="rgba(255,255,255,0.35)" />
                  </FileRow>
                );
              })
            )}
          </ContentList>
        </Panel>

        <PreviewPanel>
          {selectedFile ? (
            <PreviewBody>
              <PreviewHeader>
                <PreviewTitle>{selectedFile.title}</PreviewTitle>
                <PreviewSummary>{highlightText(selectedFile.summary, searchQuery)}</PreviewSummary>
                <TagList>
                  {folderBreadcrumb.map((crumb, index) => (
                    <Tag key={`${selectedFile.id}-crumb-${index}`}>
                      <Folder size={12} style={{ marginRight: "0.35rem" }} />
                      {crumb}
                    </Tag>
                  ))}
                </TagList>
              </PreviewHeader>
              <PreviewMeta>
                <MetaCard>
                  <span>File Name</span>
                  <span>{selectedFile.filename}</span>
                </MetaCard>
                <MetaCard>
                  <span>Type</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    {typeIconMap[selectedFile.type]}
                    {selectedFile.type}
                  </span>
                </MetaCard>
                <MetaCard>
                  <span>Added</span>
                  <span>{selectedFile.dateAdded}</span>
                </MetaCard>
                <MetaCard>
                  <span>Size</span>
                  <span>{selectedFile.size}</span>
                </MetaCard>
              </PreviewMeta>

              <ActionBar>
                <ActionButton $variant="primary" onClick={handleToggleImportant}>
                  {importantIds.has(selectedFile.id) ? <StarOff size={16} /> : <Star size={16} />}
                  {importantIds.has(selectedFile.id) ? "Remove important flag" : "Mark as important"}
                </ActionButton>
                <ActionButton $variant="ghost" onClick={handleShareWithKastor}>
                  <Share2 size={16} />
                  Share with Kastor
                </ActionButton>
              </ActionBar>

                <PreviewContent>
                  {(() => {
                    switch (selectedFile.preview.kind) {
                      case "document":
                        return (
                          <DocumentViewer
                            preview={selectedFile.preview}
                            filename={selectedFile.filename}
                            globalQuery={searchQuery}
                            highlightedKeys={highlightedKeys}
                            onToggleHighlight={handleToggleAnnotationHighlight}
                            onAddBookmark={handleAddBookmark}
                          />
                        );
                      case "email":
                        return (
                          <EmailViewer
                            preview={selectedFile.preview}
                            globalQuery={searchQuery}
                            highlightedKeys={highlightedKeys}
                            onToggleHighlight={handleToggleAnnotationHighlight}
                            onAddBookmark={handleAddBookmark}
                          />
                        );
                      case "log":
                        return (
                          <LogViewer
                            preview={selectedFile.preview}
                            globalQuery={searchQuery}
                            highlightedKeys={highlightedKeys}
                            onToggleHighlight={handleToggleAnnotationHighlight}
                            onAddBookmark={handleAddBookmark}
                          />
                        );
                      case "data":
                        return (
                          <DataTableViewer
                            preview={selectedFile.preview}
                            globalQuery={searchQuery}
                            highlightedKeys={highlightedKeys}
                            onToggleHighlight={handleToggleAnnotationHighlight}
                            onAddBookmark={handleAddBookmark}
                          />
                        );
                      case "image":
                        return <ImageViewer preview={selectedFile.preview} />;
                      case "video":
                        return (
                          <Paragraph>
                            <Video size={14} style={{ marginRight: "0.35rem" }} />
                            {selectedFile.preview.duration} briefing. {selectedFile.preview.summary}
                          </Paragraph>
                        );
                      case "encrypted":
                        return (
                          <Paragraph>
                            <ShieldAlert size={14} style={{ marginRight: "0.35rem" }} />
                            {selectedFile.preview.hint} Required key: {selectedFile.preview.requiredKey}.
                          </Paragraph>
                        );
                      default:
                        return null;
                    }
                  })()}
                </PreviewContent>

                {currentAnnotations.bookmarks.length > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 0.45rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
                      Bookmarks
                    </h4>
                    <BookmarkList>
                      {currentAnnotations.bookmarks.map((bookmark) => (
                        <BookmarkItem key={bookmark.id}>
                          <span>{bookmark.label}</span>
                          <BookmarkActions>
                            <InlineIconButton
                              onClick={() => handleNavigateToBookmark(bookmark.target)}
                              aria-label="Jump to bookmark"
                            >
                              <BookmarkCheck size={14} />
                            </InlineIconButton>
                            <InlineIconButton
                              onClick={() => handleRemoveBookmark(bookmark.id)}
                              aria-label="Remove bookmark"
                            >
                              <StarOff size={14} />
                            </InlineIconButton>
                          </BookmarkActions>
                        </BookmarkItem>
                      ))}
                    </BookmarkList>
                  </div>
                )}

              {selectedFile.related.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 0.45rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
                    Related evidence
                  </h4>
                  <RelatedList>
                    {selectedFile.related.map((item) => (
                      <li key={`${selectedFile.id}-${item}`}>{item}</li>
                    ))}
                  </RelatedList>
                </div>
              )}

              <div>
                <h4 style={{ margin: "0 0 0.45rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
                  Investigator notes
                </h4>
                <NoteArea
                  placeholder="Document your findings, intuition, or follow-up tasks..."
                  value={notes[selectedFile.id] ?? ""}
                  onChange={(event) => handleNoteChange(event.target.value)}
                />
              </div>
            </PreviewBody>
          ) : (
            <div
              style={{
                padding: "2.5rem 1.5rem",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.9rem",
              }}
            >
              Select an evidence file to inspect its metadata, preview, and related assets.
            </div>
          )}

          <AnimatePresence>
            {toastMessage && (
              <Toast
                key={toastMessage}
                initial={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 12 }}
                onAnimationComplete={() => {
                  window.setTimeout(() => setToastMessage(null), 2400);
                }}
              >
                <Info size={16} />
                {toastMessage}
              </Toast>
            )}
          </AnimatePresence>
        </PreviewPanel>
      </LayoutGrid>
    </Wrapper>
  );
}

export default FilesView;
