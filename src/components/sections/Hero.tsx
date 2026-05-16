
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const heroImg = PlaceHolderImages.find((img) => img.id === "hero-bg");

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImg && (
          <Image
            src={heroImg.imageUrl}
            alt={heroImg.description}
            fill
            className="object-cover opacity-30 scale-105 animate-pulse-slow"
            priority
            data-ai-hint="modern sign lighting"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Fabricant d'Enseignes d'Exception</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black leading-tight tracking-tighter mb-6">
            L'Art de l'<span className="text-primary glow-red">Impact</span> <br />
            Visuel et <span className="text-accent glow-accent">Lumineux</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
            Ultrapub Design conçoit, fabrique et installe vos enseignes sur-mesure. Néons, lettres boîtiers, enseignes vintage et habillage de véhicules pour sublimer votre image de marque.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg font-bold h-14 px-8" asChild>
              <Link href="#realisations">Voir nos travaux</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 text-lg font-bold h-14 px-8" asChild>
              <Link href="#devis" className="flex items-center gap-2">
                Demander un Devis <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
}
