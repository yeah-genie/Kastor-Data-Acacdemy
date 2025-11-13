import { useEffect, useMemo, useState, type ReactNode } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  BarChart3,
  BookMarked,
  Clock,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import {
  getAllSessions,
  type AnalyticsEvent,
  type UserSession,
} from "@/utils/analytics";
import { useGameStore } from "@/store/gameStore";
import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface EpisodeMeta {
  id: string;
  title: string;
  difficulty: number;
  estTime: string;
  unlocked: boolean;
}

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  achieved: boolean;
  progress?: string;
};

const ProgressTab = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const {
    gameProgress,
    completedEpisodes,
    collectedEvidence,
    currentEpisode,
  } = useGameStore((state) => ({
    gameProgress: state.gameProgress,
    completedEpisodes: state.completedEpisodes,
    collectedEvidence: state.collectedEvidence,
    currentEpisode: state.currentEpisode,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSessions(getAllSessions());
  }, []);

  const analyticsSummary = useMemo(() => {
    const allEvents = sessions.flatMap((session) => session.events);
    const answerEvents = allEvents.filter((event) => event.type === "answer_attempt");
    const choiceEvents = allEvents.filter((event) => event.type === "choice_made");
    const hintEvents = allEvents.filter((event) => event.type === "hint_used");
    const evidenceEvents = allEvents.filter((event) => event.type === "evidence_collected");
    const sceneCompleteEvents = allEvents.filter((event) => event.type === "scene_complete");

    const correctAnswers = answerEvents.filter((event) => event.data?.isCorrect).length;
    const incorrectAnswers = answerEvents.length - correctAnswers;
    const accuracy = answerEvents.length
      ? Math.round((correctAnswers / answerEvents.length) * 100)
      : null;

    const completionDurations = sessions
      .filter((session) => session.endTime)
      .map((session) => (session.endTime ?? 0) - session.startTime);

    const totalPlayTimeMs = completionDurations.reduce((acc, value) => acc + value, 0);

    const averageCompletionTimeMs =
      completionDurations.length > 0
        ? Math.round(totalPlayTimeMs / completionDurations.length)
        : null;

    const fastestCompletionMs =
      completionDurations.length > 0 ? Math.min(...completionDurations) : null;

    const accuracyTrend = sessions.map((session, index) => {
      const sessionEvents = session.events.filter((event) => event.type === "answer_attempt");
      const sessionCorrect = sessionEvents.filter((event) => event.data?.isCorrect).length;
      const percentage = sessionEvents.length
        ? Math.round((sessionCorrect / sessionEvents.length) * 100)
        : 0;
      return {
        name: `Session ${index + 1}`,
        accuracy: percentage,
      };
    });

    const categorizeScene = (event: AnalyticsEvent) => {
      const sceneId = event.sceneId ?? "";
      if (sceneId.includes("data") || sceneId.includes("log")) return "데이터 분석";
      if (sceneId.includes("chat") || sceneId.includes("dialog")) return "대화/심문";
      if (sceneId.includes("file") || sceneId.includes("evidence")) return "증거 정리";
      if (sceneId.includes("team")) return "팀 협업";
      return "종합";
    };

    const categoryStats = answerEvents.reduce<Record<string, { total: number; correct: number }>>(
      (acc, event) => {
        const category = categorizeScene(event);
        if (!acc[category]) {
          acc[category] = { total: 0, correct: 0 };
        }
        acc[category].total += 1;
        if (event.data?.isCorrect) {
          acc[category].correct += 1;
        }
        return acc;
      },
      {},
    );

    const categoryPerformance = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      accuracy: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));

    const strengths = [...categoryPerformance]
      .filter((item) => item.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 2);
    const weaknesses = [...categoryPerformance]
      .filter((item) => item.accuracy > 0 && item.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2);

    const hintlessCompletion = sessions.some(
      (session) =>
        session.endTime &&
        !session.events.some((event) => event.type === "hint_used"),
    );

    return {
      accuracy,
      totalHints: hintEvents.length,
      totalEvidenceCollected: evidenceEvents.length,
      totalChoices: choiceEvents.length,
      totalScenesCompleted: sceneCompleteEvents.length,
      totalPlayTimeMs,
      averageCompletionTimeMs,
      accuracyTrend,
      strengths,
      weaknesses,
      correctAnswers,
      incorrectAnswers,
      fastestCompletionMs,
      hintlessCompletion,
    };
  }, [sessions]);

  const episodeCatalog = useMemo<EpisodeMeta[]>(
    () => [
      {
        id: "episode-1",
        title: "Episode 1 · The Missing Balance Patch",
        difficulty: 2,
        estTime: "35m",
        unlocked: true,
      },
      {
        id: "episode-2",
        title: "Episode 2 · Ranking Manipulation",
        difficulty: 3,
        estTime: "45m",
        unlocked: completedEpisodes.includes("episode-1"),
      },
      {
        id: "episode-3",
        title: "Episode 3 · The Perfect Victory",
        difficulty: 4,
        estTime: "55m",
        unlocked: completedEpisodes.includes("episode-2"),
      },
      {
        id: "episode-4",
        title: "Episode 4 · The Data Breach",
        difficulty: 5,
        estTime: "65m",
        unlocked: true,
      },
    ],
    [completedEpisodes],
  );

  const formatDuration = (ms?: number | null) => {
    if (!ms) return "-";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${totalSeconds % 60}s`;
  };

  const achievements: Achievement[] = [
    {
      id: "first-evidence",
      title: "첫 증거 수집",
      description: "증거를 최소 1개 이상 수집하세요.",
      icon: <BookMarked size={20} />,
      achieved: collectedEvidence.length > 0,
      progress: `${collectedEvidence.length} / 1`,
    },
    {
      id: "hintless-completion",
      title: "힌트 없이 완료",
      description: "힌트 사용 없이 에피소드를 클리어하세요.",
      icon: <ShieldCheck size={20} />,
      achieved: analyticsSummary.hintlessCompletion && completedEpisodes.length > 0,
      progress:
        analyticsSummary.hintlessCompletion
          ? "완료"
          : `${analyticsSummary.totalHints}회 힌트 사용`,
    },
    {
      id: "perfect-analysis",
      title: "완벽한 분석",
      description: "정답률 90% 이상을 달성하세요.",
      icon: <Target size={20} />,
      achieved: (analyticsSummary.accuracy ?? 0) >= 90,
      progress: `${analyticsSummary.accuracy ?? 0}% / 90%`,
    },
    {
      id: "speed-runner",
      title: "빠른 해결",
      description: "한 세션을 30분 이내로 클리어하세요.",
      icon: <Clock size={20} />,
      achieved:
        (analyticsSummary.fastestCompletionMs ?? Infinity) <= 30 * 60 * 1000,
      progress: formatDuration(analyticsSummary.fastestCompletionMs),
    },
  ];

  const statsCards = [
    {
      title: "전체 진행률",
      value: `${Math.round(gameProgress)}%`,
      subtitle: `${completedEpisodes.length}개 에피소드 완료`,
      icon: <Activity size={22} />,
    },
    {
      title: "수집한 증거",
      value: `${collectedEvidence.length}`,
      subtitle: `${analyticsSummary.totalEvidenceCollected}건 기록됨`,
      icon: <BookMarked size={22} />,
    },
    {
      title: "정답률",
      value:
        analyticsSummary.accuracy !== null
          ? `${analyticsSummary.accuracy}%`
          : "데이터 없음",
      subtitle: `${analyticsSummary.correctAnswers} 정답 · ${analyticsSummary.incorrectAnswers} 오답`,
      icon: <Target size={22} />,
    },
    {
      title: "플레이 시간",
      value: formatDuration(analyticsSummary.totalPlayTimeMs),
      subtitle: `${sessions.length}회 세션`,
      icon: <Clock size={22} />,
    },
  ];

  const averageCompletionTime = formatDuration(analyticsSummary.averageCompletionTimeMs);
  const hintFrequency = sessions.length
    ? (analyticsSummary.totalHints / sessions.length).toFixed(1)
    : "0";

  return (
    <PageContainer>
      <SectionTitle>조사 진행 현황</SectionTitle>

      <CardGrid>
        {statsCards.map((card) => (
          <MetricCard key={card.title} as={motion.article} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <MetricHeader>
              <MetricIcon>{card.icon}</MetricIcon>
              <MetricTitle>{card.title}</MetricTitle>
            </MetricHeader>
            <MetricValue>{card.value}</MetricValue>
            <MetricSubtitle>{card.subtitle}</MetricSubtitle>
          </MetricCard>
        ))}
      </CardGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>에피소드 상태</SectionTitle>
          <SectionSubtitle>진행 상황을 확인하고 재도전하세요.</SectionSubtitle>
        </SectionHeader>
        <EpisodeGrid>
          {episodeCatalog.map((episode) => {
            const isCompleted = completedEpisodes.includes(episode.id);
            const isCurrent = currentEpisode === episode.id;
            const statusLabel = isCompleted
              ? "완료"
              : isCurrent
                ? "진행중"
                : episode.unlocked
                  ? "재도전 가능"
                  : "잠김";
            return (
              <EpisodeCard key={episode.id} $locked={!episode.unlocked}>
                {!episode.unlocked && (
                  <LockedOverlay>
                    <Lock size={18} />
                    <span>잠김</span>
                  </LockedOverlay>
                )}
                <EpisodeHeader>
                  <EpisodeBadge $status={statusLabel}>{statusLabel}</EpisodeBadge>
                  <EpisodeDifficulty>
                    <Star size={14} /> 난이도 {episode.difficulty}
                  </EpisodeDifficulty>
                </EpisodeHeader>
                <EpisodeTitle>{episode.title}</EpisodeTitle>
                <EpisodeMeta>예상 소요 시간 · {episode.estTime}</EpisodeMeta>
                <EpisodeActions>
                  <EpisodeButton type="button" disabled={!episode.unlocked}>
                    {isCompleted ? "재도전" : "진행"}
                  </EpisodeButton>
                  {isCurrent && (
                    <EpisodeStatusPill>
                      <RefreshCcw size={14} />
                      마지막 진행 중
                    </EpisodeStatusPill>
                  )}
                </EpisodeActions>
              </EpisodeCard>
            );
          })}
        </EpisodeGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>업적 & 배지</SectionTitle>
          <SectionSubtitle>조사 실력을 증명하고 배지를 모아보세요.</SectionSubtitle>
        </SectionHeader>
        <AchievementGrid>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} $achieved={achievement.achieved}>
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <AchievementContent>
                <AchievementTitle>{achievement.title}</AchievementTitle>
                <AchievementDescription>{achievement.description}</AchievementDescription>
                <AchievementProgress>{achievement.progress}</AchievementProgress>
              </AchievementContent>
              <AchievementStatus>
                {achievement.achieved ? (
                  <>
                    <Trophy size={18} />
                    달성 완료
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    도전 중
                  </>
                )}
              </AchievementStatus>
            </AchievementCard>
          ))}
        </AchievementGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>통계 & 분석</SectionTitle>
          <SectionSubtitle>K-LIF 분석을 위한 핵심 지표</SectionSubtitle>
        </SectionHeader>
        <StatisticsGrid>
          <StatisticsCard>
            <StatisticsTitle>평균 완료 시간</StatisticsTitle>
            <StatisticsValue>{averageCompletionTime}</StatisticsValue>
            <StatisticsHint>세션 {sessions.length}회 기준</StatisticsHint>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsTitle>힌트 사용 빈도</StatisticsTitle>
            <StatisticsValue>{hintFrequency} 회 / 세션</StatisticsValue>
            <StatisticsHint>총 힌트 {analyticsSummary.totalHints}회</StatisticsHint>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsTitle>총 선택지</StatisticsTitle>
            <StatisticsValue>{analyticsSummary.totalChoices}</StatisticsValue>
            <StatisticsHint>정답 {analyticsSummary.correctAnswers} · 오답 {analyticsSummary.incorrectAnswers}</StatisticsHint>
          </StatisticsCard>
          <StatisticsChartCard>
            <StatisticsTitle>정답률 추이</StatisticsTitle>
            <ChartWrapper>
              {analyticsSummary.accuracyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsSummary.accuracyTrend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(20,20,20,0.9)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#2196F3" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState>아직 수집된 정답률 데이터가 없습니다.</EmptyChartState>
              )}
            </ChartWrapper>
          </StatisticsChartCard>
        </StatisticsGrid>

        <StrengthWeaknessGrid>
          <StrengthCard>
            <StrengthTitle>강점 분야</StrengthTitle>
            {analyticsSummary.strengths.length > 0 ? (
              analyticsSummary.strengths.map((item) => (
                <StrengthItem key={item.category}>
                  <StrengthIcon $variant="strength">
                    <ShieldCheck size={16} />
                  </StrengthIcon>
                  <div>
                    <StrengthLabel>{item.category}</StrengthLabel>
                    <StrengthScore>{item.accuracy}% 정답률</StrengthScore>
                  </div>
                </StrengthItem>
              ))
            ) : (
              <PlaceholderText>강점 데이터가 아직 부족합니다.</PlaceholderText>
            )}
          </StrengthCard>
          <StrengthCard>
            <StrengthTitle>보완이 필요한 분야</StrengthTitle>
            {analyticsSummary.weaknesses.length > 0 ? (
              analyticsSummary.weaknesses.map((item) => (
                <StrengthItem key={item.category}>
                  <StrengthIcon $variant="weakness">
                    <Target size={16} />
                  </StrengthIcon>
                  <div>
                    <StrengthLabel>{item.category}</StrengthLabel>
                    <StrengthScore>{item.accuracy}% 정답률</StrengthScore>
                  </div>
                </StrengthItem>
              ))
            ) : (
              <PlaceholderText>더 많은 플레이 데이터를 수집해보세요.</PlaceholderText>
            )}
          </StrengthCard>
        </StrengthWeaknessGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>리더보드</SectionTitle>
          <SectionSubtitle>Coming Soon · 친구들과 순위를 겨뤄보세요.</SectionSubtitle>
        </SectionHeader>
        <LeaderboardPlaceholder>
          <Lock size={28} />
          <h4>Leaderboard Coming Soon</h4>
          <p>
            친구와 비교하고 주간 챌린지를 기록할 수 있는 리더보드를 준비 중입니다.
          </p>
        </LeaderboardPlaceholder>
      </Section>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  color: ${({ theme }) => theme.colors.white};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.2rem, 2vw, 1.4rem);
  font-weight: 700;
`;

const SectionSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.95rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MetricIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.primary};
`;

const MetricTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
`;

const MetricValue = styled.span`
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const MetricSubtitle = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
`;

const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
`;

const EpisodeCard = styled.article<{ $locked: boolean }>`
  position: relative;
  border-radius: 18px;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: ${({ $locked }) => ($locked ? 0.5 : 1)};
`;

const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border-radius: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const EpisodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EpisodeBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ theme, $status }) => {
    switch ($status) {
      case "완료":
        return "rgba(76, 175, 80, 0.18)";
      case "진행중":
        return "rgba(33, 150, 243, 0.18)";
      case "재도전 가능":
        return "rgba(255, 152, 0, 0.18)";
      default:
        return "rgba(255, 255, 255, 0.12)";
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case "완료":
        return "#6ee7b7";
      case "진행중":
        return theme.colors.primary;
      case "재도전 가능":
        return theme.colors.secondary;
      default:
        return "rgba(255, 255, 255, 0.65)";
    }
  }};
`;

const EpisodeDifficulty = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
`;

const EpisodeTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const EpisodeMeta = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
`;

const EpisodeActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const EpisodeButton = styled.button`
  padding: 0.55rem 1.2rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.8), rgba(33, 150, 243, 0.4));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) and (pointer: fine) {
    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(33, 150, 243, 0.35);
    }
  }
`;

const EpisodeStatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.8);
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const AchievementCard = styled.article<{ $achieved: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 16px;
  background: ${({ $achieved }) =>
    $achieved ? "rgba(76, 175, 80, 0.14)" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.32);
`;

const AchievementIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.primary};
`;

const AchievementContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const AchievementTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const AchievementDescription = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
`;

const AchievementProgress = styled.span`
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
`;

const AchievementStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
`;

const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const StatisticsCard = styled.div`
  padding: 1.2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const StatisticsChartCard = styled(StatisticsCard)`
  min-height: 220px;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const StatisticsTitle = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
`;

const StatisticsValue = styled.span`
  font-size: 1.35rem;
  font-weight: 700;
`;

const StatisticsHint = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const ChartWrapper = styled.div`
  flex: 1;
`;

const EmptyChartState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
`;

const StrengthWeaknessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const StrengthCard = styled.div`
  padding: 1.2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StrengthTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const StrengthItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StrengthIcon = styled.span<{ $variant: "strength" | "weakness" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $variant }) =>
    $variant === "strength" ? "rgba(76, 175, 80, 0.18)" : "rgba(244, 67, 54, 0.18)"};
  color: ${({ $variant }) => ($variant === "strength" ? "#6ee7b7" : "#ff8a80")};
`;

const StrengthLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
`;

const StrengthScore = styled.span`
  display: block;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.6);
`;

const PlaceholderText = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
`;

const LeaderboardPlaceholder = styled.div`
  border-radius: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  align-items: center;
  text-align: center;

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.65);
    max-width: 420px;
  }
`;

export default ProgressTab;

