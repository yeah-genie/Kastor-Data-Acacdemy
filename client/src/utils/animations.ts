import { Variants } from "framer-motion";

export const fadeInOut: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

export const slideTabs: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.2 },
  }),
};

export const scaleOnHover: Variants = {
  rest: { scale: 1, boxShadow: "none" },
  hover: {
    scale: 1.02,
    boxShadow: "0 18px 32px rgba(33, 150, 243, 0.18)",
    transition: { type: "spring", stiffness: 320, damping: 18 },
  },
};

export const reducedMotionEnabled = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
