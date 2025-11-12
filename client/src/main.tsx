import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import AppNew from "./AppNew";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppNew />
    </ThemeProvider>
  </StrictMode>,
);
