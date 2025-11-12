import { useEffect, useMemo, useRef, type ReactNode } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  MessageSquare,
  BarChart3,
  FolderOpen,
  Users,
  Settings,
} from "lucide-react";
import { useTabContext, useTabOrder, type TabKey } from "@/contexts/TabContext";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { caseMetadata } from "@/data/stories";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  background: ${({ theme }) => theme.colors.darkGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.mediumGray};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.65rem 1rem;
  }
`;

const TopBarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CaseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const CaseTitle = styled.h1`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.white};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`;

const CaseMeta = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.lightGray};
  opacity: 0.8;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ProgressTrack = styled.div`
  width: 160px;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.mediumGray};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $value: number }>`
  height: 100%;
  width: ${({ $value }) => `${$value}%`};
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const ScoreChip = styled.div`
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  background: ${({ theme }) => theme.colors.dark};
  font-size: 0.75rem;
  font-weight: 600;
`;

const SettingsButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.lightGray};
  padding: 0.35rem;
  border-radius: 0.5rem;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.mediumGray};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const LayoutWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
`;

const Sidebar = styled.nav`
  width: 240px;
  background: ${({ theme }) => theme.colors.darkGray};
  border-right: 1px solid ${({ theme }) => theme.colors.mediumGray};
  display: none;
  flex-direction: column;
  padding: 1.25rem 1rem;
  gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const SidebarTitle = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.lightGray};
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

const NavButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.mediumGray : "transparent"};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s ease, border 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.mediumGray};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  ${({ $active, theme }) =>
    $active &&
    `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 1px rgba(33, 150, 243, 0.25);
  `}
`;

const NavLabel = styled.span`
  flex: 1;
  text-align: left;
`;

const NotificationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.dark};
  font-size: 0.7rem;
  font-weight: 700;
`;

const ContentArea = styled.main`
  flex: 1;
  min-height: 0;
  position: relative;
  padding: 1.25rem;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem 1rem 5.5rem 1rem;
  }
`;

const ContentScrollArea = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const BottomNav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  background: rgba(22, 22, 22, 0.92);
  backdrop-filter: blur(10px);
  border-top: 1px solid ${({ theme }) => theme.colors.mediumGray};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const BottomNavButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0;
  gap: 0.35rem;
  background: transparent;
  border: none;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.lightGray};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
  position: relative;

  &:active {
    transform: scale(0.97);
  }
`;

const BottomBadge = styled.span`
  position: absolute;
  top: 0.4rem;
  right: 1.5rem;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.dark};
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SwipeHint = styled.div`
  position: absolute;
  bottom: 5.25rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.lightGray};
  opacity: 0.7;
  display: flex;
  gap: 0.25rem;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const tabIconMap: Record<TabKey, typeof MessageSquare> = {
  chat: MessageSquare,
  data: BarChart3,
  files: FolderOpen,
  team: Users,
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentTab, setTab, newNotifications, clearNotifications } = useTabContext();
  const tabOrder = useTabOrder();
  const contentRef = useRef<HTMLDivElement>(null);
  const { currentCase, score, getCaseStats } = useDetectiveGame();

  const metadata = caseMetadata[currentCase] || caseMetadata[1];
  const stats = useMemo(() => getCaseStats(), [getCaseStats]);

  const progress = useMemo(() => {
    if (stats.totalEvidence > 0) {
      const ratio = stats.evidenceCollected / stats.totalEvidence;
      return Math.min(100, Math.max(0, Math.round(ratio * 100)));
    }
    return 0;
  }, [stats.evidenceCollected, stats.totalEvidence]);

  const handleTabChange = (tab: TabKey) => {
    clearNotifications(tab);
    setTab(tab);
  };

  const handleSwipe = (direction: "left" | "right") => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (direction === "left" && currentIndex < tabOrder.length - 1) {
      handleTabChange(tabOrder[currentIndex + 1]);
    }
    if (direction === "right" && currentIndex > 0) {
      handleTabChange(tabOrder[currentIndex - 1]);
    }
  };

  const swipeState = useRef<{ startX: number; startY: number; isSwiping: boolean }>({
    startX: 0,
    startY: 0,
    isSwiping: false,
  });

  const attachSwipeHandlers = (node: HTMLDivElement | null) => {
    if (!node) return undefined;

    let pointerId: number | null = null;

    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      swipeState.current = {
        startX: event.clientX,
        startY: event.clientY,
        isSwiping: true,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!swipeState.current.isSwiping || pointerId !== event.pointerId) return;
      const deltaX = event.clientX - swipeState.current.startX;
      const deltaY = Math.abs(event.clientY - swipeState.current.startY);
      if (Math.abs(deltaX) > 24 && deltaY < 32) {
        event.preventDefault();
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!swipeState.current.isSwiping || pointerId !== event.pointerId) return;
      const deltaX = event.clientX - swipeState.current.startX;
      const deltaY = Math.abs(event.clientY - swipeState.current.startY);
      swipeState.current.isSwiping = false;

      if (Math.abs(deltaX) > 60 && deltaY < 40) {
        handleSwipe(deltaX < 0 ? "left" : "right");
      }
    };

    node.addEventListener("pointerdown", onPointerDown, { passive: true });
    node.addEventListener("pointermove", onPointerMove as EventListener, { passive: false });
    node.addEventListener("pointerup", onPointerUp, { passive: true });
    node.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointermove", onPointerMove as EventListener);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
    };
  };

  useEffect(() => {
    const node = contentRef.current;
    const cleanup = attachSwipeHandlers(node);
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [currentTab]);

  return (
    <DashboardContainer>
      <TopBar>
        <TopBarInfo>
          <Logo>
            <span role="img" aria-label="magnifier">🔍</span>
            Kastor Data Academy
          </Logo>
          <CaseDetails>
            <CaseTitle>{metadata.title}</CaseTitle>
              <CaseMeta>{stats.timeTaken || metadata.subtitle}</CaseMeta>
          </CaseDetails>
        </TopBarInfo>
        <ProgressWrapper>
          <ScoreChip>{score.toLocaleString()} XP</ScoreChip>
          <ProgressTrack>
            <ProgressFill $value={progress} />
          </ProgressTrack>
        </ProgressWrapper>
        <SettingsButton type="button" aria-label="Open settings">
          <Settings size={20} />
        </SettingsButton>
      </TopBar>

      <LayoutWrapper>
        <Sidebar>
          <SidebarTitle>Navigation</SidebarTitle>
          {tabOrder.map((tab) => {
            const Icon = tabIconMap[tab];
            const isActive = currentTab === tab;
            return (
              <NavButton
                key={tab}
                type="button"
                $active={isActive}
                onClick={() => handleTabChange(tab)}
              >
                <Icon size={18} />
                <NavLabel>{tab}</NavLabel>
                {newNotifications[tab] > 0 && (
                  <NotificationBadge>{newNotifications[tab]}</NotificationBadge>
                )}
              </NavButton>
            );
          })}
        </Sidebar>

        <ContentArea>
          <ContentScrollArea ref={contentRef}>
            {children}
          </ContentScrollArea>
        </ContentArea>
      </LayoutWrapper>

      <BottomNav>
        {tabOrder.map((tab) => {
          const Icon = tabIconMap[tab];
          const isActive = currentTab === tab;
          return (
            <BottomNavButton
              key={tab}
              type="button"
              $active={isActive}
              onClick={() => handleTabChange(tab)}
            >
              <Icon size={20} />
              {tab}
              {newNotifications[tab] > 0 && <BottomBadge>{newNotifications[tab]}</BottomBadge>}
            </BottomNavButton>
          );
        })}
      </BottomNav>

      <SwipeHint>
        <motion.span
          animate={{ x: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          ↔
        </motion.span>
        Swipe to change tabs
      </SwipeHint>
    </DashboardContainer>
  );
}
