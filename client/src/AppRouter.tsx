import { Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AppNew from "./AppNew";
import { DashboardPage, DashboardIndexRedirect } from "./pages/Dashboard";
import ChatTab from "./pages/dashboard/ChatTab";
import DataTab from "./pages/dashboard/DataTab";
import FilesTab from "./pages/dashboard/FilesTab";
import TeamTab from "./pages/dashboard/TeamTab";
import DevToolsPanel from "@/components/devtools/DevToolsPanel";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<AppNew />} />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardIndexRedirect />} />
            <Route path="chat" element={<ChatTab />} />
            <Route path="data" element={<DataTab />} />
            <Route path="files" element={<FilesTab />} />
            <Route path="team" element={<TeamTab />} />
            <Route path="*" element={<Navigate to="chat" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <DevToolsPanel />
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
