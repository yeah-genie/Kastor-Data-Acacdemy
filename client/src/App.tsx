import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/Dashboard";
import { TabProvider } from "./context/TabContext";
import { ChatView } from "./components/chat/ChatView";
import { DataView } from "./components/data/DataView";
import { FilesView } from "./components/files/FilesView";
import { TeamView } from "./components/team/TeamView";

function App() {
  return (
    <BrowserRouter>
      <TabProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<ChatView />} />
            <Route path="data" element={<DataView />} />
            <Route path="files" element={<FilesView />} />
            <Route path="team" element={<TeamView />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </TabProvider>
    </BrowserRouter>
  );
}

export default App;
