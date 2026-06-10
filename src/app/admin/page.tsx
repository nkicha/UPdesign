"use client";

import React, { useState, useEffect } from "react";
import { 
  login, 
  getDashboard, 
  getDevis, 
  updateDevis, 
  deleteDevis, 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient, 
  getCommandes, 
  createCommande, 
  updateCommande, 
  deleteCommande, 
  downloadDevisPdf,
  ClientResponse,
  DevisResponse,
  CommandeResponse,
  DashboardData,
  API_BASE_URL
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Play, 
  Download, 
  LogOut, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Loader2,
  Calendar,
  Lock,
  ChevronRight,
  UserPlus,
  Paperclip,
  Eye
} from "lucide-react";

export default function AdminPage() {
  const { toast } = useToast();
  
  // Auth states
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  // App states
  const [activeTab, setActiveTab] = useState<"dashboard" | "devis" | "clients" | "commandes">("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [devisList, setDevisList] = useState<DevisResponse[]>([]);
  const [clientsList, setClientsList] = useState<ClientResponse[]>([]);
  const [commandesList, setCommandesList] = useState<CommandeResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Search filters
  const [devisSearch, setDevisSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  
  // Modals & form state
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientForm, setClientForm] = useState({ nom: "", email: "", telephone: "", adresse: "", societe: "" });
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);

  const [showAddCommande, setShowAddCommande] = useState(false);
  const [commandeForm, setCommandeForm] = useState({ clientId: "", typePanneau: "", dimensions: "", matiere: "", prix: "", statut: "EN_ATTENTE" as "EN_ATTENTE" | "EN_COURS" | "TERMINEE" });
  const [editingCommande, setEditingCommande] = useState<CommandeResponse | null>(null);

  // Load token from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Fetch data when token or active tab changes
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    if (!token) return;
    setDataLoading(true);
    try {
      if (activeTab === "dashboard") {
        const stats = await getDashboard(token);
        setDashboardData(stats);
      } else if (activeTab === "devis") {
        const devis = await getDevis(token);
        setDevisList(devis);
      } else if (activeTab === "clients") {
        const clients = await getClients(token);
        setClientsList(clients);
      } else if (activeTab === "commandes") {
        const cmd = await getCommandes(token);
        setCommandesList(cmd);
        const clients = await getClients(token);
        setClientsList(clients);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: error instanceof Error ? error.message : "Impossible de récupérer les données.",
      });
      // If unauthorized, clear token
      if (error instanceof Error && error.message.includes("401")) {
        handleLogout();
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await login(username, password);
      localStorage.setItem("admin_token", res.accessToken);
      setToken(res.accessToken);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'espace administration UPDesign.",
      });
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

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setDashboardData(null);
    setDevisList([]);
    setClientsList([]);
    setCommandesList([]);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  // Devis Operations
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
        statut: newStatus
      });
      toast({
        title: "Statut mis à jour",
        description: `Le devis #${devis.id} est maintenant ${newStatus}.`,
      });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error instanceof Error ? error.message : "Impossible de modifier le devis.",
      });
    }
  };

  const handleDeleteDevis = async (id: number) => {
    if (!token || !confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) return;
    try {
      await deleteDevis(id, token);
      toast({
        title: "Devis supprimé",
        description: `Le devis #${id} a été supprimé.`,
      });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Impossible de supprimer le devis.",
      });
    }
  };

  const handleDownloadPdf = async (id: number) => {
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

  // Client Operations
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

  const handleDeleteClient = async (id: number) => {
    if (!token || !confirm("Supprimer ce client supprimera également tous ses devis et commandes associés. Continuer ?")) return;
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
      societe: client.societe || ""
    });
    setShowAddClient(true);
  };

  // Commande Operations
  const handleCommandeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const reqData = {
      clientId: Number(commandeForm.clientId),
      typePanneau: commandeForm.typePanneau,
      dimensions: commandeForm.dimensions,
      matiere: commandeForm.matiere,
      prix: Number(commandeForm.prix) || 0,
      statut: commandeForm.statut
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

  const handleDeleteCommande = async (id: number) => {
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

  const startEditCommande = (cmd: CommandeResponse) => {
    setEditingCommande(cmd);
    setCommandeForm({
      clientId: String(cmd.clientId),
      typePanneau: cmd.typePanneau,
      dimensions: cmd.dimensions || "",
      matiere: cmd.matiere || "",
      prix: String(cmd.prix),
      statut: cmd.statut
    });
    setShowAddCommande(true);
  };

  // Filters
  const filteredDevis = devisList.filter(d => 
    d.clientNom.toLowerCase().includes(devisSearch.toLowerCase()) ||
    d.typePanneau.toLowerCase().includes(devisSearch.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(devisSearch.toLowerCase()))
  );

  const filteredClients = clientsList.filter(c => 
    c.nom.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.telephone.includes(clientSearch) ||
    (c.societe && c.societe.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // Render Login Panel
  if (!token) {
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
            <CardDescription className="text-muted-foreground/80">Connectez-vous pour gérer les devis et les clients.</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Identifiant</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Nom d'utilisateur" 
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
              <Button type="submit" disabled={authLoading} className="w-full bg-[#E61A3D] hover:bg-[#E61A3D]/90 text-white font-bold py-6 text-lg shadow-[0_0_15px_rgba(230,26,61,0.2)]">
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connexion...
                  </>
                ) : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Dashboard Workspace
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border dark:border-white/5 flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <span className="bg-[#E61A3D] px-2 py-0.5 rounded font-black text-xl tracking-tighter text-white">UP</span>
            <span className="font-bold text-lg tracking-wider text-foreground dark:text-white">ADMIN PANEL</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-[#E61A3D] text-white" : "text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Tableau de bord
            </button>
            <button 
              onClick={() => setActiveTab("devis")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "devis" ? "bg-[#E61A3D] text-white" : "text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"}`}
            >
              <FileText className="h-4 w-4" />
              Devis
              {devisList.length > 0 && (
                <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === "devis" ? "bg-white text-primary" : "bg-[#E61A3D]/25 text-[#E61A3D]"}`}>
                  {devisList.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "clients" ? "bg-[#E61A3D] text-white" : "text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"}`}
            >
              <Users className="h-4 w-4" />
              Clients
            </button>
            <button 
              onClick={() => setActiveTab("commandes")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "commandes" ? "bg-[#E61A3D] text-white" : "text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"}`}
            >
              <ShoppingBag className="h-4 w-4" />
              Commandes
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-border dark:border-white/5 mt-6 md:mt-0">
          <Button onClick={handleLogout} variant="ghost" className="w-full flex justify-start items-center gap-3 text-muted-foreground hover:text-red-500 dark:hover:text-white hover:bg-red-500/10 transition-colors duration-300">
            <LogOut className="h-4 w-4 text-red-500" />
            Se déconnecter
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-border dark:border-white/5">
          <div>
            <h1 className="text-3xl font-bold capitalize font-headline">
              {activeTab === "dashboard" ? "Tableau de bord" : activeTab}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les demandes de devis et suivez l'activité commerciale en temps réel.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {dataLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            <Button onClick={fetchData} variant="outline" className="border-border dark:border-white/10 bg-transparent hover:bg-secondary dark:hover:bg-white/5 text-foreground dark:text-muted-foreground hover:text-primary transition-colors duration-300 text-xs h-9">
              Actualiser
            </Button>
          </div>
        </div>

        {/* Tab Components */}
        
        {/* TAB 1: DASHBOARD STATS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Summary Cards */}
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
                  <div className="text-3xl font-extrabold">{(dashboardData?.monthlyRevenue ?? 0).toLocaleString("fr-FR")} DH</div>
                  <p className="text-xs text-muted-foreground/60 mt-1">Revenu cumulé estimé</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions / Visual Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-card/20 border-white/5">
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>Effectuez des tâches courantes en un clic.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setActiveTab("devis")} className="flex flex-col h-24 gap-2 bg-[#E61A3D]/10 hover:bg-[#E61A3D]/20 border border-[#E61A3D]/20 text-[#E61A3D]">
                      <FileText className="h-6 w-6" />
                      Voir les Devis
                    </Button>
                    <button 
                      onClick={() => {
                        setEditingClient(null);
                        setClientForm({ nom: "", email: "", telephone: "", adresse: "", societe: "" });
                        setShowAddClient(true);
                        setActiveTab("clients");
                      }}
                      className="flex flex-col items-center justify-center h-24 gap-2 bg-[#DD6FEE]/10 hover:bg-[#DD6FEE]/20 border border-[#DD6FEE]/20 text-[#DD6FEE] rounded-lg text-sm font-medium"
                    >
                      <UserPlus className="h-6 w-6" />
                      Nouveau Client
                    </button>
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
        )}

        {/* TAB 2: DEVIS LIST */}
        {activeTab === "devis" && (
          <div className="space-y-6">
            {/* Filters bar */}
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
              <div className="text-xs text-muted-foreground">
                Affichage de {filteredDevis.length} devis sur {devisList.length} au total.
              </div>
            </div>

            {/* List */}
            {filteredDevis.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-card/10">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-bold">Aucun devis trouvé</h3>
                <p className="text-sm text-muted-foreground mt-1">Essayez d'ajuster vos critères de recherche ou soumettez de nouveaux devis.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredDevis.map((devis) => (
                  <Card key={devis.id} className="bg-card/30 border-white/5 hover:border-white/10 transition-colors">
                    <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
                            DEVIS #{devis.id}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            devis.statut === "VALIDE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                            devis.statut === "ANNULE" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                            devis.statut === "EN_COURS" ? "bg-sky-500/10 text-sky-400 border border-sky-500/25" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                          }`}>
                            {devis.statut}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-bold mt-2 font-headline">{devis.clientNom}</CardTitle>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary">{(devis.prix ?? 0).toLocaleString("fr-FR")} DH</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-end">
                          <Calendar className="h-3 w-3" />
                          {new Date(devis.dateCreation).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Technical specifications */}
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

                      {/* Description / message */}
                      {devis.description && (
                        <div className="text-sm text-muted-foreground bg-background/10 p-3 rounded border border-white/5 whitespace-pre-line">
                          {devis.description}
                        </div>
                      )}

                      {/* Fichier joint */}
                      {devis.fileUrl && (
                        <div className="flex items-center gap-4 p-3 bg-secondary/5 border border-border dark:border-white/5 rounded-lg text-sm transition-all">
                          <Paperclip className="h-5 w-5 text-primary shrink-0 animate-pulse-slow" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-muted-foreground block">Fichier de référence (logo, plan, façade)</span>
                            <a 
                              href={`${API_BASE_URL}${devis.fileUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm font-semibold text-primary hover:underline hover:text-primary/80 transition-colors truncate flex items-center gap-1 mt-0.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Visualiser / Télécharger le document
                            </a>
                          </div>
                          {/\.(jpg|jpeg|png|gif|webp)$/i.test(devis.fileUrl) && (
                            <a href={`${API_BASE_URL}${devis.fileUrl}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                              <img 
                                src={`${API_BASE_URL}${devis.fileUrl}`} 
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
                          {devis.statut === "EN_ATTENTE" && (
                            <>
                              <Button 
                                size="sm" 
                                className="h-8 bg-emerald-500 hover:bg-emerald-600 gap-1.5 text-xs text-white"
                                onClick={() => handleUpdateDevisStatus(devis, "VALIDE")}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Valider
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-8 bg-red-500 hover:bg-red-600 gap-1.5 text-xs text-white"
                                onClick={() => handleUpdateDevisStatus(devis, "ANNULE")}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Annuler
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
                              Lancer Production
                            </Button>
                          )}
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLIENTS LIST */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            {/* Header / Add Client Form Toggle */}
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

            {/* Add/Edit client inline form */}
            {showAddClient && (
              <Card className="bg-card/40 border-[#E61A3D]/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{editingClient ? "Modifier le Client" : "Nouveau Client"}</CardTitle>
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
                          onChange={e => setClientForm({...clientForm, nom: e.target.value})}
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
                          onChange={e => setClientForm({...clientForm, email: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="c_tel">Téléphone *</Label>
                        <Input 
                          id="c_tel" 
                          placeholder="Ex: 06 12 34 56 78" 
                          value={clientForm.telephone}
                          onChange={e => setClientForm({...clientForm, telephone: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="c_societe">Société / Entreprise</Label>
                        <Input 
                          id="c_societe" 
                          placeholder="Ex: UP Corp" 
                          value={clientForm.societe}
                          onChange={e => setClientForm({...clientForm, societe: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="c_adresse">Adresse</Label>
                      <Input 
                        id="c_adresse" 
                        placeholder="Ex: 10 Rue des Enseignes, 75000 Paris" 
                        value={clientForm.adresse}
                        onChange={e => setClientForm({...clientForm, adresse: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddClient(false)} className="border-white/10 text-xs">
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

            {/* Clients grid */}
            {filteredClients.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-card/10">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-bold">Aucun client trouvé</h3>
                <p className="text-sm text-muted-foreground mt-1">Recherchez un autre nom ou créez un nouveau profil.</p>
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
        )}

        {/* TAB 4: COMMANDES (ORDERS) */}
        {activeTab === "commandes" && (
          <div className="space-y-6">
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-xl border border-white/5">
              <div className="text-sm font-semibold">
                Gestion des projets en cours de fabrication.
              </div>
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

            {/* Add/Edit Commande Form */}
            {showAddCommande && (
              <Card className="bg-card/40 border-emerald-500/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{editingCommande ? "Modifier la Commande" : "Nouvelle Commande"}</CardTitle>
                  <CardDescription>Enregistrez un nouveau projet de signalétique en production.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCommandeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cmd_client">Sélectionner le Client *</Label>
                        <select 
                          id="cmd_client"
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={commandeForm.clientId}
                          onChange={e => setCommandeForm({...commandeForm, clientId: e.target.value})}
                          required
                        >
                          <option value="" className="bg-[#2C2627]">-- Choisir un client --</option>
                          {clientsList.map(c => (
                            <option key={c.id} value={c.id} className="bg-[#2C2627]">{c.nom} {c.societe ? `(${c.societe})` : ""}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cmd_type">Type Enseigne *</Label>
                        <Input 
                          id="cmd_type" 
                          placeholder="Ex: Enseigne Néon LED" 
                          value={commandeForm.typePanneau}
                          onChange={e => setCommandeForm({...commandeForm, typePanneau: e.target.value})}
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cmd_dim">Dimensions</Label>
                        <Input 
                          id="cmd_dim" 
                          placeholder="Ex: 120 x 80 cm" 
                          value={commandeForm.dimensions}
                          onChange={e => setCommandeForm({...commandeForm, dimensions: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cmd_mat">Matière / Description</Label>
                        <Input 
                          id="cmd_mat" 
                          placeholder="Ex: Plexiglas + Néon flexible rouge" 
                          value={commandeForm.matiere}
                          onChange={e => setCommandeForm({...commandeForm, matiere: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cmd_prix">Prix Facturé (DH) *</Label>
                        <Input 
                          id="cmd_prix" 
                          type="number"
                          placeholder="Ex: 2450" 
                          value={commandeForm.prix}
                          onChange={e => setCommandeForm({...commandeForm, prix: e.target.value})}
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cmd_statut">Statut Production *</Label>
                        <select 
                          id="cmd_statut"
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={commandeForm.statut}
                          onChange={e => setCommandeForm({...commandeForm, statut: e.target.value as any})}
                          required
                        >
                          <option value="EN_ATTENTE" className="bg-[#2C2627]">En attente de démarrage</option>
                          <option value="EN_COURS" className="bg-[#2C2627]">En cours de fabrication</option>
                          <option value="TERMINEE" className="bg-[#2C2627]">Terminée / Prête à installer</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddCommande(false)} className="border-white/10 text-xs">
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

            {/* Commandes List */}
            {commandesList.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-card/10">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-bold">Aucune commande en production</h3>
                <p className="text-sm text-muted-foreground mt-1">Validez un devis existant ou créez manuellement une commande pour démarrer la production.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {commandesList.map((cmd) => (
                  <Card key={cmd.id} className="bg-card/30 border-white/5">
                    <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
                            COMMANDE #{cmd.id}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            cmd.statut === "TERMINEE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                            cmd.statut === "EN_COURS" ? "bg-sky-500/10 text-sky-400 border border-sky-500/25" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                          }`}>
                            {cmd.statut === "TERMINEE" ? "TERMINEE (Prêt)" : cmd.statut === "EN_COURS" ? "FABRICATION EN COURS" : "EN ATTENTE"}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-bold mt-2 font-headline">{cmd.clientNom}</CardTitle>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-500">{(cmd.prix ?? 0).toLocaleString("fr-FR")} DH</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-end">
                          <Calendar className="h-3 w-3" />
                          {new Date(cmd.dateCreation).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Specifications */}
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

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
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
        )}
      </main>
    </div>
  );
}
