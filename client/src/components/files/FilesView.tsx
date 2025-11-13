import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { css } from "styled-components";
import {
  FileText,
  Mail,
  Image as ImageIcon,
  Video,
  Database,
  Lock,
  FolderTree,
  Grid,
  LayoutList,
  Filter,
  Star,
  StarOff,
  Search,
  Share2,
  NotebookPen,
  Copy,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import type { Evidence } from "@/types";

export type EvidenceImportance = Evidence["importance"];

export interface EvidenceFile extends Evidence {
  folderId: string;
  dateAdded: string;
  tags: string[];
  related?: string[];
  description?: string;
  isLocked?: boolean;
  notes?: string[];
  thumbnail?: string;
}

export interface EvidenceFolder {
  id: string;
  name: string;
  icon?: React.ReactNode;
  parentId?: string | null;
}

interface FilesViewProps {
  folders: EvidenceFolder[];
  files: EvidenceFile[];
  onMarkImportant?: (evidenceId: string, important: boolean) => void;
  onAddNote?: (evidenceId: string) => void;
  onShare?: (evidenceId: string) => void;
  onOpenInFiles?: (evidenceId: string) => void;
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 260px) 1fr minmax(280px, 360px);
  gap: 1.5rem;
  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Pane = styled.div<{ $variant?: "sidebar" | "main" | "preview" }>`
  background: rgba(15, 15, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;

  ${({ $variant }) =>
    $variant === "sidebar" &&
    css`
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        order: 1;
      }
    `}

  ${({ $variant }) =>
    $variant === "preview" &&
    css`
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        order: 3;
      }
    `}

  ${({ $variant }) =>
    $variant === "main" &&
    css`
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        order: 2;
      }
    `}
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`;

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 60vh;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const FolderButton = styled.button<{ $active?: boolean }>`
  border: none;
  border-radius: 12px;
  padding: 0.7rem 0.8rem;
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.18)" : "rgba(255,255,255,0.04)")};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      background: rgba(33, 150, 243, 0.12);
    }
  }
`;

const FolderName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const FileToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

const IconButton = styled.button<{ $active?: boolean }>`
  border: none;
  border-radius: 12px;
  padding: 0.55rem;
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.18)" : "rgba(255,255,255,0.08)")};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      background: rgba(33, 150, 243, 0.12);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.5);
`;

const SearchInput = styled.input`
  background: rgba(12, 12, 12, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.65rem 0.75rem 0.65rem 2.1rem;
  font-size: 0.85rem;
  width: 220px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }
`;

const FileGrid = styled.div<{ $mode: "grid" | "list" }>`
  flex: 1;
  display: grid;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.25rem;

  ${({ $mode }) =>
    $mode === "grid"
      ? css`
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        `
      : css`
          grid-template-columns: 1fr;
        `}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-height: 360px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const FileCard = styled.button<{ $active?: boolean; $mode: "grid" | "list" }>`
  border: 1px solid ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.4)" : "rgba(255, 255, 255, 0.05)")};
  border-radius: 16px;
  padding: 0.9rem;
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.15)" : "rgba(12,12,12,0.55)")};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  flex-direction: ${({ $mode }) => ($mode === "grid" ? "column" : "row")};
  gap: ${({ $mode }) => ($mode === "grid" ? "0.75rem" : "0.8rem")};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
  text-align: left;
  position: relative;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
    }
  }
`;

const FileIcon = styled.div<{ $type: Evidence["type"] }>`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $type, theme }) => {
    switch ($type) {
      case "document":
        return "rgba(33, 150, 243, 0.2)";
      case "log":
        return "rgba(244, 67, 54, 0.18)";
      case "email":
        return "rgba(255, 152, 0, 0.18)";
      case "image":
        return "rgba(76, 175, 80, 0.18)";
      case "video":
        return "rgba(156, 39, 176, 0.18)";
      default:
        return theme.colors.primary;
    }
  }};
  color: ${({ theme }) => theme.colors.white};
`;

const FileTitle = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
`;

const FileMeta = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $variant?: "importance" | "type" | "tag" | "new" }>`
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-weight: 700;

  ${({ $variant, theme }) =>
    $variant === "importance"
      ? css`
          background: rgba(255, 152, 0, 0.15);
          color: ${theme.colors.secondary};
        `
      : $variant === "type"
      ? css`
          background: rgba(33, 150, 243, 0.18);
          color: ${theme.colors.primary};
        `
      : $variant === "new"
      ? css`
          background: rgba(76, 175, 80, 0.18);
          color: ${theme.colors.success};
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
        `}
`;

const PreviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const PreviewTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
`;

const PreviewActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const PreviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ViewerContainer = styled.div`
  flex: 1;
  min-height: 240px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
`;

const NotSelectedPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
`;

const DocumentViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DocumentToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const DocumentContent = styled.pre`
  flex: 1;
  margin: 0;
  padding: 1rem;
  overflow-y: auto;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const EmailLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EmailHeader = styled.div`
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  display: grid;
  row-gap: 0.4rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
`;

const EmailBody = styled.div`
  flex: 1;
  padding: 1.2rem;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
`;

const ImageViewerContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageToolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const ImageStage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
`;

const StyledImage = styled.img<{ $scale: number }>`
  max-width: 100%;
  max-height: 100%;
  transform: scale(${({ $scale }) => $scale});
  transition: transform 0.2s ease;
  border-radius: 12px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
`;

const LogViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const LogFilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
`;

const DataTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

const DataTh = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const DataTd = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
`;

const NotesArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  max-height: 160px;
  overflow-y: auto;
`;

const NoteItem = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  padding: 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
`;

const FileIconForType = (type: Evidence["type"]) => {
  switch (type) {
    case "document":
      return <FileText size={18} />;
    case "email":
      return <Mail size={18} />;
    case "image":
      return <ImageIcon size={18} />;
    case "video":
      return <Video size={18} />;
    case "log":
    default:
      return <Database size={18} />;
  }
};

const DocumentViewer = ({
  content,
  onCopy,
  onDownload,
}: {
  content: string;
  onCopy?: () => void;
  onDownload?: () => void;
}) => (
  <DocumentViewerContainer>
    <DocumentToolbar>
      <IconButton type="button" onClick={onCopy}>
        <Copy size={16} />
      </IconButton>
      <IconButton type="button" onClick={onDownload}>
        <Download size={16} />
      </IconButton>
    </DocumentToolbar>
    <DocumentContent>{content}</DocumentContent>
  </DocumentViewerContainer>
);

const EmailViewer = ({ content }: { content: any }) => (
  <EmailLayout>
    <EmailHeader>
      <div>
        <strong>From:</strong> {content.from}
      </div>
      <div>
        <strong>To:</strong> {content.to}
      </div>
      <div>
        <strong>Subject:</strong> {content.subject}
      </div>
      <div style={{ opacity: 0.75 }}>
        <strong>Sent:</strong> {content.date}
      </div>
    </EmailHeader>
    <EmailBody>{content.body}</EmailBody>
  </EmailLayout>
);

const ImageViewer = ({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) => {
  const [scale, setScale] = useState(1);
  return (
    <ImageViewerContainer>
      <ImageToolbar>
        <IconButton type="button" onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}>
          <ZoomIn size={16} />
        </IconButton>
        <IconButton type="button" onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}>
          <ZoomOut size={16} />
        </IconButton>
        <IconButton type="button" onClick={() => setScale(1)}>
          <RotateCcw size={16} />
        </IconButton>
      </ImageToolbar>
      <ImageStage>
        <StyledImage src={src} alt={alt} $scale={scale} />
      </ImageStage>
    </ImageViewerContainer>
  );
};

const LogViewer = ({
  content,
}: {
  content: string;
}) => {
  const [level, setLevel] = useState<"ALL" | "INFO" | "WARN" | "ERROR">("ALL");
  const lines = content.split("\n");
  const filtered = lines.filter((line) => {
    if (level === "ALL") return true;
    return line.toUpperCase().includes(level);
  });

  return (
    <LogViewerContainer>
      <LogFilterBar>
        {(["ALL", "INFO", "WARN", "ERROR"] as const).map((lvl) => (
          <IconButton key={lvl} type="button" $active={level === lvl} onClick={() => setLevel(lvl)}>
            {lvl}
          </IconButton>
        ))}
      </LogFilterBar>
      <DocumentContent>{filtered.join("\n")}</DocumentContent>
    </LogViewerContainer>
  );
};

const DataViewer = ({ content }: { content: any[] }) => {
  if (!Array.isArray(content) || content.length === 0) {
    return <NotSelectedPlaceholder>No data rows available.</NotSelectedPlaceholder>;
  }
  const columns = Object.keys(content[0] ?? {});
  return (
    <DataTableContainer>
      <div style={{ overflowX: "auto", flex: 1 }}>
        <DataTable>
          <thead>
            <tr>
              {columns.map((column) => (
                <DataTh key={column}>{column}</DataTh>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.map((row, idx) => (
              <tr key={idx}>
                {columns.map((column) => (
                  <DataTd key={column}>{String(row[column])}</DataTd>
                ))}
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </DataTableContainer>
  );
};

export const FilesView = ({
  folders,
  files,
  onMarkImportant,
  onAddNote,
  onShare,
  onOpenInFiles,
}: FilesViewProps) => {
  const [activeFolder, setActiveFolder] = useState<string>(folders[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [importanceFilter, setImportanceFilter] = useState<"all" | EvidenceImportance>("all");
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const filteredFiles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return files.filter((file) => {
      if (activeFolder && file.folderId !== activeFolder) return false;
      if (importanceFilter !== "all" && file.importance !== importanceFilter) return false;
      if (!term) return true;
      const haystack =
        `${file.title} ${file.type} ${file.tags.join(" ")} ${file.description ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [files, activeFolder, importanceFilter, searchTerm]);

  const activeFile = filteredFiles.find((file) => file.id === activeFileId) ?? filteredFiles[0] ?? null;

  const folderTree = useMemo(() => {
    const rootNodes = folders.filter((folder) => !folder.parentId);
    const renderNode = (folder: EvidenceFolder) => {
      const children = folders.filter((item) => item.parentId === folder.id);
      const count = files.filter((file) => file.folderId === folder.id).length;
      return (
        <div key={folder.id} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <FolderButton
            type="button"
            onClick={() => setActiveFolder(folder.id)}
            $active={activeFolder === folder.id}
          >
            <FolderName>
              {folder.icon ?? <FolderTree size={16} />}
              {folder.name}
            </FolderName>
            <Badge>{count}</Badge>
          </FolderButton>
          <div style={{ marginLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {children.map(renderNode)}
          </div>
        </div>
      );
    };
    return rootNodes.map(renderNode);
  }, [folders, files, activeFolder]);

  const renderPreview = () => {
    if (!activeFile) {
      return (
        <NotSelectedPlaceholder>
          <span role="img" aria-label="folder" style={{ fontSize: "2.5rem" }}>
            🗂️
          </span>
          Select an evidence file to view its contents.
        </NotSelectedPlaceholder>
      );
    }

    if (activeFile.isLocked) {
      return (
        <NotSelectedPlaceholder>
          <Lock size={24} />
          <div>
            Evidence locked. Unlock via story progression or <strong>Evidence</strong> tab.
          </div>
        </NotSelectedPlaceholder>
      );
    }

    switch (activeFile.type) {
      case "document":
        return (
          <DocumentViewer
            content={typeof activeFile.content === "string" ? activeFile.content : JSON.stringify(activeFile.content, null, 2)}
            onCopy={() => navigator.clipboard.writeText(String(activeFile.content))}
            onDownload={() => {
              const blob = new Blob([String(activeFile.content)], { type: "text/plain;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${activeFile.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          />
        );
      case "email":
        return <EmailViewer content={activeFile.content} />;
      case "image":
        return (
          <ImageViewer
            src={typeof activeFile.content === "string" ? activeFile.content : activeFile.thumbnail ?? ""}
            alt={activeFile.title}
          />
        );
      case "log":
        return (
          <LogViewer
            content={
              typeof activeFile.content === "string"
                ? activeFile.content
                : JSON.stringify(activeFile.content, null, 2)
            }
          />
        );
      case "video":
        return (
          <NotSelectedPlaceholder>
            <Video size={24} />
            Video playback coming soon. Use <strong>Open in Files</strong> to view.
          </NotSelectedPlaceholder>
        );
      default:
        if (Array.isArray(activeFile.content)) {
          return <DataViewer content={activeFile.content} />;
        }
        return (
          <DocumentViewer
            content={JSON.stringify(activeFile.content, null, 2)}
          />
        );
    }
  };

  return (
    <Layout>
      <Pane $variant="sidebar">
        <SectionTitle>Folders</SectionTitle>
        <FolderList>{folderTree}</FolderList>
      </Pane>

      <Pane $variant="main">
        <FileToolbar>
          <ToolbarGroup>
            <IconButton type="button" $active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
              <Grid size={16} />
            </IconButton>
            <IconButton type="button" $active={viewMode === "list"} onClick={() => setViewMode("list")}>
              <LayoutList size={16} />
            </IconButton>
            <IconButton
              type="button"
              $active={importanceFilter !== "all"}
              onClick={() =>
                setImportanceFilter((prev) =>
                  prev === "all"
                    ? "critical"
                    : prev === "critical"
                    ? "high"
                    : prev === "high"
                    ? "medium"
                    : prev === "medium"
                    ? "low"
                    : "all",
                )
              }
            >
              <Filter size={16} />
            </IconButton>
            <Badge>
              {importanceFilter === "all" ? "All" : importanceFilter.toUpperCase()}
            </Badge>
          </ToolbarGroup>

          <ToolbarGroup>
            <SearchInputWrapper>
              <SearchIcon />
              <SearchInput
                placeholder="Search files"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </SearchInputWrapper>
          </ToolbarGroup>
        </FileToolbar>

        <FileGrid $mode={viewMode}>
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              type="button"
              $active={file.id === activeFile?.id}
              $mode={viewMode}
              onClick={() => setActiveFileId(file.id)}
            >
              <FileIcon $type={file.type}>{FileIconForType(file.type)}</FileIcon>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <FileTitle>{file.title}</FileTitle>
                <FileMeta>
                  <span>{new Date(file.dateAdded).toLocaleString()}</span>
                  <Badge $variant="importance">{file.importance}</Badge>
                  <Badge $variant="type">{file.type}</Badge>
                  {file.isNew ? <Badge $variant="new">NEW</Badge> : null}
                </FileMeta>
                <div style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  {file.description ?? "No description"}
                </div>
              </div>
            </FileCard>
          ))}
        </FileGrid>
      </Pane>

      <Pane $variant="preview">
        <PreviewHeader>
          <SectionTitle>Preview</SectionTitle>
          {activeFile ? (
            <>
              <PreviewTitle>{activeFile.title}</PreviewTitle>
              <PreviewMeta>
                <div>
                  Added: {new Date(activeFile.dateAdded).toLocaleString()} · Importance:{" "}
                  {activeFile.importance.toUpperCase()}
                </div>
                <div>Related: {activeFile.related?.length ? activeFile.related.join(", ") : "None"}</div>
                <div>Tags: {activeFile.tags.length ? activeFile.tags.join(", ") : "—"}</div>
              </PreviewMeta>
              <PreviewActions>
                <IconButton
                  type="button"
                  onClick={() => onMarkImportant?.(activeFile.id, activeFile.importance !== "critical")}
                >
                  {activeFile.importance === "critical" ? <StarOff size={16} /> : <Star size={16} />}
                </IconButton>
                <IconButton type="button" onClick={() => onAddNote?.(activeFile.id)}>
                  <NotebookPen size={16} />
                </IconButton>
                <IconButton type="button" onClick={() => onShare?.(activeFile.id)}>
                  <Share2 size={16} />
                </IconButton>
                <IconButton type="button" onClick={() => onOpenInFiles?.(activeFile.id)}>
                  <ExternalLink size={16} />
                </IconButton>
              </PreviewActions>
            </>
          ) : null}
        </PreviewHeader>

        <ViewerContainer>{renderPreview()}</ViewerContainer>

        {activeFile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <SectionTitle>Notes</SectionTitle>
            <NotesArea>
              {activeFile.notes?.length ? (
                activeFile.notes.map((note, index) => (
                  <NoteItem key={`${activeFile.id}-note-${index}`}>{note}</NoteItem>
                ))
              ) : (
                <div style={{ opacity: 0.65 }}>No notes yet. Add one from the action bar.</div>
              )}
            </NotesArea>
          </div>
        ) : null}
      </Pane>
    </Layout>
  );
};

export default FilesView;
