import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import AppRouter from "./AppRouter";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
);
