import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import { DashboardPage } from "./pages/dashboard";
import { TasksPage } from "./pages/tasks";
import { SettingsPage } from "./pages/settings";
import { PrivacyPage } from "./pages/privacy";
import { ToastProvider, useToast } from "./components/ui/toast";
import { useOverdueNotifier } from "./hooks/useOverdueNotifier";

function AppInner() {
  const { toast } = useToast();
  useOverdueNotifier(toast);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

export default App;
