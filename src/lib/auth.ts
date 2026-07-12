"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { login as apiLogin } from "./api";

export function useAdminAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setTokenState(savedToken);
    }
    setIsLoading(false);
  }, []);

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("admin_token", newToken);
    } else {
      localStorage.removeItem("admin_token");
    }
    setTokenState(newToken);
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
