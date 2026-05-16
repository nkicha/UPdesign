
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Tous", "Néon", "Lettres 3D", "Vintage", "Véhicules", "Caissons"];

const works = [
  { id: "neon-sign", category: "Néon", title: "Néon Rouge Loft" },
  { id: "built-up-letters", category: "Lettres 3D", title: "Siège Social Tech" },
  { id: "car-wrap", category: "Véhicules", title: "Flotte Commerciale" },
  { id: "vintage-light", category: "Vintage", title: "Cinéma Le Grand" },
  { id: "lightbox", category: "Caissons", title: "Boutique Prestige" },
  { id: "halo-sign", category: "Lettres 3D", title: "Hôtel Lumina" },
];

export function Gallery() {
  const [filter, setFilter] = useState("Tous");

  const filteredWorks = works.filter(
    (w) => filter === "Tous" || w.category === filter
  );

  return (
    <section id="realisations" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Galerie de Projets</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-black">Nos Dernières <span className="text-accent">Créations</span></h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredWorks.map((work) => {
              const img = PlaceHolderImages.find((i) => i.id === work.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={work.id}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-secondary shadow-xl"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <Badge className="w-fit mb-3 bg-accent">{work.category}</Badge>
                    <h4 className="text-2xl font-black">{work.title}</h4>
                    <p className="text-muted-foreground text-sm mt-2">{img?.description}</p>
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
