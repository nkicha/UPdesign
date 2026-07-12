"use client";

import React, { useState, useEffect } from "react";
import {
  getDevis,
  updateDevis,
  deleteDevis,
  downloadDevisPdf,
  DevisResponse,
  API_BASE_URL,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Download,
  Loader2,
  Calendar,
  Paperclip,
  Eye,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

type ViewMode = "table" | "cards";

export default function DevisPage() {
  const { token, handleLogout } = useAdminAuth();
  const { toast } = useToast();

  const [devisList, setDevisList] = useState<DevisResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [devisSearch, setDevisSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const devis = await getDevis(token);
      setDevisList(devis);
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

  const handleUpdateDevisStatus = async (devis: DevisResponse, newStatus: DevisResponse["statut"]) => {
    if (!token) return;
    try {
      await updateDevis(devis.id, token, {
        clientId: devis.clientId,
        typePanneau: devis.typePanneau,
        dimensions: devis.dimensions,
        matiere: devis.matiere,
        prix: devis.prix,
        description: devis.description,
        statut: newStatus,
      });
      toast({ title: "Statut mis à jour", description: `Le devis #${getDevisNumber(devis.id)} est maintenant ${newStatus}.` });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error instanceof Error ? error.message : "Impossible de modifier le devis.",
      });
    }
  };

  const handleDeleteDevis = async (id: string) => {
    if (!token || !confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) return;
    try {
      await deleteDevis(id, token);
      toast({ title: "Devis supprimé", description: `Le devis #${getDevisNumber(id)} a été supprimé.` });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Impossible de supprimer le devis.",
      });
    }
  };

  const handleDownloadPdf = async (id: string) => {
    if (!token) return;
    try {
      toast({ title: "Génération PDF", description: "Veuillez patienter pendant le téléchargement..." });
      await downloadDevisPdf(id, token);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur PDF",
        description: error instanceof Error ? error.message : "Impossible de télécharger le PDF.",
      });
    }
  };

  const filteredDevis = devisList.filter(
    (d) =>
      d.clientNom.toLowerCase().includes(devisSearch.toLowerCase()) ||
      d.typePanneau.toLowerCase().includes(devisSearch.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(devisSearch.toLowerCase()))
  );

  // Sort devis by ID ascending to assign sequential numbers
  const sortedChronologically = [...devisList].sort(
    (a, b) => a.id.localeCompare(b.id)
  );

  const getDevisNumber = (id: string) => {
    const idx = sortedChronologically.findIndex((d) => d.id === id);
    return idx !== -1 ? idx + 1 : 1;
  };

  const statusBadgeClass = (statut: DevisResponse["statut"]) =>
    statut === "VALIDE"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
      : statut === "ANNULE"
        ? "bg-red-500/10 text-red-400 border border-red-500/25"
        : statut === "EN_COURS"
          ? "bg-sky-500/10 text-sky-400 border border-sky-500/25"
          : "bg-amber-500/10 text-amber-400 border border-amber-500/25";

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  const renderStatusActions = (devis: DevisResponse, size: "sm" | "xs" = "sm") => (
    <>
      {devis.statut === "EN_ATTENTE" && (
        <>
          <Button
            size="sm"
            className="h-8 bg-emerald-500 hover:bg-emerald-600 gap-1.5 text-xs text-white"
            onClick={() => handleUpdateDevisStatus(devis, "VALIDE")}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {size === "sm" && "Valider"}
          </Button>
          <Button
            size="sm"
            className="h-8 bg-red-500 hover:bg-red-600 gap-1.5 text-xs text-white"
            onClick={() => handleUpdateDevisStatus(devis, "ANNULE")}
          >
            <XCircle className="h-3.5 w-3.5" />
            {size === "sm" && "Annuler"}
          </Button>
        </>
      )}
      {devis.statut === "VALIDE" && (
        <Button
          size="sm"
          className="h-8 bg-sky-500 hover:bg-sky-600 gap-1.5 text-xs text-white"
          onClick={() => handleUpdateDevisStatus(devis, "EN_COURS")}
        >
          <Play className="h-3.5 w-3.5" />
          {size === "sm" && "Lancer"}
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border dark:border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-headline">Devis</h1>
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

      <div className="space-y-6">
        {/* ── Search bar + view toggle ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-xl border border-white/5">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un devis..."
              className="pl-10 bg-background/50 border-white/10"
              value={devisSearch}
              onChange={(e) => setDevisSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Affichage de {filteredDevis.length} devis sur {devisList.length} au total.
            </div>

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-white/10 bg-background/50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                Tableau
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === "cards"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Cartes
              </button>
            </div>
          </div>
        </div>

        {/* ── List ────────────────────────────────────────────────────────── */}
        {loading && devisList.length === 0 ? (
          viewMode === "table" ? <DevisTableSkeleton /> : <DevisListSkeleton />
        ) : filteredDevis.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-card/10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <h3 className="text-lg font-bold">Aucun devis trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Essayez d'ajuster vos critères de recherche ou soumettez de nouveaux devis.
            </p>
          </div>
        ) : viewMode === "table" ? (
          /* ── TABLE VIEW ──────────────────────────────────────────────── */
          <div className="rounded-xl border border-white/5 bg-card/30 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-background/40 border-b border-white/5 text-left">
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">#</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Client</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Statut</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Dimensions</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Matière</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide text-right">Prix</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Date</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide text-center">Fichier</th>
                    <th className="px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants} initial="hidden" animate="show">
                  {filteredDevis.map((devis) => (
                    <motion.tr
                      key={devis.id}
                      variants={itemVariants}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
                          #{getDevisNumber(devis.id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white max-w-[160px] truncate">{devis.clientNom}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusBadgeClass(devis.statut)}`}>
                          {devis.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">{devis.typePanneau || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">{devis.dimensions || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[120px] truncate">{devis.matiere || "—"}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary whitespace-nowrap">
                        {(devis.prix ?? 0).toLocaleString("fr-FR")} DH
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3 w-3" />
                          {new Date(devis.dateCreation).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {devis.fileUrl ? (
                          <a
                            href={devis.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-7 w-7 rounded-md text-primary hover:bg-primary/10 transition-colors"
                            title="Voir le fichier"
                          >
                            <Paperclip className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDownloadPdf(devis.id)}
                            className="h-7 w-7 border-white/10 hover:bg-white/5 text-sky-400 hover:text-sky-300"
                            title="Télécharger PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          {renderStatusActions(devis, "xs")}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteDevis(devis.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ── CARD VIEW ───────────────────────────────────────────────── */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6"
          >
            {filteredDevis.map((devis) => (
              <motion.div
                key={devis.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Card className="bg-card/30 border-white/5 hover:border-white/10 transition-colors shadow-md">
                  <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
                          DEVIS #{getDevisNumber(devis.id)}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusBadgeClass(devis.statut)}`}>
                          {devis.statut}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold mt-2 font-headline">{devis.clientNom}</CardTitle>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-primary">
                        {(devis.prix ?? 0).toLocaleString("fr-FR")} DH
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-end">
                        <Calendar className="h-3 w-3" />
                        {new Date(devis.dateCreation).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Technical specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/30 p-3 rounded-lg border border-white/5 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">Type Enseigne</span>
                        <span className="font-semibold text-white">{devis.typePanneau || "Non spécifié"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Dimensions / Délai</span>
                        <span className="font-semibold text-white">{devis.dimensions || "Non spécifiées"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Matières</span>
                        <span className="font-semibold text-white">{devis.matiere || "Non spécifiée"}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {devis.description && (
                      <div className="text-sm text-muted-foreground bg-background/10 p-3 rounded border border-white/5 whitespace-pre-line">
                        {devis.description}
                      </div>
                    )}

                    {/* Attached file */}
                    {devis.fileUrl && (
                      <div className="flex items-center gap-4 p-3 bg-secondary/5 border border-border dark:border-white/5 rounded-lg text-sm transition-all">
                        <Paperclip className="h-5 w-5 text-primary shrink-0 animate-pulse-slow" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground block">
                            Fichier de référence (logo, plan, façade)
                          </span>
                          <a
                            href={devis.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-primary hover:underline hover:text-primary/80 transition-colors truncate flex items-center gap-1 mt-0.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Visualiser / Télécharger le document
                          </a>
                        </div>
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(devis.fileUrl) && (
                          <a
                            href={devis.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <img
                              src={devis.fileUrl}
                              alt="Aperçu"
                              className="h-12 w-12 object-cover rounded border border-border dark:border-white/10 hover:opacity-80 transition-all shadow-md"
                            />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPdf(devis.id)}
                          className="h-8 border-white/10 hover:bg-white/5 gap-1.5 text-xs text-sky-400 hover:text-sky-300"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Télécharger PDF
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderStatusActions(devis, "sm")}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteDevis(devis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

function DevisTableSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-card/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background/40 border-b border-white/5">
              {["#", "Client", "Statut", "Type", "Dimensions", "Matière", "Prix", "Date", "Fichier", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-12 bg-white/5" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                {[...Array(10)].map((__, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-4 w-16 bg-white/5" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DevisListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-card/30 border-white/5 relative overflow-hidden animate-pulse">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 bg-white/5" />
                <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
              </div>
              <Skeleton className="h-6 w-48 bg-white/5" />
            </div>

            <div className="text-right space-y-2 flex flex-col items-end">
              <Skeleton className="h-8 w-28 bg-white/5" />
              <Skeleton className="h-4 w-20 bg-white/5" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Technical specs skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/30 p-3 rounded-lg border border-white/5">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3.5 w-16 bg-white/5" />
                  <Skeleton className="h-4 w-24 bg-white/5" />
                </div>
              ))}
            </div>

            {/* Description skeleton */}
            <Skeleton className="h-10 w-full bg-white/5" />

            {/* Actions skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
              <Skeleton className="h-8 w-32 bg-white/5" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 bg-white/5" />
                <Skeleton className="h-8 w-8 bg-white/5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}