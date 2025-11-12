import { Navigate, Route, Routes } from "react-router-dom";

import AppNew from "./AppNew";
import { TabProvider } from "./contexts/TabContext";
import DashboardLayout from "./components/layout/Dashboard";
import ChatDashboardView from "./components/chat/ChatDashboardView";
import DataDashboardView from "./components/data/DataDashboardView";
import FilesDashboardView from "./components/files/FilesDashboardView";
import TeamDashboardView from "./components/team/TeamDashboardView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppNew />} />
      <Route
        path="/dashboard"
        element={
          <TabProvider>
            <DashboardLayout />
          </TabProvider>
        }
      >
        <Route index element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<ChatDashboardView />} />
        <Route path="data" element={<DataDashboardView />} />
        <Route path="files" element={<FilesDashboardView />} />
        <Route path="team" element={<TeamDashboardView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
