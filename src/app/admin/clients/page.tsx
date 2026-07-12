"use client";

import React, { useState, useEffect } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  ClientResponse,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/auth";
import {
  Users,
  Search,
  Trash2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building,
  Loader2,
} from "lucide-react";

export default function ClientsPage() {
  const { token, handleLogout } = useAdminAuth();
  const { toast } = useToast();

  const [clientsList, setClientsList] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  // Form state
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientForm, setClientForm] = useState({ nom: "", email: "", telephone: "", adresse: "", societe: "" });
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const clients = await getClients(token);
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

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingClient) {
        await updateClient(editingClient.id, token, clientForm);
        toast({ title: "Client mis à jour", description: "Les informations du client ont été modifiées." });
      } else {
        await createClient(token, clientForm);
        toast({ title: "Client créé", description: "Nouveau client enregistré avec succès." });
      }
      setClientForm({ nom: "", email: "", telephone: "", adresse: "", societe: "" });
      setEditingClient(null);
      setShowAddClient(false);
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur client",
        description: error instanceof Error ? error.message : "Opération échouée.",
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (
      !token ||
      !confirm("Supprimer ce client supprimera également tous ses devis et commandes associés. Continuer ?")
    )
      return;
    try {
      await deleteClient(id, token);
      toast({ title: "Client supprimé", description: "Le client a été retiré de la base de données." });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Impossible de supprimer le client.",
      });
    }
  };

  const startEditClient = (client: ClientResponse) => {
    setEditingClient(client);
    setClientForm({
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse || "",
      societe: client.societe || "",
    });
    setShowAddClient(true);
  };

  const filteredClients = clientsList.filter(
    (c) =>
      c.nom.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.telephone.includes(clientSearch) ||
      (c.societe && c.societe.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border dark:border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-headline">Clients</h1>
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
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-10 bg-background/50 border-white/10"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditingClient(null);
              setClientForm({ nom: "", email: "", telephone: "", adresse: "", societe: "" });
              setShowAddClient(!showAddClient);
            }}
            className="bg-[#E61A3D] hover:bg-[#E61A3D]/90 gap-2 h-10 font-bold"
          >
            <Plus className="h-4 w-4" />
            Nouveau Client
          </Button>
        </div>

        {/* ── Add / Edit Form ──────────────────────────────────────────────── */}
        {showAddClient && (
          <Card className="bg-card/40 border-[#E61A3D]/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {editingClient ? "Modifier le Client" : "Nouveau Client"}
              </CardTitle>
              <CardDescription>Entrez les coordonnées du client dans la base de données.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="c_nom">Nom Complet *</Label>
                    <Input
                      id="c_nom"
                      placeholder="Ex: Jean Dupont"
                      value={clientForm.nom}
                      onChange={(e) => setClientForm({ ...clientForm, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c_email">Email *</Label>
                    <Input
                      id="c_email"
                      type="email"
                      placeholder="Ex: jean.dupont@entreprise.com"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c_tel">Téléphone *</Label>
                    <Input
                      id="c_tel"
                      placeholder="Ex: 06 12 34 56 78"
                      value={clientForm.telephone}
                      onChange={(e) => setClientForm({ ...clientForm, telephone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c_societe">Société / Entreprise</Label>
                    <Input
                      id="c_societe"
                      placeholder="Ex: UP Corp"
                      value={clientForm.societe}
                      onChange={(e) => setClientForm({ ...clientForm, societe: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="c_adresse">Adresse</Label>
                  <Input
                    id="c_adresse"
                    placeholder="Ex: 10 Rue des Enseignes, 75000 Paris"
                    value={clientForm.adresse}
                    onChange={(e) => setClientForm({ ...clientForm, adresse: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddClient(false)}
                    className="border-white/10 text-xs"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-[#E61A3D] hover:bg-[#E61A3D]/90 text-xs font-bold">
                    Sauvegarder
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── Clients Grid ────────────────────────────────────────────────── */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-card/10">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <h3 className="text-lg font-bold">Aucun client trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Recherchez un autre nom ou créez un nouveau profil.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-card/30 border-white/5 relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">{client.nom}</CardTitle>
                      {client.societe && (
                        <span className="text-xs text-[#DD6FEE] mt-1 flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          {client.societe}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">ID #{client.id}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>{client.telephone}</span>
                    </div>
                    {client.adresse && (
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{client.adresse}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-white/10 hover:bg-white/5 text-xs text-[#DD6FEE]"
                      onClick={() => startEditClient(client)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDeleteClient(client.id)}
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
