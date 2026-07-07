import { createContext, useContext, useState, useEffect } from "react";
import { useAuthStatus, useLogin, useLogout } from "../Hooks/UseAuth";

import type { LoginModel } from "../Types/Authentication";

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginModel) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: authStatus, isLoading } = useAuthStatus();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  useEffect (() => {
    if (authStatus) {
        setIsAdmin(authStatus);
    }
  }, [authStatus]);

  const login = async (credentials: LoginModel) => {
    await loginMutation.mutateAsync(credentials);
    setIsAdmin(true);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth must be used within AuthProvider");

  return context;
}