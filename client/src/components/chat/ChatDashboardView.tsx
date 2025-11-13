import styled from "styled-components";
import { motion } from "framer-motion";
import { MessageSquareText, Sparkles } from "lucide-react";

const Wrapper = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const HeaderCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(33, 150, 243, 0.18),
    rgba(9, 12, 20, 0.85)
  );
  border: 1px solid rgba(33, 150, 243, 0.4);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.25);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const PlaceholderCard = styled(motion.div)`
  border-radius: 18px;
  background: rgba(16, 21, 32, 0.92);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  display: grid;
  gap: 0.75rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.lightGray};
`;

export function ChatDashboardView() {
  return (
    <Wrapper>
      <HeaderCard
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TitleRow>
          <MessageSquareText size={22} strokeWidth={1.8} />
          <Title>Chat View</Title>
        </TitleRow>
        <Description>
          팀원들과 Kastor AI 어시스턴트가 실시간으로 사건을 논의하는 공간입니다.
          다음 단계에서는 실제 메시지 목록, 선택지, 증거 카드가 이 영역에
          렌더링됩니다.
        </Description>
      </HeaderCard>

      <PlaceholderCard
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Sparkles size={22} strokeWidth={1.6} />
        <strong>다음 단계</strong>
        <span>
          현재는 레이아웃 구축 단계입니다. Phase 3에서 메시지 리스트, 선택지
          시스템, 증거 첨부 UI가 이 영역을 채우게 됩니다.
        </span>
      </PlaceholderCard>
    </Wrapper>
  );
}

export default ChatDashboardView;
