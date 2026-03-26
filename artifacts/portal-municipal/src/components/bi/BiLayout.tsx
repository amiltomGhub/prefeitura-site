import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Megaphone, DollarSign, Users, HardHat,
  HeartPulse, Tv2, Download, RefreshCw, ChevronLeft,
  ChevronRight, LogOut, ArrowLeftRight, Globe, Bell, Maximize2, PanelLeft
} from "lucide-react";
import { useBi, PeriodoId } from "@/contexts/BiContext";
import { BI_MUNICIPIO } from "@/data/bi-mock";

const PERIODOS: { id: PeriodoId; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "semana", label: "Esta semana" },
  { id: "mes", label: "Este mês" },
  { id: "trimestre", label: "Este trimestre" },
  { id: "ano", label: "Este ano" },
];

const NAV = [
  { href: "/bi", icon: LayoutDashboard, label: "Cockpit" },
  { href: "/bi/ouvidoria", icon: Megaphone, label: "Ouvidoria" },
  { href: "/bi/financeiro", icon: DollarSign, label: "Financeiro" },
  { href: "/bi/pessoal", icon: Users, label: "Pessoal" },
  { href: "/bi/obras", icon: HardHat, label: "Obras" },
  { href: "/bi/social", icon: HeartPulse, label: "Saúde & Educação" },
];

function SidebarLink({ item, collapsed }: { item: (typeof NAV)[number]; collapsed: boolean }) {
  const [isActive] = useRoute(item.href + "/*?");
  const [isExact] = useRoute(item.href);
  const active = isActive || isExact;
  return (
    <Link href={item.href}>
      <span className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all",
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
          : "text-zinc-400 hover:text-white hover:bg-white/10"
      )} title={collapsed ? item.label : undefined}>
        <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} aria-hidden="true" />
        {!collapsed && <span className="flex-1">{item.label}</span>}
      </span>
    </Link>
  );
}

interface BiLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function BiLayout({ children, title }: BiLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { periodo, setPeriodo, tvMode, setTvMode } = useBi();
  const [location] = useLocation();

  const currentNav = [...NAV].reverse().find(n => location.startsWith(n.href));

  if (tvMode) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col">
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Tv2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Sala de Situação — {BI_MUNICIPIO.nome}/{BI_MUNICIPIO.uf}</p>
              <p className="text-xs text-zinc-500">Atualizado {BI_MUNICIPIO.ultimaAtualizacao}</p>
            </div>
          </div>
          <button
            onClick={() => setTvMode(false)}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors"
          >
            Sair do Modo TV
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full z-40 flex flex-col bg-zinc-900 border-r border-white/5 transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand */}
        <div className={cn("flex items-center gap-3 p-4 border-b border-white/5 h-16 flex-shrink-0", collapsed && "justify-center")}>
          {!collapsed ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white leading-tight truncate">{BI_MUNICIPIO.nome}</p>
                <p className="text-[10px] text-zinc-500 leading-tight">Sala de Situação</p>
              </div>
              <span className="flex-shrink-0 text-[9px] font-black bg-violet-600/20 text-violet-400 border border-violet-600/30 px-1.5 py-0.5 rounded-md uppercase tracking-wider">BI</span>
            </>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {!collapsed && (
            <div className="mb-3 px-1">
              <Link href="/site-admin/dashboard">
                <button className="w-full flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-white/5">
                  <ArrowLeftRight className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left">Módulo CMS</span>
                </button>
              </Link>
            </div>
          )}
          {!collapsed && <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 pb-1">Painéis</p>}
          {NAV.map((item) => <SidebarLink key={item.href} item={item} collapsed={collapsed} />)}

          {!collapsed && <div className="w-full h-px bg-white/5 my-3" />}
          <Link href="/bi/tv">
            <span className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all text-zinc-400 hover:text-white hover:bg-white/10",
              collapsed && "justify-center"
            )} title={collapsed ? "Modo TV" : undefined}>
              <Tv2 className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!collapsed && "Modo TV"}
            </span>
          </Link>
        </nav>

        {/* Footer */}
        <div className={cn("border-t border-white/5 p-3 flex-shrink-0 space-y-1", collapsed && "flex flex-col items-center gap-2")}>
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-black text-violet-400">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{BI_MUNICIPIO.prefeito}</p>
                <p className="text-[10px] text-zinc-500 truncate">Prefeito</p>
              </div>
            </div>
          )}
          <div className={cn("flex gap-1", collapsed ? "flex-col items-center" : "justify-end px-2")}>
            <Link href="/">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Portal Público">
                <Globe className="w-4 h-4" />
              </span>
            </Link>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Sair">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors shadow-lg hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main */}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", collapsed ? "lg:ml-16" : "lg:ml-60")}>
        {/* Top bar */}
        <header className="h-16 bg-zinc-900 border-b border-white/5 flex items-center gap-3 px-4 lg:px-6 flex-shrink-0 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <PanelLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs text-zinc-500 hidden sm:block">BI</span>
            <span className="text-zinc-600 text-xs hidden sm:block">/</span>
            <span className="text-sm font-semibold text-white truncate">{title ?? currentNav?.label ?? "Sala de Situação"}</span>
          </div>

          {/* Period selector */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-800 rounded-xl p-1">
            {PERIODOS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriodo(p.id)}
                className={cn(
                  "text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors",
                  periodo.id === p.id ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTvMode(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs text-zinc-300 transition-colors"
              title="Modo TV"
            >
              <Tv2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Modo TV</span>
            </button>
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs text-zinc-300 transition-colors" title="Exportar relatório">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Exportar</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors" title="Atualizar dados">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[10px] text-zinc-600 hidden xl:block">Atualizado {BI_MUNICIPIO.ultimaAtualizacao}</span>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-zinc-950 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
