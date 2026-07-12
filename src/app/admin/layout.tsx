"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/devis",     label: "Devis",           icon: FileText },
  { href: "/admin/clients",   label: "Clients",         icon: Users },
  { href: "/admin/commandes", label: "Commandes",       icon: ShoppingBag },
];

// ─── Inner layout (needs auth context) ───────────────────────────────────────
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { token, isLoading, handleLogout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

  useEffect(() => {
    if (!isLoading && !token && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [token, isLoading, isLoginPage, router]);

  // Login page or root redirect — render children directly (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Still checking localStorage — avoid flash
  if (isLoading || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border dark:border-white/5 flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <span className="bg-[#E61A3D] px-2 py-0.5 rounded font-black text-xl tracking-tighter text-white">
              UP
            </span>
            <span className="font-bold text-lg tracking-wider text-foreground dark:text-white">
              ADMIN PANEL
            </span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#E61A3D] text-white"
                      : "text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-border dark:border-white/5">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full flex justify-start items-center gap-3 text-muted-foreground hover:text-red-500 dark:hover:text-white hover:bg-red-500/10 transition-colors duration-300"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            Se déconnecter
          </Button>
        </div>
      </aside>

      {/* ── Page content ────────────────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// ─── Root export (wraps everything in the provider) ───────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminLayoutInner>{children}</AdminLayoutInner>
      <Toaster />
    </>
  );
}
