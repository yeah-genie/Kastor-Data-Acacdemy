import { useMemo, useState } from "react";
import styled from "styled-components";
import { Filter, RefreshCcw, AlertTriangle, Search } from "lucide-react";

import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { DataCard } from "@/components/evidence-cards/DataCard";
import type { DataEvidence } from "@/lib/stores/useDetectiveGame";

const ViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const Panel = styled.div`
  background: rgba(13, 18, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow:
    0 24px 48px rgba(5, 8, 18, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
`;

const PanelTitle = styled.h2`
  font-size: 1.15rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 1rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const FilterControl = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const Select = styled.select`
  appearance: none;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.65rem 0.85rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: rgba(0, 217, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.15);
  }
`;

const SearchInput = styled.input`
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.65rem 2.25rem 0.65rem 0.9rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: rgba(0, 217, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.15);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.35);
`;

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 217, 255, 0.25);
  background: rgba(0, 217, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 217, 255, 0.16);
    transform: translateY(-1px);
  }
`;

const EvidenceGrid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const EmptyState = styled.div`
  padding: 2.5rem 1.5rem;
  border-radius: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.9rem;
`;

const AlertPanel = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.14), rgba(29, 21, 12, 0.7));
  padding: 1.1rem 1.25rem;
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 16px 32px rgba(255, 193, 7, 0.12);
`;

const AlertActions = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;

  button {
    border-radius: 12px;
    border: none;
    padding: 0.45rem 0.9rem;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const PrimaryAction = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 10px 18px rgba(33, 150, 243, 0.25);
`;

const GhostAction = styled.button`
  background: rgba(255, 255, 255, 0.15);
  color: ${({ theme }) => theme.colors.white};
`;

const SectionHeading = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const SectionDescription = styled.p`
  margin: 0 0 1rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const PatternCounter = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(0, 217, 255, 0.15);
  border: 1px solid rgba(0, 217, 255, 0.25);
`;

function extractLogEntries(evidence: DataEvidence): Array<Record<string, string>> {
  if (evidence.dataType !== "log") return [];
  return Array.isArray((evidence.data as any)?.entries) ? (evidence.data as any).entries : [];
}

const ALL = "all";

export function DataView() {
  const dataEvidence = useDetectiveGame((state) => state.getEvidenceByType("DATA"));
  const [userFilter, setUserFilter] = useState<string>(ALL);
  const [actionFilter, setActionFilter] = useState<string>(ALL);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const availableUsers = useMemo(() => {
    const users = new Set<string>();
    dataEvidence.forEach((ev) => {
      extractLogEntries(ev).forEach((entry) => {
        if (entry.user) users.add(entry.user);
      });
    });
    return Array.from(users).sort();
  }, [dataEvidence]);

  const availableActions = useMemo(() => {
    const actions = new Set<string>();
    dataEvidence.forEach((ev) => {
      extractLogEntries(ev).forEach((entry) => {
        const baseAction = entry.action?.split(":")[0]?.trim();
        if (baseAction) actions.add(baseAction);
      });
    });
    return Array.from(actions).sort();
  }, [dataEvidence]);

  const filteredEvidence = useMemo(() => {
    return dataEvidence.filter((ev) => {
      const entries = extractLogEntries(ev);
      const matchesEntry = entries.some((entry) => {
        const matchesUser = userFilter === ALL || entry.user === userFilter;
        const entryAction = entry.action?.split(":")[0]?.trim();
        const matchesAction = actionFilter === ALL || entryAction === actionFilter;
        const matchesSearch =
          searchTerm.trim().length === 0 ||
          JSON.stringify(entry).toLowerCase().includes(searchTerm.trim().toLowerCase());
        return matchesUser && matchesAction && matchesSearch;
      });

      if (entries.length > 0) {
        return matchesEntry;
      }

      // For non-log data types, only apply search term
      if (searchTerm.trim().length === 0) {
        return true;
      }

      return (
        ev.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        JSON.stringify(ev.data ?? {})
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );
    });
  }, [dataEvidence, userFilter, actionFilter, searchTerm]);

  const patternEvidence = useMemo(
    () =>
      filteredEvidence.filter(
        (ev) => (ev.data as any)?.puzzle || (ev.dataContent as any)?.puzzle
      ),
    [filteredEvidence]
  );

  const resetFilters = () => {
    setUserFilter(ALL);
    setActionFilter(ALL);
    setSearchTerm("");
  };

  return (
    <ViewWrapper>
      <Panel>
        <PanelTitle>
          <Filter size={20} strokeWidth={1.6} />
          Log Filters
        </PanelTitle>

        <FiltersGrid>
          <FilterControl>
            User
            <Select value={userFilter} onChange={(event) => setUserFilter(event.target.value)}>
              <option value={ALL}>All users</option>
              {availableUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </Select>
          </FilterControl>

          <FilterControl>
            Action type
            <Select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}>
              <option value={ALL}>All actions</option>
              {availableActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </Select>
          </FilterControl>

          <FilterControl>
            Search
            <SearchField>
              <SearchInput
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Enter keywords, IPs, timestamps..."
              />
              <SearchIcon />
            </SearchField>
          </FilterControl>
        </FiltersGrid>

        <ControlsRow>
          <span>
            Showing <strong>{filteredEvidence.length}</strong> of {dataEvidence.length} data assets
          </span>
          <ResetButton onClick={resetFilters}>
            <RefreshCcw size={14} />
            Reset filters
          </ResetButton>
        </ControlsRow>
      </Panel>

      {patternEvidence.length > 0 && (
        <AlertPanel>
          <AlertTriangle size={22} strokeWidth={1.8} />
          <div>
            <SectionHeading>Pattern Detected!</SectionHeading>
            <SectionDescription>
              Suspicious activity pattern uncovered in the current dataset. Review highlighted rows
              and confirm the finding to unlock bonus evidence.
            </SectionDescription>
            <AlertActions>
              <PrimaryAction>Analyze pattern</PrimaryAction>
              <GhostAction>Ask Kastor</GhostAction>
            </AlertActions>
          </div>
          <PatternCounter>
            {patternEvidence.length} pattern{patternEvidence.length > 1 ? "s" : ""} flagged
          </PatternCounter>
        </AlertPanel>
      )}

      <div>
        <SectionHeading>Data Assets</SectionHeading>
        <SectionDescription>
          Filtered log entries, access traces, and anomaly reports collected during the investigation.
          Tap entries inside each card to highlight important lines.
        </SectionDescription>

        {filteredEvidence.length === 0 ? (
          <EmptyState>필터와 검색 조건에 일치하는 데이터가 없습니다.</EmptyState>
        ) : (
          <EvidenceGrid>
            {filteredEvidence.map((evidence, index) => (
              <DataCard key={evidence.id} evidence={evidence} delay={index * 0.05} />
            ))}
          </EvidenceGrid>
        )}
      </div>
    </ViewWrapper>
  );
}

export default DataView;
