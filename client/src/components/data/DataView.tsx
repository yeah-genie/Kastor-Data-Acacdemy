import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { css } from "styled-components";
import { Download, Filter, Lightbulb, RefreshCw, Search, Sparkles, TriangleAlert, Users } from "lucide-react";
import Confetti from "react-confetti";

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  user: string;
  action: "Read" | "Write" | "Download" | "Delete";
  location: string;
  details: string;
  suspicious?: boolean;
}

type TimeRange = "all" | "today" | "lastWeek" | "nightShift";

interface DataViewProps {
  entries: LogEntry[];
  onAskKastor?: (context: { selectedRows: LogEntry[]; filters: Filters }) => void;
  patternLabel?: string;
  requiredPatternIds?: string[];
}

interface Filters {
  user: string;
  timeRange: TimeRange;
  action: "all" | LogEntry["action"];
  search: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

const FilterBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  align-items: end;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
`;

const Select = styled.select`
  appearance: none;
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(12, 12, 12, 0.65);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9rem;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.25);
  }
`;

const SearchFieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  width: 16px;
  height: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.85rem 0.7rem 2.3rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(12, 12, 12, 0.65);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9rem;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.25);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? css`
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
          box-shadow: 0 16px 35px rgba(33, 150, 243, 0.35);
        `
      : $variant === "danger"
      ? css`
          background: rgba(244, 67, 54, 0.15);
          color: ${theme.colors.danger};
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
        `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ $variant }) =>
        $variant === "primary"
          ? "0 20px 38px rgba(33, 150, 243, 0.4)"
          : "0 14px 30px rgba(0,0,0,0.25)"};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const TableWrapper = styled.div`
  position: relative;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  background: rgba(12, 12, 12, 0.6);
`;

const TableScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

const Th = styled.th<{ $sticky?: boolean }>`
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(30, 30, 30, 0.85);
  position: sticky;
  top: 0;
  z-index: ${({ $sticky }) => ($sticky ? 3 : 2)};
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  ${({ $sticky }) =>
    $sticky &&
    css`
      left: 0;
      background: rgba(30, 30, 30, 0.95);
      box-shadow: 8px 0 15px rgba(0, 0, 0, 0.35);
    `}
`;

const ThSortIcon = styled.span<{ $active: boolean }>`
  display: inline-block;
  margin-left: 0.35rem;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  transform: translateY(${({ $active }) => ($active ? "0" : "1px")});
`;

const Tr = styled.tr<{ $selected?: boolean; $suspicious?: boolean }>`
  transition: background 0.2s ease;
  background: ${({ $selected }) => ($selected ? "rgba(33, 150, 243, 0.12)" : "transparent")};

  &:nth-child(odd) {
    background: ${({ $selected }) => ($selected ? "rgba(33, 150, 243, 0.12)" : "rgba(255,255,255,0.02)")};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  ${({ $suspicious, theme }) =>
    $suspicious &&
    css`
      box-shadow: inset 0 0 0 2px rgba(244, 67, 54, 0.35);
      position: relative;

      &::after {
        content: "🚨";
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translate(-120%, -50%) rotate(-10deg);
        font-size: 0.9rem;
      }
    `}
`;

const Td = styled.td<{ $sticky?: boolean }>`
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;

  ${({ $sticky }) =>
    $sticky &&
    css`
      position: sticky;
      left: 0;
      background: rgba(12, 12, 12, 0.8);
      z-index: 2;
      box-shadow: 8px 0 15px rgba(0, 0, 0, 0.3);
      font-weight: 600;
    `}
`;

const Highlight = styled.mark`
  background: rgba(33, 150, 243, 0.45);
  color: ${({ theme }) => theme.colors.white};
  padding: 0 2px;
  border-radius: 4px;
`;

const RowDetails = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 0.65rem;
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(30, 30, 30, 0.85);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const PageInfo = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const SelectionSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
`;

const AlertWrapper = styled(motion.div)`
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.18), rgba(255, 152, 0, 0.05));
  border: 1px solid rgba(255, 152, 0, 0.35);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  box-shadow: 0 20px 45px rgba(255, 152, 0, 0.25);
`;

const AlertIcon = styled.div`
  padding: 0.65rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffb74d;
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: rgba(255, 255, 255, 0.85);
`;

const HintStack = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const HintBadge = styled.button<{ $active?: boolean }>`
  border: none;
  border-radius: 12px;
  padding: 0.6rem 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? "rgba(33, 150, 243, 0.18)" : "rgba(255, 255, 255, 0.06)"};
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  transition: background 0.2s ease, border 0.2s ease, transform 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      background: rgba(33, 150, 243, 0.15);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 250;
`;

const SuccessCard = styled(motion.div)`
  width: min(420px, 90vw);
  border-radius: 24px;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.85), rgba(76, 175, 80, 0.45));
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  box-shadow: 0 40px 80px rgba(33, 150, 243, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.55rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.02em;
`;

const SuccessStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.92);
`;

const SuccessAction = styled.button`
  margin-top: 0.5rem;
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #0c111f;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 18px 35px rgba(0, 0, 0, 0.28);
    }
  }
`;

const HINTS = [
  "Check the activity between 2 AM and 4 AM. Night shift behavior stands out.",
  "Focus on repeated actions from a single analyst account in that window.",
  "Look for a download followed immediately by deletion from the secure vault.",
];

export const DataView = ({
  entries,
  onAskKastor,
  patternLabel = "Late-night vault extraction",
  requiredPatternIds,
}: DataViewProps) => {
  const [filters, setFilters] = useState<Filters>({
    user: "all",
    timeRange: "all",
    action: "all",
    search: "",
  });
  const [sorting, setSorting] = useState<{ column: keyof LogEntry | "dateTime"; direction: "asc" | "desc" }>({
    column: "dateTime",
    direction: "desc",
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [patternFound, setPatternFound] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 12;

  const uniqueUsers = useMemo(() => {
    const set = new Set(entries.map((entry) => entry.user));
    return Array.from(set).sort();
  }, [entries]);

  const suspiciousSet = useMemo(() => {
    const ids = requiredPatternIds ?? entries.filter((entry) => entry.suspicious).map((entry) => entry.id);
    return new Set(ids);
  }, [entries, requiredPatternIds]);

  const filteredEntries = useMemo(() => {
    const { user, timeRange, action, search } = filters;
    const searchLower = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (user !== "all" && entry.user !== user) return false;
      if (action !== "all" && entry.action !== action) return false;

      if (timeRange !== "all") {
        const hour = parseInt(entry.time.split(":")[0] ?? "0", 10);
        if (timeRange === "today") {
          const today = new Date();
          const entryDate = new Date(entry.date + " " + entry.time);
          if (
            entryDate.getDate() !== today.getDate() ||
            entryDate.getMonth() !== today.getMonth() ||
            entryDate.getFullYear() !== today.getFullYear()
          ) {
            return false;
          }
        } else if (timeRange === "lastWeek") {
          const today = new Date();
          const entryDate = new Date(entry.date + " " + entry.time);
          const diff = today.getTime() - entryDate.getTime();
          if (diff > 7 * 24 * 60 * 60 * 1000) return false;
        } else if (timeRange === "nightShift") {
          if (!(hour >= 0 && hour < 6)) return false;
        }
      }

      if (searchLower) {
        const haystack = `${entry.date} ${entry.time} ${entry.user} ${entry.action} ${entry.location} ${entry.details}`.toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }

      return true;
    });
  }, [entries, filters]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const { column, direction } = sorting;
      let valueA: string | number = "";
      let valueB: string | number = "";

      if (column === "dateTime") {
        valueA = new Date(`${a.date} ${a.time}`).getTime();
        valueB = new Date(`${b.date} ${b.time}`).getTime();
      } else {
        valueA = (a[column as keyof LogEntry] as string) ?? "";
        valueB = (b[column as keyof LogEntry] as string) ?? "";
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredEntries, sorting]);

  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / pageSize));
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedEntries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEntries]);

  useEffect(() => {
    const suspiciousFiltered = filteredEntries.filter((entry) => suspiciousSet.has(entry.id));
    if (suspiciousFiltered.length && suspiciousFiltered.length <= 6) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [filteredEntries, suspiciousSet]);

  const toggleSort = (column: keyof LogEntry | "dateTime") => {
    setSorting((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: column === "dateTime" ? "desc" : "asc" };
    });
  };

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return [text];
  const regex = new RegExp(`(${query})`, "ig");
  const segments: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;
    if (start > lastIndex) {
      segments.push(text.slice(lastIndex, start));
    }
    segments.push(<Highlight key={`${start}-${end}`}>{match[0]}</Highlight>);
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
};

  const handleRowSelect = (id: string) => {
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

  const handleRowExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      user: "all",
      timeRange: "all",
      action: "all",
      search: "",
    });
    setSelectedRows(new Set());
    setExpandedRows(new Set());
  };

  const exportFiltered = () => {
    const headers = ["Date", "Time", "User", "Action", "Location", "Details"];
    const rows = sortedEntries.map((entry) =>
      [entry.date, entry.time, entry.user, entry.action, entry.location, entry.details.replace(/\n/g, " ")].join(","),
    );
    const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kastor-log-analysis.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const revealNextHint = () => {
    if (hintIndex < HINTS.length) {
      setHintIndex((prev) => prev + 1);
      setHintsUsed((prev) => prev + 1);
    }
  };

  const handleSubmitPattern = () => {
    const suspiciousIds = new Set(Array.from(suspiciousSet));
    const selectedIds = selectedRows.size ? selectedRows : new Set(filteredEntries.map((entry) => entry.id));
    const allMatch = Array.from(selectedIds).every((id) => suspiciousIds.has(id));

    if (allMatch && selectedIds.size === suspiciousIds.size) {
      setPatternFound(true);
      setShowSuccess(true);
      confettiRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (patternFound) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [patternFound]);

  const currentHints = HINTS.slice(0, hintIndex);

  return (
    <Wrapper>
      <div ref={confettiRef} />
      <FilterBar>
        <Label>
          Analyst
          <Select
            value={filters.user}
            onChange={(event) => setFilters((prev) => ({ ...prev, user: event.target.value }))}
          >
            <option value="all">All analysts</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </Select>
        </Label>

        <Label>
          Time Range
          <Select
            value={filters.timeRange}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, timeRange: event.target.value as TimeRange }))
            }
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="lastWeek">Last 7 days</option>
            <option value="nightShift">Night shift (00:00 - 06:00)</option>
          </Select>
        </Label>

        <Label>
          Action type
          <Select
            value={filters.action}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, action: event.target.value as Filters["action"] }))
            }
          >
            <option value="all">All actions</option>
            <option value="Read">Read</option>
            <option value="Write">Write</option>
            <option value="Download">Download</option>
            <option value="Delete">Delete</option>
          </Select>
        </Label>

        <Label>
          Search
          <SearchFieldWrapper>
            <SearchIcon />
            <Input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Search logs, users, locations…"
            />
          </SearchFieldWrapper>
        </Label>
      </FilterBar>

      <ButtonRow>
        <Button $variant="primary" type="button" onClick={() => setFilters({ ...filters })}>
          <Filter size={16} />
          Apply filters
        </Button>
        <Button type="button" onClick={resetFilters}>
          <RefreshCw size={16} />
          Reset
        </Button>
        <Button type="button" onClick={exportFiltered}>
          <Download size={16} />
          Export CSV
        </Button>
        <Button
          type="button"
          onClick={() =>
            onAskKastor?.({
              selectedRows: entries.filter((entry) => selectedRows.has(entry.id)),
              filters,
            })
          }
        >
          <Users size={16} />
          Ask Kastor
        </Button>
      </ButtonRow>

      <AnimatePresence>
        {showAlert && !patternFound ? (
          <AlertWrapper
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <AlertIcon>
              <TriangleAlert size={20} />
            </AlertIcon>
            <AlertContent>
              <strong>Pattern detected!</strong>
              <span>
                {patternLabel} present in filtered results. Validate the anomaly or request Kastor’s
                guidance.
              </span>
              <HintStack>
                <HintBadge onClick={revealNextHint} disabled={hintIndex >= HINTS.length}>
                  <Lightbulb size={15} />
                  Reveal hint ({hintIndex}/{HINTS.length})
                </HintBadge>
                <HintBadge onClick={handleSubmitPattern} $active>
                  <Sparkles size={15} />
                  Submit finding
                </HintBadge>
              </HintStack>
              {currentHints.length ? (
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
                  {currentHints.map((hint, index) => (
                    <div key={`${hint}-${index}`} style={{ opacity: 0.85 }}>
                      <strong>Hint {index + 1}:</strong> {hint}
                    </div>
                  ))}
                </div>
              ) : null}
            </AlertContent>
          </AlertWrapper>
        ) : null}
      </AnimatePresence>

      <TableWrapper>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <Th $sticky onClick={() => toggleSort("dateTime")}>
                  Date & Time
                  <ThSortIcon $active={sorting.column === "dateTime"}>
                    {sorting.direction === "asc" ? "▲" : "▼"}
                  </ThSortIcon>
                </Th>
                <Th onClick={() => toggleSort("user")}>
                  User
                  <ThSortIcon $active={sorting.column === "user"}>
                    {sorting.direction === "asc" ? "▲" : "▼"}
                  </ThSortIcon>
                </Th>
                <Th onClick={() => toggleSort("action")}>
                  Action
                  <ThSortIcon $active={sorting.column === "action"}>
                    {sorting.direction === "asc" ? "▲" : "▼"}
                  </ThSortIcon>
                </Th>
                <Th onClick={() => toggleSort("location")}>
                  Location
                  <ThSortIcon $active={sorting.column === "location"}>
                    {sorting.direction === "asc" ? "▲" : "▼"}
                  </ThSortIcon>
                </Th>
                <Th style={{ minWidth: "240px" }}>Details</Th>
                <Th>Select</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((entry) => {
                const isSelected = selectedRows.has(entry.id);
                const isExpanded = expandedRows.has(entry.id);
                const isSuspicious = suspiciousSet.has(entry.id);

                return (
                  <Tr key={entry.id} $selected={isSelected} $suspicious={isSuspicious}>
                    <Td $sticky>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowExpand(entry.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div>{highlightText(`${entry.date} · ${entry.time}`, filters.search)}</div>
                        <AnimatePresence>
                          {isExpanded ? (
                            <RowDetails
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {entry.details}
                            </RowDetails>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </Td>
                    <Td style={{ fontWeight: isSuspicious ? 700 : 500 }}>
                      {highlightText(entry.user, filters.search)}
                    </Td>
                    <Td
                      style={{
                        color:
                          entry.action === "Delete"
                            ? "#F44336"
                            : entry.action === "Download"
                            ? "#FFB74D"
                            : "rgba(255,255,255,0.8)",
                        fontWeight: entry.action === "Delete" ? 700 : 500,
                      }}
                    >
                      {highlightText(entry.action, filters.search)}
                    </Td>
                    <Td>{highlightText(entry.location, filters.search)}</Td>
                    <Td>
                      <span>
                        {highlightText(
                          entry.details.slice(0, 60) + (entry.details.length > 60 ? "…" : ""),
                          filters.search,
                        )}
                      </span>
                    </Td>
                    <Td $sticky>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(entry.id)}
                        aria-label={`Select log ${entry.id}`}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableScroll>
        <PaginationBar>
          <SelectionSummary>
            <span>
              Selected rows: <strong>{selectedRows.size}</strong>
            </span>
            <span>
              Suspicious rows in view:{" "}
              <strong>{filteredEntries.filter((entry) => suspiciousSet.has(entry.id)).length}</strong>
            </span>
          </SelectionSummary>
          <PageInfo>
            Page {currentPage} of {totalPages} · {sortedEntries.length} records
          </PageInfo>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>
              Prev
            </Button>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}>
              Next
            </Button>
          </div>
        </PaginationBar>
      </TableWrapper>

      <AnimatePresence>
        {showSuccess ? (
          <SuccessModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessCard
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <SuccessTitle>Pattern confirmed!</SuccessTitle>
              <SuccessStats>
                <span>✔ Identified: {patternLabel}</span>
                <span>✔ Hints used: {hintsUsed}</span>
                <span>✔ Suspicious records matched: {suspiciousSet.size}</span>
                <span style={{ opacity: 0.85 }}>Kastor is impressed. “Virtual high five!” ✋</span>
              </SuccessStats>
              <SuccessAction type="button" onClick={() => setShowSuccess(false)}>
                Continue investigation
              </SuccessAction>
            </SuccessCard>
            <Confetti
              width={typeof window !== "undefined" ? window.innerWidth : 1200}
              height={typeof window !== "undefined" ? window.innerHeight : 800}
              recycle={false}
              numberOfPieces={400}
            />
          </SuccessModalBackdrop>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
};

export default DataView;
