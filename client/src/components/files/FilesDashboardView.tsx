import styled from "styled-components";
import { motion } from "framer-motion";
import { FolderOpen, Search, Star, Share2 } from "lucide-react";

const Wrapper = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const Hero = styled(motion.div)`
  padding: 1.5rem;
  border-radius: 18px;
  background: linear-gradient(
    140deg,
    rgba(173, 129, 255, 0.24),
    rgba(22, 18, 32, 0.92)
  );
  border: 1px solid rgba(173, 129, 255, 0.35);
  display: grid;
  gap: 0.75rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const FeatureList = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const FeatureCard = styled(motion.div)`
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: rgba(18, 20, 34, 0.85);
  padding: 1.2rem;
  display: grid;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const FeatureTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.white};
`;

export function FilesDashboardView() {
  const features = [
    {
      icon: <Search size={18} strokeWidth={1.8} />,
      title: "빠른 검색 & 강조 표시",
      description:
        "파일명/메타데이터/본문을 한 번에 검색하고, 일치하는 텍스트를 자동으로 하이라이트합니다.",
      delay: 0.05,
    },
    {
      icon: <Star size={18} strokeWidth={1.8} />,
      title: "중요도 태그 & 즐겨찾기",
      description:
        "중요한 증거는 즐겨찾기로, 긴급한 문서는 Critical 태그로 표시해 빠르게 접근합니다.",
      delay: 0.12,
    },
    {
      icon: <Share2 size={18} strokeWidth={1.8} />,
      title: "Kastor와 공유",
      description:
        "선택한 파일을 챗 뷰와 연동해 Kastor에게 즉시 공유할 수 있도록 연결할 예정입니다.",
      delay: 0.18,
    },
  ];

  return (
    <Wrapper>
      <Hero
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title>
          <FolderOpen size={22} strokeWidth={1.8} />
          Evidence Files View
        </Title>
        <Text>
          수집한 증거를 에피소드/분류별로 탐색하고, 세부 미리보기와 메타데이터를
          확인하는 공간입니다. Phase 5에서 폴더 트리, 파일 리스트, 상세 뷰어가
          이곳에 연결될 예정입니다.
        </Text>
      </Hero>

      <FeatureList>
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay, duration: 0.3 }}
          >
            <FeatureTitle>
              {feature.icon}
              {feature.title}
            </FeatureTitle>
            <Text style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              {feature.description}
            </Text>
          </FeatureCard>
        ))}
      </FeatureList>
    </Wrapper>
  );
}

export default FilesDashboardView;
