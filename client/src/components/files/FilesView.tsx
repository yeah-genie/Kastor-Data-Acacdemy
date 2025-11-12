import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FolderTree,
  Folder,
  FileText,
  Image,
  MessageSquare,
  BarChart3,
  Star,
  Tag,
  Info,
  Share2,
  BookmarkPlus,
} from "lucide-react";

import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import type {
  Evidence,
  CharacterEvidence,
  DataEvidence,
  DialogueEvidence,
  PhotoEvidence,
  DocumentEvidence,
} from "@/lib/stores/useDetectiveGame";
import { CharacterCard } from "@/components/evidence-cards/CharacterCard";
import { DataCard } from "@/components/evidence-cards/DataCard";
import { DialogueCard } from "@/components/evidence-cards/DialogueCard";
import { PhotoCard } from "@/components/evidence-cards/PhotoCard";
import { DocumentCard } from "@/components/evidence-cards/DocumentCard";

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) minmax(0, 360px);
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div<{ $variant?: "dark" | "medium" }>`
  background: ${({ $variant }) =>
    $variant === "dark"
      ? "rgba(10, 14, 24, 0.92)"
      : "rgba(15, 19, 32, 0.78)"};
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem;
  box-shadow:
    0 22px 40px rgba(6, 9, 18, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.white};
`;

const FolderList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
`;

const FolderButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-radius: 14px;
  border: 1px solid transparent;
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active
      ? "linear-gradient(135deg, rgba(0, 217, 255, 0.22), rgba(0, 82, 120, 0.45))"
      : "rgba(255, 255, 255, 0.04)"};
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease;
  border-color: ${({ $active }) => ($active ? "rgba(0, 217, 255, 0.4)" : "rgba(255, 255, 255, 0.04)")};

  &:hover {
    transform: translateX(4px);
    border-color: rgba(0, 217, 255, 0.25);
  }
`;

const EvidenceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  overflow: hidden;
`;

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.78rem;
`;

const Badge = styled.span<{ $accent?: "primary" | "danger" | "neutral" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  border: 1px solid
    ${({ $accent, theme }) =>
      $accent === "primary"
        ? "rgba(0, 217, 255, 0.35)"
        : $accent === "danger"
          ? "rgba(244, 67, 54, 0.45)"
          : "rgba(255, 255, 255, 0.12)"};
  background:
    ${({ $accent }) =>
      $accent === "primary"
        ? "rgba(0, 217, 255, 0.08)"
        : $accent === "danger"
          ? "rgba(244, 67, 54, 0.12)"
          : "rgba(255, 255, 255, 0.05)"};
  color: ${({ theme }) => theme.colors.white};
`;

const EvidenceList = styled.div`
  display: grid;
  gap: 0.85rem;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 0.35rem;
`;

const EvidenceItem = styled.button<{ $active?: boolean }>`
  border-radius: 16px;
  padding: 0.95rem 1rem;
  text-align: left;
  border: 1px solid ${({ $active }) =>
    $active ? "rgba(0, 217, 255, 0.35)" : "rgba(255, 255, 255, 0.05)"};
  background: ${({ $active }) =>
    $active ? "rgba(0, 217, 255, 0.12)" : "rgba(255, 255, 255, 0.03)"};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.18s ease;
  display: grid;
  gap: 0.4rem;
  position: relative;

  &:hover {
    border-color: rgba(0, 217, 255, 0.25);
    transform: translateY(-1px);
  }
`;

const EvidenceMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.6);
`;

const PreviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const PreviewTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.white};
`;

const PreviewSubtitle = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;

  button {
    border-radius: 12px;
    border: none;
    padding: 0.45rem 0.85rem;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.08);
    color: ${({ theme }) => theme.colors.white};
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const PreviewContent = styled.div`
  margin-top: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  max-height: 480px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 2.5rem 1rem;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  text-align: center;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.85rem;
`;

const folderStructure = [
  {
    id: "suspects",
    name: "Suspects",
    icon: <Folder className="w-4 h-4" />,
  },
  {
    id: "digital",
    name: "Digital Evidence",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "communications",
    name: "Communications",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: "timeline",
    name: "Timeline",
    icon: <Image className="w-4 h-4" />,
  },
];

type FolderKey = (typeof folderStructure)[number]["id"];

function assignFolder(evidence: Evidence): FolderKey {
  switch (evidence.type) {
    case "CHARACTER":
      return "suspects";
    case "DATA":
      return "digital";
    case "DIALOGUE":
      return "communications";
    case "PHOTO":
      return "timeline";
    case "DOCUMENT":
      return evidence.title.toLowerCase().includes("email") ||
        evidence.title.toLowerCase().includes("message")
        ? "communications"
        : "digital";
    default:
      return "digital";
  }
}

function typeIcon(evidence: Evidence) {
  switch (evidence.type) {
    case "CHARACTER":
      return <UserIcon />;
    case "DATA":
      return <BarChart3 className="w-4 h-4 text-cyan-300" />;
    case "DOCUMENT":
      return <FileText className="w-4 h-4 text-blue-300" />;
    case "DIALOGUE":
      return <MessageSquare className="w-4 h-4 text-purple-300" />;
    case "PHOTO":
      return <Image className="w-4 h-4 text-amber-300" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12.5c2.347 0 4.25-1.903 4.25-4.25S14.347 4 12 4 7.75 5.903 7.75 8.25 9.653 12.5 12 12.5Zm0 1.5c-3.04 0-9 1.527-9 4.5V21h18v-2.5c0-2.973-5.96-4.5-9-4.5Z"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function renderPreviewContent(evidence: Evidence) {
  switch (evidence.type) {
    case "CHARACTER":
      return <CharacterCard evidence={evidence as CharacterEvidence} />;
    case "DATA":
      return <DataCard evidence={evidence as DataEvidence} />;
    case "DIALOGUE":
      return <DialogueCard evidence={evidence as DialogueEvidence} />;
    case "PHOTO":
      return <PhotoCard evidence={evidence as PhotoEvidence} />;
    case "DOCUMENT":
    default:
      return <DocumentCard evidence={evidence as DocumentEvidence} />;
  }
}

export function FilesView() {
  const evidence = useDetectiveGame((state) => state.evidenceCollected);
  const [folder, setFolder] = useState<FolderKey>("digital");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [importanceFilter, setImportanceFilter] = useState<string>("all");
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const folderedEvidence = useMemo(
    () =>
      evidence
        .map((item) => ({
          item,
          folder: assignFolder(item),
        }))
        .filter((entry) => entry.folder === folder),
    [evidence, folder]
  );

  const filteredEvidence = useMemo(() => {
    return folderedEvidence
      .map((entry) => entry.item)
      .filter((item) => {
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesImportance =
          importanceFilter === "all" ||
          (item as any).importance === importanceFilter;
        return matchesType && matchesImportance;
      });
  }, [folderedEvidence, typeFilter, importanceFilter]);

  useEffect(() => {
    if (filteredEvidence.length > 0 && !selectedEvidence) {
      setSelectedEvidence(filteredEvidence[0]);
      return;
    }

    if (
      selectedEvidence &&
      !filteredEvidence.some((item) => item.id === selectedEvidence.id)
    ) {
      setSelectedEvidence(filteredEvidence[0] ?? null);
    }
  }, [filteredEvidence, selectedEvidence]);

  const importanceColor = (importance?: string) => {
    switch (importance) {
      case "critical":
        return "rgba(244, 67, 54, 0.16)";
      case "high":
        return "rgba(255, 152, 0, 0.16)";
      case "medium":
        return "rgba(33, 150, 243, 0.16)";
      default:
        return "rgba(255, 255, 255, 0.14)";
    }
  };

  return (
    <Layout>
      <Panel $variant="dark">
        <SectionTitle>
          <FolderTree size={18} strokeWidth={1.8} />
          Episode 4: The Data Breach
        </SectionTitle>

        <FolderList>
          {folderStructure.map(({ id, name, icon }) => (
            <li key={id}>
              <FolderButton
                $active={folder === id}
                onClick={() => setFolder(id)}
              >
                <span className="text-cyan-200/70">{icon}</span>
                {name}
              </FolderButton>
            </li>
          ))}
        </FolderList>
      </Panel>

      <Panel>
        <SectionTitle>
          <FileText size={18} strokeWidth={1.6} />
          Evidence Files
        </SectionTitle>

        <FiltersRow>
          <Badge $accent="neutral">
            <Tag size={14} />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="bg-transparent border-none text-white focus:outline-none"
            >
              <option value="all">All types</option>
              <option value="CHARACTER">Character</option>
              <option value="DATA">Data</option>
              <option value="DOCUMENT">Document</option>
              <option value="DIALOGUE">Dialogue</option>
              <option value="PHOTO">Photo</option>
            </select>
          </Badge>
          <Badge $accent="neutral">
            <Star size={14} />
            <select
              value={importanceFilter}
              onChange={(event) => setImportanceFilter(event.target.value)}
              className="bg-transparent border-none text-white focus:outline-none"
            >
              <option value="all">All priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </Badge>
          <span>
            {filteredEvidence.length} result{filteredEvidence.length !== 1 ? "s" : ""} in{" "}
            {
              folderStructure.find((entry) => entry.id === folder)?.name
            }
          </span>
        </FiltersRow>

        <EvidenceList>
          {filteredEvidence.length === 0 ? (
            <EmptyState>선택한 조건에 해당하는 증거가 없습니다.</EmptyState>
          ) : (
            filteredEvidence.map((item) => (
              <EvidenceItem
                key={item.id}
                $active={selectedEvidence?.id === item.id}
                onClick={() => setSelectedEvidence(item)}
              >
                <div className="flex items-center gap-0.6">
                  {typeIcon(item)}
                  <span className="font-semibold text-sm">{item.title}</span>
                </div>
                <EvidenceMeta>
                  {item.importance && (
                    <span
                      style={{
                        background: importanceColor(item.importance),
                        borderRadius: "999px",
                        padding: "0.2rem 0.5rem",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {item.importance.toUpperCase()}
                    </span>
                  )}
                  <span>ID: {item.id}</span>
                  {item.relatedTo?.length > 0 && (
                    <span>Links: {item.relatedTo.length}</span>
                  )}
                </EvidenceMeta>
              </EvidenceItem>
            ))
          )}
        </EvidenceList>
      </Panel>

      <Panel $variant="dark">
        {selectedEvidence ? (
          <>
            <PreviewHeader>
              <SectionTitle>
                <Info size={18} strokeWidth={1.6} />
                Evidence Preview
              </SectionTitle>
              <PreviewTitle>{selectedEvidence.title}</PreviewTitle>
              <PreviewSubtitle>
                Importance: {selectedEvidence.importance.toUpperCase()} ·{" "}
                {selectedEvidence.dateCollected}
              </PreviewSubtitle>
            </PreviewHeader>

            <PreviewActions>
              <button>
                <Share2 size={14} />
                Share with Kastor
              </button>
              <button>
                <BookmarkPlus size={14} />
                Mark important
              </button>
            </PreviewActions>

            <PreviewContent>{renderPreviewContent(selectedEvidence)}</PreviewContent>
          </>
        ) : (
          <EmptyState>
            왼쪽 목록에서 증거를 선택하면 상세 내용이 표시됩니다.
          </EmptyState>
        )}
      </Panel>
    </Layout>
  );
}

export default FilesView;
