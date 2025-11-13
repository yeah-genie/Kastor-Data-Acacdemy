import { Navigate, Route, Routes } from "react-router-dom";

import AppNew from "./AppNew";
import { TabProvider } from "./contexts/TabContext";
import DashboardLayout from "./components/layout/Dashboard";
import { ChatView } from "./components/chat";
import { DataView } from "./components/data";
import { FilesView } from "./components/files";
import { TeamView } from "./components/team";

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
        <Route path="chat" element={<ChatView />} />
        <Route path="data" element={<DataView />} />
        <Route path="files" element={<FilesView />} />
        <Route path="team" element={<TeamView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
