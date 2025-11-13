import styled from "styled-components";

const Container = styled.div`
  display: grid;
  place-items: center;
  min-height: 60vh;
  padding: 48px 16px;
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.dark} 0%,
    ${({ theme }) => theme.colors.darkGray} 100%
  );
  color: ${({ theme }) => theme.colors.white};
  border-radius: 32px;
  border: 1px dashed ${({ theme }) => theme.colors.mediumGray};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 12px;
`;

const Description = styled.p`
  max-width: 540px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.lightGray};
`;

export function CaseCompletePage() {
  return (
    <Container>
      <div>
        <Title>케이스 클리어 화면 준비 중</Title>
        <Description>
          플레이어의 성취 요약, 획득한 증거, 포인트, 업적을 표시하는 화면은
          Phase 7-3 이후에 완성됩니다. 현재는 레이아웃과 테마만 구성된
          상태입니다.
        </Description>
      </div>
    </Container>
  );
}

export default CaseCompletePage;
