import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

type AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (user: CurrentUser, token: string) => void;
  signOut: () => void;
  setCurrentUser: (user: CurrentUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return () => { active = false; };
    }

    // Next lesson replaces the API stub with authenticated session restoration.
    void getCurrentUser()
      .then((user: CurrentUser) => {
        if (active) setCurrentUser(user);
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const signIn = (user: CurrentUser, token: string) => {
    localStorage.setItem("token", token);
    setCurrentUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      isLoading,
      signIn,
      signOut,
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
