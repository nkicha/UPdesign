"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { submitQuoteRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Sparkles,
  DollarSign,
  Calendar,
  FileText,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Send,
  Keyboard,
  CheckCircle,
} from "lucide-react";

export function Devis() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    budget: "",
    deadline: "",
    serviceType: "",
    message: "",
  });

  // Autocomplete Suggestions
  const serviceSuggestions = [
    "Enseigne Néon LED",
    "Habillage Véhicule",
    "Panneau Lumineux",
    "Signalétique Intérieure",
    "Impression Grand Format",
  ];

  const budgetPresets = [
    "< 5000 DH",
    "5000 - 15000 DH",
    "15000 - 50000 DH",
    "50000 DH+",
  ];

  const deadlinePresets = [
    "Urgent (1 semaine)",
    "Standard (2-3 semaines)",
    "Flexible (1 mois+)",
  ];

  // Retrieve form data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("updesign_devis_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, []);

  const updateField = (key: string, value: string) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    localStorage.setItem("updesign_devis_form", JSON.stringify(updated));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const isStepValid = (s: number) => {
    if (s === 1) {
      return formData.name.trim() !== "" && formData.phone.trim().length >= 8;
    }
    if (s === 2) {
      return true; // Specs are optional, suggestions speed up entry
    }
    if (s === 3) {
      return formData.message.trim() !== "";
    }
    return false;
  };

  const handleNextStep = () => {
    if (step < 3 && isStepValid(step)) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const handleQuoteSubmit = async () => {
    if (!isStepValid(1) || !isStepValid(3)) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir correctement les champs obligatoires des étapes précédentes.",
      });
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("phone", formData.phone);
    submitData.append("budget", formData.budget);
    submitData.append("deadline", formData.deadline);
    submitData.append("service-type", formData.serviceType);
    submitData.append("message", formData.message);

    if (selectedFiles.length > 0) {
      submitData.append("file", selectedFiles[0]);
    }

    try {
      await submitQuoteRequest(submitData);
      toast({
        title: "Demande envoyée !",
        description: "Notre équipe vous contactera sous 24h pour discuter de votre projet.",
      });
      
      // Clean state and local storage
      localStorage.removeItem("updesign_devis_form");
      setFormData({
        name: "",
        phone: "",
        budget: "",
        deadline: "",
        serviceType: "",
        message: "",
      });
      setSelectedFiles([]);
      setStep(1);
      setIsSubmitted(true); // Hide form & show success view
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de l'envoi",
        description: error instanceof Error ? error.message : "Impossible d'envoyer la demande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is in textarea or form is submitted
      if (isSubmitted) return;
      const isTextarea = document.activeElement?.tagName === "TEXTAREA";
      
      if (e.key === "Enter" && !e.shiftKey) {
        if (isTextarea && !(e.ctrlKey || e.metaKey)) {
          return; // Let standard textarea newline behavior work
        }
        
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Submit if on step 3 and valid
          if (step === 3 && isStepValid(3)) {
            handleQuoteSubmit();
          } else if (step < 3) {
            handleNextStep();
          }
        } else {
          // Plain Enter key goes to next step if valid
          if (step < 3) {
            handleNextStep();
          }
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, formData, isSubmitted]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 120 : -120,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <section id="devis" className="py-24 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Parlons Projet</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-black mb-4">
              Demandez un <span className="text-accent">Devis Personnalisé</span>
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Remplissez notre formulaire optimisé pour un chiffrage rapide en quelques étapes simples.
            </p>
          </div>

          <Card className="bg-card/40 border-white/5 shadow-2xl overflow-hidden relative min-h-[350px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6"
                >
                  <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/5">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold font-headline text-white">Demande Envoyée avec Succès !</h4>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Merci pour votre message. Nous avons bien reçu votre demande de devis et notre équipe l'étudie en ce moment. Vous recevrez une réponse chiffrée sous 24 heures.
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-6 h-10 transition-all active:scale-95 text-xs rounded-lg shadow-md"
                  >
                    Envoyer une autre demande
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Progress indicator */}
                  <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white/5 border border-white/5 text-muted-foreground">
                          Étape {step} / 3
                        </span>
                        <span className="text-sm font-semibold text-white/90">
                          {step === 1
                            ? "Vos Coordonnées"
                            : step === 2
                            ? "Configuration Projet"
                            : "Détails & Fichiers"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <Keyboard className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Raccourcis activés</span>
                      </div>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                        initial={false}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                      />
                    </div>
                  </div>

                  <CardContent className="p-6 sm:p-8">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                      <div className="relative overflow-hidden min-h-[300px]">
                        <AnimatePresence mode="wait" custom={direction}>
                          <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full space-y-6"
                          >
                            {/* STEP 1: IDENTITY */}
                            {step === 1 && (
                              <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                  <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2 text-white/80">
                                      <User className="h-4 w-4 text-primary shrink-0" />
                                      <span>Nom / Société <span className="text-primary">*</span></span>
                                    </Label>
                                    <Input
                                      id="name"
                                      className="bg-background/40 border-white/10 focus-visible:border-primary/50 transition-colors h-11"
                                      placeholder="Nom / Société"
                                      value={formData.name}
                                      onChange={(e) => updateField("name", e.target.value)}
                                      required
                                      autoFocus
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2 text-white/80">
                                      <Phone className="h-4 w-4 text-primary shrink-0" />
                                      <span>Téléphone <span className="text-primary">*</span></span>
                                    </Label>
                                    <Input
                                      id="phone"
                                      className={`bg-background/40 border-white/10 focus-visible:border-primary/50 transition-colors h-11 ${
                                        formData.phone && formData.phone.trim().length < 8
                                          ? "border-red-500/50 focus-visible:ring-red-500/20"
                                          : formData.phone
                                          ? "border-emerald-500/50 focus-visible:ring-emerald-500/20"
                                          : ""
                                      }`}
                                      placeholder="Téléphone"
                                      value={formData.phone}
                                      onChange={(e) => updateField("phone", e.target.value)}
                                      required
                                    />
                                    {formData.phone && formData.phone.trim().length < 8 && (
                                      <p className="text-[11px] text-red-400">Veuillez entrer un numéro de téléphone valide.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* STEP 2: PROJECT SPECS */}
                            {step === 2 && (
                              <div className="space-y-5">
                                <div className="space-y-2">
                                  <Label htmlFor="service-type" className="text-sm font-semibold flex items-center gap-2 text-white/80">
                                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                                    <span>Type de Service</span>
                                  </Label>
                                  <Input
                                    id="service-type"
                                    className="bg-background/40 border-white/10 focus-visible:border-primary/50 transition-colors h-11"
                                    placeholder="Ex: Enseigne Néon LED, Habillage"
                                    value={formData.serviceType}
                                    onChange={(e) => updateField("serviceType", e.target.value)}
                                  />
                                  {/* Suggestions list */}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {serviceSuggestions.map((item) => (
                                      <button
                                        key={item}
                                        type="button"
                                        onClick={() => updateField("serviceType", item)}
                                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all text-white/70 hover:text-white"
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="space-y-2">
                                    <Label htmlFor="budget" className="text-sm font-semibold flex items-center gap-2 text-white/80">
                                      <DollarSign className="h-4 w-4 text-primary shrink-0" />
                                      <span>Budget Estimatif</span>
                                    </Label>
                                    <Input
                                      id="budget"
                                      className="bg-background/40 border-white/10 focus-visible:border-primary/50 transition-colors h-11"
                                      placeholder="Ex: 10000 DH"
                                      value={formData.budget}
                                      onChange={(e) => updateField("budget", e.target.value)}
                                    />
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {budgetPresets.map((preset) => (
                                        <button
                                          key={preset}
                                          type="button"
                                          onClick={() => updateField("budget", preset)}
                                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 hover:bg-primary/10 transition-colors text-white/60 hover:text-white"
                                        >
                                          {preset}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="deadline" className="text-sm font-semibold flex items-center gap-2 text-white/80">
                                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                                      <span>Délai Souhaité</span>
                                    </Label>
                                    <Input
                                      id="deadline"
                                      className="bg-background/40 border-white/10 focus-visible:border-primary/50 transition-colors h-11"
                                      placeholder="Ex: Fin du mois"
                                      value={formData.deadline}
                                      onChange={(e) => updateField("deadline", e.target.value)}
                                    />
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {deadlinePresets.map((preset) => (
                                        <button
                                          key={preset}
                                          type="button"
                                          onClick={() => updateField("deadline", preset)}
                                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 hover:bg-primary/10 transition-colors text-white/60 hover:text-white"
                                        >
                                          {preset}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* STEP 3: DETAILS & UPLOAD */}
                            {step === 3 && (
                              <div className="space-y-5">
                                <div className="space-y-2">
                                  <Label htmlFor="message" className="text-sm font-semibold flex items-center gap-2 text-white/80">
                                    <FileText className="h-4 w-4 text-primary shrink-0" />
                                    <span>Description du Projet <span className="text-primary">*</span></span>
                                  </Label>
                                  <Textarea
                                    id="message"
                                    className="min-h-[120px] bg-background/40 border-white/10 focus-visible:border-primary/50 transition-colors"
                                    placeholder="Dites-nous en plus sur vos besoins (dimensions, couleurs, emplacement...)"
                                    value={formData.message}
                                    onChange={(e) => updateField("message", e.target.value)}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="file-upload" className="text-sm font-semibold text-white/80">
                                    Fichiers de Référence (Logos, plans, façades)
                                  </Label>
                                  <label
                                    htmlFor="file-upload"
                                    className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-background/20 hover:bg-secondary/10 dark:hover:bg-white/[0.02] hover:border-white/20 transition-all cursor-pointer group"
                                  >
                                    <input
                                      type="file"
                                      id="file-upload"
                                      className="hidden"
                                      onChange={handleFileChange}
                                      multiple
                                    />
                                    <UploadCloud className="h-8 w-8 text-muted-foreground/80 group-hover:text-primary transition-colors mb-2" />
                                    <p className="text-xs text-muted-foreground text-center">
                                      Glissez vos fichiers ici ou <span className="text-primary font-bold">parcourez</span>
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/50 mt-1">PNG, JPG, PDF (max 10Mo)</p>

                                    {selectedFiles.length > 0 && (
                                      <div className="mt-3 p-1.5 bg-primary/10 text-primary text-[10px] rounded font-semibold max-w-full text-center truncate flex items-center gap-1.5">
                                        <CheckCircle className="h-3 w-3" />
                                        {selectedFiles.length} fichier(s) sélectionné(s) : {selectedFiles.map((f) => f.name).join(", ")}
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Footer Controls */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                        {step > 1 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevStep}
                            className="border-white/10 hover:bg-white/5 gap-1.5 text-xs h-10 px-4"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Retour
                          </Button>
                        ) : (
                          <div />
                        )}

                        <div className="flex items-center gap-3">
                          {step < 3 ? (
                            <Button
                              type="button"
                              onClick={handleNextStep}
                              disabled={!isStepValid(step)}
                              className="bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 text-xs h-10 px-5 active:scale-95 transition-all animate-pulse-slow"
                            >
                              Continuer
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => handleQuoteSubmit()}
                              disabled={isSubmitting || !isStepValid(3)}
                              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-black gap-1.5 text-xs h-10 px-6 active:scale-95 transition-all shadow-lg"
                            >
                              {isSubmitting ? "Envoi..." : "Envoyer la Demande"}
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </CardContent>

                  {/* Smart Keyboard Shortcuts Footer Helper */}
                  <div className="px-6 py-3 bg-white/[0.005] border-t border-white/5 text-[10px] text-muted-foreground/60 flex items-center justify-between flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono px-1 py-0.5 rounded bg-white/5 border border-white/5">Entrée</span>
                      Suivant
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono px-1 py-0.5 rounded bg-white/5 border border-white/5">Ctrl + Entrée</span>
                      Soumettre
                    </span>
                    <span className="hidden sm:inline text-right text-[10px]"> Progression sauvegardée automatiquement</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  );
}
