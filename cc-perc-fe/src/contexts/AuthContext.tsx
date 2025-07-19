import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { api, type User } from "@/lib/api-with-interceptor";


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const currentUser = await api.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return true;
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
    return false;
  };

  // Set up automatic token refresh every 45 minutes (JWT typically expires in 1 hour)
  const setupTokenRefresh = () => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Set up new interval
    refreshIntervalRef.current = setInterval(async () => {
      const success = await refreshSession();
      if (!success) {
        // If refresh fails, log out the user
        logout();
      }
    }, 45 * 60 * 1000); // 45 minutes
  };

  useEffect(() => {
    // Check if user is authenticated by trying to get current user
    const checkAuth = async () => {
      try {
        // Skip auth interceptor on initial load to prevent loops
        const currentUser = await api.getCurrentUser(true);
        setUser(currentUser);
        // Set up token refresh if authentication is successful
        setupTokenRefresh();
      } catch (error) {
        console.error("Not authenticated:", error);
        // User is not authenticated, which is fine
      }
      setIsLoading(false);
    };

    checkAuth();

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      setUser(response.user);
      // Set up token refresh after successful login
      setupTokenRefresh();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.register(
        email,
        password,
        firstName,
        lastName,
      );
      setUser(response.user);
      // Set up token refresh after successful registration
      setupTokenRefresh();
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    setUser(null);
    api.logout();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
