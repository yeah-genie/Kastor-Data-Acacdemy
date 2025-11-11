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

export const TeamView = () => (
  <Wrapper>
    <Title>Team View 준비 중</Title>
    <Description>
      팀/캐릭터 프로필 인터페이스는 Phase 6에서 세부적으로 구현됩니다. 지금은 전환 및 레이아웃을
      확인하기 위한 플레이스홀더입니다.
    </Description>
  </Wrapper>
);

export default TeamView;
