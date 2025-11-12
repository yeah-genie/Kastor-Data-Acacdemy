import { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Calendar, Sparkle } from "lucide-react";
import ForceGraph2D from "react-force-graph-2d";

type Status = "suspect" | "cleared" | "active" | "under-investigation";

export interface CharacterTimelineEvent {
  id: string;
  time: string;
  description: string;
  evidenceId?: string;
  importance: "low" | "medium" | "high";
}

export interface RelationshipEdge {
  targetId: string;
  type: "coworker" | "friend" | "conflict" | "suspicious";
  strength: number;
  notes?: string;
}

export interface CharacterProfileData {
  id: string;
  name: string;
  role: string;
  status: Status;
  trustLevel: number;
  avatar?: string;
  summary: string;
  background: string[];
  suspiciousActivity: string[];
  notes?: string[];
  timeline: CharacterTimelineEvent[];
  evidence: { id: string; title: string; importance: "low" | "medium" | "high" | "critical" }[];
  relationships: RelationshipEdge[];
}

interface TeamViewProps {
  characters: CharacterProfileData[];
  onOpenEvidence?: (evidenceId: string) => void;
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 320px) 1fr;
  gap: 1.5rem;
  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: rgba(15, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 2;
  }
`;

const CharacterScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 60vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: none;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const CharacterCard = styled.button<{ $active?: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.4)" : "rgba(255,255,255,0.06)")};
  border-radius: 16px;
  padding: 0.9rem;
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.15)" : "rgba(12, 12, 18, 0.55)")};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  min-width: 220px;
  text-align: left;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
    }
  }
`;

const Avatar = styled.div<{ $src?: string }>`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.darkGray};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.35);

  ${({ $src }) =>
    $src &&
    css`
      background-image: url(${$src});
      background-size: cover;
      background-position: center;
    `}
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

const Role = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const StatusBadge = styled.span<{ $status: Status }>`
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  width: fit-content;

  ${({ $status, theme }) => {
    switch ($status) {
      case "suspect":
        return css`
          background: rgba(244, 67, 54, 0.15);
          color: ${theme.colors.danger};
        `;
      case "under-investigation":
        return css`
          background: rgba(255, 152, 0, 0.18);
          color: ${theme.colors.secondary};
        `;
      case "cleared":
        return css`
          background: rgba(76, 175, 80, 0.18);
          color: ${theme.colors.success};
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);
        `;
    }
  }}
`;

const MainPane = styled.div`
  background: rgba(15, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 1;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
`;

const HeaderInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LargeAvatar = styled(Avatar)`
  width: 72px;
  height: 72px;
  border-radius: 20px;
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TrustTrack = styled.div`
  display: flex;
  gap: 0.35rem;
  align-items: center;
`;

const TrustBar = styled.div<{ $level: number }>`
  width: 120px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${({ $level }) => `${($level / 5) * 100}%`};
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(33, 150, 243, 0.9), rgba(76, 175, 80, 0.9));
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  border: none;
  border-radius: 12px;
  padding: 0.55rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ $active }) => ($active ? "rgba(33, 150, 243, 0.18)" : "rgba(255,255,255,0.08)")};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      background: rgba(33, 150, 243, 0.12);
    }
  }
`;

const TabPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 280px;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.9rem;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  padding-left: 1.6rem;

  &::before {
    content: "";
    position: absolute;
    left: 0.75rem;
    top: 0.2rem;
    bottom: 0.2rem;
    width: 2px;
    background: linear-gradient(180deg, rgba(33, 150, 243, 0.25), rgba(33, 150, 243, 0));
  }
`;

const TimelineEvent = styled.div<{ $importance: CharacterTimelineEvent["importance"] }>`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -0.85rem;
    top: 0.3rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $importance }) =>
      $importance === "high"
        ? "rgba(244, 67, 54, 0.9)"
        : $importance === "medium"
        ? "rgba(255, 152, 0, 0.9)"
        : "rgba(255, 255, 255, 0.5)"};
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.18);
  }
`;

const TimelineTime = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const EvidenceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EvidenceCard = styled.button<{ $importance: "low" | "medium" | "high" | "critical" }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.75rem 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      background: rgba(33, 150, 243, 0.12);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
    }
  }

  ${({ $importance }) =>
    $importance === "critical" &&
    css`
      border-color: rgba(244, 67, 54, 0.35);
    `}
`;

const RelationshipCanvas = styled.div`
  height: 320px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const RelationshipLegend = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
`;

const LegendItem = styled.span<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &::before {
    content: "";
    width: 14px;
    height: 4px;
    border-radius: 999px;
    background: ${({ $variant }) => $variant};
  }
`;

const SuspiciousToggle = styled.button<{ $active?: boolean }>`
  border-radius: 12px;
  border: none;
  padding: 0.5rem 0.8rem;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: ${({ $active }) => ($active ? "rgba(244, 67, 54, 0.18)" : "rgba(255,255,255,0.06)")};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(244, 67, 54, 0.12);
    }
  }
`;

const TAB_OPTIONS = ["background", "timeline", "evidence", "relationships"] as const;
type TabOption = (typeof TAB_OPTIONS)[number];

const relationshipColors: Record<RelationshipEdge["type"], string> = {
  coworker: "#42a5f5",
  friend: "#66bb6a",
  conflict: "#ef5350",
  suspicious: "#ffa726",
};

export const TeamView = ({ characters, onOpenEvidence }: TeamViewProps) => {
  const [activeCharacterId, setActiveCharacterId] = useState(characters[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<TabOption>("background");
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);

  useEffect(() => {
    if (!characters.find((character) => character.id === activeCharacterId) && characters.length > 0) {
      setActiveCharacterId(characters[0].id);
    }
  }, [characters, activeCharacterId]);

  const activeCharacter = characters.find((character) => character.id === activeCharacterId) ?? characters[0];

  const filteredRelationships = useMemo(() => {
    if (!activeCharacter) return [];
    return showSuspiciousOnly
      ? activeCharacter.relationships.filter((relationship) => relationship.type === "suspicious" || relationship.type === "conflict")
      : activeCharacter.relationships;
  }, [activeCharacter, showSuspiciousOnly]);

  const graphData = useMemo(() => {
    if (!activeCharacter) {
      return { nodes: [], links: [] };
    }
    const nodes = characters.map((character) => ({
      id: character.id,
      name: character.name,
      status: character.status,
      isActive: character.id === activeCharacter.id,
      trust: character.trustLevel,
    }));

    const links = filteredRelationships.map((relationship) => ({
      source: activeCharacter.id,
      target: relationship.targetId,
      type: relationship.type,
      strength: relationship.strength,
      notes: relationship.notes,
    }));

    return { nodes, links };
  }, [characters, activeCharacter, filteredRelationships]);

  const renderBackground = () => (
    <TabPanel
      key="background"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <h4 style={{ margin: 0, fontSize: "0.95rem", color: "rgba(255,255,255,0.75)" }}>Background</h4>
        <BulletList>
          {activeCharacter.background.map((item, index) => (
            <li key={`background-${index}`}>{item}</li>
          ))}
        </BulletList>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <h4 style={{ margin: 0, fontSize: "0.95rem", color: "rgba(255,255,255,0.75)" }}>Suspicious activity</h4>
        <BulletList>
          {activeCharacter.suspiciousActivity.map((item, index) => (
            <li key={`suspicious-${index}`}>{item}</li>
          ))}
        </BulletList>
      </div>

      {activeCharacter.notes?.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <h4 style={{ margin: 0, fontSize: "0.95rem", color: "rgba(255,255,255,0.75)" }}>Notes</h4>
          <BulletList>
            {activeCharacter.notes.map((item, index) => (
              <li key={`notes-${index}`}>{item}</li>
            ))}
          </BulletList>
        </div>
      ) : null}
    </TabPanel>
  );

  const renderTimeline = () => (
    <TabPanel
      key="timeline"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Timeline>
        {activeCharacter.timeline.map((event) => (
          <TimelineEvent key={event.id} $importance={event.importance}>
            <TimelineTime>
              <Calendar size={12} />
              {event.time}
            </TimelineTime>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>{event.description}</div>
            {event.evidenceId ? (
              <button
                type="button"
                onClick={() => onOpenEvidence?.(event.evidenceId!)}
                style={{
                  background: "rgba(33, 150, 243, 0.12)",
                  border: "1px solid rgba(33, 150, 243, 0.25)",
                  color: "rgba(255,255,255,0.85)",
                  borderRadius: "10px",
                  padding: "0.4rem 0.65rem",
                  fontSize: "0.75rem",
                  width: "fit-content",
                }}
              >
                View evidence
              </button>
            ) : null}
          </TimelineEvent>
        ))}
      </Timeline>
    </TabPanel>
  );

  const renderEvidence = () => (
    <TabPanel
      key="evidence"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <EvidenceList>
        {activeCharacter.evidence.map((item) => (
          <EvidenceCard
            key={item.id}
            $importance={item.importance}
            type="button"
            onClick={() => onOpenEvidence?.(item.id)}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>ID: {item.id}</div>
            </div>
            <Badge $variant="importance">{item.importance.toUpperCase()}</Badge>
          </EvidenceCard>
        ))}
      </EvidenceList>
    </TabPanel>
  );

  const renderRelationships = () => (
    <TabPanel
      key="relationships"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ gap: "0.85rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <RelationshipLegend>
          <LegendItem $variant={relationshipColors.coworker}>Coworker</LegendItem>
          <LegendItem $variant={relationshipColors.friend}>Friend</LegendItem>
          <LegendItem $variant={relationshipColors.conflict}>Conflict</LegendItem>
          <LegendItem $variant={relationshipColors.suspicious}>Suspicious</LegendItem>
        </RelationshipLegend>
        <SuspiciousToggle
          type="button"
          $active={showSuspiciousOnly}
          onClick={() => setShowSuspiciousOnly((prev) => !prev)}
        >
          <AlertTriangle size={14} />
          Suspicious only
        </SuspiciousToggle>
      </div>
      <RelationshipCanvas>
        <ForceGraph2D
          width={undefined}
          height={undefined}
          graphData={graphData}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = node.isActive ? 16 / globalScale : 12 / globalScale;
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.fillStyle = node.isActive ? "#ffffff" : "rgba(255,255,255,0.8)";
            const textWidth = ctx.measureText(label).width;
            const padding = 6;
            ctx.fillStyle = node.isActive ? "rgba(33,150,243,0.35)" : "rgba(0,0,0,0.4)";
            ctx.beginPath();
            ctx.roundRect(node.x - textWidth / 2 - padding, node.y - fontSize, textWidth + padding * 2, fontSize + padding, 8);
            ctx.fill();
            ctx.fillStyle = node.isActive ? "#ffffff" : "rgba(255,255,255,0.85)";
            ctx.fillText(label, node.x - textWidth / 2, node.y);
          }}
          linkColor={(link: any) => relationshipColors[link.type as RelationshipEdge["type"]]}
          linkWidth={(link: any) => (link.type === "suspicious" ? 2.8 : link.type === "conflict" ? 2.4 : 1.8)}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleColor={(link: any) => relationshipColors[link.type as RelationshipEdge["type"]]}
          nodeRelSize={6}
          autoPauseRedraw={false}
          cooldownTicks={60}
        />
      </RelationshipCanvas>
      <BulletList>
        {filteredRelationships.length ? (
          filteredRelationships.map((relationship) => {
            const target = characters.find((character) => character.id === relationship.targetId);
            return (
              <li key={`${activeCharacter.id}-${relationship.targetId}`}>
                <strong>{target?.name ?? relationship.targetId}</strong> · {relationship.type} · Strength {relationship.strength}
                {relationship.notes ? ` · ${relationship.notes}` : ""}
              </li>
            );
          })
        ) : (
          <li>No relationships match the current filters.</li>
        )}
      </BulletList>
    </TabPanel>
  );

  if (!activeCharacter) {
    return null;
  }

  return (
    <Layout>
      <Sidebar>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <h3 style={{ margin: 0, fontSize: "0.85rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>
            Team roster
          </h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
            Select a profile to inspect their background, activity, and connections.
          </p>
        </div>
        <CharacterScroll>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              type="button"
              $active={character.id === activeCharacterId}
              onClick={() => {
                setActiveCharacterId(character.id);
                setActiveTab("background");
              }}
            >
              <Avatar $src={character.avatar}>{character.name[0]}</Avatar>
              <CardInfo>
                <Name>{character.name}</Name>
                <Role>{character.role}</Role>
                <StatusBadge $status={character.status}>
                  {character.status.replace("-", " ")}
                </StatusBadge>
              </CardInfo>
            </CharacterCard>
          ))}
        </CharacterScroll>
      </Sidebar>

      <MainPane>
        <ProfileHeader>
          <HeaderInfo>
            <LargeAvatar $src={activeCharacter.avatar}>{activeCharacter.name[0]}</LargeAvatar>
            <HeaderMeta>
              <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{activeCharacter.name}</div>
              <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)" }}>
                {activeCharacter.role}
              </div>
              <TrustTrack>
                <TrustBar $level={activeCharacter.trustLevel} />
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
                  Trust {activeCharacter.trustLevel}/5
                </span>
              </TrustTrack>
            </HeaderMeta>
          </HeaderInfo>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <Sparkle size={16} />
            {activeCharacter.summary}
          </div>
        </ProfileHeader>

        <TabBar>
          {TAB_OPTIONS.map((tab) => (
            <TabButton
              key={tab}
              type="button"
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace("-", " ")}
            </TabButton>
          ))}
        </TabBar>

        <AnimatePresence mode="wait">
          {activeTab === "background"
            ? renderBackground()
            : activeTab === "timeline"
            ? renderTimeline()
            : activeTab === "evidence"
            ? renderEvidence()
            : renderRelationships()}
        </AnimatePresence>
      </MainPane>
    </Layout>
  );
};

export default TeamView;
