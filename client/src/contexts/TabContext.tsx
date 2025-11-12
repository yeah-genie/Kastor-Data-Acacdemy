import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TabKey = "chat" | "data" | "files" | "team";

export const TAB_ORDER: TabKey[] = ["chat", "data", "files", "team"];
const DEFAULT_TAB: TabKey = "chat";
const DASHBOARD_BASE_PATH = "/dashboard";

type Notifications = Record<TabKey, number>;

interface TabState {
  currentTab: TabKey;
  tabHistory: TabKey[];
  newNotifications: Notifications;
}

interface TabContextValue extends TabState {
  setTab: (tab: TabKey, options?: { replace?: boolean }) => void;
  goBack: () => void;
  incrementNotification: (tab: TabKey, amount?: number) => void;
  clearNotifications: (tab: TabKey) => void;
  getNextTab: (tab: TabKey) => TabKey | null;
  getPreviousTab: (tab: TabKey) => TabKey | null;
}

const initialNotifications: Notifications = {
  chat: 0,
  data: 0,
  files: 0,
  team: 0,
};

const getTabFromPath = (pathname: string): TabKey | null => {
  if (!pathname.startsWith(DASHBOARD_BASE_PATH)) {
    return null;
  }

  const segments = pathname.replace(DASHBOARD_BASE_PATH, "").split("/");
  const maybeTab = segments.filter(Boolean)[0] as TabKey | undefined;

  if (maybeTab && TAB_ORDER.includes(maybeTab)) {
    return maybeTab;
  }

  return DEFAULT_TAB;
};

const TabContext = createContext<TabContextValue | undefined>(undefined);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstSync = useRef(true);

  const [state, setState] = useState<TabState>({
    currentTab: DEFAULT_TAB,
    tabHistory: [],
    newNotifications: initialNotifications,
  });

  const setTab = (tab: TabKey, options?: { replace?: boolean }) => {
    if (!TAB_ORDER.includes(tab)) {
      return;
    }

    const targetPath = `${DASHBOARD_BASE_PATH}/${tab}`;
    const shouldReplace = options?.replace ?? false;

    navigate(targetPath, { replace: shouldReplace });
  };

  const goBack = () => {
    setState((prev) => {
      if (prev.tabHistory.length === 0) {
        return prev;
      }

      const history = [...prev.tabHistory];
      const previousTab = history.pop() ?? DEFAULT_TAB;

      navigate(`${DASHBOARD_BASE_PATH}/${previousTab}`);

      return {
        ...prev,
        tabHistory: history,
      };
    });
  };

  const incrementNotification = (tab: TabKey, amount = 1) => {
    setState((prev) => ({
      ...prev,
      newNotifications: {
        ...prev.newNotifications,
        [tab]: prev.newNotifications[tab] + amount,
      },
    }));
  };

  const clearNotifications = (tab: TabKey) => {
    setState((prev) => ({
      ...prev,
      newNotifications: {
        ...prev.newNotifications,
        [tab]: 0,
      },
    }));
  };

  useEffect(() => {
    const derivedTab = getTabFromPath(location.pathname);

    if (!derivedTab) {
      if (location.pathname.startsWith(DASHBOARD_BASE_PATH)) {
        navigate(`${DASHBOARD_BASE_PATH}/${DEFAULT_TAB}`, { replace: true });
      }
      return;
    }

    setState((prev) => {
      if (prev.currentTab === derivedTab) {
        return prev;
      }

      const nextHistory =
        prev.currentTab && !isFirstSync.current
          ? [...prev.tabHistory, prev.currentTab].slice(-20)
          : prev.tabHistory;

      return {
        currentTab: derivedTab,
        tabHistory: nextHistory,
        newNotifications: {
          ...prev.newNotifications,
          [derivedTab]: 0,
        },
      };
    });

    if (isFirstSync.current) {
      isFirstSync.current = false;
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      const keyMap: Record<string, TabKey> = {
        "1": "chat",
        "2": "data",
        "3": "files",
        "4": "team",
      };

      const targetTab = keyMap[event.key];
      if (targetTab) {
        event.preventDefault();
        setTab(targetTab);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const getNextTab = (tab: TabKey): TabKey | null => {
    const index = TAB_ORDER.indexOf(tab);
    if (index === -1) return null;
    const nextIndex = index + 1;
    return TAB_ORDER[nextIndex] ?? null;
  };

  const getPreviousTab = (tab: TabKey): TabKey | null => {
    const index = TAB_ORDER.indexOf(tab);
    if (index === -1) return null;
    const prevIndex = index - 1;
    return TAB_ORDER[prevIndex] ?? null;
  };

  const value = useMemo<TabContextValue>(
    () => ({
      ...state,
      setTab,
      goBack,
      incrementNotification,
      clearNotifications,
      getNextTab,
      getPreviousTab,
    }),
    [state]
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTabContext = (): TabContextValue => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};
