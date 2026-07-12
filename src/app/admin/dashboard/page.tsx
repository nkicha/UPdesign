"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getDashboard, DashboardData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  DollarSign,
  UserPlus,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { token, handleLogout } = useAdminAuth();
  const { toast } = useToast();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const stats = await getDashboard(token);
      setDashboardData(stats);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: error instanceof Error ? error.message : "Impossible de récupérer les données.",
      });
      if (error instanceof Error && error.message.includes("401")) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border dark:border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-headline">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les demandes de devis et suivez l'activité commerciale en temps réel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          <Button
            onClick={fetchData}
            variant="outline"
            className="border-border dark:border-white/10 bg-transparent hover:bg-secondary dark:hover:bg-white/5 text-foreground dark:text-muted-foreground hover:text-primary transition-colors duration-300 text-xs h-9"
          >
            Actualiser
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* ── Stats Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/30 border-white/5 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{dashboardData?.totalClients ?? 0}</div>
              <p className="text-xs text-muted-foreground/60 mt-1">Clients uniques enregistrés</p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-white/5 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Demandes Devis</CardTitle>
              <FileText className="h-5 w-5 text-[#DD6FEE]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{dashboardData?.totalDevis ?? 0}</div>
              <p className="text-xs text-muted-foreground/60 mt-1">Devis formulés / reçus</p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-white/5 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Commandes Actives</CardTitle>
              <ShoppingBag className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{dashboardData?.totalCommandes ?? 0}</div>
              <p className="text-xs text-muted-foreground/60 mt-1">Projets convertis en production</p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-white/5 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'Affaires Mensuel</CardTitle>
              <DollarSign className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">
                {(dashboardData?.monthlyRevenue ?? 0).toLocaleString("fr-FR")} DH
              </div>
              <p className="text-xs text-muted-foreground/60 mt-1">Revenu cumulé estimé</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Quick Actions + Last Activity ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card/20 border-white/5">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Effectuez des tâches courantes en un clic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/devis"
                  className="flex flex-col items-center justify-center h-24 gap-2 bg-[#E61A3D]/10 hover:bg-[#E61A3D]/20 border border-[#E61A3D]/20 text-[#E61A3D] rounded-lg text-sm font-medium transition-colors"
                >
                  <FileText className="h-6 w-6" />
                  Voir les Devis
                </Link>
                <Link
                  href="/admin/clients"
                  className="flex flex-col items-center justify-center h-24 gap-2 bg-[#DD6FEE]/10 hover:bg-[#DD6FEE]/20 border border-[#DD6FEE]/20 text-[#DD6FEE] rounded-lg text-sm font-medium transition-colors"
                >
                  <UserPlus className="h-6 w-6" />
                  Nouveau Client
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/20 border-white/5">
            <CardHeader>
              <CardTitle>Dernières Activités</CardTitle>
              <CardDescription>Aperçu des récents événements commerciaux.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-6">
                  Consultez les autres onglets pour voir les listes détaillées de vos clients et devis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
