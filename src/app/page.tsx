import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Gallery } from "@/components/sections/Gallery";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { FAQ } from "@/components/sections/FAQ";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Process />
        <Gallery />
        <FAQ />
        <QuoteForm />
        <About />
        <Contact />
      </main>
      
      <footer className="py-12 md:py-16 border-t border-white/5 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary px-3 py-1 rounded font-black text-2xl tracking-tighter text-white">
              UP
            </div>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Ultrapub Design Éclat. Tous droits réservés.
          </p>
          <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-[10px] md:text-xs text-muted-foreground/60">
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