
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, Hammer, Wrench, Lightbulb, Car, Zap } from "lucide-react";

const services = [
  {
    title: "Conception Graphique",
    description: "Design créatif et technique adapté à votre identité visuelle pour un impact maximal.",
    icon: <Paintbrush className="h-10 w-10 text-primary" />,
  },
  {
    title: "Fabrication d'Enseignes",
    description: "Usinage de précision, soudure et assemblage dans nos ateliers de pointe.",
    icon: <Hammer className="h-10 w-10 text-accent" />,
  },
  {
    title: "Installation Professionnelle",
    description: "Équipes spécialisées pour une pose sécurisée en intérieur comme en extérieur.",
    icon: <Wrench className="h-10 w-10 text-primary" />,
  },
  {
    title: "Néons & Éclairage",
    description: "Néons artistiques, halo lumineux et lettres boîtiers illuminées (face et rétro).",
    icon: <Zap className="h-10 w-10 text-accent" />,
  },
  {
    title: "Habillage Véhicules",
    description: "Transformation de votre flotte en supports publicitaires mobiles percutants.",
    icon: <Car className="h-10 w-10 text-primary" />,
  },
  {
    title: "Design Vintage",
    description: "Réalisation d'enseignes à l'ancienne, style cinéma ou rétro-éclairage bulbe.",
    icon: <Lightbulb className="h-10 w-10 text-accent" />,
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Nos Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-headline font-black mb-6">Des Solutions sur Mesure</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            De l'idée à l'installation finale, nous gérons chaque étape de votre projet de signalétique avec une rigueur artisanale et un design moderne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-card/50 border-white/5 hover:border-primary/50 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {service.icon}
              </div>
              <CardHeader>
                <div className="mb-4 bg-background w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
