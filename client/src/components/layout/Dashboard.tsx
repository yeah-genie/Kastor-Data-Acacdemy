import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { MessageSquareText, Database, FolderGit2, Users2, Settings, Bell } from "lucide-react";
import { TabContainer } from "./TabContainer";
import { TabKey, useTabContext } from "../../context/TabContext";

const TABS: Array<{
  key: TabKey;
  label: string;
  icon: ReactNode;
}> = [
  { key: "chat", label: "Chat", icon: <MessageSquareText size={20} /> },
  { key: "data", label: "Data", icon: <Database size={20} /> },
  { key: "files", label: "Files", icon: <FolderGit2 size={20} /> },
  { key: "team", label: "Team", icon: <Users2 size={20} /> },
];

const TAB_ORDER = TABS.map((tab) => tab.key);

const isMobileViewport = () => window.matchMedia("(max-width: 1023px)").matches;

export const DashboardLayout = () => {
  const { currentTab, setTab, newNotifications } = useTabContext();
  const location = useLocation();
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const progress = 42;
  const caseTitle = "Episode 4 · The Data Breach";

  const isInvalidRoute = useMemo(() => {
    const validPaths = [
      "/dashboard",
      "/dashboard/",
      "/dashboard/chat",
      "/dashboard/data",
      "/dashboard/files",
      "/dashboard/team",
    ];
    return !validPaths.includes(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;
      const digit = event.key;
      const tabMap: Record<string, TabKey> = {
        "1": "chat",
        "2": "data",
        "3": "files",
        "4": "team",
      };
      const target = tabMap[digit];
      if (target) {
        event.preventDefault();
        setTab(target);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [setTab]);

  const handleSwipeStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    swipeStartX.current = touch.clientX;
    swipeStartY.current = touch.clientY;
    isSwiping.current = true;
  }, []);

  const handleSwipeMove = useCallback((event: React.TouchEvent) => {
    if (!isSwiping.current || swipeStartX.current === null || swipeStartY.current === null) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - swipeStartX.current;
    const deltaY = Math.abs(touch.clientY - swipeStartY.current);

    if (Math.abs(deltaX) > 20 && deltaY < 40) {
      event.preventDefault();
    }
  }, []);

  const handleContentTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!isMobileViewport()) return;
      if (swipeStartX.current === null || swipeStartY.current === null) {
        swipeStartX.current = null;
        swipeStartY.current = null;
        isSwiping.current = false;
        return;
      }

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - swipeStartX.current;
      const deltaY = Math.abs(touch.clientY - swipeStartY.current);

      swipeStartX.current = null;
      swipeStartY.current = null;
      isSwiping.current = false;

      const threshold = 60;
      if (Math.abs(deltaX) < threshold || deltaY > 60) return;

      const currentIndex = TAB_ORDER.indexOf(currentTab);
      if (deltaX < 0 && currentIndex < TAB_ORDER.length - 1) {
        setTab(TAB_ORDER[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        setTab(TAB_ORDER[currentIndex - 1]);
      }
    },
    [currentTab, setTab],
  );

  if (isInvalidRoute) {
    return <Navigate to="/dashboard/chat" replace />;
  }

  return (
    <Wrapper>
      <TopBar>
        <LogoArea>
          <Bell size={22} />
          <div>
            <Title>🔍 Kastor Data Academy</Title>
            <CaseTitle>{caseTitle}</CaseTitle>
          </div>
        </LogoArea>
        <ProgressSection>
          <ProgressLabel>Progress</ProgressLabel>
          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <ProgressValue>{progress}%</ProgressValue>
        </ProgressSection>
        <SettingsButton type="button">
          <Settings size={20} />
        </SettingsButton>
      </TopBar>

      <Body>
        <Sidebar>
          <NavList>
            {TABS.map((tab) => (
              <SidebarItem
                key={tab.key}
                data-active={currentTab === tab.key}
                onClick={() => setTab(tab.key)}
              >
                <IconWrapper>{tab.icon}</IconWrapper>
                <SidebarLabel>{tab.label}</SidebarLabel>
                {newNotifications[tab.key] > 0 && (
                  <NotificationBadge>{newNotifications[tab.key]}</NotificationBadge>
                )}
              </SidebarItem>
            ))}
          </NavList>
        </Sidebar>

        <ContentArea
          onTouchStart={handleSwipeStart}
          onTouchMove={handleSwipeMove}
          onTouchEnd={handleContentTouchEnd}
        >
          <TabContainer locationKey={location.pathname}>
            <Outlet />
          </TabContainer>
        </ContentArea>
      </Body>

      <BottomNav>
        {TABS.map((tab) => (
          <BottomNavItem
            key={tab.key}
            data-active={currentTab === tab.key}
            onClick={() => setTab(tab.key)}
          >
            <IconWrapper>{tab.icon}</IconWrapper>
            <BottomNavLabel>{tab.label}</BottomNavLabel>
            {newNotifications[tab.key] > 0 && (
              <NotificationBadge>{newNotifications[tab.key]}</NotificationBadge>
            )}
          </BottomNavItem>
        ))}
      </BottomNav>
    </Wrapper>
  );
};

export default DashboardLayout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(33, 150, 243, 0.1), transparent 55%),
    radial-gradient(circle at bottom left, rgba(255, 152, 0, 0.12), transparent 60%),
    ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 0.85rem 1.25rem;
    gap: 1rem;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  min-height: 0;
`;

const Sidebar = styled.nav`
  width: 220px;
  padding: 1.5rem 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  background: linear-gradient(180deg, rgba(45, 45, 45, 0.85), rgba(45, 45, 45, 0.4));

  @media (max-width: 1023px) {
    display: none;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const navItemStyles = css`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  color: ${({ theme }) => theme.colors.lightGray};
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(33, 150, 243, 0.12);
    color: ${({ theme }) => theme.colors.white};
    transform: translateX(4px);
  }

  &[data-active="true"] {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.05));
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid rgba(33, 150, 243, 0.4);
    box-shadow: 0 14px 30px rgba(33, 150, 243, 0.18);
  }
`;

const SidebarItem = styled.button`
  ${navItemStyles};
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
`;

const SidebarLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.dark};
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
`;

const ContentArea = styled.main`
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 1.5rem 2rem 2rem;
  min-height: calc(100vh - 72px);

  @media (max-width: 1023px) {
    padding: 1.25rem 1.1rem 5.5rem;
    min-height: calc(100vh - 64px - 72px);
  }
`;

const BottomNav = styled.nav`
  display: none;

  @media (max-width: 1023px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    padding: 0.35rem 0.75rem;
    background: rgba(30, 30, 30, 0.95);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    z-index: 25;
    justify-content: space-around;
  }
`;

const BottomNavItem = styled.button`
  ${navItemStyles};
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.45rem;
  border-radius: 12px;

  &[data-active="true"] {
    transform: translateY(-4px);
  }

  ${IconWrapper} {
    width: 36px;
    height: 36px;
    border-radius: 12px;
  }
`;

const BottomNavLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const Title = styled.h1`
  font-size: 1.05rem;
  margin: 0;
  letter-spacing: 0.03em;
`;

const CaseTitle = styled.div`
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.lightGray};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProgressLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const ProgressBar = styled.div`
  position: relative;
  width: 200px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(33, 150, 243, 1), rgba(33, 150, 243, 0.2));
  transition: width 0.3s ease;
`;

const ProgressValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
`;

const SettingsButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease;

  &:hover {
    transform: rotate(10deg);
    border-color: rgba(255, 255, 255, 0.35);
  }
`;
