"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { login as apiLogin } from "./api";

// Global state to synchronize token across all hook instances
let globalToken: string | null = null;
let globalIsLoading = true;
const listeners = new Set<(token: string | null) => void>();

if (typeof window !== "undefined") {
  globalToken = localStorage.getItem("admin_token");
  globalIsLoading = false;
}

export function useAdminAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Sync with global state on mount
    setTokenState(globalToken);
    setIsLoading(globalIsLoading);

    const onChange = (newToken: string | null) => {
      setTokenState(newToken);
      setIsLoading(false);
    };

    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const setToken = useCallback((newToken: string | null) => {
    globalToken = newToken;
    globalIsLoading = false;
    if (newToken) {
      localStorage.setItem("admin_token", newToken);
    } else {
      localStorage.removeItem("admin_token");
    }
    // Notify all active listeners
    listeners.forEach((listener) => listener(newToken));
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
    router.push("/admin/login");
  }, [setToken, toast, router]);

  return { token, setToken, handleLogout, isLoading };
}

export async function loginAdmin(username: string, password: string) {
  if (process.env.NODE_ENV === "development") {
    const devUser = process.env.NEXT_PUBLIC_DEV_ADMIN_USER;
    const devPass = process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD;

    if (devUser && devPass) {
      // Dev credentials are configured — validate them locally
      if (username === devUser && password === devPass) {
        return { accessToken: "dev_token_123" };
      }
      throw new Error("Identifiants invalides.");
    }
  }
  return apiLogin(username, password);
}
