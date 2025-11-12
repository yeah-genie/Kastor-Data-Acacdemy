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
        <Title>Team & Character Profiles</Title>
      </Header>
      <Subtitle>The team board will render character dossiers, timelines, and relationship visualisations here.</Subtitle>
      <Placeholder>
        The full team interface will live in this space.<br />
        It will highlight status badges, trust levels, related evidence, and the interactive relationship graph.
      </Placeholder>
    </Wrapper>
  );
}

export default TeamView;
