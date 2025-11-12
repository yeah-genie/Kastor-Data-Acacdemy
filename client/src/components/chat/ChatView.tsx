import styled from "styled-components";
import { GameScene } from "@/components/GameScene";

const ChatShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 560px;
  background: radial-gradient(circle at top left, rgba(0, 217, 255, 0.08), transparent),
    radial-gradient(circle at bottom right, rgba(255, 152, 0, 0.07), transparent),
    rgba(10, 14, 24, 0.85);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 30px 60px rgba(5, 9, 18, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 10%;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(0, 217, 255, 0.08), rgba(255, 152, 0, 0.04));
    filter: blur(40px);
    opacity: 0.5;
    pointer-events: none;
  }
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export function ChatView() {
  return (
    <ChatShell>
      <Content>
        <GameScene variant="embedded" />
      </Content>
    </ChatShell>
  );
}

export default ChatView;
