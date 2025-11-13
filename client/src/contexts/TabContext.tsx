import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DashboardTabId } from "@/components/layout";

export interface TabContextValue {
  currentTab: DashboardTabId;
  setTab: (tab: DashboardTabId, options?: { silent?: boolean }) => void;
  tabHistory: DashboardTabId[];
  goBack: () => DashboardTabId | null;
  newNotifications: Partial<Record<DashboardTabId, number>>;
  setNotificationCount: (tab: DashboardTabId, count: number) => void;
  incrementNotification: (tab: DashboardTabId, amount?: number) => void;
  clearNotifications: (tab: DashboardTabId) => void;
}

interface TabProviderProps {
  initialTab: DashboardTabId;
  orderedTabs: DashboardTabId[];
  children: ReactNode;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

const clampTabIndex = (
  current: DashboardTabId,
  orderedTabs: DashboardTabId[],
  direction: 1 | -1,
) => {
  const idx = orderedTabs.indexOf(current);
  if (idx === -1) {
    return current;
  }
  const nextIndex = Math.max(0, Math.min(orderedTabs.length - 1, idx + direction));
  return orderedTabs[nextIndex] ?? current;
};

export const TabProvider = ({
  initialTab,
  orderedTabs,
  children,
}: TabProviderProps) => {
  const [currentTab, setCurrentTab] = useState<DashboardTabId>(initialTab);
  const [tabHistory, setTabHistory] = useState<DashboardTabId[]>([initialTab]);
  const [notifications, setNotifications] = useState<
    Partial<Record<DashboardTabId, number>>
  >({});

  const orderedTabsRef = useRef(orderedTabs);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    orderedTabsRef.current = orderedTabs;
  }, [orderedTabs]);

  const setTab = useCallback(
    (tab: DashboardTabId, options?: { silent?: boolean }) => {
      setCurrentTab((prev) => (prev === tab ? prev : tab));
      if (!options?.silent) {
        setTabHistory((prev) => {
          const last = prev[prev.length - 1];
          if (last === tab) {
            return prev;
          }
          return [...prev, tab];
        });
      }
    },
    [],
  );

  const goBack = useCallback(() => {
    let previousTab: DashboardTabId | null = null;
    setTabHistory((prev) => {
      if (prev.length <= 1) {
        previousTab = prev[0] ?? null;
        return prev;
      }
      const nextHistory = prev.slice(0, -1);
      previousTab = nextHistory[nextHistory.length - 1] ?? null;
      if (previousTab) {
        setCurrentTab(previousTab);
      }
      return nextHistory;
    });
    return previousTab;
  }, []);

  const setNotificationCount = useCallback((tab: DashboardTabId, count: number) => {
    setNotifications((prev) => ({ ...prev, [tab]: Math.max(0, count) }));
  }, []);

  const incrementNotification = useCallback(
    (tab: DashboardTabId, amount = 1) => {
      setNotifications((prev) => ({
        ...prev,
        [tab]: Math.max(0, (prev[tab] ?? 0) + amount),
      }));
    },
    [],
  );

  const clearNotifications = useCallback((tab: DashboardTabId) => {
    setNotifications((prev) => {
      if (prev[tab] === undefined || prev[tab] === 0) {
        return prev;
      }
      const next = { ...prev };
      delete next[tab];
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;

      const keyMap: Record<string, DashboardTabId | undefined> = {
        Digit1: orderedTabsRef.current[0],
        Digit2: orderedTabsRef.current[1],
        Digit3: orderedTabsRef.current[2],
        Digit4: orderedTabsRef.current[3],
      };

      const mappedTab = keyMap[event.code];
      if (mappedTab) {
        event.preventDefault();
        setTab(mappedTab);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTab]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      swipeStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const start = swipeStartRef.current;
      const touch = event.changedTouches[0];
      swipeStartRef.current = null;

      if (!start) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const dt = Date.now() - start.time;

      if (dt > 600) return;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;

      const direction: 1 | -1 = dx < 0 ? 1 : -1;
      const nextTab = clampTabIndex(currentTab, orderedTabsRef.current, direction);

      if (nextTab !== currentTab) {
        setTab(nextTab);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentTab, setTab]);

  const value = useMemo<TabContextValue>(
    () => ({
      currentTab,
      setTab,
      tabHistory,
      goBack,
      newNotifications: notifications,
      setNotificationCount,
      incrementNotification,
      clearNotifications,
    }),
    [
      clearNotifications,
      currentTab,
      goBack,
      incrementNotification,
      notifications,
      setNotificationCount,
      tabHistory,
      setTab,
    ],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTabContext = (): TabContextValue => {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return ctx;
};
