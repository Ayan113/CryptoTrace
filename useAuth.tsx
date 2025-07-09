import { LoginFormValues } from "@/pages/Auth";
import { useStoreActions } from "@/store/hooks";
import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginFormValues) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const loginAction = useStoreActions((actions) => actions.authModel.login);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, [localStorage.getItem("jwt")]);

  const login = async (data: LoginFormValues) => {
    try {
      await loginAction(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("jwt");
    window.location.href = "/landing";
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
