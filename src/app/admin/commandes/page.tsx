"use client";

import React, { useState, useEffect } from "react";
import {
  getCommandes,
  createCommande,
  updateCommande,
  deleteCommande,
  getClients,
  downloadCommandeBl,
  CommandeResponse,
  ClientResponse,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/auth";
import { ShoppingBag, Trash2, Plus, Loader2, Calendar, Download } from "lucide-react";

export default function CommandesPage() {
  const { token, handleLogout } = useAdminAuth();
  const { toast } = useToast();

  const [commandesList, setCommandesList] = useState<CommandeResponse[]>([]);
  const [clientsList, setClientsList] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [showAddCommande, setShowAddCommande] = useState(false);
  const [commandeForm, setCommandeForm] = useState({
    clientId: "",
    typePanneau: "",
    dimensions: "",
    matiere: "",
    prix: "",
    statut: "EN_ATTENTE" as "EN_ATTENTE" | "EN_COURS" | "TERMINEE",
  });
  const [editingCommande, setEditingCommande] = useState<CommandeResponse | null>(null);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [cmd, clients] = await Promise.all([getCommandes(token), getClients(token)]);
      setCommandesList(cmd);
      setClientsList(clients);
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

  const handleCommandeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const reqData = {
      clientId: commandeForm.clientId,
      typePanneau: commandeForm.typePanneau,
      dimensions: commandeForm.dimensions,
      matiere: commandeForm.matiere,
      prix: Number(commandeForm.prix) || 0,
      statut: commandeForm.statut,
    };
    try {
      if (editingCommande) {
        await updateCommande(editingCommande.id, token, reqData);
        toast({ title: "Commande mise à jour", description: "Les informations de la commande ont été modifiées." });
      } else {
        await createCommande(token, reqData);
        toast({ title: "Commande créée", description: "Nouvelle commande enregistrée avec succès." });
      }
      setCommandeForm({ clientId: "", typePanneau: "", dimensions: "", matiere: "", prix: "", statut: "EN_ATTENTE" });
      setEditingCommande(null);
      setShowAddCommande(false);
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur commande",
        description: error instanceof Error ? error.message : "Opération échouée.",
      });
    }
  };

  const handleDeleteCommande = async (id: string) => {
    if (!token || !confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;
    try {
      await deleteCommande(id, token);
      toast({ title: "Commande supprimée", description: "La commande a été retirée de la base de données." });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Impossible de supprimer la commande.",
      });
    }
  };

  const handleDownloadBl = async (id: string) => {
    if (!token) return;
    try {
      toast({ title: "Génération PDF", description: "Veuillez patienter pendant le téléchargement..." });
      await downloadCommandeBl(id, token);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur PDF",
        description: error instanceof Error ? error.message : "Impossible de télécharger le BL PDF.",
      });
    }
  };

  const startEditCommande = (cmd: CommandeResponse) => {
    setEditingCommande(cmd);
    setCommandeForm({
      clientId: String(cmd.clientId),
      typePanneau: cmd.typePanneau,
      dimensions: cmd.dimensions || "",
      matiere: cmd.matiere || "",
      prix: String(cmd.prix),
      statut: cmd.statut,
    });
    setShowAddCommande(true);
  };

  // Sort commandes by ID ascending to assign sequential numbers
  const sortedChronologically = [...commandesList].sort(
    (a, b) => a.id.localeCompare(b.id)
  );

  const getCommandeNumber = (id: string) => {
    const idx = sortedChronologically.findIndex((c) => c.id === id);
    return idx !== -1 ? idx + 1 : 1;
  };

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border dark:border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-headline">Commandes</h1>
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
        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-xl border border-white/5">
          <div className="text-sm font-semibold">Gestion des projets en cours de fabrication.</div>
          <Button
            onClick={() => {
              setEditingCommande(null);
              setCommandeForm({ clientId: "", typePanneau: "", dimensions: "", matiere: "", prix: "", statut: "EN_ATTENTE" });
              setShowAddCommande(!showAddCommande);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 gap-2 h-10 font-bold"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Commande
          </Button>
        </div>

        {/* ── Add / Edit Form ──────────────────────────────────────────────── */}
        {showAddCommande && (
          <Card className="bg-card/40 border-emerald-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500" />
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {editingCommande ? "Modifier la Commande" : "Nouvelle Commande"}
              </CardTitle>
              <CardDescription>Enregistrez un nouveau projet de signalétique en production.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommandeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cmd_client">Sélectionner le Client *</Label>
                    <select
                      id="cmd_client"
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={commandeForm.clientId}
                      onChange={(e) => setCommandeForm({ ...commandeForm, clientId: e.target.value })}
                      required
                    >
                      <option value="" className="bg-[#2C2627]">-- Choisir un client --</option>
                      {clientsList.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#2C2627]">
                          {c.nom} {c.societe ? `(${c.societe})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cmd_type">Type Enseigne *</Label>
                    <Input
                      id="cmd_type"
                      placeholder="Ex: Enseigne Néon LED"
                      value={commandeForm.typePanneau}
                      onChange={(e) => setCommandeForm({ ...commandeForm, typePanneau: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cmd_dim">Dimensions</Label>
                    <Input
                      id="cmd_dim"
                      placeholder="Ex: 120 x 80 cm"
                      value={commandeForm.dimensions}
                      onChange={(e) => setCommandeForm({ ...commandeForm, dimensions: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cmd_mat">Matière / Description</Label>
                    <Input
                      id="cmd_mat"
                      placeholder="Ex: Plexiglas + Néon flexible rouge"
                      value={commandeForm.matiere}
                      onChange={(e) => setCommandeForm({ ...commandeForm, matiere: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cmd_prix">Prix Facturé (DH) *</Label>
                    <Input
                      id="cmd_prix"
                      type="number"
                      placeholder="Ex: 2450"
                      value={commandeForm.prix}
                      onChange={(e) => setCommandeForm({ ...commandeForm, prix: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cmd_statut">Statut Production *</Label>
                    <select
                      id="cmd_statut"
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={commandeForm.statut}
                      onChange={(e) => setCommandeForm({ ...commandeForm, statut: e.target.value as "EN_ATTENTE" | "EN_COURS" | "TERMINEE" })}
                      required
                    >
                      <option value="EN_ATTENTE" className="bg-[#2C2627]">En attente de démarrage</option>
                      <option value="EN_COURS" className="bg-[#2C2627]">En cours de fabrication</option>
                      <option value="TERMINEE" className="bg-[#2C2627]">Terminée / Prête à installer</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCommande(false)}
                    className="border-white/10 text-xs"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── Commandes List ───────────────────────────────────────────────── */}
        {commandesList.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-card/10">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <h3 className="text-lg font-bold">Aucune commande en production</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Validez un devis existant ou créez manuellement une commande pour démarrer la production.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {commandesList.map((cmd) => (
              <Card key={cmd.id} className="bg-card/30 border-white/5">
                <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
                        COMMANDE #{getCommandeNumber(cmd.id)}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          cmd.statut === "TERMINEE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : cmd.statut === "EN_COURS"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/25"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                        }`}
                      >
                        {cmd.statut === "TERMINEE"
                          ? "TERMINEE (Prêt)"
                          : cmd.statut === "EN_COURS"
                          ? "FABRICATION EN COURS"
                          : "EN ATTENTE"}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold mt-2 font-headline">{cmd.clientNom}</CardTitle>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-500">
                      {(cmd.prix ?? 0).toLocaleString("fr-FR")} DH
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-end">
                      <Calendar className="h-3 w-3" />
                      {new Date(cmd.dateCreation).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/30 p-3 rounded-lg border border-white/5 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Projet</span>
                      <span className="font-semibold text-white">{cmd.typePanneau}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Dimensions</span>
                      <span className="font-semibold text-white">{cmd.dimensions || "Non spécifiées"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Détails Matière</span>
                      <span className="font-semibold text-white">{cmd.matiere || "Non spécifiés"}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-white/10 hover:bg-white/5 gap-1.5 text-xs text-sky-400 hover:text-sky-300"
                      onClick={() => handleDownloadBl(cmd.id)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      BL PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-white/10 hover:bg-white/5 text-xs text-emerald-400"
                      onClick={() => startEditCommande(cmd)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDeleteCommande(cmd.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
