import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTabContext, TabKey } from "../../context/TabContext";

const TAB_ORDER: TabKey[] = ["chat", "data", "files", "team"];

interface TabContainerProps {
  locationKey: string;
  children: ReactNode;
}

export const TabContainer = ({ locationKey, children }: TabContainerProps) => {
  const { currentTab } = useTabContext();
  const previousTab = useRef<TabKey>(currentTab);
  const [direction, setDirection] = useState(0);

  const orderIndex = useMemo(
    () =>
      TAB_ORDER.reduce<Record<TabKey, number>>((acc, tab, index) => {
        acc[tab] = index;
        return acc;
      }, {} as Record<TabKey, number>),
    [],
  );

  useEffect(() => {
    const prev = previousTab.current;
    if (prev !== currentTab) {
      setDirection(orderIndex[currentTab] > orderIndex[prev] ? 1 : -1);
      previousTab.current = currentTab;
    } else {
      setDirection(0);
    }
  }, [currentTab, orderIndex]);

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={locationKey}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        custom={direction}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction === 0 ? 0 : direction > 0 ? 40 : -40,
    filter: "blur(4px)",
  }),
  enter: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction === 0 ? 0 : direction > 0 ? -40 : 40,
    filter: "blur(4px)",
  }),
};

export default TabContainer;
