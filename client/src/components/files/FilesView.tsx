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

export function FilesView() {
  return (
    <Wrapper>
      <Header>
        <Title>증거 파일 보관함</Title>
      </Header>
      <Subtitle>폴더 트리, 파일 목록, 상세 프리뷰 영역이 이곳에 배치됩니다.</Subtitle>
      <Placeholder>
        증거 파일 탐색기 UI가 여기에 구현될 예정입니다. <br />
        정렬/필터, 메타데이터, 관련 증거 표시 등을 포함합니다.
      </Placeholder>
    </Wrapper>
  );
}

export default FilesView;
