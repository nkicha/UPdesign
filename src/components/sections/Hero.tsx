import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[95vh] md:min-h-[90vh] flex flex-col items-center justify-center pt-24 md:pt-20 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-20 md:opacity-30"
          playsInline
        >
          <source src="/hero_banner.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 md:via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
      </div>

      {/* Logo - Top Left */}
      <div className="absolute left-4 md:left-12 top-8 md:top-12 z-10 animate-in fade-in slide-in-from-left duration-700">
        <Image
          src="/logo_white.png"
          alt="UP Design Logo"
          width={500}
          height={480}
          className="h-auto w-[120px] md:w-[140px]"
        />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex flex-col items-center md:items-end md:pr-12 gap-8 animate-in fade-in duration-700">
        <div className="text-center md:text-right">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Créez Votre<br />
            Univers Visuel
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full sm:w-auto">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg font-bold h-14 px-8 w-full sm:w-auto" asChild>
            <Link href="#realisations">Nos Travaux</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 text-lg font-bold h-14 px-8 w-full sm:w-auto" asChild>
            <Link href="#devis" className="flex items-center justify-center md:justify-start gap-2">
              Devis Gratuit <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>


    </section>
  );
}