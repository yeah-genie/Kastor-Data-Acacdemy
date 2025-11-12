import { useState } from "react";
import styled from "styled-components";
import { useGameStore } from "@/store/gameStore";

const Panel = styled.aside<{ $open: boolean }>`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: ${({ $open }) => ($open ? "360px" : "62px")};
  max-height: 480px;
  border-radius: 18px;
  background: rgba(14, 14, 20, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  transition: width 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
  z-index: 120;
  font-size: 0.78rem;
  transform: ${({ $open }) => ($open ? "translateY(0)" : "translateY(20px)")};
  opacity: ${({ $open }) => ($open ? 1 : 0.7)};

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Header = styled.button<{ $open: boolean }>`
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-weight: 700;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const Body = styled.div`
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 360px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.75rem;
`;

const CodeBlock = styled.pre`
  margin: 0;
  font-size: 0.7rem;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 0.65rem 0.75rem;
  overflow-x: auto;
`;

export const DevToolsPanel = () => {
  const [open, setOpen] = useState(false);
  const storeSnapshot = useGameStore((state) => ({
    currentEpisode: state.currentEpisode,
    currentScene: state.currentScene,
    progress: state.gameProgress,
    unlockedScenes: state.unlockedScenes,
    collectedEvidence: state.collectedEvidence.map((item) => item.id),
    completedEpisodes: state.completedEpisodes,
    autoSaveSlot: state.autoSaveSlot,
  }));

  if (import.meta.env.PROD) return null;

  return (
    <Panel $open={open} aria-live="polite">
      <Header type="button" onClick={() => setOpen((prev) => !prev)} $open={open}>
        DevTools
        <span>{open ? "▾" : "▴"}</span>
      </Header>
      {open ? (
        <Body>
          <Stat>
            <span>Episode</span>
            <strong>{storeSnapshot.currentEpisode ?? "—"}</strong>
          </Stat>
          <Stat>
            <span>Scene</span>
            <strong>{storeSnapshot.currentScene ?? "—"}</strong>
          </Stat>
          <Stat>
            <span>Progress</span>
            <strong>{Math.round(storeSnapshot.progress)}%</strong>
          </Stat>
          <Stat>
            <span>Unlocked scenes</span>
            <strong>{storeSnapshot.unlockedScenes.length}</strong>
          </Stat>
          <Stat>
            <span>Evidence</span>
            <strong>{storeSnapshot.collectedEvidence.length}</strong>
          </Stat>
          <Stat>
            <span>Auto slot</span>
            <strong>{storeSnapshot.autoSaveSlot}</strong>
          </Stat>
          <CodeBlock>{JSON.stringify(storeSnapshot, null, 2)}</CodeBlock>
        </Body>
      ) : null}
    </Panel>
  );
};

export default DevToolsPanel;
