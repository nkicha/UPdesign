import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[95vh] md:min-h-[90vh] flex flex-col items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-25 md:opacity-35"
          playsInline
        >
          <source src="/hero_banner.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 md:via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent hidden md:block" />
      </div>

      {/* Bottom CTA Buttons — flush to the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full max-w-lg mx-auto p-0 m-0 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Primary */}
        <Link
          href="#portfolio"
          className="flex-1 w-full sm:w-auto flex items-center justify-center h-14 px-8 rounded-full bg-primary font-bold text-white text-base tracking-wide"
        >
          Nos Travaux
        </Link>

        {/* Secondary */}
        <Link
          href="#devis"
          className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-white font-semibold text-base tracking-wide"
        >
          Devis Gratuit
          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>
    </section>
  );
}