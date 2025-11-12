import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TabKey = "chat" | "data" | "files" | "team";

const TAB_ORDER: TabKey[] = ["chat", "data", "files", "team"];

interface TabContextValue {
  currentTab: TabKey;
  setTab: (tab: TabKey) => void;
  tabHistory: TabKey[];
  newNotifications: Record<TabKey, number>;
  addNotification: (tab: TabKey, count?: number) => void;
  clearNotifications: (tab: TabKey) => void;
  transitionDirection: "forward" | "backward" | "none";
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

const getTabFromPath = (pathname: string): TabKey => {
  const normalized = pathname.replace("/dashboard", "").replace(/^\/+/, "");
  if (normalized === "" || normalized === "chat") return "chat";
  if (normalized.startsWith("data")) return "data";
  if (normalized.startsWith("files")) return "files";
  if (normalized.startsWith("team")) return "team";
  return "chat";
};

export function TabProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<TabKey>(getTabFromPath(location.pathname));
  const [tabHistory, setTabHistory] = useState<TabKey[]>([currentTab]);
  const [newNotifications, setNewNotifications] = useState<Record<TabKey, number>>({
    chat: 0,
    data: 0,
    files: 0,
    team: 0,
  });
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward" | "none">(
    "none",
  );

  const previousTabRef = useRef<TabKey>(currentTab);

  useEffect(() => {
    const nextTab = getTabFromPath(location.pathname);
    if (nextTab !== currentTab) {
      const previousIndex = TAB_ORDER.indexOf(previousTabRef.current);
      const nextIndex = TAB_ORDER.indexOf(nextTab);

      if (previousIndex < nextIndex) {
        setTransitionDirection("forward");
      } else if (previousIndex > nextIndex) {
        setTransitionDirection("backward");
      } else {
        setTransitionDirection("none");
      }

      setCurrentTab(nextTab);
      setTabHistory((history) => [...history, nextTab]);
      previousTabRef.current = nextTab;
    }
  }, [location.pathname, currentTab]);

  const setTab = useCallback(
    (tab: TabKey) => {
      if (tab === currentTab) return;
      const targetPath = tab === "chat" ? "/dashboard/chat" : `/dashboard/${tab}`;
      navigate(targetPath, { replace: false });
    },
    [currentTab, navigate],
  );

  const addNotification = useCallback((tab: TabKey, count = 1) => {
    setNewNotifications((prev) => ({
      ...prev,
      [tab]: prev[tab] + count,
    }));
  }, []);

  const clearNotifications = useCallback((tab: TabKey) => {
    setNewNotifications((prev) => ({
      ...prev,
      [tab]: 0,
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      switch (event.key) {
        case "1":
          event.preventDefault();
          setTab("chat");
          break;
        case "2":
          event.preventDefault();
          setTab("data");
          break;
        case "3":
          event.preventDefault();
          setTab("files");
          break;
        case "4":
          event.preventDefault();
          setTab("team");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTab]);

  const value = useMemo<TabContextValue>(
    () => ({
      currentTab,
      setTab,
      tabHistory,
      newNotifications,
      addNotification,
      clearNotifications,
      transitionDirection,
    }),
    [currentTab, setTab, tabHistory, newNotifications, addNotification, clearNotifications, transitionDirection],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};

export const useTabOrder = () => TAB_ORDER;
