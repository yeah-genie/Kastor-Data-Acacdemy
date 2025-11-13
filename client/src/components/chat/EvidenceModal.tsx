import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import type { Evidence } from "@/types";

interface EvidenceModalProps {
  evidence: Evidence | null;
  onClose: () => void;
  relatedEvidence?: Evidence[];
  onNavigate?: (evidenceId: string) => void;
}

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2.5rem);
  z-index: 200;
`;

const ModalBody = styled(motion.div)`
  width: min(900px, 100%);
  max-height: 90vh;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 0.85rem;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

const PreviewBlock = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.3);
  padding: 1.25rem;
`;

const EvidenceContent = styled.pre`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.white};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
`;

const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const RelatedItem = styled.button`
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.white};
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(33, 150, 243, 0.15);
    }
  }
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
`;

const Tag = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const renderContentPreview = (evidence: Evidence): ReactNode => {
  switch (evidence.type) {
    case "image":
      return (
        <PreviewBlock>
          <img
            src={typeof evidence.content === "string" ? evidence.content : undefined}
            alt={evidence.title}
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </PreviewBlock>
      );
    case "video":
      return (
        <PreviewBlock>
          <video
            controls
            style={{ width: "100%", borderRadius: "12px" }}
            src={typeof evidence.content === "string" ? evidence.content : undefined}
          />
        </PreviewBlock>
      );
    case "email":
    case "document":
    case "log":
    case "data":
    default:
      return (
        <PreviewBlock>
          <EvidenceContent>
            {typeof evidence.content === "string"
              ? evidence.content
              : JSON.stringify(evidence.content, null, 2)}
          </EvidenceContent>
        </PreviewBlock>
      );
  }
};

export const EvidenceModal = ({ evidence, onClose, relatedEvidence, onNavigate }: EvidenceModalProps) => {
  return (
    <AnimatePresence>
      {evidence ? (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalBody
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <div>
                <Title>{evidence.title}</Title>
                <Meta>
                  <Tag>{evidence.type.toUpperCase()}</Tag>
                  <span>{new Date(evidence.dateCollected).toLocaleString()}</span>
                  {evidence.relatedTo.length ? (
                    <span>Related to: {evidence.relatedTo.join(", ")}</span>
                  ) : null}
                </Meta>
              </div>
              <CloseButton type="button" onClick={onClose}>
                Close
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              {renderContentPreview(evidence)}

              {relatedEvidence?.length ? (
                <div>
                  <SectionTitle>Related Evidence</SectionTitle>
                  <RelatedList>
                    {relatedEvidence.map((item) => (
                      <RelatedItem
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate?.(item.id)}
                      >
                        <strong>{item.title}</strong>
                        <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>
                          {item.type.toUpperCase()} · {item.importance.toUpperCase()}
                        </div>
                      </RelatedItem>
                    ))}
                  </RelatedList>
                </div>
              ) : null}
            </ModalContent>
          </ModalBody>
        </Backdrop>
      ) : null}
    </AnimatePresence>
  );
};

export default EvidenceModal;
