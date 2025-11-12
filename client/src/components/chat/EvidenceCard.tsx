import styled from "styled-components";
import type { Evidence } from "@/types";

interface EvidenceCardProps {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
}

const EvidenceCardContainer = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.white};
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 10px 24px rgba(33, 150, 243, 0.2);
  }
`;

const EvidenceIcon = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-right: 0.85rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 1.2rem;
`;

const EvidenceContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const EvidenceTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.white};
`;

const EvidenceMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.lightGray};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ViewHint = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const evidenceTypeEmoji: Record<Evidence["type"], string> = {
  document: "📄",
  log: "📊",
  email: "📧",
  image: "🖼️",
  video: "🎥",
};

export function EvidenceCard({ evidence, onView }: EvidenceCardProps) {
  return (
    <EvidenceCardContainer type="button" onClick={() => onView(evidence)}>
      <EvidenceIcon>{evidenceTypeEmoji[evidence.type]}</EvidenceIcon>
      <EvidenceContent>
        <EvidenceTitle>{evidence.title}</EvidenceTitle>
        <EvidenceMeta>{evidence.importance.toUpperCase()} · Tap to inspect</EvidenceMeta>
        <ViewHint>View evidence</ViewHint>
      </EvidenceContent>
    </EvidenceCardContainer>
  );
}

export default EvidenceCard;
