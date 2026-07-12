import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, } from "lucide-react";
import { SiTiktok } from '@icons-pack/react-simple-icons';

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
                    <p className="font-bold text-sm md:text-base">06 29 92 51 78</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Email</p>
                    <p className="font-bold text-sm md:text-s break-all">ultrapubdesign@gmail.com</p>
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
                    <p className="font-bold text-sm md:text-base">Hay Alwifaq Alnaris N19</p>
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
              <a href="https://www.instagram.com/ultra_pub_design/?hl=en">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary">
                  <Instagram className="h-6 w-6" />
                </Button>
              </a>
              <a href="https://www.facebook.com/ultrapubdesign/">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary">
                  <Facebook className="h-6 w-6" />
                </Button>
              </a>
              <a href="https://www.tiktok.com/@ultrapubdesign">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary">
                  <SiTiktok className="h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[300px] md:h-[400px] lg:h-auto border border-white/10 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.11836712052!2d-4.008280473419812!3d34.200298345590184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9e17212812c61f%3A0x20694482c06338b5!2sULTRA%20PUB%20DESIGN%20SARL%20AU!5e1!3m2!1sen!2sma!4v1779040652313!5m2!1sen!2sma"
              height="100%"
              width="100%"
              // style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            {/* <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[10px] font-bold text-primary animate-pulse">
              Nous Sommes Ici
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}