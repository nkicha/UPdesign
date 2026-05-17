"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const works = [
  { id: "neon-sign", category: "Néon", title: "Néon Rouge Loft" },
  { id: "built-up-letters", category: "Lettres 3D", title: "Siège Social Tech" },
  { id: "car-wrap", category: "Véhicules", title: "Flotte Commerciale" },
  { id: "vintage-light", category: "Vintage", title: "Cinéma Le Grand" },
  { id: "lightbox", category: "Caissons", title: "Boutique Prestige" },
  { id: "halo-sign", category: "Lettres 3D", title: "Hôtel Lumina" },
];

export function Gallery() {
  return (  
    <section id="realisations" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-center lg:items-center mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl text-center">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Portfolio</h2>
            <h3 className="text-3xl md:text-5xl font-headline font-black">Nos Dernières <span className="text-accent">Créations</span></h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {works.map((work) => {
              const img = PlaceHolderImages.find((i) => i.id === work.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={work.id}
                  className="group relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] bg-secondary shadow-xl"
                >
                  {img && (
                    <Image
                      src={img.imageUrl}
                      alt={img.description}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={img.imageHint}
                    />
                  )}
                  {/* Overlay always visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-90 lg:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                    <Badge className="w-fit mb-3 bg-accent text-[10px] md:text-xs">{work.category}</Badge>
                    <h4 className="text-xl md:text-2xl font-black">{work.title}</h4>
                    <p className="text-muted-foreground text-xs md:text-sm mt-2 line-clamp-2">{img?.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}