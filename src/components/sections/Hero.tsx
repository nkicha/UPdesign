import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const heroImg = PlaceHolderImages.find((img) => img.id === "hero-bg");

  return (
    <section className="relative min-h-[95vh] md:min-h-[90vh] flex flex-col items-center justify-between pt-24 md:pt-20 pb-20 overflow-hidden">
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

      <div className="z-10 flex flex-col items-center animate-in fade-in slide-in-from-top duration-700">
        <Image
          src="/images/icon.png"
          alt="UP Design Logo"
          width={120}
          height={120}
          className="mb-8"
        />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
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


    </section>
  );
}