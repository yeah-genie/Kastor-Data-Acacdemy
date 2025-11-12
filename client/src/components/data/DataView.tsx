import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  Filter,
  RefreshCw,
  Download,
  AlertTriangle,
  Sparkles,
  Clock,
  MapPin,
  User,
  BarChart2,
} from "lucide-react";

type ActionType = "Read" | "Write" | "Download" | "Delete";

interface LogRow {
  id: string;
  timestamp: string;
  user: string;
  action: ActionType;
  location: string;
  bytes: number;
  suspicious: boolean;
  details: string;
  tags: string[];
}

const sampleLogs: LogRow[] = [
  {
    id: "log-001",
    timestamp: "2024-08-21T02:57:12Z",
    user: "isabella.torres",
    action: "Read",
    location: "VPN Gateway",
    bytes: 24576,
    suspicious: false,
    details: "Authentication success from remote workstation.",
    tags: ["auth", "vpn"],
  },
  {
    id: "log-002",
    timestamp: "2024-08-21T02:58:03Z",
    user: "isabella.torres",
    action: "Write",
    location: "R&D Secure Storage",
    bytes: 1258291,
    suspicious: true,
    details: "Privilege escalation to ADMIN role (admin-core-01).",
    tags: ["privilege", "admin"],
  },
  {
    id: "log-003",
    timestamp: "2024-08-21T03:00:18Z",
    user: "isabella.torres",
    action: "Download",
    location: "R&D Secure Storage",
    bytes: 1288490188,
    suspicious: true,
    details: "Bulk export triggered for folder /projects/atlas/datasets.",
    tags: ["export", "bulk-transfer"],
  },
  {
    id: "log-004",
    timestamp: "2024-08-21T01:42:55Z",
    user: "alex.reeves",
    action: "Read",
    location: "Incident Knowledge Base",
    bytes: 4096,
    suspicious: false,
    details: "Reference lookup for incident response playbooks.",
    tags: ["knowledge-base"],
  },
  {
    id: "log-005",
    timestamp: "2024-08-20T22:14:29Z",
    user: "camille.beaumont",
    action: "Write",
    location: "SOC Ticketing",
    bytes: 8192,
    suspicious: false,
    details: "Incident triage notes updated.",
    tags: ["ticketing"],
  },
  {
    id: "log-006",
    timestamp: "2024-08-21T03:01:44Z",
    user: "system",
    action: "Delete",
    location: "Audit Trail",
    bytes: 1024,
    suspicious: true,
    details: "Automated cleanup job cancelled abruptly.",
    tags: ["automation", "anomaly"],
  },
  {
    id: "log-007",
    timestamp: "2024-08-21T02:59:30Z",
    user: "isabella.torres",
    action: "Read",
    location: "Secrets Vault",
    bytes: 12288,
    suspicious: true,
    details: "Secrets vault accessed minutes before bulk export.",
    tags: ["vault", "credential"],
  },
  {
    id: "log-008",
    timestamp: "2024-08-19T11:43:00Z",
    user: "maya.zhang",
    action: "Read",
    location: "Executive Dashboard",
    bytes: 16384,
    suspicious: false,
    details: "Routine KPI review.",
    tags: ["dashboard"],
  },
  {
    id: "log-009",
    timestamp: "2024-08-21T03:03:09Z",
    user: "isabella.torres",
    action: "Download",
    location: "R&D Secure Storage",
    bytes: 943718400,
    suspicious: true,
    details: "Continuation of bulk transfer session (chunk #2).",
    tags: ["export", "bulk-transfer"],
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.75rem;
  gap: 1.5rem;
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(180deg, rgba(32, 38, 58, 0.4), transparent);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.25rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Heading = styled.h2`
  margin: 0;
  font-size: clamp(1.6rem, 2vw, 2.1rem);
  font-family: ${({ theme }) => theme.fonts.heading};
  letter-spacing: 0.01em;
`;

const SubHeading = styled.p`
  margin: 0;
  max-width: 540px;
  color: ${({ theme }) => theme.colors.lightGray};
  line-height: 1.5;
`;

const FilterPanel = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  background: rgba(16, 20, 32, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.35rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.65rem 0.75rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.65rem 0.75rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  font-family: ${({ theme }) => theme.fonts.body};

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
  align-items: center;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  border-radius: 12px;
  border: ${({ $variant, theme }) =>
    $variant === "ghost" ? "1px solid rgba(255,255,255,0.1)" : "none"};
  background: ${({ $variant, theme }) =>
    $variant === "ghost" ? "rgba(255,255,255,0.04)" : theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 25px rgba(33, 150, 243, 0.25);
  }
`;

const TableContainer = styled.div`
  position: relative;
  flex: 1;
  background: rgba(17, 19, 29, 0.78);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
  font-size: 0.92rem;
`;

const TH = styled.th<{ $sortable?: boolean }>`
  padding: 0.85rem 1rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  font-weight: 600;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.8);
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 25%;
    bottom: 25%;
    width: 1px;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TR = styled.tr<{ $highlight?: boolean; $selected?: boolean }>`
  background: ${({ $highlight, $selected }) =>
    $selected
      ? "rgba(33, 150, 243, 0.18)"
      : $highlight
        ? "rgba(255, 255, 255, 0.04)"
        : "transparent"};
  transition: background 0.18s ease;

  &:hover {
    background: rgba(33, 150, 243, 0.12);
  }
`;

const TD = styled.td`
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: top;
`;

const SuspiciousBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(244, 67, 54, 0.16);
  color: #ff8a80;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.16);
`;

const PaginationButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.07);
  color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Highlighted = styled.span`
  background: rgba(33, 150, 243, 0.35);
  border-radius: 4px;
  padding: 0 0.1rem;
`;

const AlertBanner = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.22), rgba(255, 152, 0, 0.15));
  border: 1px solid rgba(255, 152, 0, 0.35);
  border-radius: 16px;
  padding: 1.1rem 1.3rem;
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: ${({ theme }) => theme.colors.white};
`;

const DetailRow = styled(motion.tr)`
  background: rgba(17, 24, 33, 0.85);
`;

const DetailCell = styled.td`
  padding: 1rem 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.6rem;
  background: rgba(33, 150, 243, 0.15);
  border-radius: 999px;
  color: rgba(155, 196, 255, 0.9);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const ComparisonPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 0.9rem 1.1rem;
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.85rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 3rem 1.5rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.95rem;
`;

const SkeletonRow = styled.div`
  height: 56px;
  width: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  background-size: 400% 100%;
  animation: shimmer 1.6s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -200% 0%;
    }
  }
`;

const highlightText = (value: string, query: string) => {
  if (!query.trim()) return value;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return value.split(regex).map((part, index) =>
    index % 2 === 1 ? <Highlighted key={`${part}-${index}`}>{part}</Highlighted> : part,
  );
};

const rowsPerPage = 50;

export const DataView = () => {
  const [inputFilters, setInputFilters] = useState({
    user: "all",
    timeRange: "last-hour",
    action: "all",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(inputFilters);
  const [sortConfig, setSortConfig] = useState<{ key: keyof LogRow; direction: "asc" | "desc" }>({
    key: "timestamp",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [patternDetected, setPatternDetected] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const applyFilters = (rows: LogRow[], filters = appliedFilters) => {
    const { user, timeRange, action, search } = filters;
    const searchLower = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesUser = user === "all" || row.user === user;
      const matchesAction = action === "all" || row.action === action;

      let matchesTime = true;
      if (timeRange !== "all") {
        const logTime = new Date(row.timestamp).getTime();
        const now = new Date("2024-08-21T03:10:00Z").getTime();
        const hourMs = 60 * 60 * 1000;
        const dayMs = 24 * hourMs;
        if (timeRange === "last-hour") {
          matchesTime = now - logTime <= hourMs;
        } else if (timeRange === "today") {
          matchesTime = now - logTime <= dayMs;
        } else if (timeRange === "week") {
          matchesTime = now - logTime <= dayMs * 7;
        }
      }

      const matchesSearch =
        !searchLower ||
        [row.user, row.location, row.details, row.tags.join(" "), row.action]
          .join(" ")
          .toLowerCase()
          .includes(searchLower);

      return matchesUser && matchesAction && matchesTime && matchesSearch;
    });
  };

  const filteredRows = useMemo(() => applyFilters(sampleLogs), [appliedFilters]);

  useEffect(() => {
    const suspiciousBurst = filteredRows.filter(
      (row) =>
        row.user === "isabella.torres" &&
        new Date(row.timestamp).getUTCHours() >= 2 &&
        new Date(row.timestamp).getUTCHours() <= 4 &&
        row.action === "Download",
    );
    const detected = suspiciousBurst.length >= 2;
    setPatternDetected(detected);
    setAlertVisible(detected);
  }, [filteredRows]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (key === "timestamp") {
        return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * direction;
      }
      if (key === "bytes") {
        return (a.bytes - b.bytes) * direction;
      }
      return String(a[key]).localeCompare(String(b[key])) * direction;
    });
    return rows;
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const pageStart = (currentPage - 1) * rowsPerPage;
  const visibleRows = sortedRows.slice(pageStart, pageStart + rowsPerPage);

  const toggleSort = (key: keyof LogRow) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleApplyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedFilters(inputFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const defaults = {
      user: "all",
      timeRange: "last-hour",
      action: "all",
      search: "",
    };
    setInputFilters(defaults);
    setAppliedFilters(defaults);
    setCurrentPage(1);
  };

  const handleRowClick = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const toggleSelectRow = (id: string) => {
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

  const handleExport = () => {
    const headers = ["timestamp", "user", "action", "location", "bytes", "suspicious", "details"];
    const rows = filteredRows.map((row) =>
      [
        row.timestamp,
        row.user,
        row.action,
        row.location,
        row.bytes,
        row.suspicious ? "TRUE" : "FALSE",
        row.details.replace(/\n/g, " "),
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "log-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Header>
        <TitleBlock>
          <Heading>Security Log Analytics</Heading>
          <SubHeading>
            필터를 조정해 의심스러운 패턴을 찾아보세요. 패턴이 감지되면 Kastor가 추가 단서를 제시합니다.
          </SubHeading>
        </TitleBlock>
        <Actions>
          <ActionButton type="button" $variant="ghost" onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </ActionButton>
        </Actions>
      </Header>

      <FilterPanel onSubmit={handleApplyFilters}>
        <Field>
          담당자
          <Select
            value={inputFilters.user}
            onChange={(event) => setInputFilters((prev) => ({ ...prev, user: event.target.value }))}
          >
            <option value="all">All analysts</option>
            <option value="isabella.torres">isabella.torres</option>
            <option value="camille.beaumont">camille.beaumont</option>
            <option value="alex.reeves">alex.reeves</option>
            <option value="maya.zhang">maya.zhang</option>
            <option value="system">system</option>
          </Select>
        </Field>

        <Field>
          시간 범위
          <Select
            value={inputFilters.timeRange}
            onChange={(event) =>
              setInputFilters((prev) => ({ ...prev, timeRange: event.target.value }))
            }
          >
            <option value="last-hour">Last 1 hour</option>
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="all">All</option>
          </Select>
        </Field>

        <Field>
          액션 타입
          <Select
            value={inputFilters.action}
            onChange={(event) =>
              setInputFilters((prev) => ({ ...prev, action: event.target.value }))
            }
          >
            <option value="all">All actions</option>
            <option value="Read">Read</option>
            <option value="Write">Write</option>
            <option value="Download">Download</option>
            <option value="Delete">Delete</option>
          </Select>
        </Field>

        <Field>
          검색
          <SearchInput
            placeholder="사용자, 위치, 태그, 세부사항 검색"
            value={inputFilters.search}
            onChange={(event) =>
              setInputFilters((prev) => ({ ...prev, search: event.target.value }))
            }
          />
        </Field>

        <Actions>
          <ActionButton type="submit">
            <Filter size={16} />
            Apply
          </ActionButton>
          <ActionButton type="button" $variant="ghost" onClick={handleResetFilters}>
            <RefreshCw size={16} />
            Reset
          </ActionButton>
        </Actions>
      </FilterPanel>

      <AnimatePresence>
        {alertVisible && (
          <AlertBanner
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <AlertTriangle color="#ffb74d" size={28} />
            <AlertContent>
              <strong>패턴 감지!</strong>
              <span>
                admin-core-01 계정으로 새벽 시간대 대량 다운로드가 반복되고 있습니다.
                Credentials 탈취 가능성이 높습니다.
              </span>
              <Actions>
                <ActionButton type="button" $variant="ghost" onClick={() => setAlertVisible(false)}>
                  무시
                </ActionButton>
                <ActionButton type="button">
                  <Sparkles size={16} />
                  Ask Kastor
                </ActionButton>
              </Actions>
            </AlertContent>
          </AlertBanner>
        )}
      </AnimatePresence>

      <TableContainer>
        <TableScroll>
          <StyledTable>
            <thead>
              <tr>
                <TH $sortable onClick={() => toggleSort("timestamp")}>
                  Timestamp {sortConfig.key === "timestamp" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TH>
                <TH $sortable onClick={() => toggleSort("user")}>User</TH>
                <TH>Action</TH>
                <TH>Location</TH>
                <TH $sortable onClick={() => toggleSort("bytes")}>Bytes</TH>
                <TH>Flags</TH>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td colSpan={6}>
                        <SkeletonRow />
                      </td>
                    </tr>
                  ))
                : visibleRows.map((row) => {
                    const isSelected = selectedRows.has(row.id);
                    return (
                      <Fragment key={row.id}>
                        <TR
                          $highlight={row.suspicious}
                          $selected={isSelected}
                          onClick={() => handleRowClick(row.id)}
                        >
                          <TD>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                              <span style={{ fontWeight: 600 }}>
                                {new Date(row.timestamp).toLocaleString("en-GB", {
                                  hour12: false,
                                })}
                              </span>
                              <small style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                <Clock size={12} />
                                {new Date(row.timestamp).toUTCString()}
                              </small>
                            </div>
                          </TD>
                          <TD>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                              <User size={14} />
                              <strong>{row.user}</strong>
                            </div>
                          </TD>
                          <TD>
                            <span style={{ fontWeight: 600 }}>{row.action}</span>
                          </TD>
                          <TD>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                              <MapPin size={14} />
                              {highlightText(row.location, appliedFilters.search)}
                            </div>
                          </TD>
                          <TD>{(row.bytes / (1024 * 1024)).toFixed(2)} MB</TD>
                          <TD>
                            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                              {row.suspicious && (
                                <SuspiciousBadge>
                                  <AlertTriangle size={13} />
                                  Suspicious
                                </SuspiciousBadge>
                              )}
                              {row.tags.slice(0, 2).map((tag) => (
                                <Tag key={`${row.id}-${tag}`}>{tag}</Tag>
                              ))}
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleSelectRow(row.id);
                                }}
                                style={{
                                  border: "none",
                                  background: "rgba(33,150,243,0.1)",
                                  color: "rgba(187,222,251,0.9)",
                                  fontSize: "0.75rem",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "999px",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                {isSelected ? "Selected" : "Compare"}
                              </button>
                            </div>
                          </TD>
                        </TR>
                        <AnimatePresence>
                          {expandedRow === row.id && (
                            <DetailRow
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <DetailCell colSpan={6}>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "0.8rem",
                                    marginBottom: "0.8rem",
                                  }}
                                >
                                  <span>
                                    <strong>Details</strong>
                                    <br />
                                    {highlightText(row.details, appliedFilters.search)}
                                  </span>
                                  <span>
                                    <strong>Session Size</strong>
                                    <br />
                                    {(row.bytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                                  </span>
                                  <span>
                                    <strong>Tags</strong>
                                    <br />
                                    {row.tags.map((tag) => (
                                      <Tag key={`${row.id}-expanded-${tag}`}>{tag}</Tag>
                                    ))}
                                  </span>
                                </div>
                                <ComparisonPanel>
                                  <strong>참고</strong>
                                  <span>
                                    {row.user} 사용자가 최근 10분간 {row.action.toLowerCase()} 이벤트를{" "}
                                    {filteredRows.filter((item) => item.user === row.user).length}회
                                    실행했습니다.
                                  </span>
                                </ComparisonPanel>
                              </DetailCell>
                            </DetailRow>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
              {!loading && visibleRows.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState>
                      <BarChart2 size={36} color="rgba(255,255,255,0.4)" />
                      <span>필터 조건에 맞는 로그가 없습니다.</span>
                    </EmptyState>
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableScroll>

        <PaginationBar>
          <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
            {filteredRows.length} entries · page {currentPage} / {totalPages}
          </span>
          <div style={{ display: "flex", gap: "0.45rem" }}>
            <PaginationButton
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </PaginationButton>
            <PaginationButton
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </PaginationButton>
          </div>
        </PaginationBar>
      </TableContainer>

      {selectedRows.size > 0 && (
        <ComparisonPanel>
          <strong>{selectedRows.size}개의 로그 선택됨</strong>
          <span>
            행을 두 개 이상 선택하면 전송량, 위치, 액션 유형을 비교하여 이상 여부를 빠르게 확인할 수
            있습니다.
          </span>
        </ComparisonPanel>
      )}
    </Container>
  );
};

export default DataView;
