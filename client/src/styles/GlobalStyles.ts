import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyles = createGlobalStyle`
  :root {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.white};
    background-color: ${theme.colors.dark};
    line-height: 1.5;
    font-weight: 400;
    color-scheme: only dark;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background-color: ${theme.colors.dark};
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
