
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateAiSignConcept, type AiSignConceptGeneratorOutput } from "@/ai/flows/ai-sign-concept-generator";
import { Loader2, Sparkles, Wand2, Paintbrush, Zap, Construction } from "lucide-react";

export function AITool() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSignConceptGeneratorOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const output = await generateAiSignConcept({
        businessName: formData.get("businessName") as string,
        businessType: formData.get("businessType") as string,
        targetAudience: formData.get("targetAudience") as string,
        stylisticPreferences: formData.get("stylisticPreferences") as string,
        keyMessage: formData.get("keyMessage") as string,
        budgetPreference: formData.get("budgetPreference") as string,
        locationType: formData.get("locationType") as string,
        existingLogoDescription: formData.get("existingLogoDescription") as string,
      });
      setResult(output);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="conception-ia" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Innovation IA</h2>
          <h3 className="text-4xl md:text-5xl font-headline font-black mb-6">Imaginez votre <span className="text-primary">Enseigne</span></h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Utilisez notre intelligence artificielle pour générer des concepts créatifs basés sur vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="border-white/5 bg-card/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary" />
                Paramètres du Projet
              </CardTitle>
              <CardDescription>
                Décrivez votre entreprise et vos envies pour un résultat optimal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nom de l'entreprise</Label>
                    <Input id="businessName" name="businessName" placeholder="Ex: Loft Café" required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Type d'activité</Label>
                    <Input id="businessType" name="businessType" placeholder="Ex: Restaurant, Boutique..." required className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Public Cible</Label>
                  <Input id="targetAudience" name="targetAudience" placeholder="Ex: Jeunes urbains, Professionnels..." required className="bg-background/50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stylisticPreferences">Style Souhaité</Label>
                    <Input id="stylisticPreferences" name="stylisticPreferences" placeholder="Ex: Vintage, Moderne, Industriel..." required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locationType">Emplacement</Label>
                    <Input id="locationType" name="locationType" placeholder="Ex: Façade, Intérieur, Vitrine..." required className="bg-background/50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetPreference">Budget Préférentiel</Label>
                    <Input id="budgetPreference" name="budgetPreference" placeholder="Ex: Modéré, Premium..." required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyMessage">Message Clé</Label>
                    <Input id="keyMessage" name="keyMessage" placeholder="Ex: Élégance et Confort" required className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingLogoDescription">Description du Logo (optionnel)</Label>
                  <Textarea id="existingLogoDescription" name="existingLogoDescription" placeholder="Couleurs, formes, symboles..." className="bg-background/50 min-h-[100px]" />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-lg font-bold py-6">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Générer mon Concept
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6 min-h-[600px] flex flex-col">
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 flex-1 flex flex-col">
                <Card className="border-primary/30 bg-primary/5 backdrop-blur-xl flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl font-black text-primary glow-red mb-2">
                          {result.conceptName}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {result.styleKeywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="border-primary/50 text-primary">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 overflow-y-auto max-h-[700px] pr-4 scrollbar-thin scrollbar-thumb-primary/20">
                    <div className="space-y-3">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Vision du Concept
                      </h4>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{result.description}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Paintbrush className="h-5 w-5 text-accent" />
                          Design Visuel
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong className="text-primary">Couleurs:</strong> {result.visualElementsSuggestions.colors}</p>
                          <p><strong className="text-primary">Typographie:</strong> {result.visualElementsSuggestions.typography}</p>
                          <p><strong className="text-primary">Éléments:</strong> {result.visualElementsSuggestions.imagery}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5 text-accent" />
                          Éclairage
                        </h4>
                        <ul className="space-y-2">
                          {result.lightingSuggestions.map((l, i) => (
                            <li key={i} className="text-sm">
                              <span className="font-bold block">{l.type}</span>
                              <span className="text-muted-foreground">{l.effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <Construction className="h-5 w-5 text-accent" />
                        Matériaux Suggérés
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.materialSuggestions.map((m, i) => (
                          <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="font-bold block text-primary">{m.material}</span>
                            <span className="text-xs text-muted-foreground">{m.properties}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-xl border border-white/10 mt-auto">
                      <h4 className="font-bold mb-2">Justification Design</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.justification}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-card/20 border-2 border-dashed border-white/5 rounded-3xl">
                <div className="bg-secondary p-6 rounded-full mb-6">
                  <Wand2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h4 className="text-xl font-bold mb-2">Prêt à créer ?</h4>
                <p className="text-muted-foreground">
                  Remplissez le formulaire pour voir votre concept apparaître ici.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
