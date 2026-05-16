
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <QuoteForm />
        <About />
        <Contact />
      </main>
      
      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary px-3 py-1 rounded font-black text-2xl tracking-tighter text-white">
              UP
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Ultrapub Design Éclat. Tous droits réservés. Créateur d'impact visuel.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-primary transition-colors">Politique de Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">CGV</a>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}
