import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TabKey = "chat" | "data" | "files" | "team";

const TAB_TO_PATH: Record<TabKey, string> = {
  chat: "/dashboard/chat",
  data: "/dashboard/data",
  files: "/dashboard/files",
  team: "/dashboard/team",
};

const PATH_TO_TAB: Record<string, TabKey> = {
  "/dashboard": "chat",
  "/dashboard/": "chat",
  "/dashboard/chat": "chat",
  "/dashboard/data": "data",
  "/dashboard/files": "files",
  "/dashboard/team": "team",
};

export interface TabContextValue {
  currentTab: TabKey;
  setTab: (tab: TabKey, options?: { silent?: boolean }) => void;
  tabHistory: TabKey[];
  newNotifications: Record<TabKey, number>;
  setNotificationCount: (tab: TabKey, count: number | ((prev: number) => number)) => void;
  goBack: () => void;
}

const TabContext = createContext<TabContextValue | null>(null);

export const useTabContext = () => {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error("useTabContext는 TabProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
};

const DEFAULT_NOTIFICATIONS: Record<TabKey, number> = {
  chat: 0,
  data: 0,
  files: 0,
  team: 0,
};

export const TabProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = useMemo<TabKey>(() => PATH_TO_TAB[location.pathname] ?? "chat", [location.pathname]);

  const [currentTab, setCurrentTab] = useState<TabKey>(initialTab);
  const [tabHistory, setTabHistory] = useState<TabKey[]>([initialTab]);
  const [newNotifications, setNewNotifications] =
    useState<Record<TabKey, number>>(DEFAULT_NOTIFICATIONS);

  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const pathTab = PATH_TO_TAB[location.pathname];
    if (pathTab && pathTab !== currentTab && !isNavigatingRef.current) {
      setCurrentTab(pathTab);
      setTabHistory((prev) => [...prev, pathTab]);
    }
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
    }
  }, [location.pathname, currentTab]);

  const setTab = useCallback(
    (tab: TabKey, options?: { silent?: boolean }) => {
      if (tab === currentTab) return;

      setCurrentTab(tab);
      setTabHistory((prev) => [...prev, tab]);
      setNewNotifications((prev) =>
        prev[tab] === 0 ? prev : { ...prev, [tab]: 0 },
      );

      if (!options?.silent) {
        const targetPath = TAB_TO_PATH[tab];
        if (targetPath) {
          isNavigatingRef.current = true;
          navigate(targetPath, { replace: false });
        }
      }
    },
    [currentTab, navigate],
  );

  const goBack = useCallback(() => {
    setTabHistory((prev) => {
      if (prev.length < 2) return prev;
      const nextHistory = prev.slice(0, -1);
      const lastTab = nextHistory[nextHistory.length - 1];
      isNavigatingRef.current = true;
      navigate(TAB_TO_PATH[lastTab], { replace: false });
      setCurrentTab(lastTab);
      return nextHistory;
    });
  }, [navigate]);

  const setNotificationCount = useCallback(
    (tab: TabKey, count: number | ((prev: number) => number)) => {
      setNewNotifications((prev) => ({
        ...prev,
        [tab]: typeof count === "function" ? count(prev[tab]) : count,
      }));
    },
    [],
  );

  const value = useMemo<TabContextValue>(
    () => ({
      currentTab,
      setTab,
      tabHistory,
      newNotifications,
      setNotificationCount,
      goBack,
    }),
    [currentTab, setTab, tabHistory, newNotifications, setNotificationCount, goBack],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};
