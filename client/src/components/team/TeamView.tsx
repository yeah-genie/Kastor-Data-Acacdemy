import { useMemo, useState } from "react";
import styled from "styled-components";
import { Users, Sparkles, Link2, Star, NotebookPen } from "lucide-react";

import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import type { CharacterEvidence, Evidence } from "@/lib/stores/useDetectiveGame";

const Layout = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 280px minmax(0, 1fr);
  }
`;

const Panel = styled.div`
  background: rgba(13, 16, 28, 0.85);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow:
    0 24px 48px rgba(6, 9, 18, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${({ theme }) => theme.colors.white};
`;

const CharacterList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const CharacterButton = styled.button<{ $active?: boolean }>`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 18px;
  border: 1px solid ${({ $active }) =>
    $active ? "rgba(0, 217, 255, 0.35)" : "rgba(255, 255, 255, 0.05)"};
  background: ${({ $active }) =>
    $active ? "rgba(0, 217, 255, 0.12)" : "rgba(255, 255, 255, 0.03)"};
  color: ${({ theme }) => theme.colors.white};
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 217, 255, 0.2);
  }
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Name = styled.span`
  font-size: 0.98rem;
  font-weight: 600;
`;

const Role = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const Trust = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const TabBar = styled.div`
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  align-self: flex-start;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: none;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : "rgba(255, 255, 255, 0.6)"};
  background: ${({ $active }) =>
    $active ? "rgba(0, 217, 255, 0.22)" : "transparent"};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const DetailSection = styled.div`
  display: grid;
  gap: 1rem;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 1.1rem;
  display: grid;
  gap: 0.6rem;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const ItemList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.45rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.82rem;
`;

const RelationshipGrid = styled.div`
  display: grid;
  gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const RelationshipCard = styled.div`
  border-radius: 14px;
  border: 1px solid rgba(0, 217, 255, 0.12);
  background: rgba(0, 217, 255, 0.08);
  padding: 0.75rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.white};
`;

const EmptyState = styled.div`
  padding: 2.2rem 1.25rem;
  border-radius: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const tabs = [
  { id: "background", label: "Background" },
  { id: "activity", label: "Suspicious Activity" },
  { id: "relationships", label: "Relationships" },
];

type TabKey = (typeof tabs)[number]["id"];

function renderTrustStars(trustLevel: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      size={12}
      className={index < trustLevel ? "text-amber-300" : "text-white/15"}
      fill={index < trustLevel ? "currentColor" : "none"}
    />
  ));
}

export function TeamView() {
  const characterEvidence = useDetectiveGame((state) =>
    state.getEvidenceByType("CHARACTER") as CharacterEvidence[]
  );
  const allEvidence = useDetectiveGame((state) => state.evidenceCollected);

  const [selected, setSelected] = useState<CharacterEvidence | null>(
    characterEvidence[0] ?? null
  );
  const [tab, setTab] = useState<TabKey>("background");

  const relatedEvidence = useMemo(() => {
    if (!selected) return [];
    const connectionIds = new Set((selected.connections ?? []).map((conn) => conn.to));
    if (connectionIds.size === 0) {
      return [];
    }
    return allEvidence.filter((item) => connectionIds.has(item.id));
  }, [selected, allEvidence]);

  return (
    <Layout>
      <Panel>
        <Header>
          <Users size={20} strokeWidth={1.6} />
          <div>
            <strong>Team Members</strong>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
              Select a suspect to review their dossier.
            </p>
          </div>
        </Header>

        <CharacterList>
          {characterEvidence.map((character) => (
            <CharacterButton
              key={character.id}
              $active={selected?.id === character.id}
              onClick={() => setSelected(character)}
            >
              <Avatar>
                {character.photo ? (
                  <img src={character.photo} alt={character.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    <Users className="w-4 h-4" />
                  </div>
                )}
              </Avatar>
              <CharacterInfo>
                <Name>{character.name}</Name>
                <Role>{character.role}</Role>
                <Trust>
                  {renderTrustStars(character.trustLevel)}
                  <span>{character.trustLevel}/5 Trust</span>
                </Trust>
              </CharacterInfo>
            </CharacterButton>
          ))}
        </CharacterList>
      </Panel>

      <Panel>
        {selected ? (
          <>
            <Header>
              <Sparkles size={20} strokeWidth={1.6} />
              <div>
                <strong>{selected.name}</strong>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                  Status: {selected.status.toUpperCase()}
                </p>
              </div>
            </Header>

            <TabBar>
              {tabs.map((item) => (
                <TabButton
                  key={item.id}
                  $active={tab === item.id}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </TabButton>
              ))}
            </TabBar>

            <DetailSection>
              {tab === "background" && (
                <>
                  <Section>
                    <SectionTitle>
                      <NotebookPen size={16} />
                      Background & Profile
                    </SectionTitle>
                    <ItemList>
                      {selected.background.length > 0 ? (
                        selected.background.map((entry) => <li key={entry}>{entry}</li>)
                      ) : (
                        <li>No background information recorded.</li>
                      )}
                    </ItemList>
                  </Section>
                  {selected.personality && (
                    <Section>
                      <SectionTitle>
                        <Sparkles size={16} />
                        Personality Notes
                      </SectionTitle>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
                        {selected.personality}
                      </p>
                    </Section>
                  )}
                </>
              )}

              {tab === "activity" && (
                <Section>
                  <SectionTitle>
                    <Link2 size={16} />
                    Suspicious Activity
                  </SectionTitle>
                  <ItemList>
                    {selected.suspiciousActivity.length > 0 ? (
                      selected.suspiciousActivity.map((entry) => <li key={entry}>{entry}</li>)
                    ) : (
                      <li>Suspicious behaviour not logged yet.</li>
                    )}
                  </ItemList>
                </Section>
              )}

              {tab === "relationships" && (
                <Section>
                  <SectionTitle>
                    <Users size={16} strokeWidth={1.6} />
                    Related Evidence & Connections
                  </SectionTitle>
                  {relatedEvidence.length === 0 ? (
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
                      관련된 증거가 아직 수집되지 않았습니다.
                    </p>
                  ) : (
                    <RelationshipGrid>
                      {relatedEvidence.map((item) => (
                        <RelationshipCard key={item.id}>
                          <strong>{item.title}</strong>
                          <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", opacity: 0.7 }}>
                            Type: {item.type}
                          </div>
                          {item.importance && (
                            <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", opacity: 0.7 }}>
                              Importance: {item.importance.toUpperCase()}
                            </div>
                          )}
                        </RelationshipCard>
                      ))}
                    </RelationshipGrid>
                  )}
                </Section>
              )}
            </DetailSection>
          </>
        ) : (
          <EmptyState>왼쪽에서 캐릭터를 선택하면 상세 정보가 표시됩니다.</EmptyState>
        )}
      </Panel>
    </Layout>
  );
}

export default TeamView;
