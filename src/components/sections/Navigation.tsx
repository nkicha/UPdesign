"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#realisations", label: "Réalisations" },
    { href: "#devis", label: "Devis" },
    { href: "#a-propos", label: "À Propos" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary px-3 py-1 rounded font-black text-2xl tracking-tighter text-white shadow-[0_0_15px_rgba(230,26,61,0.4)] group-hover:shadow-[0_0_25px_rgba(230,26,61,0.6)] transition-all">
              UP
            </div>
            <span className="font-headline font-bold text-xl tracking-tight hidden sm:block">
              Design <span className="text-accent">Éclat</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 font-bold">
              <Link href="#devis">Projet Gratuit</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-4">
               <Button asChild className="w-full bg-primary font-bold">
                 <Link href="#devis" onClick={() => setIsOpen(false)}>Demander un Devis</Link>
               </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
