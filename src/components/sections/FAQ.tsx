
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quels types d'enseignes fabriquez-vous ?",
    answer: "Ultrapub Design fabrique une large gamme d'enseignes lumineuses sur mesure : lettres boîtiers 3D rétroéclairées, néons LED flexibles, caissons lumineux simple et double face, enseignes de façade, totems, panneaux d'affichage, habillage de devantures et signalétique intérieure/extérieure. Chaque réalisation est conçue et fabriquée intégralement dans notre atelier."
  },
  {
    question: "Comment se déroule le processus de commande, de la conception à l'installation ?",
    answer: "Notre processus comprend 4 étapes : (1) Consultation et prise en compte de vos besoins, (2) Création d'une maquette numérique soumise à votre validation, (3) Fabrication sur mesure dans notre atelier avec des matériaux haute qualité, et (4) Installation par notre équipe technique. Vous êtes accompagné à chaque étape pour un résultat qui correspond parfaitement à votre vision."
  },
  {
    question: "Quels sont les délais de fabrication et d'installation ?",
    answer: "Pour une enseigne standard (lettres 3D, caisson lumineux, néon LED), comptez entre 10 et 20 jours ouvrés après validation de la maquette. Les projets complexes impliquant plusieurs éléments ou une grande façade peuvent nécessiter jusqu'à 4 semaines. Nous proposons également des délais accélérés selon les urgences, sous réserve de disponibilité de l'atelier."
  },

  {
    question: "Quelle est la durée de vie de vos enseignes LED et quelle garantie offrez-vous ?",
    answer: "Nos enseignes sont conçues pour durer. Les modules LED que nous utilisons ont une durée de vie moyenne de 50 000 heures, soit plus de 10 ans d'utilisation quotidienne. Toutes nos fabrications sont garanties 2 ans (pièces et main-d'œuvre). Nous assurons également un service après-vente et de maintenance pour garantir la longévité de votre investissement."
  },
  {
    question: "Quelle est la différence entre une enseigne néon LED et un caisson lumineux ?",
    answer: "Le néon LED flexible imite l'aspect du néon traditionnel avec un rendu lumineux continu et organique, idéal pour des logos, des lettres manuscrites ou une atmosphère chaleureuse. Le caisson lumineux est une structure en aluminium avec une face en bâche diffusante rétroéclairée, parfaite pour afficher un logo, un nom ou une image avec une luminosité uniforme et un rendu professionnel. Les deux sont disponibles en version intérieure et extérieure."
  },
  {
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Absolument. Nous collaborons aussi bien avec des commerces de proximité (coiffeurs, boutiques, restaurants) qu'avec des grandes entreprises, des hôtels, des centres commerciaux et des promoteurs immobiliers. Chaque projet, qu'il soit petit ou grand, bénéficie du même niveau d'exigence et de qualité artisanale. Nous adaptons nos solutions et nos tarifs en conséquence."
  },
  {
    question: "Assurez-vous également la maintenance et la réparation des enseignes ?",
    answer: "Oui, nous proposons un service complet de maintenance préventive et de réparation pour toutes les enseignes que nous fabriquons, mais aussi pour des enseignes existantes de tiers. Cela inclut le remplacement de modules LED défaillants, la remise en état de structures, le nettoyage et la mise à jour graphique. Contactez-nous via notre formulaire ou directement pour planifier une intervention."
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

          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="relative border-[3px] border-amber-900/80 dark:border-amber-600/60 p-[6px] rounded-none bg-transparent transition-all duration-300 hover:border-amber-700 dark:hover:border-amber-400 hover:shadow-md group"
              >
                {/* Carpenter Frame Miter Joints */}
                <svg className="absolute top-0 left-0 w-[6px] h-[6px] text-amber-900/80 dark:text-amber-600/60 transition-colors duration-300 group-hover:text-amber-700 dark:group-hover:text-amber-400" viewBox="0 0 6 6" fill="none">
                  <line x1="0" y1="0" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <svg className="absolute top-0 right-0 w-[6px] h-[6px] text-amber-900/80 dark:text-amber-600/60 transition-colors duration-300 group-hover:text-amber-700 dark:group-hover:text-amber-400" viewBox="0 0 6 6" fill="none">
                  <line x1="6" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-[6px] h-[6px] text-amber-900/80 dark:text-amber-600/60 transition-colors duration-300 group-hover:text-amber-700 dark:group-hover:text-amber-400" viewBox="0 0 6 6" fill="none">
                  <line x1="0" y1="6" x2="6" y2="0" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-[6px] h-[6px] text-amber-900/80 dark:text-amber-600/60 transition-colors duration-300 group-hover:text-amber-700 dark:group-hover:text-amber-400" viewBox="0 0 6 6" fill="none">
                  <line x1="6" y1="6" x2="0" y2="0" stroke="currentColor" strokeWidth="1.5" />
                </svg>

                <AccordionItem 
                  value={`item-${index}`}
                  className="border border-amber-950/20 dark:border-amber-800/30 rounded-none px-6 bg-transparent transition-all duration-300 group-hover:border-amber-950/40 dark:group-hover:border-amber-800/50"
                >
                  <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
