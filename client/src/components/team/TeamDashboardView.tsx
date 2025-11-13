import styled from "styled-components";
import { motion } from "framer-motion";
import { Users, Network, NotebookPen } from "lucide-react";

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const IntroCard = styled(motion.div)`
  padding: 1.5rem;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.22),
    rgba(29, 21, 12, 0.85)
  );
  border: 1px solid rgba(255, 193, 7, 0.28);
  display: grid;
  gap: 0.75rem;
`;

const Heading = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const BodyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const Highlights = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const HighlightCard = styled(motion.div)`
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  background: rgba(24, 18, 10, 0.82);
  padding: 1.25rem;
  display: grid;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const HighlightTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.white};
`;

export function TeamDashboardView() {
  return (
    <Grid>
      <IntroCard
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Heading>
          <Users size={22} strokeWidth={1.8} />
          Team Intelligence View
        </Heading>
        <BodyText>
          용의자와 팀원들의 정보를 한눈에 조회하고, 관계도를 시각화하는 공간입니다.
          Phase 6에서 캐릭터 카드, 타임라인, 관계 네트워크가 이 영역에 배치될
          예정입니다.
        </BodyText>
      </IntroCard>

      <Highlights>
        <HighlightCard
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <HighlightTitle>
            <NotebookPen size={19} strokeWidth={1.8} />
            캐릭터 프로필 & 노트
          </HighlightTitle>
          <BodyText style={{ fontSize: "0.92rem", lineHeight: 1.5 }}>
            직무, 친밀도, 수상한 활동 로그를 확인하고 조사 노트를 남길 수 있는
            카드형 UI가 연결됩니다.
          </BodyText>
        </HighlightCard>

        <HighlightCard
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
        >
          <HighlightTitle>
            <Network size={19} strokeWidth={1.8} />
            관계도 시각화
          </HighlightTitle>
          <BodyText style={{ fontSize: "0.92rem", lineHeight: 1.5 }}>
            react-force-graph 기반의 네트워크 다이어그램으로 캐릭터 간 연결과
            긴장도를 확인할 수 있도록 설계할 예정입니다.
          </BodyText>
        </HighlightCard>
      </Highlights>
    </Grid>
  );
}

export default TeamDashboardView;
