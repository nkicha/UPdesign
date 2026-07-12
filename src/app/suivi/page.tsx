"use client";

import React, { useState } from "react";
import { Bar } from "@/components/sections/Bar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Paperclip,
  Download,
  Building,
  Mail,
  FileText,
  Package,
  ArrowRight,
  Info,
  Layers,
  Wrench,
  Sparkles,
} from "lucide-react";

// Types corresponding to our tracking API response
type ClientInfo = {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  societe: string;
};

type TrackedDevis = {
  id: string;
  number: number;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  description?: string;
  statut: "EN_ATTENTE" | "VALIDE" | "ANNULE" | "EN_COURS";
  fileUrl?: string;
  dateCreation: string;
};

type TrackedCommande = {
  id: string;
  number: number;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  statut: "EN_ATTENTE" | "EN_COURS" | "TERMINEE";
  dateCreation: string;
};

type TrackingData = {
  client: ClientInfo;
  devis: TrackedDevis[];
  commandes: TrackedCommande[];
};

export default function SuiviPage() {
  const { toast } = useToast();
  
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackingData | null>(null);
  const [activeTab, setActiveTab] = useState<"devis" | "commandes">("devis");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({
        variant: "destructive",
        title: "Champ requis",
        description: "Veuillez entrer un numéro de téléphone valide.",
      });
      return;
    }

    setLoading(true);
    setData(null);
    try {
      const response = await fetch(`/api/suivi?phone=${encodeURIComponent(phone.trim())}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Aucun dossier trouvé pour ce numéro de téléphone. Vérifiez votre saisie ou contactez-nous.");
        }
        const errText = await response.text();
        throw new Error(errText || "Une erreur est survenue lors de la recherche.");
      }

      const resData = await response.json();
      setData(resData);
      setSearchedPhone(phone.trim());
      
      // Auto-switch tab if one list is empty
      if (resData.devis.length === 0 && resData.commandes.length > 0) {
        setActiveTab("commandes");
      } else {
        setActiveTab("devis");
      }

      toast({
        title: "Dossier trouvé",
        description: `Bonjour ${resData.client.nom}, voici le statut de vos demandes.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Recherche infructueuse",
        description: error.message || "Impossible de récupérer les informations.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, type: "devis" | "devis-bl" | "commande") => {
    try {
      toast({
        title: "Téléchargement",
        description: "Génération de votre document PDF en cours...",
      });

      const response = await fetch(
        `/api/suivi/pdf?phone=${encodeURIComponent(searchedPhone)}&id=${id}&type=${type}`
      );

      if (!response.ok) {
        throw new Error("Impossible de télécharger le fichier PDF.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = response.headers.get("content-disposition");
      let filename = `${type}-${id}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast({
        title: "Succès",
        description: "Le PDF a été téléchargé avec succès.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur PDF",
        description: error.message || "Le téléchargement a échoué.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white pb-16">
      <Bar />
      
      <main className="max-w-6xl mx-auto px-4 pt-32 sm:px-6 lg:px-8">
        {/* ── Page Intro ─────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Espace Client
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-black mt-4 mb-4">
              Suivi de votre <span className="text-primary">Projet</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Entrez votre numéro de téléphone pour suivre l'état de votre devis ou l'avancement de votre fabrication en atelier.
            </p>
          </motion.div>
        </div>

        {/* ── Search Form Card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto mb-16"
        >
          <Card className="bg-card/30 border-white/5 backdrop-blur-md shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#E61A3D]/40" />
            <CardContent className="pt-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="text-sm font-semibold text-foreground/80 block">
                    Numéro de Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="Ex: 0612345678"
                      className="pl-11 h-12 bg-background/50 border-white/10 hover:border-white/20 focus:border-primary/50 transition-all font-mono text-base tracking-widest"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 h-12 font-bold transition-all text-sm tracking-wide shadow-lg hover:shadow-primary/20 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Rechercher mon dossier
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Dynamic Content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="space-y-10"
            >
              {/* ── Client Welcome Card ── */}
              <Card className="bg-card/25 border-white/5 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-transparent border-b border-white/5 py-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-primary tracking-wider uppercase">Dossier Client Actif</span>
                      <h2 className="text-2xl font-black font-headline mt-1 flex items-center gap-2 text-white">
                        <Sparkles className="h-5 w-5 text-primary shrink-0" />
                        Bonjour, {data.client.nom}
                      </h2>
                    </div>
                    {data.client.societe && data.client.societe !== "Non spécifiée" && (
                      <span className="self-start md:self-center bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                        <Building className="h-3.5 w-3.5" />
                        {data.client.societe}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Téléphone</span>
                    <span className="font-semibold font-mono text-white">{data.client.telephone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Email</span>
                    <span className="font-semibold text-white">{data.client.email}</span>
                  </div>
                  <div className="space-y-1 sm:col-span-2 md:col-span-1">
                    <span className="text-xs text-muted-foreground block">Adresse</span>
                    <span className="font-semibold text-white">{data.client.adresse || "Non spécifiée"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* ── Navigation Tabs ── */}
              <div className="flex justify-center border-b border-white/5">
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                  <button
                    onClick={() => setActiveTab("devis")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                      activeTab === "devis"
                        ? "bg-primary text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Mes Devis ({data.devis.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("commandes")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                      activeTab === "commandes"
                        ? "bg-primary text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    Mes Projets ({data.commandes.length})
                  </button>
                </div>
              </div>

              {/* ── Tab Content ── */}
              <div className="min-h-[300px]">
                {activeTab === "devis" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {data.devis.length === 0 ? (
                      <EmptyState
                        icon={<FileText className="h-12 w-12 text-muted-foreground/30" />}
                        title="Aucun devis trouvé"
                        description="Vous n'avez pas encore soumis de demande de devis en ligne."
                      />
                    ) : (
                      data.devis.map((devis) => (
                        <DevisTrackingCard
                          key={devis.id}
                          devis={devis}
                          onDownload={(type) => handleDownload(devis.id, type)}
                        />
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "commandes" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {data.commandes.length === 0 ? (
                      <EmptyState
                        icon={<Package className="h-12 w-12 text-muted-foreground/30" />}
                        title="Aucun projet en production"
                        description="Une fois votre devis validé, vos commandes apparaîtront ici avec leur avancement étape par étape."
                      />
                    ) : (
                      data.commandes.map((cmd) => (
                        <CommandeTrackingCard
                          key={cmd.id}
                          commande={cmd}
                          onDownload={() => handleDownload(cmd.id, "commande")}
                        />
                      ))
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Toaster />
    </div>
  );
}

// ── Helper Components ────────────────────────────────────────────────────────

// ── Empty State ──
function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-card/10">
      <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-white/5">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ── Devis Tracking Card ──
function DevisTrackingCard({
  devis,
  onDownload,
}: {
  devis: TrackedDevis;
  onDownload: (type: "devis" | "devis-bl") => void;
}) {
  const stepMap = {
    EN_ATTENTE: 1, // Demande reçue / étude
    VALIDE: 2,     // Devis accepté / validé
    EN_COURS: 3,   // Production lancée
    ANNULE: 0,     // Annulé
  };

  const currentStep = stepMap[devis.statut];
  const isCanceled = devis.statut === "ANNULE";

  // Devis process timeline steps
  const steps = [
    { label: "Demande Reçue", desc: "Étude technique et estimation budgétaire en cours." },
    { label: "Devis Validé", desc: "Devis accepté et validé par vos soins." },
    { label: "Mise en Production", desc: "Projet transmis à notre atelier de fabrication." },
  ];

  return (
    <Card className="bg-card/20 border-white/5 hover:border-white/10 transition-colors shadow-md overflow-hidden">
      <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
              DEVIS #{devis.number}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                devis.statut === "VALIDE"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                  : devis.statut === "ANNULE"
                  ? "bg-red-500/10 text-red-400 border border-red-500/25"
                  : devis.statut === "EN_COURS"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/25"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
              }`}
            >
              {devis.statut === "EN_COURS"
                ? "PRODUCTION"
                : devis.statut === "VALIDE"
                ? "VALIDÉ"
                : devis.statut === "ANNULE"
                ? "ANNULÉ"
                : "ÉTUDE EN COURS"}
            </span>
          </div>
          <CardTitle className="text-xl font-bold mt-2 font-headline">{devis.typePanneau}</CardTitle>
        </div>
        <div className="text-right sm:text-right self-start sm:self-auto">
          <div className="text-2xl font-black text-primary">
            {devis.prix.toLocaleString("fr-FR")} DH
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-end">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(devis.dateCreation).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Specifications snippet */}
        {(devis.dimensions || devis.matiere) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/30 p-3 rounded-lg border border-white/5 text-xs">
            {devis.dimensions && (
              <div>
                <span className="text-muted-foreground block text-[10px]">Dimensions</span>
                <span className="font-semibold text-white">{devis.dimensions}</span>
              </div>
            )}
            {devis.matiere && (
              <div>
                <span className="text-muted-foreground block text-[10px]">Matière / Rendu</span>
                <span className="font-semibold text-white">{devis.matiere}</span>
              </div>
            )}
          </div>
        )}

        {/* Canceled banner or Stepper */}
        {isCanceled ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
            <XCircle className="h-5 w-5 text-red-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-red-400 block">Projet Annulé</span>
              <p className="text-muted-foreground mt-0.5">
                Cette demande de devis a été annulée. N'hésitez pas à nous contacter pour toute modification ou nouvelle étude.
              </p>
            </div>
          </div>
        ) : (
          /* Stepper visual workflow */
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Processus de Traitement :
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {steps.map((st, i) => {
                const stepNum = i + 1;
                const isCompleted = currentStep > stepNum;
                const isActive = currentStep === stepNum;
                
                return (
                  <div key={i} className="flex gap-3 relative z-10 items-start">
                    {/* Circle icon */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : isActive
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                          : "bg-background border-white/10 text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                    </div>
                    {/* Text desc */}
                    <div className="space-y-0.5">
                      <span className={`text-xs font-bold block ${isActive ? "text-primary" : isCompleted ? "text-emerald-400" : "text-foreground"}`}>
                        {st.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Panel */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
          {devis.fileUrl ? (
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded border border-white/5 text-[10px] text-muted-foreground shrink-0 max-w-[200px] sm:max-w-xs truncate">
              <Paperclip className="h-3 w-3 text-primary shrink-0" />
              <span>Pièce jointe attachée</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            {!isCanceled && currentStep >= 2 && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-white/10 hover:bg-white/5 text-xs text-sky-400 hover:text-sky-300 gap-1.5 transition-colors"
                onClick={() => onDownload("devis-bl")}
              >
                <Download className="h-3.5 w-3.5" />
                Bon de Commande
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-white/10 hover:bg-white/5 text-xs text-primary hover:text-primary/80 gap-1.5 transition-colors"
              onClick={() => onDownload("devis")}
            >
              <Download className="h-3.5 w-3.5" />
              Télécharger Devis PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Commande Tracking Card ──
function CommandeTrackingCard({
  commande,
  onDownload,
}: {
  commande: TrackedCommande;
  onDownload: () => void;
}) {
  const stepMap = {
    EN_ATTENTE: 1, // Planification
    EN_COURS: 2,   // En fabrication
    TERMINEE: 3,   // Terminée
  };

  const currentStep = stepMap[commande.statut];

  // Commande production steps
  const steps = [
    { label: "Lancement", desc: "Planification et préparation des fichiers d'usinage / maquettes." },
    { label: "Atelier de Fabrication", desc: "Façonnage et assemblage technique de l'enseigne." },
    { label: "Prête & Installée", desc: "Vérification qualité finale, livraison ou pose chez vous." },
  ];

  return (
    <Card className="bg-card/20 border-white/5 hover:border-white/10 transition-colors shadow-md overflow-hidden">
      <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
              PROJET #{commande.number}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                commande.statut === "TERMINEE"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                  : commande.statut === "EN_COURS"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/25 animate-pulse"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
              }`}
            >
              {commande.statut === "TERMINEE" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              {commande.statut === "EN_COURS" && <Wrench className="h-3 w-3 text-sky-400 animate-spin" />}
              {commande.statut === "TERMINEE"
                ? "PRÊTE / LIVRÉE"
                : commande.statut === "EN_COURS"
                ? "FABRICATION EN COURS"
                : "EN ATTENTE"}
            </span>
          </div>
          <CardTitle className="text-xl font-bold mt-2 font-headline">{commande.typePanneau}</CardTitle>
        </div>
        <div className="text-right sm:text-right self-start sm:self-auto">
          <div className="text-2xl font-black text-emerald-500">
            {commande.prix.toLocaleString("fr-FR")} DH
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-end">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(commande.dateCreation).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Specifications snippet */}
        {(commande.dimensions || commande.matiere) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/30 p-3 rounded-lg border border-white/5 text-xs">
            {commande.dimensions && (
              <div>
                <span className="text-muted-foreground block text-[10px]">Dimensions</span>
                <span className="font-semibold text-white">{commande.dimensions}</span>
              </div>
            )}
            {commande.matiere && (
              <div>
                <span className="text-muted-foreground block text-[10px]">Finition / Matières</span>
                <span className="font-semibold text-white">{commande.matiere}</span>
              </div>
            )}
          </div>
        )}

        {/* Stepper visual workflow */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            Avancement de votre Enseigne :
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((st, i) => {
              const stepNum = i + 1;
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              
              return (
                <div key={i} className="flex gap-3 relative z-10 items-start">
                  {/* Circle icon */}
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : isActive
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                        : "bg-background border-white/10 text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                  </div>
                  {/* Text desc */}
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold block ${isActive ? "text-emerald-400" : isCompleted ? "text-emerald-400" : "text-foreground"}`}>
                      {st.label}
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-4 border-t border-white/5">
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-white/10 hover:bg-white/5 text-xs text-sky-400 hover:text-sky-300 gap-1.5 transition-colors"
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Bon de Livraison (BL) PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
