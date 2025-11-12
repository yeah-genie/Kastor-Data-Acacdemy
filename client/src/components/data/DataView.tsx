import { Fragment, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Download, Filter, Info, RefreshCw, Search } from "lucide-react";
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
  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
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

  return (
    <Wrapper>
      <Header>
        <TitleRow>
          <Title>데이터 분석 콘솔</Title>
          <GhostButton onClick={resetFilters}>
            <Filter size={16} />
            기본 필터로 초기화
          </GhostButton>
        </TitleRow>
        <Subtitle>
          SOC가 수집한 로그 스트림을 빠르게 필터링하고, 이상 징후를 감지하며, 다음 퍼즐에 대비할 근거를 확보하세요.
        </Subtitle>
      </Header>

      <ControlsShell>
        <FiltersRow>
          <SearchField>
            <Search size={16} />
            <Input
              value={searchQuery}
              placeholder="사용자, 위치, 상세 내용 검색..."
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="로그 검색"
            />
          </SearchField>
          <SelectField
            value={userFilter}
            onChange={(event) => {
              setUserFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="사용자 필터"
          >
            <option value="all">전체 사용자</option>
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
            aria-label="시간 범위 필터"
          >
            <option value="all">전체 기간</option>
            <option value="today">오늘</option>
            <option value="yesterday">어제</option>
            <option value="last7">최근 7일</option>
            <option value="overnight">심야 활동 (00:00~04:00)</option>
          </SelectField>
          <SelectField
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="행동 유형 필터"
          >
            <option value="all">모든 액션</option>
            {ACTION_TYPES.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={sortColumn}
            onChange={(event) => toggleSort(event.target.value as keyof LogEntry)}
            aria-label="정렬 기준"
          >
            <option value="timestamp">시간순 정렬</option>
            <option value="user">사용자</option>
            <option value="action">행동</option>
            <option value="location">위치</option>
          </SelectField>
        </FiltersRow>

        <ActionsRow>
          <GhostButton onClick={() => setTimeFilter("overnight")}>
            <AlertTriangle size={16} />
            심야 이상 징후 보기
          </GhostButton>
          <GhostButton onClick={() => setSearchQuery("")}>
            <RefreshCw size={16} />
            검색어 지우기
          </GhostButton>
          <PrimaryButton onClick={handleExportCsv}>
            <Download size={16} />
            CSV 내보내기
          </PrimaryButton>
        </ActionsRow>
      </ControlsShell>

      <AnimatePresence>
        {patternDetected && (
          <AlertBanner
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 28 } }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertTriangle size={28} color="#ffb74d" />
            <AlertContent>
              <AlertTitle>패턴 감지: 심야 대용량 데이터 전송</AlertTitle>
              <AlertDescription>
                동일 서비스 계정이 15분 간격으로 3회 이상 400GB 이상의 데이터를 외부 IP(178.34.22.9)로 전송했습니다.
                기존 평소 대비 310% 초과량이며, 전송 후 이벤트 버퍼 삭제 시도가 확인되었습니다.
              </AlertDescription>
            </AlertContent>
            <AlertActions>
              <AlertActionButton $variant="outline">
                <Info size={14} />
                세부 로그 분석
              </AlertActionButton>
              <AlertActionButton>
                <ArrowRight size={14} />
                Kastor에게 질문하기
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
                    aria-label="모든 행 선택"
                    checked={selectedRows.size === paginatedEntries.length && paginatedEntries.length > 0}
                    onChange={toggleAllRows}
                  />
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("timestamp")}>
                  타임스탬프 {sortColumn === "timestamp" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("user")}>
                  사용자 {sortColumn === "user" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("action")}>
                  액션 {sortColumn === "action" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell $sortable onClick={() => toggleSort("location")}>
                  위치 {sortColumn === "location" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </HeaderCell>
                <HeaderCell>심각도</HeaderCell>
                <HeaderCell>태그</HeaderCell>
                <HeaderCell>세부 정보</HeaderCell>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length === 0 && (
                <tr>
                  <BodyCell colSpan={8}>
                    <EmptyState>
                      조건에 맞는 로그가 없습니다. 필터 범위를 넓히거나 다른 키워드를 시도해 보세요.
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
                          aria-label={`${entry.user} 행 선택`}
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
                        <ExpandToggle onClick={() => toggleExpand(entry.id)} aria-label="세부 내용 펼치기">
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
                              <span>IP 주소</span>
                              <span>{highlightText(entry.ipAddress, searchQuery)}</span>
                            </ExpandedStat>
                            <ExpandedStat>
                              <span>사용 디바이스</span>
                              <span>{entry.device}</span>
                            </ExpandedStat>
                            <ExpandedStat>
                              <span>시간 구간</span>
                              <span>
                                {entry.timeBucket === "overnight"
                                  ? "심야(00:00-04:00)"
                                  : entry.timeBucket === "business"
                                  ? "주간(09:00-18:00)"
                                  : "야간(18:00-00:00)"}
                              </span>
                            </ExpandedStat>
                          </ExpandedGrid>
                          <ExpandedDetail>
                            <strong>세부 설명:</strong> {highlightText(entry.detail, searchQuery)}
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
            총 {filteredEntries.length}개 중 {paginatedEntries.length}개 표시 • 페이지당 {pageSize}건
            {selectedRows.size > 0 && (
              <>
                <span>|</span>
                <strong>{selectedRows.size}</strong>개 선택됨
                <GhostButton onClick={clearSelection}>
                  <XCircle size={14} />
                  선택 해제
                </GhostButton>
              </>
            )}
            {suspiciousCount > 0 && (
              <>
                <span>|</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <AlertTriangle size={14} color="#ffb74d" />
                  의심 로그 {suspiciousCount}건
                </span>
              </>
            )}
          </SelectionSummary>
          <PaginationControls>
            <PaginationButton onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              처음
            </PaginationButton>
            <PaginationButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              이전
            </PaginationButton>
            <span>
              {currentPage} / {totalPages}
            </span>
            <PaginationButton onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              다음
            </PaginationButton>
            <PaginationButton onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              끝
            </PaginationButton>
          </PaginationControls>
        </TableFooter>
      </TableShell>
    </Wrapper>
  );
}

export default DataView;
