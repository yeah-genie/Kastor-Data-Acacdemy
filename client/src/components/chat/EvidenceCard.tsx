import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Mail,
  Image as ImageIcon,
  Video,
  Database,
} from "lucide-react";
import styled from "styled-components";
import type { Evidence } from "@/types";

interface EvidenceCardProps {
  evidence: Evidence;
  onView?: (evidence: Evidence) => void;
}

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: rgba(30, 30, 30, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(33, 150, 243, 0.12);
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
`;

const Badge = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(33, 150, 243, 0.15);
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const ViewButton = styled.button`
  align-self: flex-start;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(33, 150, 243, 0.28);
    }
  }
`;

const iconForType = (type: Evidence["type"]): ReactNode => {
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

export const EvidenceCard = ({ evidence, onView }: EvidenceCardProps) => {
  return (
    <Card
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Header>
        <IconWrapper>{iconForType(evidence.type)}</IconWrapper>
        <div>
          <Title>{evidence.title}</Title>
          <Meta>{new Date(evidence.dateCollected).toLocaleString()}</Meta>
        </div>
      </Header>

      <Meta>
        <Badge>{evidence.importance.toUpperCase()}</Badge>
        {evidence.relatedTo.length ? (
          <span>Linked to: {evidence.relatedTo.join(", ")}</span>
        ) : null}
        {evidence.isNew ? <Badge>NEW</Badge> : null}
      </Meta>

      {onView ? (
        <ViewButton type="button" onClick={() => onView(evidence)}>
          View
        </ViewButton>
      ) : null}
    </Card>
  );
};

export default EvidenceCard;
