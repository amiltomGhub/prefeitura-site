import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useServidor } from "@/contexts/ServidorContext";
import {
  FileText, Umbrella, ClipboardList, User, LayoutDashboard,
  LogOut, Menu, X, ChevronRight, Building2, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: FileText, label: "Contracheque", href: "/servidor/contracheque" },
  { icon: Umbrella, label: "Férias", href: "/servidor/ferias" },
  { icon: ClipboardList, label: "Requerimentos", href: "/servidor/requerimentos" },
  { icon: User, label: "Vida Funcional", href: "/servidor/vida-funcional" },
];

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

interface ServidorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function ServidorLayout({ children, title, subtitle }: ServidorLayoutProps) {
  const { servidor, setRole, logout } = useServidor();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-30">
        {/* Logo / org */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-700 truncate leading-tight">Portal do Servidor</p>
            <p className="text-xs text-gray-500 truncate">Parauapebas — PA</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-blue-700" : "text-gray-400")} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && <Badge className="ml-auto text-xs px-1.5 py-0">{item.badge}</Badge>}
                {active && <ChevronRight className="h-3.5 w-3.5 text-blue-700" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                {initials(servidor.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{servidor.nome.split(" ").slice(0, 2).join(" ")}</p>
              <p className="text-xs text-gray-500 truncate">Mat. {servidor.matricula}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setRole(servidor.isRH ? "servidor" : "rh")}
              className="flex-1 text-xs text-center py-1 px-2 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              title="Alternar perfil para testes"
            >
              {servidor.isRH ? "Mudar para Servidor" : "Mudar para RH"}
            </button>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair do Portal
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white h-full z-50">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Portal do Servidor</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active ? "text-blue-700" : "text-gray-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{initials(servidor.nome)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{servidor.nome.split(" ").slice(0, 2).join(" ")}</p>
                  <p className="text-xs text-gray-500">Mat. {servidor.matricula}</p>
                </div>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-600">
                <LogOut className="h-3.5 w-3.5" />Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-gray-600">
              <Bell className="h-4 w-4" />
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2 text-xs">
                Portal Público
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{servidor.nome.split(" ")[0]}</span>
              <span className="text-gray-300">|</span>
              <span>{servidor.cargo}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function RhLayout({ children, title, subtitle }: ServidorLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const RH_NAV = [
    { icon: LayoutDashboard, label: "Dashboard RH", href: "/rh/dashboard" },
    { icon: Umbrella, label: "Férias — Aprovações", href: "/rh/ferias" },
    { icon: ClipboardList, label: "Requerimentos", href: "/rh/requerimentos" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed inset-y-0 z-30">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Painel RH</p>
            <p className="text-xs text-slate-400">Gestão de Servidores</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {RH_NAV.map((item) => {
            const active = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active ? "bg-amber-500/20 text-amber-400" : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <item.icon className={cn("h-4 w-4", active ? "text-amber-400" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/servidor/contracheque">
            <Button variant="outline" size="sm" className="w-full text-xs border-slate-600 text-slate-300 hover:bg-slate-800">
              Meu Portal
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-900 h-full z-50">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <span className="text-sm font-semibold text-white">Painel RH</span>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {RH_NAV.map((item) => {
                const active = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      active ? "bg-amber-500/20 text-amber-400" : "text-slate-300 hover:bg-slate-800"
                    )}
                  >
                    <item.icon className="h-4 w-4" />{item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <Badge className="bg-amber-500 text-white">Painel RH</Badge>
        </header>
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
