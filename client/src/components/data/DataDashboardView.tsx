import styled from "styled-components";
import { motion } from "framer-motion";
import { BarChart3, Filter, Radar } from "lucide-react";

const Layout = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const Intro = styled(motion.div)`
  padding: 1.5rem;
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    rgba(79, 209, 197, 0.2),
    rgba(13, 22, 32, 0.9)
  );
  border: 1px solid rgba(79, 209, 197, 0.35);
  display: flex;
  flex-direction: column;
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

const Paragraph = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const FeatureCard = styled(motion.div)`
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: rgba(16, 20, 32, 0.82);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const FeatureTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.white};
`;

export function DataDashboardView() {
  return (
    <Layout>
      <Intro
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Heading>
          <BarChart3 size={22} strokeWidth={1.8} />
          Data Analysis View
        </Heading>
        <Paragraph>
          시스템 로그와 행동 데이터를 분석하여 패턴을 찾아내는 공간입니다.
          필터, 정렬, 패턴 감지 알림 등을 통해 용의자들의 흔적을 추적하게 될
          예정입니다.
        </Paragraph>
      </Intro>

      <FeatureGrid>
        <FeatureCard
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <FeatureTitle>
            <Filter size={19} strokeWidth={1.8} />
            고급 필터 & 데이터 테이블
          </FeatureTitle>
          <Paragraph>
            사용자, 시간대, 액션 타입, 지역 등을 조합해서 데이터를 좁혀보고,
            의심스러운 로그를 표시할 수 있는 테이블 컴포넌트가 연결될 예정입니다.
          </Paragraph>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
        >
          <FeatureTitle>
            <Radar size={19} strokeWidth={1.8} />
            패턴 감지 인터랙션
          </FeatureTitle>
          <Paragraph>
            Phase 4-2에서 구현할 “Find the Pattern” 퍼즐이 이 영역을 통해
            플레이됩니다. 올바른 패턴을 찾으면 시각적 하이라이트와 보상 모달이
            노출될 예정입니다.
          </Paragraph>
        </FeatureCard>
      </FeatureGrid>
    </Layout>
  );
}

export default DataDashboardView;
