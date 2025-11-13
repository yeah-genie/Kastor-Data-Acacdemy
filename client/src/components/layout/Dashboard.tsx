import { PropsWithChildren, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings } from "lucide-react";
import styled, { css } from "styled-components";
import { fadeInOut } from "@/utils/animations";

export type DashboardTabId = "chat" | "data" | "files" | "team" | (string & {});

export interface DashboardTab {
  id: DashboardTabId;
  label: string;
  icon: ReactNode;
}

export interface DashboardProps extends PropsWithChildren {
  currentCaseTitle: string;
  progress: number;
  activeTab: DashboardTabId;
  tabs: DashboardTab[];
  onTabChange: (tab: DashboardTabId) => void;
  notificationBadges?: Partial<Record<DashboardTabId, number>>;
  rightActions?: ReactNode;
  settingsButton?: ReactNode;
}

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkGray};
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BrandTitle = styled.h1`
  font-size: clamp(1.15rem, 2vw, 1.5rem);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CaseMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: rgba(255, 255, 255, 0.85);
`;

const CaseTitle = styled.span`
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  font-weight: 600;
`;

const ProgressBarWrapper = styled.div`
  width: min(320px, 100%);
  height: 6px;
  background: ${({ theme }) => theme.colors.mediumGray};
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Sidebar = styled.nav`
  position: sticky;
  top: 84px;
  align-self: flex-start;
  display: none;
  flex-direction: column;
  width: 240px;
  padding: 1.5rem 1rem;
  gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    height: calc(100vh - 84px);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  gap: 1.5rem;
  padding: 1.5rem clamp(1rem, 3vw, 2.75rem);
  padding-bottom: 4.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-bottom: 1.5rem;
    margin-left: 240px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    gap: 2.5rem;
  }
`;

const SidebarSpacer = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    width: 240px;
    position: fixed;
    top: 84px;
    bottom: 0;
    left: 0;
    padding: 1.5rem 1rem;
  }
`;

const NavSectionTitle = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin: 0.5rem 1rem;
`;

const TabButtonBase = css<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ theme }) =>
        `0 10px 30px rgba(33, 150, 243, 0.15)`};
    }
  }

  ${({ $active, theme }) =>
    $active
      ? css`
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.25),
            rgba(33, 150, 243, 0.05)
          );
          color: ${theme.colors.primary};
          box-shadow: 0 12px 30px rgba(33, 150, 243, 0.2);
        `
      : css`
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.7);
        `}
`;

const SidebarTabButton = styled.button<{ $active: boolean }>`
  ${TabButtonBase};
  width: 100%;
`;

const SidebarTabLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`;

const NotificationBadge = styled.span`
  margin-left: auto;
  min-width: 24px;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

const ContentArea = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  min-height: calc(100vh - 220px);
`;

const ContentViewport = styled(motion.div)`
  flex: 1;
  overflow-y: auto;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  background: radial-gradient(
      circle at top right,
      rgba(33, 150, 243, 0.08),
      transparent 60%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(255, 152, 0, 0.08),
      transparent 55%
    );

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
  }
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.65rem 0.85rem;
  background: rgba(30, 30, 30, 0.95);
  border-top: 1px solid ${({ theme }) => theme.colors.darkGray};
  backdrop-filter: blur(10px);
  z-index: 30;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const BottomNavButton = styled.button<{ $active: boolean }>`
  ${TabButtonBase};
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.6rem 0.5rem;
  border-radius: 14px;
  font-size: 0.75rem;
`;

const BottomNavBadge = styled(NotificationBadge)`
  position: absolute;
  top: 6px;
  right: 12px;
`;

const TabIconWrapper = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  width: 30px;
  height: 30px;
  background: ${({ theme, $active }) =>
    $active ? "rgba(33, 150, 243, 0.18)" : "rgba(255, 255, 255, 0.05)"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "rgba(255, 255, 255, 0.7)"};
`;

export const DashboardLayout = ({
  currentCaseTitle,
  progress,
  activeTab,
  tabs,
  onTabChange,
  children,
  notificationBadges,
  rightActions,
  settingsButton,
}: DashboardProps) => {
  const handleTabChange = (tabId: DashboardTabId) => {
    if (tabId !== activeTab) {
      onTabChange(tabId);
    }
  };

  return (
    <DashboardContainer>
      <TopBar>
        <Brand>
          <BrandTitle>
            <span role="img" aria-label="magnifier">
              🔍
            </span>
            Kastor Data Academy
          </BrandTitle>
          <CaseMeta>
            <CaseTitle>{currentCaseTitle}</CaseTitle>
            <ProgressBarWrapper>
              <ProgressFill
                layout
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </ProgressBarWrapper>
          </CaseMeta>
        </Brand>
        <TopBarActions>
          {rightActions}
          {settingsButton ?? (
            <IconButton
              type="button"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings size={20} />
            </IconButton>
          )}
        </TopBarActions>
      </TopBar>

      <SidebarSpacer>
        <NavSectionTitle>Investigation Tabs</NavSectionTitle>
        {tabs.map((tab) => {
          const badgeCount = notificationBadges?.[tab.id];
          return (
            <SidebarTabButton
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              $active={tab.id === activeTab}
            >
              <TabIconWrapper $active={tab.id === activeTab}>
                {tab.icon}
              </TabIconWrapper>
              <SidebarTabLabel>{tab.label}</SidebarTabLabel>
              {!!badgeCount && badgeCount > 0 ? (
                <NotificationBadge>{badgeCount}</NotificationBadge>
              ) : null}
            </SidebarTabButton>
          );
        })}
        </SidebarSpacer>

        <ContentWrapper>
          <Sidebar>
            <NavSectionTitle>Investigation Tabs</NavSectionTitle>
            {tabs.map((tab) => {
              const badgeCount = notificationBadges?.[tab.id];
              return (
                <SidebarTabButton
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  $active={tab.id === activeTab}
                >
                  <TabIconWrapper $active={tab.id === activeTab}>
                    {tab.icon}
                  </TabIconWrapper>
                  <SidebarTabLabel>{tab.label}</SidebarTabLabel>
                  {!!badgeCount && badgeCount > 0 ? (
                    <NotificationBadge>{badgeCount}</NotificationBadge>
                  ) : null}
                </SidebarTabButton>
              );
            })}
          </Sidebar>

          <ContentArea>
            <AnimatePresence mode="wait">
              <ContentViewport
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInOut}
              >
                {children}
              </ContentViewport>
            </AnimatePresence>
          </ContentArea>
        </ContentWrapper>

        <BottomNav>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const badgeCount = notificationBadges?.[tab.id];
          return (
            <BottomNavButton
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              $active={isActive}
            >
              <TabIconWrapper $active={isActive}>{tab.icon}</TabIconWrapper>
              <span>{tab.label}</span>
              {!!badgeCount && badgeCount > 0 ? (
                <BottomNavBadge>{badgeCount}</BottomNavBadge>
              ) : null}
            </BottomNavButton>
          );
        })}
      </BottomNav>
    </DashboardContainer>
  );
};

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  color: ${({ theme }) => theme.colors.white};
  transition: transform 0.2s ease, border 0.2s ease, background 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.18);
    }
  }
`;

export default DashboardLayout;
