"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCircle2,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/osint-workspace", label: "OSINT Workspace", icon: Search },
  { href: "/narrative-intelligence", label: "Narrative Intelligence", icon: TrendingUp },
  { href: "/media-forensics", label: "Media Forensics", icon: ImageIcon },
  { href: "/source-integrity", label: "Source Integrity", icon: ShieldCheck },
  { href: "/countermeasures", label: "Countermeasures", icon: FileText },
  { href: "/simulation-lab", label: "Simulation Lab", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: BriefcaseBusiness },
  { href: "/publishing", label: "Research Publishing", icon: FileText },
  { href: "/case-management", label: "Case Management", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "My Profile", icon: UserCircle2 },
  { href: "/help", label: "Help & guide", icon: HelpCircle },
];

const breadcrumbs = [
  { label: "Operations", href: "/overview" },
  { label: "Intelligence", href: "/overview" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    if (pathname === "/login" || pathname === "/register" || pathname === "/prototype-owner") { setAuthLoading(false); return; }
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) { router.replace("/login"); return; }
      const data = await response.json();
      if (active) setUser(data.user);
    }).catch(() => router.replace("/login")).finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, [pathname, router]);
  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  if (pathname === "/login" || pathname === "/register" || pathname === "/prototype-owner") {
    return <>{children}</>;
  }

  if (authLoading || !user) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">Loading NEXUS workspace…</div>;

  const currentPage = navItems.find((item) => item.href === pathname) ?? navItems[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950/80 p-4 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-400/40 bg-cyan-500/10 text-sm font-bold text-cyan-200">
              N
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">NEXUS</p>
              <h1 className="text-lg font-semibold text-slate-50">Information Integrity</h1>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (pathname === "/" && href === "/overview");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive ? "bg-slate-800 text-cyan-200 ring-1 ring-cyan-400/30" : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100",
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="mb-3 flex items-center gap-2 text-amber-200">
              <AlertTriangle size={14} />
              <span className="text-xs font-medium uppercase tracking-[0.2em]">Threat Monitor</span>
            </div>
            <p className="text-sm text-slate-300">No live threat-monitoring feed is connected. Metrics appear only when records exist in this account.</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                
                <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
                  {breadcrumbs.map((item, index) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <Link href={item.href} className="hover:text-slate-200">{item.label}</Link>
                      {index < breadcrumbs.length - 1 && <ChevronRight size={14} />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="relative hidden w-full max-w-md md:block">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    aria-label="Global search"
                    value=""
                    readOnly
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                    placeholder="Global search, case ID, claim, source"
                  />
                </div>
                <Link href="/profile" className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 hover:border-cyan-500/40">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-semibold text-cyan-200">{(user.name || user.email).slice(0, 2).toUpperCase()}</div>
                  <div className="hidden text-left md:block">
                    <div className="max-w-36 truncate text-sm font-medium text-slate-100">{user.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{user.role}</div>
                  </div>
                </Link>
                <button type="button" onClick={signOut} className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 hover:border-rose-500/40 hover:text-rose-200">Sign out</button>
              </div>
            </div>
          </header>

          <nav aria-label="Main navigation" className="flex gap-2 overflow-x-auto border-b border-slate-800 px-4 py-3 lg:hidden">{navItems.map(({href,label}) => <Link key={href} href={href} className={cn("shrink-0 rounded-lg px-3 py-2 text-xs", pathname===href ? "bg-slate-800 text-cyan-200" : "bg-slate-900 text-slate-300")}>{label}</Link>)}</nav>
          <main className="p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{currentPage.label}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-50">NEXUS intelligence workstation</h2>
              </div>
              <Link href="/case-management" className="inline-flex items-center justify-center rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Open case management</Link>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
