import styled from "styled-components";

const Placeholder = styled.div`
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
  max-width: 38rem;
  line-height: 1.6;
`;

export const ChatView = () => (
  <Placeholder>
    <Title>Chat Interface 준비 중</Title>
    <Description>
      채팅 인터페이스는 Phase 3에서 구현됩니다. 현재는 레이아웃 및 전환 시스템을 테스트하기 위한
      자리 표시자입니다.
    </Description>
  </Placeholder>
);

export default ChatView;
