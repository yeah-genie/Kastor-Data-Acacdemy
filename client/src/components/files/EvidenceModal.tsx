import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import styled from "styled-components";

export type EvidenceKind = "document" | "log" | "email" | "image" | "video";

export type EvidenceDetail =
  | {
      kind: "document";
      summary?: string;
      body: string[];
    }
  | {
      kind: "log";
      summary?: string;
      body: string[];
      highlights?: string[];
    }
  | {
      kind: "email";
      headers: {
        from: string;
        to: string[];
        cc?: string[];
        subject: string;
        timestamp: string;
      };
      body: string[];
    }
  | {
      kind: "image";
      src: string;
      caption?: string;
      metadata?: { label: string; value: string }[];
    }
  | {
      kind: "data";
      headers: string[];
      rows: string[][];
      insights?: string[];
      footnote?: string;
    }
  | {
      kind: "video";
      url: string;
      description?: string;
    };

export interface EvidenceModalItem {
  id: string;
  title: string;
  type: EvidenceKind;
  detail: EvidenceDetail;
  metadata?: { label: string; value: string }[];
  relatedCharacters?: string[];
  tag?: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  evidenceItems: EvidenceModalItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(8, 11, 19, 0.78);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: clamp(1rem, 4vw, 2.5rem);
`;

const Dialog = styled(motion.article)`
  position: relative;
  width: min(960px, 100%);
  max-height: min(86vh, 900px);
  background: ${({ theme }) => theme.colors.darkGray};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.25rem;
  box-shadow:
    0 20px 45px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 3vw, 2rem);
  background: linear-gradient(
    135deg,
    rgba(33, 150, 243, 0.18),
    rgba(21, 32, 57, 0.6)
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.125rem, 1.6vw, 1.5rem);
  font-weight: 600;
  letter-spacing: 0.01em;
`;

const Tag = styled.span`
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.85rem;
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.55rem;
  border-radius: 0.6rem;
  background: rgba(0, 0, 0, 0.3);
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: clamp(1rem, 2vw, 1.75rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const SummaryCard = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-line;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  font-weight: 600;
`;

const Paragraph = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.6;
  font-size: 0.97rem;
  word-break: keep-all;
`;

const LogContainer = styled.pre`
  margin: 0;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: rgba(6, 8, 14, 0.85);
  border: 1px solid rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.lightGray};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.9rem;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  strong {
    color: ${({ theme }) => theme.colors.white};
    background: rgba(244, 67, 54, 0.18);
    border-radius: 0.4rem;
    padding: 0.05rem 0.25rem;
  }
`;

const EmailHeader = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.lightGray};

  dt {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.72rem;
  }

  dd {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ImagePreview = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(15, 21, 35, 0.8), rgba(9, 13, 23, 0.95));
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  img {
    width: 100%;
    max-height: 360px;
    object-fit: cover;
  }

  figcaption {
    padding: 0 1rem 1rem;
    color: ${({ theme }) => theme.colors.lightGray};
    font-size: 0.9rem;
  }
`;

const TableWrapper = styled.div`
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(3px);
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  thead {
    background: rgba(33, 150, 243, 0.14);
    color: ${({ theme }) => theme.colors.white};
  }

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    text-align: left;
  }

  tbody tr:nth-child(2n) {
    background: rgba(0, 0, 0, 0.12);
  }
`;

const InsightsList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.1rem;
  display: grid;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.92rem;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.35rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(9, 13, 24, 0.8);
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.85rem;
  gap: 0.75rem;
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  border-radius: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease;

  &:hover {
    background: rgba(33, 150, 243, 0.34);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.35);
`;

const CountBubble = styled.span`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.white};
`;

export function EvidenceModal({
  isOpen,
  evidenceItems,
  activeIndex,
  onClose,
  onNavigate,
}: EvidenceModalProps) {
  const activeEvidence = evidenceItems[activeIndex] ?? evidenceItems[0];
  const totalItems = evidenceItems.length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (totalItems > 1) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          onNavigate(activeIndex + 1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          onNavigate(activeIndex - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, activeIndex, totalItems, onClose, onNavigate]);

  const highlightMap = useMemo(() => {
    if (activeEvidence?.detail.kind !== "log" || !activeEvidence.detail.highlights) {
      return [];
    }
    return activeEvidence.detail.highlights;
  }, [activeEvidence]);

  if (!isOpen || !activeEvidence) {
    return null;
  }

  const goPrev = () => onNavigate(activeIndex - 1);
  const goNext = () => onNavigate(activeIndex + 1);

  const renderDetail = () => {
    switch (activeEvidence.detail.kind) {
      case "document":
        return (
          <>
            {activeEvidence.detail.summary && <SummaryCard>{activeEvidence.detail.summary}</SummaryCard>}
            {activeEvidence.detail.body.map((paragraph, index) => (
              <Paragraph key={index}>{paragraph}</Paragraph>
            ))}
          </>
        );
      case "log":
        return (
          <>
            {activeEvidence.detail.summary && <SummaryCard>{activeEvidence.detail.summary}</SummaryCard>}
            <LogContainer>
              {activeEvidence.detail.body.map((line, index) => {
                const highlighted = highlightMap.includes(line);
                return highlighted ? <strong key={index}>{line}</strong> : <span key={index}>{line}</span>;
              })}
            </LogContainer>
          </>
        );
      case "email":
        return (
          <>
            <EmailHeader>
              <dt>From</dt>
              <dd>{activeEvidence.detail.headers.from}</dd>
              <dt>To</dt>
              <dd>{activeEvidence.detail.headers.to.join(", ")}</dd>
              {activeEvidence.detail.headers.cc && (
                <>
                  <dt>CC</dt>
                  <dd>{activeEvidence.detail.headers.cc.join(", ")}</dd>
                </>
              )}
              <dt>Subject</dt>
              <dd>{activeEvidence.detail.headers.subject}</dd>
              <dt>Sent</dt>
              <dd>{activeEvidence.detail.headers.timestamp}</dd>
            </EmailHeader>
            {activeEvidence.detail.body.map((paragraph, index) => (
              <Paragraph key={index}>{paragraph}</Paragraph>
            ))}
          </>
        );
      case "image":
        return (
          <>
            <ImagePreview as="figure">
              <img src={activeEvidence.detail.src} alt={activeEvidence.detail.caption ?? activeEvidence.title} />
              {activeEvidence.detail.caption && <figcaption>{activeEvidence.detail.caption}</figcaption>}
            </ImagePreview>
            {activeEvidence.detail.metadata && activeEvidence.detail.metadata.length > 0 && (
              <MetaRow>
                {activeEvidence.detail.metadata.map(({ label, value }) => (
                  <MetaBadge key={label}>
                    <strong>{label}</strong>
                    <span>{value}</span>
                  </MetaBadge>
                ))}
              </MetaRow>
            )}
          </>
        );
      case "data":
        return (
          <>
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    {activeEvidence.detail.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeEvidence.detail.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </TableWrapper>
            {activeEvidence.detail.insights && activeEvidence.detail.insights.length > 0 && (
              <div>
                <SectionTitle>Investigative Insights</SectionTitle>
                <InsightsList>
                  {activeEvidence.detail.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </InsightsList>
              </div>
            )}
            {activeEvidence.detail.footnote && <Paragraph>{activeEvidence.detail.footnote}</Paragraph>}
          </>
        );
      case "video":
        return (
          <>
            <div>
              <video controls style={{ width: "100%", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                <source src={activeEvidence.detail.url} />
              </video>
            </div>
            {activeEvidence.detail.description && <Paragraph>{activeEvidence.detail.description}</Paragraph>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <Dialog
            role="dialog"
            aria-modal="true"
            aria-label={`${activeEvidence.title} evidence viewer`}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, translateY: 24 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 0.96, translateY: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
              <CloseButton onClick={onClose} aria-label="Close">
              <X size={18} />
            </CloseButton>
            <Header>
              <TitleRow>
                <Title>{activeEvidence.title}</Title>
                {activeEvidence.tag && <Tag>{activeEvidence.tag}</Tag>}
              </TitleRow>
              {(activeEvidence.metadata || activeEvidence.relatedCharacters) && (
                <MetaRow>
                  {activeEvidence.metadata?.map(({ label, value }) => (
                    <MetaBadge key={`${activeEvidence.id}-${label}`}>
                      <strong>{label}</strong>
                      <span>{value}</span>
                    </MetaBadge>
                  ))}
                  {activeEvidence.relatedCharacters && activeEvidence.relatedCharacters.length > 0 && (
                    <MetaBadge>
                      <strong>Related</strong>
                      <span>{activeEvidence.relatedCharacters.join(", ")}</span>
                    </MetaBadge>
                  )}
                </MetaRow>
              )}
            </Header>
            <Body>{renderDetail()}</Body>
            <Footer>
              <span>{activeEvidence.type.toUpperCase()}</span>
              <NavControls>
                {totalItems > 1 && (
                  <>
                      <IconButton onClick={goPrev} aria-label="Previous evidence">
                      <ArrowLeft size={18} />
                    </IconButton>
                    <CountBubble>
                      {activeIndex + 1} / {totalItems}
                    </CountBubble>
                      <IconButton onClick={goNext} aria-label="Next evidence">
                      <ArrowRight size={18} />
                    </IconButton>
                  </>
                )}
              </NavControls>
            </Footer>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
