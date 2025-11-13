import styled from "styled-components";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.dark};
`;

const Heading = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.lightGray};
  margin: 0;
`;

export function EpisodePage() {
  return (
    <Wrapper>
      <Heading>Episode 페이지(준비 중)</Heading>
      <Subtitle>
        Episode별 세부 컨텐츠는 Phase 4 이후에 연결됩니다. 스토리/씬
        데이터를 JSON으로 변환한 뒤 이 페이지에서 플레이 흐름을 제어할
        예정입니다.
      </Subtitle>
    </Wrapper>
  );
}

export default EpisodePage;
