export const theme = {
  colors: {
    primary: "#2196F3",
    secondary: "#FF9800",
    success: "#4CAF50",
    danger: "#F44336",
    dark: "#1E1E1E",
    darkGray: "#2D2D2D",
    mediumGray: "#3D3D3D",
    lightGray: "#E0E0E0",
    white: "#FFFFFF",
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Noto Sans KR', sans-serif",
    mono: "'Fira Code', monospace",
  },
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1440px",
  },
} as const;

export type Theme = typeof theme;
