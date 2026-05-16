
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quels sont les délais moyens de fabrication ?",
    answer: "Pour une enseigne standard (lettres 3D ou néon), comptez entre 15 et 21 jours ouvrés après validation de la maquette. Les projets complexes peuvent nécessiter jusqu'à 4 semaines."
  },
  {
    question: "Proposez-vous une garantie sur vos enseignes ?",
    answer: "Oui, toutes nos fabrications sont garanties 2 ans (pièces et main d'œuvre). Nos éclairages LED haute performance ont une durée de vie moyenne de 50 000 heures."
  },
  {
    question: "S'occupez-vous des autorisations administratives ?",
    answer: "Nous vous accompagnons dans la constitution du dossier de déclaration préalable pour la mairie. Nous pouvons également gérer l'intégralité des démarches Cerfa en option."
  },
  {
    question: "Quelle est la différence entre néon gaz et néon LED ?",
    answer: "Le néon gaz (traditionnel) offre un rendu authentique et une lumière à 360°, idéal pour le vintage. Le néon LED est plus robuste, consomme moins d'énergie et permet des formes plus complexes à moindre coût."
  },
  {
    question: "Intervenez-vous partout en France ?",
    answer: "Notre atelier est basé en région parisienne, mais nous installons nos enseignes dans toute la France. Pour l'étranger, nous proposons la fabrication avec kit de pose et assistance à distance."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">FAQ</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-black mb-6">Questions <span className="text-accent">Fréquentes</span></h3>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card/30 border border-white/5 rounded-xl px-6"
              >
                <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
