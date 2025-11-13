import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Database,
  FolderKanban,
  MessageCircle,
  Users,
} from "lucide-react";
import { DashboardLayout, DashboardTab } from "@/components/layout";
import {
  TabProvider,
  useTabContext,
} from "@/contexts/TabContext";
import { useGameStore } from "@/store/gameStore";

const dashboardTabs: DashboardTab[] = [
  {
    id: "chat",
    label: "Chat",
    icon: <MessageCircle size={18} />,
  },
  {
    id: "data",
    label: "Data",
    icon: <Database size={18} />,
  },
  {
    id: "files",
    label: "Files",
    icon: <FolderKanban size={18} />,
  },
  {
    id: "team",
    label: "Team",
    icon: <Users size={18} />,
  },
];

const TAB_IDS = dashboardTabs.map((tab) => tab.id);

const pathToTab = (pathname: string): DashboardTab["id"] => {
  if (pathname.includes("/dashboard/data")) return "data";
  if (pathname.includes("/dashboard/files")) return "files";
  if (pathname.includes("/dashboard/team")) return "team";
  return "chat";
};

const DashboardContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTab, setTab, newNotifications } = useTabContext();
  const setCurrentTabPersisted = useGameStore((state) => state.setCurrentTab);

  const activeTabFromRoute = useMemo(
    () => pathToTab(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    if (activeTabFromRoute !== currentTab) {
      setTab(activeTabFromRoute, { silent: true });
      setCurrentTabPersisted(activeTabFromRoute);
    }
  }, [activeTabFromRoute, currentTab, setCurrentTabPersisted, setTab]);

  const handleTabChange = (tabId: DashboardTab["id"]) => {
    if (tabId === currentTab) return;
    setTab(tabId);
    setCurrentTabPersisted(tabId);
    navigate(`/dashboard/${tabId}`);
  };

  return (
    <DashboardLayout
      currentCaseTitle="Episode 4 · The Data Breach"
      progress={42}
      tabs={dashboardTabs}
      activeTab={currentTab}
      onTabChange={handleTabChange}
      notificationBadges={newNotifications}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export const DashboardPage = () => {
  const location = useLocation();
  const storedTab = useGameStore((state) => state.currentTab);
  const initialTab = useMemo(
    () => storedTab ?? pathToTab(location.pathname),
    [location.pathname, storedTab],
  );

  return (
    <TabProvider initialTab={initialTab} orderedTabs={TAB_IDS}>
      <DashboardContent />
    </TabProvider>
  );
};

export const DashboardIndexRedirect = () => <Navigate to="chat" replace />;

export default DashboardPage;
