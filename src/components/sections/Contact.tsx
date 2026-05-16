import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-10 md:space-y-12">
            <div className="text-center lg:text-left">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Contact</h2>
              <h3 className="text-3xl md:text-5xl font-headline font-black mb-6">Commençons Votre <span className="text-accent">Projet</span></h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
                Notre atelier est ouvert pour vous accueillir. Prenez rendez-vous pour discuter de vos idées.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Téléphone</p>
                    <p className="font-bold text-sm md:text-base">01 45 67 89 00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Email</p>
                    <p className="font-bold text-sm md:text-base break-all">contact@updesign-eclat.fr</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Adresse</p>
                    <p className="font-bold text-sm md:text-base">12 Rue de l'Artisanat, Paris</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Horaires</p>
                    <p className="font-bold text-sm md:text-base">Lun - Ven: 09h00 - 18h00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center lg:justify-start gap-4">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary">
                <Instagram className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary">
                <Linkedin className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[300px] md:h-[400px] lg:h-auto border border-white/10 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.8583736086221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1625000000000!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[10px] font-bold text-primary animate-pulse">
              Atelier Ultrapub Design
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}