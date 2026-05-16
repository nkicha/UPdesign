import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const heroImg = PlaceHolderImages.find((img) => img.id === "hero-bg");

  return (
    <section className="relative min-h-[95vh] md:min-h-[90vh] flex items-center pt-24 md:pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImg && (
          <Image
            src={heroImg.imageUrl}
            alt={heroImg.description}
            fill
            className="object-cover opacity-20 md:opacity-30 scale-105 animate-pulse-slow"
            priority
            data-ai-hint="modern sign lighting"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 md:via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold mb-6 animate-in fade-in slide-in-from-top duration-700">
            <Sparkles className="h-3 w-3 md:h-4 md:h-4" />
            <span>Fabricant d'Enseignes d'Exception</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-black leading-tight tracking-tighter mb-6 animate-in fade-in slide-in-from-left duration-700 delay-100">
            L'Art de l'<span className="text-primary glow-red">Impact</span> <br className="hidden sm:block" />
            Visuel et <span className="text-accent glow-accent">Lumineux</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0 animate-in fade-in slide-in-from-left duration-700 delay-200">
            Ultrapub Design conçoit, fabrique et installe vos enseignes sur-mesure. Sublimons ensemble votre image de marque avec des créations uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg font-bold h-14 px-8 w-full sm:w-auto" asChild>
              <Link href="#realisations">Nos Travaux</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 text-lg font-bold h-14 px-8 w-full sm:w-auto" asChild>
              <Link href="#devis" className="flex items-center gap-2">
                Devis Gratuit <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1 opacity-50">
          <div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
}