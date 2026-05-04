import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";

export type AuthUser = {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    const frame = window.requestAnimationFrame(() => {
      if (savedToken) setToken(savedToken);

      if (savedUser) {
        try {
          setUserState(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const setUser = useCallback((nextUser: AuthUser | null) => {
    setUserState(nextUser);

    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const login = useCallback(
    (nextUser: AuthUser, nextToken: string) => {
      localStorage.setItem("token", nextToken);
      localStorage.setItem("user", JSON.stringify(nextUser));
      setToken(nextToken);
      setUserState(nextUser);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUserState(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      setUser,
    }),
    [login, logout, setUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
