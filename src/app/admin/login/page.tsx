"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Lock, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";

export default function LoginPage() {
  const { setToken } = useAdminAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await loginAdmin(username, password);
      setToken(res.accessToken);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'espace administration UPDesign.",
      });
      router.push("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Échec de connexion",
        description: error instanceof Error ? error.message : "Identifiants invalides.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#E61A3D]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#DD6FEE]/10 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md bg-card border-border dark:border-white/5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#E61A3D] via-[#DD6FEE] to-[#E61A3D]" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="flex justify-center mb-4">
            <span className="bg-[#E61A3D] px-4 py-1.5 rounded font-black text-3xl tracking-tighter text-white shadow-[0_0_15px_rgba(230,26,61,0.4)]">
              UP
            </span>
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Espace Administration</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Connectez-vous pour gérer les devis et les clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Email"
                  className="pl-10 bg-background border-input dark:border-white/10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-background border-input dark:border-white/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#E61A3D] hover:bg-[#E61A3D]/90 text-white font-bold py-6 text-lg shadow-[0_0_15px_rgba(230,26,61,0.2)]"
            >
              {authLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
