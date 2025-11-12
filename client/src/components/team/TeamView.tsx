import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.9rem;
`;

const Placeholder = styled.div`
  min-height: 320px;
  border-radius: 1rem;
  border: 1px dashed ${({ theme }) => theme.colors.mediumGray};
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.95rem;
  text-align: center;
  padding: 2rem;
`;

export function TeamView() {
  return (
    <Wrapper>
      <Header>
        <Title>팀 & 캐릭터 프로파일</Title>
      </Header>
      <Subtitle>캐릭터 카드, 관계도 시각화, 타임라인 등이 이 구역에 배치됩니다.</Subtitle>
      <Placeholder>
        팀 뷰 인터페이스가 여기에 구현될 예정입니다. <br />
        캐릭터 상태, 신뢰도, 관련 증거 목록을 포함합니다.
      </Placeholder>
    </Wrapper>
  );
}

export default TeamView;
