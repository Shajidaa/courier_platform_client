"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth.api";
import { isTokenExpired, parseJwt, tokenStorage } from "@/lib/token";
import type {
  IJwtPayload,
  ILoginPayload,
  IRegisterPayload,
  IVerifyEmailPayload,
} from "@/types/auth.types";
import { ROLE_HOME, type TRole } from "@/types/roles";

export interface AuthContextType {
  user: IJwtPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: ILoginPayload) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<void>;
  verifyEmail: (payload: IVerifyEmailPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getRoleHome(role: string): string {
  return ROLE_HOME[role as TRole] ?? "/dashboard/sender";
}

const AUTH_CHANGE_EVENT = "courierpro_auth_change";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<IJwtPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncStateFromStorage = useCallback(() => {
    try {
      const token = tokenStorage.get();
      if (token) {
        if (isTokenExpired(token)) {
          tokenStorage.remove();
          setUser(null);
          setIsAuthenticated(false);
        } else {
          const parsed = parseJwt(token);
          if (parsed) {
            setUser(parsed);
            setIsAuthenticated(true);
          } else {
            tokenStorage.remove();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncStateFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === null) {
        syncStateFromStorage();
      }
    };

    const handleCustomAuthChange = () => {
      syncStateFromStorage();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, handleCustomAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleCustomAuthChange);
    };
  }, [syncStateFromStorage]);

  const notifyAuthChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }
  };

  const login = useCallback(
    async (payload: ILoginPayload) => {
      const res = await authApi.login(payload);
      const { accessToken } = res.data!;
      tokenStorage.set(accessToken);
      const parsed = parseJwt(accessToken);
      setUser(parsed);
      setIsAuthenticated(true);
      setIsLoading(false);
      notifyAuthChange();
      router.push(getRoleHome(parsed?.role ?? ""));
    },
    [router]
  );

  const register = useCallback(
    async (payload: IRegisterPayload) => {
      await authApi.register(payload);
      router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`);
    },
    [router]
  );

  const verifyEmail = useCallback(
    async (payload: IVerifyEmailPayload) => {
      const res = await authApi.verifyEmail(payload);
      const { accessToken } = res.data!;
      tokenStorage.set(accessToken);
      const parsed = parseJwt(accessToken);
      setUser(parsed);
      setIsAuthenticated(true);
      setIsLoading(false);
      notifyAuthChange();
      router.push(getRoleHome(parsed?.role ?? ""));
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors during logout to allow local session cleanup
    } finally {
      tokenStorage.remove();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      notifyAuthChange();
      router.push("/login");
    }
  }, [router]);

  const refreshAuth = useCallback(() => {
    syncStateFromStorage();
  }, [syncStateFromStorage]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        verifyEmail,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
