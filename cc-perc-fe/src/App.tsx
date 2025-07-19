import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@heroui/spinner";
import IndexPage from "@/pages/index";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import DashboardV1Page from "@/pages/dashboard-v1";
import AnalysisDetailPage from "@/pages/analysis-detail";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="warning" size="lg" variant="dots" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="warning" size="lg" variant="dots" />
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard-v1" />;
};

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
        path="/auth"
      />
      <Route
        element={<Navigate to="/dashboard-v1" replace />}
        path="/dashboard"
      />
      <Route
        element={
          <ProtectedRoute>
            <DashboardV1Page />
          </ProtectedRoute>
        }
        path="/dashboard-v1"
      />
      <Route
        element={
          <ProtectedRoute>
            <AnalysisDetailPage />
          </ProtectedRoute>
        }
        path="/analysis/:id"
      />
    </Routes>
  );
}

export default App;
