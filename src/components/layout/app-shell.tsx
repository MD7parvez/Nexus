"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Bell,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/osint-workspace", label: "OSINT Workspace", icon: Search },
  { href: "/narrative-intelligence", label: "Narrative Intelligence", icon: TrendingUp },
  { href: "/media-forensics", label: "Media Forensics", icon: ImageIcon },
  { href: "/source-integrity", label: "Source Integrity", icon: ShieldCheck },
  { href: "/countermeasures", label: "Countermeasures", icon: FileText },
  { href: "/simulation-lab", label: "Simulation Lab", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: BriefcaseBusiness },
  { href: "/case-management", label: "Case Management", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
];

const breadcrumbs = [
  { label: "Operations", href: "/overview" },
  { label: "Intelligence", href: "/overview" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

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
            <p className="text-sm text-slate-300">3 high-priority narratives are under analyst review and evidence validation.</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" className="lg:hidden">Menu</Button>
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
                <button className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-slate-100">
                  <Bell size={16} />
                </button>
                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-semibold text-cyan-200">AC</div>
                  <div className="hidden text-left md:block">
                    <div className="text-sm font-medium text-slate-100">Alicia Chen</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Analyst</div>
                  </div>
                  <UserCircle2 size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{currentPage.label}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-50">NEXUS intelligence workstation</h2>
              </div>
              <Button variant="default" size="sm">
                Create investigation
              </Button>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
