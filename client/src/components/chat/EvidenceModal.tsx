import { useEffect } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import type { Evidence } from "@/types";

interface EvidenceModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 60;
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  margin: auto;
  width: min(640px, 92vw);
  max-height: min(80vh, 720px);
  background: rgba(30, 30, 30, 0.92);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 70;
`;

const Header = styled.div`
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const MetaRow = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
  flex-wrap: wrap;
`;

const Content = styled.div`
  flex: 1;
  padding: 1.75rem;
  overflow-y: auto;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 999px;
  }
`;

const Footer = styled.div`
  padding: 1.25rem 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.65rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(33, 150, 243, 0.25);
  }
`;

const variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const typeLabel: Record<Evidence["type"], string> = {
  document: "Document",
  log: "Log File",
  email: "Email",
  image: "Image",
  video: "Video",
};

export function EvidenceModal({ evidence, onClose }: EvidenceModalProps) {
  useEffect(() => {
    if (!evidence) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [evidence, onClose]);

  return (
    <AnimatePresence>
      {evidence && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Modal
            role="dialog"
            aria-modal="true"
            aria-labelledby="evidence-modal-title"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Header>
              <Title id="evidence-modal-title">{evidence.title}</Title>
              <MetaRow>
                <span>{typeLabel[evidence.type]}</span>
                <span>Collected: {new Date(evidence.dateCollected).toLocaleString()}</span>
                <span>Importance: {evidence.importance.toUpperCase()}</span>
              </MetaRow>
            </Header>
            <Content>
              {typeof evidence.content === "string" ? (
                evidence.content
              ) : (
                <pre>{JSON.stringify(evidence.content, null, 2)}</pre>
              )}
            </Content>
            <Footer>
              <CloseButton type="button" onClick={onClose}>
                Close
              </CloseButton>
            </Footer>
          </Modal>
        </>
      )}
    </AnimatePresence>
  );
}

export default EvidenceModal;
