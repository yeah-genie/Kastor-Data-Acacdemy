import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import AppRouter from "./AppRouter";
import "./index.css";
import { theme } from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <AppRouter />
  </ThemeProvider>,
);
