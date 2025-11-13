import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGameStore,
  selectCurrentTab,
  selectNotifications,
  TabKey,
} from "@/store/gameStore";

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

export const TabProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const storeCurrentTab = useGameStore(selectCurrentTab);
  const notifications = useGameStore(selectNotifications);
  const tabHistory = useGameStore((state) => state.tabHistory);
  const setCurrentTabStore = useGameStore((state) => state.setCurrentTab);
  const setNotificationValue = useGameStore((state) => state.setNotificationValue);

  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const pathTab = PATH_TO_TAB[location.pathname];
    if (pathTab && pathTab !== storeCurrentTab && !isNavigatingRef.current) {
      setCurrentTabStore(pathTab);
    }
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
    }
  }, [location.pathname, setCurrentTabStore, storeCurrentTab]);

  const setTab = useCallback(
    (tab: TabKey, options?: { silent?: boolean }) => {
      if (tab === useGameStore.getState().currentTab) return;

      setCurrentTabStore(tab);

      if (!options?.silent) {
        const targetPath = TAB_TO_PATH[tab];
        if (targetPath) {
          isNavigatingRef.current = true;
          navigate(targetPath, { replace: false });
        }
      }
    },
    [navigate, setCurrentTabStore],
  );

  const goBack = useCallback(() => {
    const history = useGameStore.getState().tabHistory;
    if (history.length < 2) return;
    useGameStore.getState().goBackTab();
    const nextTab = useGameStore.getState().currentTab;
    const path = TAB_TO_PATH[nextTab];
    if (path) {
      isNavigatingRef.current = true;
      navigate(path, { replace: false });
    }
  }, [navigate]);

  const setNotificationCount = useCallback(
    (tab: TabKey, count: number | ((prev: number) => number)) => {
      const current = notifications[tab];
      const value = typeof count === "function" ? count(current) : count;
      setNotificationValue(tab, value);
    },
    [notifications, setNotificationValue],
  );

  const value = useMemo<TabContextValue>(
    () => ({
      currentTab: storeCurrentTab,
      setTab,
      tabHistory,
      newNotifications: notifications,
      setNotificationCount,
      goBack,
    }),
    [storeCurrentTab, setTab, tabHistory, notifications, setNotificationCount, goBack],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export type { TabKey };
