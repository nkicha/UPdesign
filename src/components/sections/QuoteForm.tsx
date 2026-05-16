
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, UploadCloud } from "lucide-react";

export function QuoteForm() {
  const { toast } = useToast();

  const handleQuoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Demande Envoyée !",
      description: "Notre équipe vous contactera sous 24h pour discuter de votre projet.",
    });
    e.currentTarget.reset();
  };

  return (
    <section id="devis" className="py-24 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Parlons Projet</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-black mb-6">Demandez un <span className="text-accent">Devis Personnalisé</span></h3>
          </div>

          <Card className="bg-card/40 border-white/5 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Détails du Projet</CardTitle>
              <CardDescription>Fournissez-nous un maximum d'informations pour un chiffrage précis.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuoteSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom Complet</Label>
                      <Input id="name" placeholder="Votre nom ou société" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Professionnel</Label>
                      <Input id="email" type="email" placeholder="contact@votre-entreprise.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="01 23 45 67 89" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Approximatif (€)</Label>
                      <Input id="budget" placeholder="Ex: 5000€" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Délai Souhaité</Label>
                      <Input id="deadline" placeholder="Ex: Fin du mois" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-type">Type de Service</Label>
                      <Input id="service-type" placeholder="Ex: Enseigne Néon, Habillage Véhicule" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Description de vos besoins</Label>
                  <Textarea id="message" placeholder="Dites-nous en plus sur votre vision, dimensions, emplacement..." className="min-h-[150px]" required />
                </div>

                <div className="space-y-4">
                   <Label>Fichiers de référence (logos, plans, photos de façade)</Label>
                   <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-background/30 hover:bg-background/50 transition-colors cursor-pointer group">
                      <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                      <p className="text-sm text-muted-foreground text-center">
                        Glissez vos fichiers ici ou <span className="text-primary font-bold">parcourez</span>
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, PDF (max 10Mo)</p>
                   </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-xl font-black py-8">
                  <Send className="mr-3 h-6 w-6" />
                  Envoyer ma demande de devis
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
