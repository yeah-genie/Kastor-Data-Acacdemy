import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  MessageSquareText,
  BarChart3,
  FolderOpen,
  Users,
  Settings,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useTabContext, TAB_ORDER, type TabKey } from "@/contexts/TabContext";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { getCaseMetadata } from "@/data/stories";

const TOP_BAR_HEIGHT = 72;
const BOTTOM_NAV_HEIGHT = 68;

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  height: ${TOP_BAR_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(18, 18, 24, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.mediumGray};
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoBadge = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  font-size: 1.4rem;
  box-shadow: 0 12px 24px rgba(33, 150, 243, 0.2);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AcademyTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  margin: 0;
`;

const CaseTitle = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const ProgressWrap = styled.div`
  margin-top: 6px;
  background: ${({ theme }) => theme.colors.darkGray};
  border-radius: 999px;
  overflow: hidden;
  height: 6px;
  width: clamp(160px, 22vw, 220px);
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  background: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 16px rgba(33, 150, 243, 0.12);
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const Sidebar = styled.nav`
  width: 240px;
  border-right: 1px solid ${({ theme }) => theme.colors.mediumGray};
  background: rgba(24, 24, 32, 0.85);
  backdrop-filter: blur(18px);
  padding: 1.25rem 1rem;
  display: none;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const NavButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  background: rgba(33, 33, 45, 0.55);
  color: ${({ theme }) => theme.colors.lightGray};
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;

  ${({ $active, theme }) =>
    $active &&
    css`
      background: linear-gradient(
        135deg,
        rgba(33, 150, 243, 0.18),
        rgba(255, 152, 0, 0.12)
      );
      border-color: rgba(33, 150, 243, 0.45);
      color: ${theme.colors.white};
    `}

  &:hover {
    transform: translateX(4px);
  }
`;

const BottomNav = styled.nav`
  position: sticky;
  bottom: 0;
  z-index: 25;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: ${BOTTOM_NAV_HEIGHT}px;
  background: rgba(18, 18, 24, 0.94);
  border-top: 1px solid ${({ theme }) => theme.colors.mediumGray};
  backdrop-filter: blur(12px);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const BottomButton = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.lightGray};
  border: none;
  background: none;
  cursor: pointer;
  position: relative;

  ${({ $active, theme }) =>
    $active &&
    css`
      color: ${theme.colors.primary};
    `}
`;

const BottomIndicator = styled(motion.span)`
  position: absolute;
  bottom: 6px;
  width: 32px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  padding: 1.25rem;
  padding-bottom: calc(1.25rem + ${BOTTOM_NAV_HEIGHT}px);
  padding-top: calc(1.25rem + 12px);
  overflow-y: auto;
  background: linear-gradient(
    180deg,
    rgba(28, 34, 48, 0.75) 0%,
    rgba(15, 18, 28, 0.92) 45%,
    rgba(10, 12, 20, 1) 100%
  );

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-bottom: 2rem;
    padding-top: 2rem;
  }
`;

const MotionContent = styled(motion.main)`
  min-height: calc(100vh - ${TOP_BAR_HEIGHT + BOTTOM_NAV_HEIGHT}px);
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: calc(100vh - ${TOP_BAR_HEIGHT}px);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.35);
`;

const navIconMap: Record<TabKey, JSX.Element> = {
  chat: <MessageSquareText size={20} strokeWidth={1.8} />,
  data: <BarChart3 size={20} strokeWidth={1.8} />,
  files: <FolderOpen size={20} strokeWidth={1.8} />,
  team: <Users size={20} strokeWidth={1.8} />,
};

export function DashboardLayout() {
  const location = useLocation();
  const {
    currentTab,
    setTab,
    newNotifications,
    getNextTab,
    getPreviousTab,
    goBack,
  } = useTabContext();
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  const { currentCase, getCaseProgressDetails } = useDetectiveGame();
  const caseMeta = getCaseMetadata(currentCase);
  const progressInfo = getCaseProgressDetails(currentCase);
  const progress = progressInfo?.percentComplete ?? 0;

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (event.touches.length !== 1) return;
    touchStartX.current = event.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (touchStartX.current === null || touchStartTime.current === null) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const elapsed = Date.now() - touchStartTime.current;
    const swipeThreshold = 60;

    if (elapsed < 500) {
      if (deltaX > swipeThreshold) {
        const previous = getPreviousTab(currentTab);
        if (previous) {
          setTab(previous);
        }
      } else if (deltaX < -swipeThreshold) {
        const next = getNextTab(currentTab);
        if (next) {
          setTab(next);
        }
      }
    }

    touchStartX.current = null;
    touchStartTime.current = null;
  };

  return (
    <Container>
      <TopBar>
        <LogoWrap>
          <LogoBadge>🔍</LogoBadge>
          <TitleGroup>
            <AcademyTitle>Kastor Data Academy</AcademyTitle>
            <CaseTitle>{caseMeta?.title ?? "Investigation Dashboard"}</CaseTitle>
            <ProgressWrap>
              <ProgressFill
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </ProgressWrap>
          </TitleGroup>
        </LogoWrap>

        <Actions>
          <IconButton onClick={goBack} title="이전 탭으로 이동 (History)">
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton title="공지 확인">
            <Bell size={18} />
          </IconButton>
          <IconButton title="설정">
            <Settings size={18} />
          </IconButton>
        </Actions>
      </TopBar>

      <Body>
        <Sidebar>
          {TAB_ORDER.map((tabKey) => (
            <NavButton
              key={tabKey}
              $active={currentTab === tabKey}
              onClick={() => setTab(tabKey)}
            >
              {navIconMap[tabKey]}
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {tabLabel(tabKey)}
              </span>
              {newNotifications[tabKey] > 0 && (
                <NotificationBadge>{newNotifications[tabKey]}</NotificationBadge>
              )}
            </NavButton>
          ))}
        </Sidebar>

        <ContentWrapper onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <AnimatePresence mode="wait">
            <MotionContent
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Outlet />
            </MotionContent>
          </AnimatePresence>
        </ContentWrapper>
      </Body>

      <BottomNav>
        {TAB_ORDER.map((tabKey) => (
          <BottomButton
            key={tabKey}
            $active={currentTab === tabKey}
            onClick={() => setTab(tabKey)}
          >
            {navIconMap[tabKey]}
            <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>
              {tabLabel(tabKey)}
            </span>
            {currentTab === tabKey && (
              <BottomIndicator layoutId="tab-indicator" />
            )}
            {newNotifications[tabKey] > 0 && (
              <NotificationBadge>{newNotifications[tabKey]}</NotificationBadge>
            )}
          </BottomButton>
        ))}
      </BottomNav>
    </Container>
  );
}

const tabLabel = (tab: TabKey) => {
  switch (tab) {
    case "chat":
      return "Chat";
    case "data":
      return "Data";
    case "files":
      return "Files";
    case "team":
      return "Team";
    default:
      return tab;
  }
};

export default DashboardLayout;
