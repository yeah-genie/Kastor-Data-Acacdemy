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

export const FilesView = () => (
  <Wrapper>
    <Title>Evidence Files View 준비 중</Title>
    <Description>
      증거 파일 브라우저는 Phase 5에서 구현됩니다. 현재는 레이아웃 구조 작업을 위한 프리뷰
      컴포넌트입니다.
    </Description>
  </Wrapper>
);

export default FilesView;
