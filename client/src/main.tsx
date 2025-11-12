import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import AppNew from "./AppNew";
import "./index.css";
import { theme } from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <AppNew />
  </ThemeProvider>,
);
