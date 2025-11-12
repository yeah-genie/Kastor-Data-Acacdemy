import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
