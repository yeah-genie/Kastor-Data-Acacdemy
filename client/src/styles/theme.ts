import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
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
};

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      danger: string;
      dark: string;
      darkGray: string;
      mediumGray: string;
      lightGray: string;
      white: string;
    };
    fonts: {
      heading: string;
      body: string;
      mono: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}
