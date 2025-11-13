import { ReactNode } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useTabContext } from "@/contexts/TabContext";

const MotionSection = styled(motion.section)`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const variants = {
  initial: (direction: "forward" | "backward" | "none") => ({
    opacity: 0,
    y: direction === "forward" ? 24 : direction === "backward" ? -24 : 16,
    scale: 0.98,
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: (direction: "forward" | "backward" | "none") => ({
    opacity: 0,
    y: direction === "forward" ? -20 : direction === "backward" ? 20 : -16,
    scale: 0.98,
    transition: { duration: 0.18, ease: "easeIn" },
  }),
};

interface TabContainerProps {
  children: ReactNode;
}

export function TabContainer({ children }: TabContainerProps) {
  const { transitionDirection } = useTabContext();

  return (
    <MotionSection
      variants={variants}
      custom={transitionDirection}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </MotionSection>
  );
}

export default TabContainer;
