import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

type AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
  signOut: () => void;
  logout: () => void;
  setCurrentUser: (user: CurrentUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setIsLoading(false);
      return () => { active = false; };
    }

    // Next lesson replaces the API stub with authenticated session restoration.
    void getCurrentUser()
      .then((res) => {
        if (active && res.data) setCurrentUser(res.data);
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem("auth-token");
          setCurrentUser(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const login = (token: string, user: CurrentUser) => {
    localStorage.setItem("auth-token", token);
    setCurrentUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("auth-token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      isLoading,
      login,
      signOut,
      logout: signOut,
      setCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
