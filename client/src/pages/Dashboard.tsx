import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { TabProvider, useTabContext } from "@/contexts/TabContext";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { TabContainer } from "@/components/layout/TabContainer";
import { ChatView } from "@/components/chat/ChatView";
import { DataView } from "@/components/data/DataView";
import { FilesView } from "@/components/files/FilesView";
import { TeamView } from "@/components/team/TeamView";

function DashboardRoutes() {
  const location = useLocation();
  const { transitionDirection } = useTabContext();

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
        <TabContainer key={location.pathname}>
          <Routes location={location}>
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<ChatView />} />
            <Route path="data" element={<DataView />} />
            <Route path="files" element={<FilesView />} />
            <Route path="team" element={<TeamView />} />
            <Route path="*" element={<Navigate to="chat" replace />} />
          </Routes>
        </TabContainer>
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function DashboardShell() {
  return (
    <TabProvider>
      <DashboardRoutes />
    </TabProvider>
  );
}
