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

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
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
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        path="/dashboard"
      />
    </Routes>
  );
}

export default App;
