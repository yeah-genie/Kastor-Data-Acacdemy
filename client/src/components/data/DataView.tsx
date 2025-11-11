import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  max-width: 40rem;
  line-height: 1.6;
`;

export const DataView = () => (
  <Wrapper>
    <Title>Data Analysis View 준비 중</Title>
    <Description>
      데이터 분석 인터페이스는 Phase 4에서 구현됩니다. 현재는 네비게이션 및 전환 기능 검증을 위한
      임시 콘텐츠입니다.
    </Description>
  </Wrapper>
);

export default DataView;
