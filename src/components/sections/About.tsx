
import { CheckCircle2 } from "lucide-react";

export function About() {

  return (
    <section id="a-propos" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 border-primary rounded-tl-3xl hidden md:block" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-4 border-r-4 border-accent rounded-br-3xl hidden md:block" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black flex items-center justify-center">
              <video
                src="/hero_banner.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute bottom-8 left-8 bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-2xl border border-white/20 max-w-[200px] hidden sm:block transform hover:scale-105 transition-transform duration-300">
              <p className="text-2xl font-black text-white mb-0.5">5+</p>
              <p className="text-xs font-bold text-white/90 leading-snug">Années d'expertise artisanale et technologique</p>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">À Propos d'Ultrapub Design</h2>
              <h3 className="text-4xl md:text-5xl font-headline font-black mb-6">L'Expertise au Service de Votre <span className="text-accent">Visibilité</span></h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Né d'une passion pour le design industriel et la lumière, Ultrapub Design s'est imposé comme une référence dans la conception d'enseignes haut de gamme. Nous combinons des techniques ancestrales comme le soufflage de néon avec les technologies d'usinage numérique les plus modernes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Fabrication 100% Locale",
                "Design Sur-Mesure",
                "Matériaux Haute Qualité",
                "Installation Sécurisée",
                "Maintenance & SAV",
                "Conseil Identité Visuelle",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-bold text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-secondary/50 rounded-2xl border-l-4 border-primary italic text-muted-foreground">
              "Notre mission est simple : transformer votre vitrine en une oeuvre d'art lumineuse qui attire irrésistiblement le regard."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
