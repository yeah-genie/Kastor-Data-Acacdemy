import styled from "styled-components";

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.lightGray};
  background: ${({ theme }) => theme.colors.darkGray};
  min-height: 60vh;
  border-radius: 16px;
  border: 1px dashed ${({ theme }) => theme.colors.lightGray};
`;

export function DashboardPage() {
  return (
    <Placeholder>
      Dashboard layout coming soon. (Phase 2 작업에서 구현 예정)
    </Placeholder>
  );
}

export default DashboardPage;
