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

export function DataView() {
  return (
    <Wrapper>
      <Header>
        <Title>데이터 분석</Title>
      </Header>
      <Subtitle>로그 필터링, 패턴 탐지, 분석 퍼즐 인터페이스가 구현될 예정입니다.</Subtitle>
      <Placeholder>
        데이터 테이블과 필터 컨트롤, 패턴 감지 경고 박스 등이 여기에 배치됩니다.
      </Placeholder>
    </Wrapper>
  );
}

export default DataView;
