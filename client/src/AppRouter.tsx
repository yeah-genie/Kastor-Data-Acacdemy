import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppNew from "./AppNew";
import DashboardShell from "./pages/Dashboard";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/*" element={<DashboardShell />} />
        <Route path="/legacy/*" element={<AppNew />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
