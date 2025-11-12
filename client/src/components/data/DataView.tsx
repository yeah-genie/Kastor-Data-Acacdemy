import { Fragment, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  Info,
  RefreshCw,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";
import styled from "styled-components";

type ActionType = "Read" | "Write" | "Download" | "Delete" | "Modify";
type TimeRange = "all" | "today" | "yesterday" | "last7" | "overnight";

interface LogEntry {
  id: string;
  timestamp: string;
  timeBucket: "overnight" | "business" | "offpeak";
  user: string;
  action: ActionType;
  location: string;
  ipAddress: string;
  device: string;
  detail: string;
  severity: "low" | "medium" | "high" | "critical";
  suspicious: boolean;
  tags: string[];
}

const LOG_ENTRIES: LogEntry[] = [
  {
    id: "log-001",
    timestamp: "2025-11-12T02:17:32",
    timeBucket: "overnight",
    user: "svc_boundary",
    action: "Download",
    location: "DMZ Edge Server 02",
    ipAddress: "178.34.22.9",
    device: "Headless Agent",
    detail: "Outbound transfer 480GB to unknown VPS",
    severity: "critical",
    suspicious: true,
    tags: ["exfiltration", "untrusted-endpoint"],
  },
  {
    id: "log-002",
    timestamp: "2025-11-12T02:22:04",
    timeBucket: "overnight",
    user: "svc_boundary",
    action: "Download",
    location: "DMZ Edge Server 02",
    ipAddress: "178.34.22.9",
    device: "Headless Agent",
    detail: "Outbound transfer 512GB to unknown VPS",
    severity: "critical",
    suspicious: true,
    tags: ["exfiltration", "repeat-pattern"],
  },
  {
    id: "log-003",
    timestamp: "2025-11-12T02:35:18",
    timeBucket: "overnight",
    user: "svc_boundary",
    action: "Download",
    location: "DMZ Edge Server 02",
    ipAddress: "178.34.22.9",
    device: "Headless Agent",
    detail: "Outbound transfer 540GB to unknown VPS",
    severity: "critical",
    suspicious: true,
    tags: ["exfiltration", "repeat-pattern"],
  },
  {
    id: "log-004",
    timestamp: "2025-11-11T15:47:08",
    timeBucket: "business",
    user: "alex.reeves",
    action: "Read",
    location: "Finance Data Lake",
    ipAddress: "10.24.16.19",
    device: "MacBook Pro",
    detail: "Accessed monthly revenue dashboard",
    severity: "low",
    suspicious: false,
    tags: ["finance", "report"],
  },
  {
    id: "log-005",
    timestamp: "2025-11-11T23:14:42",
    timeBucket: "offpeak",
    user: "maya.zhang",
    action: "Modify",
    location: "SOC Investigator Console",
    ipAddress: "10.21.8.4",
    device: "Secure Workstation",
    detail: "Added rule to flag high-volume outbound traffic",
    severity: "medium",
    suspicious: false,
    tags: ["rule-change", "soc"],
  },
  {
    id: "log-006",
    timestamp: "2025-11-12T03:12:01",
    timeBucket: "overnight",
    user: "camille.beaumont",
    action: "Delete",
    location: "Firewall Rule Engine",
    ipAddress: "10.12.11.5",
    device: "Secure Tablet",
    detail: "Removed legacy outbound whitelist entry",
    severity: "high",
    suspicious: false,
    tags: ["firewall", "cleanup"],
  },
  {
    id: "log-007",
    timestamp: "2025-11-11T20:35:56",
    timeBucket: "offpeak",
    user: "marcus.chen",
    action: "Write",
    location: "Network Diagram Repository",
    ipAddress: "10.42.21.33",
    device: "Windows Desktop",
    detail: "Uploaded new campus segmentation blueprint",
    severity: "medium",
    suspicious: false,
    tags: ["documentation", "network"],
  },
  {
    id: "log-008",
    timestamp: "2025-11-12T02:05:12",
    timeBucket: "overnight",
    user: "unknown",
    action: "Read",
    location: "HR Archive Node",
    ipAddress: "52.18.74.4",
    device: "Headless Agent",
    detail: "Bulk read request (32MB/s sustained)",
    severity: "high",
    suspicious: true,
    tags: ["anomaly", "unattributed"],
  },
  {
    id: "log-009",
    timestamp: "2025-11-11T08:15:27",
    timeBucket: "business",
    user: "olivia.brennan",
    action: "Read",
    location: "Incident Knowledge Base",
    ipAddress: "10.40.18.6",
    device: "iPad Pro",
    detail: "Reviewed prior breach response checklist",
    severity: "low",
    suspicious: false,
    tags: ["documentation", "training"],
  },
  {
    id: "log-010",
    timestamp: "2025-11-12T00:48:09",
    timeBucket: "overnight",
    user: "isabella.torres",
    action: "Download",
    location: "Research Cluster",
    ipAddress: "10.28.44.12",
    device: "Linux Workstation",
    detail: "Downloaded anomaly detection model artifact",
    severity: "medium",
    suspicious: false,
    tags: ["ml", "model"],
  },
  {
    id: "log-011",
    timestamp: "2025-11-11T18:04:48",
    timeBucket: "offpeak",
    user: "camille.beaumont",
    action: "Read",
    location: "Firewall Log Archive",
    ipAddress: "10.12.11.5",
    device: "Secure Tablet",
    detail: "Queried outbound transfer anomalies",
    severity: "medium",
    suspicious: false,
    tags: ["investigation", "firewall"],
  },
  {
    id: "log-012",
    timestamp: "2025-11-11T21:12:00",
    timeBucket: "offpeak",
    user: "kastor.ai",
    action: "Read",
    location: "Telemetry Stream",
    ipAddress: "loopback",
    device: "AI Agent",
    detail: "Gathering metrics for predictive breach score",
    severity: "low",
    suspicious: false,
    tags: ["ai", "monitoring"],
  },
  {
    id: "log-013",
    timestamp: "2025-11-11T09:32:05",
    timeBucket: "business",
    user: "hr.audit",
    action: "Read",
    location: "Personnel Records",
    ipAddress: "10.30.16.42",
    device: "Secure Workstation",
    detail: "Spot-check on privileged account activity",
    severity: "medium",
    suspicious: false,
    tags: ["audit", "compliance"],
  },
  {
    id: "log-014",
    timestamp: "2025-11-11T22:48:38",
    timeBucket: "offpeak",
    user: "svc_backup",
    action: "Write",
    location: "Cold Storage Vault",
    ipAddress: "10.50.10.2",
    device: "Backup Appliance",
    detail: "Completed scheduled delta backup (94GB)",
    severity: "low",
    suspicious: false,
    tags: ["backup"],
  },
  {
    id: "log-015",
    timestamp: "2025-11-12T03:09:51",
    timeBucket: "overnight",
    user: "unknown",
    action: "Delete",
    location: "Security Event Buffer",
    ipAddress: "178.34.22.9",
    device: "Headless Agent",
    detail: "Attempted to purge critical event indices",
    severity: "critical",
    suspicious: true,
    tags: ["tampering", "exfiltration"],
  },
];

interface PuzzlePattern {
  id: string;
  title: string;
  summary: string;
  requiredRows: string[];
  reward: number;
}

const PUZZLE_PATTERNS: PuzzlePattern[] = [
  {
    id: "pattern-exfiltration",
    title: "Overnight Massive Data Exfiltration",
    summary: "Account svc_boundary pushed hundreds of gigabytes to an untrusted VPS multiple times.",
    requiredRows: ["log-001", "log-002", "log-003"],
    reward: 40,
  },
  {
    id: "pattern-ghost-reader",
    title: "Ghost Endpoint Reconnaissance",
    summary: "An unidentified VPS (52.18.74.4) harvested HR archives at high speed.",
    requiredRows: ["log-008"],
    reward: 25,
  },
  {
    id: "pattern-cover-tracks",
    title: "Covering Their Tracks",
    summary: "The same external IP attempted to purge the security event buffer.",
    requiredRows: ["log-015"],
    reward: 35,
  },
];

const PUZZLE_HINTS = [
  "Check the same account activity between 02:00 and 03:30.",
  "Look for repeated appearances of external IPs 178.34.22.9 and 52.18.74.4.",
  "The anomaly unfolds in three steps: exfiltration, reconnaissance, and evidence removal.",
];

const USERS = Array.from(
  new Set(LOG_ENTRIES.map((entry) => entry.user).filter((name) => name !== "unknown")),
).sort();

const ACTION_TYPES: ActionType[] = ["Read", "Write", "Download", "Delete", "Modify"];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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
  max-width: 720px;
  line-height: 1.5;
`;

const ControlsShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(12, 18, 32, 0.85));
  padding: 1.2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(140px, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const SelectField = styled.select`
  appearance: none;
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.85rem;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 0.75rem;
    color: rgba(255, 255, 255, 0.45);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.85rem 0.65rem 2.35rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.85rem;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  justify-content: flex-end;
`;

const GhostButton = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.18s ease, transform 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    background: rgba(255, 255, 255, 0.06);
    transform: none;
  }
`;

const PrimaryButton = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #42a5f5);
  color: #ffffff;
  padding: 0.6rem 1.1rem;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  box-shadow: 0 12px 24px rgba(33, 150, 243, 0.25);
  transition: transform 0.18s ease;

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

const AlertBanner = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 77, 0, 0.18), rgba(10, 15, 26, 0.88));
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: left;
  }
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const AlertTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const AlertDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
  line-height: 1.4;
`;

const AlertActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`;

const AlertActionButton = styled.button<{ $variant?: "outline" | "solid" }>`
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 0.75rem;
  border: ${({ $variant }) => ($variant === "outline" ? "1px solid rgba(255, 255, 255, 0.35)" : "none")};
  background: ${({ $variant, theme }) =>
    $variant === "outline" ? "transparent" : `rgba(33, 150, 243, 0.28)`};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.45rem 0.85rem;
  font-size: 0.78rem;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;

  &:hover {
    background: ${({ $variant }) => ($variant === "outline" ? "rgba(255, 255, 255, 0.1)" : "rgba(33, 150, 243, 0.4)")};
    transform: translateY(-1px);
  }
`;

const TableShell = styled.div`
  border-radius: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableScroll = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  thead {
    background: rgba(255, 255, 255, 0.04);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.72rem;
  }
`;

const HeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: 0.85rem 1rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
  position: relative;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;

  &:hover {
    color: ${({ $sortable }) => ($sortable ? "#ffffff" : "inherit")};
  }
`;

const BodyRow = styled.tr<{ $suspicious?: boolean; $selected?: boolean }>`
  background: ${({ $selected }) => ($selected ? "rgba(33, 150, 243, 0.08)" : "transparent")};

  &:hover {
    background: ${({ $selected }) => ($selected ? "rgba(33, 150, 243, 0.12)" : "rgba(255, 255, 255, 0.04)")};
  }

  ${({ $suspicious, theme }) =>
    $suspicious &&
    `
    box-shadow: inset 2px 0 0 ${theme.colors.danger};
  `}
`;

const BodyCell = styled.td`
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.colors.white};
  vertical-align: middle;
  min-width: 120px;
  white-space: nowrap;

  &:first-child {
    width: 40px;
  }

  &:nth-child(2) {
    min-width: 160px;
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const SeverityBadge = styled.span<{ $severity: LogEntry["severity"] }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ $severity }) => {
    switch ($severity) {
      case "critical":
        return "rgba(244, 67, 54, 0.2)";
      case "high":
        return "rgba(255, 152, 0, 0.18)";
      case "medium":
        return "rgba(33, 150, 243, 0.16)";
      case "low":
      default:
        return "rgba(76, 175, 80, 0.2)";
    }
  }};
  color: ${({ $severity }) => {
    switch ($severity) {
      case "critical":
        return "#ff7961";
      case "high":
        return "#ffb74d";
      case "medium":
        return "#64b5f6";
      case "low":
      default:
        return "#81c784";
    }
  }};
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Tag = styled.span`
  padding: 0.2rem 0.55rem;
  border-radius: 0.65rem;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
`;

const EmptyState = styled.div`
  padding: 2.25rem 1.75rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.9rem;
`;

const TableFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const PaginationControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const PaginationButton = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.white};
  border-radius: 0.65rem;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
  transition: background 0.18s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const SelectionSummary = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

const Highlight = styled.mark`
  background: rgba(33, 150, 243, 0.25);
  color: ${({ theme }) => theme.colors.white};
  border-radius: 0.35rem;
  padding: 0.05rem 0.15rem;
`;

const ExpandToggle = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.lightGray};
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0;
`;

const ExpandedRow = styled.tr`
  background: rgba(255, 255, 255, 0.04);
`;

const ExpandedCell = styled.td`
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.82rem;
`;

const ExpandedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr));
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const ExpandedStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  background: rgba(0, 0, 0, 0.26);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.75rem;

  span:first-child {
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
  }

  span:last-child {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.white};
    word-break: break-word;
  }
`;

const ExpandedDetail = styled.div`
  margin-top: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const PuzzleShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(33, 150, 243, 0.14);
  background: linear-gradient(140deg, rgba(33, 150, 243, 0.12), rgba(10, 18, 30, 0.82));
  padding: 1.2rem 1.35rem;
`;

const PuzzleHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const PuzzleTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const PuzzleStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.78rem;

  strong {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const PuzzleProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(66, 165, 245, 0.85));
  border-radius: inherit;
  transition: width 0.35s ease;
`;

const PuzzleActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
`;

const HintList = styled.ul`
  margin: 0.25rem 0 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.78rem;
`;

const FeedbackToast = styled(motion.div)<{ $variant: "success" | "error" | "info" }>`
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "success"
        ? "rgba(76, 175, 80, 0.3)"
        : $variant === "error"
        ? "rgba(244, 67, 54, 0.35)"
        : "rgba(33, 150, 243, 0.28)"};
  background: ${({ $variant }) => {
    switch ($variant) {
      case "success":
        return "rgba(76, 175, 80, 0.15)";
      case "error":
        return "rgba(244, 67, 54, 0.18)";
      default:
        return "rgba(33, 150, 243, 0.16)";
    }
  }};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.85rem;
`;

const PuzzleCompleteBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(76, 175, 80, 0.35);
  background: rgba(76, 175, 80, 0.18);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.85rem 1rem;
  font-size: 0.88rem;
  font-weight: 600;
`;

const highlightText = (value: string, query: string) => {
  if (!query) return value;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const segments = value.split(regex);
  return segments.map((segment, index) =>
    index % 2 === 1 ? <Highlight key={`${segment}-${index}`}>{segment}</Highlight> : segment,
  );
};

const TIME_RANGE_FILTERS: Record<TimeRange, (entry: LogEntry, now: Date) => boolean> = {
  all: () => true,
  today: (entry, now) => {
    const entryDate = new Date(entry.timestamp);
    return (
      entryDate.getFullYear() === now.getFullYear() &&
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getDate() === now.getDate()
    );
  },
  yesterday: (entry, now) => {
    const entryDate = new Date(entry.timestamp);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return (
      entryDate.getFullYear() === yesterday.getFullYear() &&
      entryDate.getMonth() === yesterday.getMonth() &&
      entryDate.getDate() === yesterday.getDate()
    );
  },
  last7: (entry, now) => {
    const entryDate = new Date(entry.timestamp);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    return entryDate >= sevenDaysAgo && entryDate <= now;
  },
  overnight: (entry) => entry.timeBucket === "overnight",
};

function useDataFilters(entries: LogEntry[]) {
  const [userFilter, setUserFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<TimeRange>("overnight");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof LogEntry>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const now = useMemo(() => new Date("2025-11-12T03:30:00"), []);

  const filteredEntries = useMemo(() => {
    const filterFn = TIME_RANGE_FILTERS[timeFilter];
    const query = searchQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchUser = userFilter === "all" || entry.user === userFilter;
      const matchAction = actionFilter === "all" || entry.action === actionFilter;
      const matchTime = filterFn(entry, now);

      const matchQuery =
        query.length === 0 ||
        entry.user.toLowerCase().includes(query) ||
        entry.location.toLowerCase().includes(query) ||
        entry.detail.toLowerCase().includes(query) ||
        entry.ipAddress.toLowerCase().includes(query) ||
        entry.action.toLowerCase().includes(query);

      return matchUser && matchAction && matchTime && matchQuery;
    });
  }, [entries, userFilter, actionFilter, timeFilter, searchQuery, now]);

  const sortedEntries = useMemo(() => {
    const next = [...filteredEntries];
    next.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortColumn === "timestamp") {
        return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * direction;
      }
      if (typeof a[sortColumn] === "string" && typeof b[sortColumn] === "string") {
        return (a[sortColumn] as string).localeCompare(b[sortColumn] as string) * direction;
      }
      return 0;
    });
    return next;
  }, [filteredEntries, sortColumn, sortDirection]);

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedEntries = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [sortedEntries, safePage]);

  const suspiciousCount = filteredEntries.filter((entry) => entry.suspicious).length;
  const patternDetected = suspiciousCount >= 3 && filteredEntries.some((entry) => entry.timeBucket === "overnight");

  const toggleSort = (column: keyof LogEntry) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection(column === "timestamp" ? "desc" : "asc");
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedEntries.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedEntries.map((entry) => entry.id)));
    }
  };

  const clearSelection = () => setSelectedRows(new Set());

  const resetFilters = () => {
    setUserFilter("all");
    setTimeFilter("overnight");
    setActionFilter("all");
    setSearchQuery("");
    setSortColumn("timestamp");
    setSortDirection("desc");
    setCurrentPage(1);
    setExpandedRow(null);
    setSelectedRows(new Set());
  };

  return {
    state: {
      userFilter,
      timeFilter,
      actionFilter,
      searchQuery,
      sortColumn,
      sortDirection,
      currentPage: safePage,
      totalPages,
      expandedRow,
      selectedRows,
      pageSize,
    },
    data: {
      paginatedEntries,
      filteredEntries,
      patternDetected,
      suspiciousCount,
    },
    actions: {
      setUserFilter,
      setTimeFilter,
      setActionFilter,
      setSearchQuery,
      toggleSort,
      setCurrentPage,
      setExpandedRow,
      toggleRowSelection,
      toggleAllRows,
      clearSelection,
      resetFilters,
    },
  };
}

function formatTimestampToLocale(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DataView() {
  const {
    state: {
      userFilter,
      timeFilter,
      actionFilter,
      searchQuery,
      sortColumn,
      sortDirection,
      currentPage,
      totalPages,
      expandedRow,
      selectedRows,
      pageSize,
    },
    data: { paginatedEntries, filteredEntries, patternDetected, suspiciousCount },
    actions: {
      setUserFilter,
      setTimeFilter,
      setActionFilter,
      setSearchQuery,
      toggleSort,
      setCurrentPage,
      setExpandedRow,
        toggleRowSelection,
        toggleAllRows,
        clearSelection,
        resetFilters,
    },
  } = useDataFilters(LOG_ENTRIES);
  const [foundPatternIds, setFoundPatternIds] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [puzzlePoints, setPuzzlePoints] = useState(75);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error" | "info"; message: string } | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const selectedCount = selectedRows.size;
  const puzzleProgress = Math.round((foundPatternIds.length / PUZZLE_PATTERNS.length) * 100);
  const puzzleComplete = foundPatternIds.length === PUZZLE_PATTERNS.length;
  const patternsRemaining = PUZZLE_PATTERNS.length - foundPatternIds.length;
  const revealedHints = PUZZLE_HINTS.slice(0, hintLevel);

  const handleExportCsv = () => {
    if (filteredEntries.length === 0) return;
    const header = "Timestamp,User,Action,Location,IP Address,Device,Severity,Suspicious,Detail\n";
    const rows = filteredEntries
      .map((entry) =>
        [
          entry.timestamp,
          entry.user,
          entry.action,
          `"${entry.location}"`,
          entry.ipAddress,
          `"${entry.device}"`,
          entry.severity,
          entry.suspicious ? "YES" : "NO",
          `"${entry.detail.replace(/"/g, '""')}"`,
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `kastor-log-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleRevealHint = () => {
    if (hintLevel >= PUZZLE_HINTS.length) {
      setFeedback({ variant: "info", message: "All available hints have already been revealed." });
      return;
    }
    setHintLevel((prev) => prev + 1);
    setHintsUsed((prev) => prev + 1);
    setPuzzlePoints((prev) => Math.max(0, prev - 10));
    const nextIndex = hintLevel;
    setFeedback({ variant: "info", message: `Hint ${nextIndex + 1}: ${PUZZLE_HINTS[nextIndex]}` });
  };

  const handleResetSelection = () => {
    if (selectedRows.size === 0) return;
    clearSelection();
    setExpandedRow(null);
    setFeedback({ variant: "info", message: "Cleared the current log selection." });
  };

  const handleSubmitSelection = () => {
    if (puzzleComplete) {
      setFeedback({ variant: "info", message: "All patterns have already been solved. Outstanding work!" });
      return;
    }

    const selectedIds = Array.from(selectedRows);
    if (selectedIds.length === 0) {
      setFeedback({ variant: "error", message: "Select at least one log you believe belongs to a pattern." });
      return;
    }

    const matchedPattern = PUZZLE_PATTERNS.find(
      (pattern) =>
        !foundPatternIds.includes(pattern.id) &&
        pattern.requiredRows.every((rowId) => selectedRows.has(rowId)),
    );

    if (matchedPattern) {
      setFoundPatternIds((prev) => [...prev, matchedPattern.id]);
      setPuzzlePoints((prev) => prev + matchedPattern.reward);
      setFeedback({
        variant: "success",
        message: `Pattern confirmed: ${matchedPattern.title}. ${matchedPattern.summary}`,
      });
      clearSelection();
      setExpandedRow(null);
    } else {
      setPuzzlePoints((prev) => Math.max(0, prev - 5));
      setFeedback({
        variant: "error",
        message: "That combination didn't match a known pattern. Try a different set of logs.",
      });
    }
  };

  return (
    <Wrapper>
      <Header>
        <TitleRow>
          <Title>Incident Data Console</Title>
          <GhostButton onClick={resetFilters}>
            <Filter size={16} />
            Reset to Default Filters
          </GhostButton>
        </TitleRow>
        <Subtitle>
          Filter the SOC log stream, flag anomalies, and gather evidence that feeds the next puzzle step.
        </Subtitle>
      </Header>

      <ControlsShell>
        <FiltersRow>
          <SearchField>
            <Search size={16} />
            <Input
              value={searchQuery}
              placeholder="Search user, location, or details..."
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search logs"
            />
          </SearchField>
          <SelectField
            value={userFilter}
            onChange={(event) => {
              setUserFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="User filter"
          >
            <option value="all">All users</option>
            {USERS.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={timeFilter}
            onChange={(event) => {
              setTimeFilter(event.target.value as TimeRange);
              setCurrentPage(1);
            }}
            aria-label="Time range filter"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7">Last 7 days</option>
            <option value="overnight">Overnight activity (00:00-04:00)</option>
          </SelectField>
          <SelectField
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Action filter"
          >
            <option value="all">All actions</option>
            {ACTION_TYPES.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={sortColumn}
            onChange={(event) => toggleSort(event.target.value as keyof LogEntry)}
            aria-label="Sort column"
          >
            <option value="timestamp">Sort by time</option>
            <option value="user">Sort by user</option>
            <option value="action">Sort by action</option>
            <option value="location">Sort by location</option>
          </SelectField>
        </FiltersRow>

        <ActionsRow>
          <GhostButton onClick={() => setTimeFilter("overnight")}>
            <AlertTriangle size={16} />
            Focus on overnight anomalies
          </GhostButton>
          <GhostButton onClick={() => setSearchQuery("")}>
            <RefreshCw size={16} />
            Clear search
          </GhostButton>
          <PrimaryButton onClick={handleExportCsv}>
            <Download size={16} />
            Export CSV
          </PrimaryButton>
        </ActionsRow>
      </ControlsShell>

      <PuzzleShell>
        <PuzzleHeader>
          <PuzzleTitle>
            <h3>Pattern Detection Puzzle</h3>
            <span>Identify suspicious overnight activity to unlock the next investigative step.</span>
          </PuzzleTitle>
          <PuzzleStats>
            <span>
              Patterns found: <strong>{foundPatternIds.length}</strong> / {PUZZLE_PATTERNS.length}
            </span>
            <span>
              Selected logs: <strong>{selectedCount}</strong>
            </span>
            <span>
              Current score: <strong>{puzzlePoints} XP</strong>
            </span>
            {hintsUsed > 0 && (
              <span>
                Hints used: <strong>{hintsUsed}</strong>
              </span>
            )}
          </PuzzleStats>
        </PuzzleHeader>
        <PuzzleProgress>
          <ProgressTrack>
            <ProgressFill $percent={puzzleProgress} />
          </ProgressTrack>
          <PuzzleStats>
            {puzzleComplete ? (
              <strong>Excellent! Every suspicious pattern has been uncovered.</strong>
            ) : (
              <span>{patternsRemaining} pattern(s) remaining - Select logs and submit to validate your theory.</span>
            )}
          </PuzzleStats>
        </PuzzleProgress>
        <PuzzleActions>
          <PrimaryButton type="button" onClick={handleSubmitSelection} disabled={puzzleComplete}>
            <Sparkles size={16} />
            Validate Pattern From Selection
          </PrimaryButton>
          <GhostButton type="button" onClick={handleRevealHint} disabled={hintLevel >= PUZZLE_HINTS.length}>
            <Info size={16} />
            Reveal Hint {hintLevel >= PUZZLE_HINTS.length ? "(all used)" : ""}
          </GhostButton>
          <GhostButton type="button" onClick={handleResetSelection} disabled={selectedCount === 0}>
            <RefreshCw size={16} />
            Clear Selection
          </GhostButton>
        </PuzzleActions>
        {hintLevel > 0 && (
          <HintList>
            {revealedHints.map((hint, index) => (
              <li key={hint}>
                <strong>Hint {index + 1}.</strong> {hint}
              </li>
            ))}
          </HintList>
        )}
        <AnimatePresence>
          {feedback && (
            <FeedbackToast
              key={feedback.message}
              $variant={feedback.variant}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {feedback.variant === "success" ? (
                <Sparkles size={18} />
              ) : feedback.variant === "error" ? (
                <AlertTriangle size={18} />
              ) : (
                <Info size={18} />
              )}
              <span>{feedback.message}</span>
            </FeedbackToast>
          )}
        </AnimatePresence>
          <AnimatePresence>
            {puzzleComplete && (
              <PuzzleCompleteBanner
                key="puzzle-complete"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
              >
                <Sparkles size={18} />
                All anomaly patterns confirmed! Kastor is ready to move to the next phase.
              </PuzzleCompleteBanner>
            )}
          </AnimatePresence>
        </PuzzleShell>

        <AnimatePresence>
          {patternDetected && (
            <AlertBanner
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 28 } }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertTriangle size={28} color="#ffb74d" />
              <AlertContent>
                <AlertTitle>Pattern detected: Overnight bulk transfer</AlertTitle>
                <AlertDescription>
                  Service account <strong>svc_boundary</strong> sent more than 400 GB three times within 15 minutes to
                  178.34.22.9. Volume exceeds the baseline by 310%, followed by an attempt to wipe event buffers.
                </AlertDescription>
              </AlertContent>
              <AlertActions>
                <AlertActionButton $variant="outline">
                  <Info size={14} />
                  View detailed logs
                </AlertActionButton>
                <AlertActionButton>
                  <ArrowRight size={14} />
                  Ask Kastor for guidance
                </AlertActionButton>
              </AlertActions>
            </AlertBanner>
          )}
        </AnimatePresence>

        <TableShell>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <HeaderCell>
                  <Checkbox
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={selectedRows.size === paginatedEntries.length && paginatedEntries.length > 0}
                    onChange={toggleAllRows}
                  />
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("timestamp")}>
                  Timestamp {sortColumn === "timestamp" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("user")}>
                  User {sortColumn === "user" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("action")}>
                  Action {sortColumn === "action" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("location")}>
                  Location {sortColumn === "location" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell>Severity</HeaderCell>
                <HeaderCell>Tags</HeaderCell>
                <HeaderCell>Details</HeaderCell>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length === 0 && (
                <tr>
                  <BodyCell colSpan={8}>
                    <EmptyState>
                      No logs match the current filters. Broaden the filters or try a different keyword search.
                    </EmptyState>
                  </BodyCell>
                </tr>
              )}
              {paginatedEntries.map((entry) => {
                const isExpanded = expandedRow === entry.id;
                const isSelected = selectedRows.has(entry.id);
                return (
                  <Fragment key={entry.id}>
                    <BodyRow $suspicious={entry.suspicious} $selected={isSelected}>
                      <BodyCell>
                        <Checkbox
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(entry.id)}
                            aria-label={`Select row for ${entry.user}`}
                        />
                      </BodyCell>
                      <BodyCell>{formatTimestampToLocale(entry.timestamp)}</BodyCell>
                      <BodyCell>{highlightText(entry.user, searchQuery)}</BodyCell>
                      <BodyCell>{entry.action}</BodyCell>
                      <BodyCell>{highlightText(entry.location, searchQuery)}</BodyCell>
                      <BodyCell>
                        <SeverityBadge $severity={entry.severity}>
                          {entry.severity.toUpperCase()}
                          {entry.suspicious && <AlertTriangle size={12} />}
                        </SeverityBadge>
                      </BodyCell>
                      <BodyCell>
                        <TagList>
                          {entry.tags.map((tag) => (
                            <Tag key={`${entry.id}-${tag}`}>{tag}</Tag>
                          ))}
                        </TagList>
                      </BodyCell>
                        <BodyCell>
                          <ExpandToggle onClick={() => toggleExpand(entry.id)} aria-label="Toggle detailed view">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            <span style={{ marginLeft: "0.35rem" }}>{entry.detail.slice(0, 36)}...</span>
                          </ExpandToggle>
                        </BodyCell>
                    </BodyRow>
                    {isExpanded && (
                      <ExpandedRow>
                        <ExpandedCell colSpan={8}>
                          <ExpandedGrid>
                            <ExpandedStat>
                                <span>IP Address</span>
                              <span>{highlightText(entry.ipAddress, searchQuery)}</span>
                            </ExpandedStat>
                            <ExpandedStat>
                                <span>Device</span>
                              <span>{entry.device}</span>
                            </ExpandedStat>
                            <ExpandedStat>
                                <span>Time Window</span>
                              <span>
                                  {entry.timeBucket === "overnight"
                                    ? "Overnight (00:00-04:00)"
                                    : entry.timeBucket === "business"
                                    ? "Business hours (09:00-18:00)"
                                    : "Off-peak (18:00-00:00)"}
                              </span>
                            </ExpandedStat>
                          </ExpandedGrid>
                          <ExpandedDetail>
                              <strong>Details:</strong> {highlightText(entry.detail, searchQuery)}
                          </ExpandedDetail>
                        </ExpandedCell>
                      </ExpandedRow>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </TableScroll>

        <TableFooter>
          <SelectionSummary>
              Showing {paginatedEntries.length} of {filteredEntries.length} entries - {pageSize} per page
            {selectedRows.size > 0 && (
              <>
                <span>|</span>
                  <strong>{selectedRows.size}</strong> selected
                <GhostButton onClick={clearSelection}>
                  <XCircle size={14} />
                    Clear selection
                </GhostButton>
              </>
            )}
            {suspiciousCount > 0 && (
              <>
                <span>|</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <AlertTriangle size={14} color="#ffb74d" />
                    {suspiciousCount} suspicious log(s)
                </span>
              </>
            )}
          </SelectionSummary>
          <PaginationControls>
            <PaginationButton onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                First
            </PaginationButton>
            <PaginationButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Prev
            </PaginationButton>
            <span>
              {currentPage} / {totalPages}
            </span>
            <PaginationButton onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </PaginationButton>
            <PaginationButton onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                Last
            </PaginationButton>
          </PaginationControls>
        </TableFooter>
      </TableShell>
    </Wrapper>
  );
}

export default DataView;
