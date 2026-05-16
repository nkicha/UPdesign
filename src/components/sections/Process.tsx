
"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Search, PenTool, Factory, Truck } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Conseil & Étude",
    description: "Analyse de votre façade, de votre environnement et de votre charte graphique pour une solution optimale.",
    image: "workshop"
  },
  {
    icon: <PenTool className="h-6 w-6" />,
    title: "Design & Maquette",
    description: "Création de visuels 2D et 3D pour vous projeter. Ajustements jusqu'à validation finale.",
    image: "design-phase"
  },
  {
    icon: <Factory className="h-6 w-6" />,
    title: "Fabrication",
    description: "Réalisation artisanale et technologique dans notre atelier parisien avec des matériaux premium.",
    image: "built-up-letters"
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Installation",
    description: "Pose sécurisée par nos techniciens spécialisés, incluant les raccordements électriques.",
    image: "install-phase"
  }
];

export function Process() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Notre Méthode</h2>
          <h3 className="text-4xl md:text-5xl font-headline font-black mb-6">De l'Idée à la <span className="text-accent">Lumière</span></h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Un accompagnement complet pour garantir la pérennité et l'impact visuel de votre enseigne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const img = PlaceHolderImages.find(i => i.id === step.image);
            return (
              <div key={index} className="relative group">
                <div className="mb-6 relative rounded-2xl overflow-hidden aspect-video shadow-xl border border-white/5">
                  {img && (
                    <Image 
                      src={img.imageUrl} 
                      alt={img.description} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center font-black text-primary border border-primary/20">
                    {index + 1}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-primary">{step.icon}</div>
                  <h4 className="text-xl font-bold">{step.title}</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
