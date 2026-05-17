"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Bar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    // { href: "#services", label: "Services" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#devis", label: "Devis" },
    { href: "#a-propos", label: "À Propos" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-md border-b border-border py-2" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            {/* icon  */}
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
              className="p-2 text-muted-foreground hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-x-0 bg-background border-b border-border transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-4 text-lg font-medium text-muted-foreground hover:text-primary border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6">
             <Button asChild className="w-full bg-primary font-bold py-6 text-lg">
               <Link href="#devis" onClick={() => setIsOpen(false)}>Demander un Devis</Link>
             </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}