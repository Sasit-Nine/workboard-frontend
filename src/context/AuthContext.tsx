import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { UserPayload } from "../type/type";

type AuthState = {
  token: string | null;
  user: UserPayload | null;
};

type AuthContextType = AuthState & {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): UserPayload | null {
  try {
    const payload = jwtDecode<UserPayload>(token);

    const exp = (payload as UserPayload)?.exp;
    if (typeof exp === "number" && exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function initAuthState(): AuthState {
  const savedToken = sessionStorage.getItem("token");
  if (!savedToken) return { token: null, user: null };

  const payload = decodeToken(savedToken);
  if (!payload) {
    sessionStorage.removeItem("token");
    return { token: null, user: null };
  }

  return { token: savedToken, user: payload };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initAuthState);

  const login = useCallback((token: string) => {
    const payload = decodeToken(token);

    if (!payload) {
      sessionStorage.removeItem("token");
      setAuth({ token: null, user: null });
      return;
    }

    sessionStorage.setItem("token", token);
    setAuth({ token, user: payload });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo<AuthContextType>(() => {
    return {
      token: auth.token,
      user: auth.user,
      isAuthenticated: !!auth.token && !!auth.user,
      login,
      logout,
    };
  }, [auth.token, auth.user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
