"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Bar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#portfolio", label: "Portfolio" },
    { href: "/#devis", label: "Devis" },
    { href: "/suivi", label: "Suivi Projet" },
    { href: "/#a-propos", label: "À Propos" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-md border-b border-border py-2" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo_red.png"
              alt="UP Design"
              width={200}
              height={200}
              className="h-auto w-[80px] md:w-[100px] transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/85 hover:text-primary dark:text-muted-foreground dark:hover:text-primary transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="border-primary/20 hover:border-primary/50 text-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary bg-transparent rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-300"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button asChild variant="outline" className="border-primary/20 hover:border-primary/50 text-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary bg-transparent font-bold transition-colors duration-300">
              <Link href="/admin">Espace Admin</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="border-primary/20 hover:border-primary/50 text-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary bg-transparent rounded-full w-10 h-10 flex items-center justify-center animate-none transition-colors duration-300"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-white transition-colors duration-300"
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
              className="block px-3 py-4 text-lg font-medium text-foreground/85 dark:text-muted-foreground hover:text-primary dark:hover:text-primary border-b border-border dark:border-white/5 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 space-y-3">
            <Button asChild className="w-full bg-primary font-bold py-6 text-lg">
              <Link href="/#devis" onClick={() => setIsOpen(false)}>Demander un Devis</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-border dark:border-white/10 bg-transparent hover:bg-secondary dark:hover:bg-white/5 text-foreground dark:text-white py-6 text-lg transition-colors duration-300">
              <Link href="/admin" onClick={() => setIsOpen(false)}>Espace Admin</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}