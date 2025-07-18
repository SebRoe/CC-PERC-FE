import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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

  useEffect(() => {
    // Initialize with demo users if none exist
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    if (users.length === 0) {
      const demoUsers = [
        {
          id: "1",
          email: "demo@example.com",
          password: "password123",
          name: "Demo User"
        },
        {
          id: "2", 
          email: "test@cc-perc.com",
          password: "test123",
          name: "Test User"
        }
      ];
      localStorage.setItem("registered_users", JSON.stringify(demoUsers));
    }

    // Check for stored user data on app start
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists in localStorage (mock database)
      const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Mock user data
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
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
    name: string,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
      };

      // Save to mock database
      users.push(newUser);
      localStorage.setItem("registered_users", JSON.stringify(users));

      // Set current user
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("user");
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
