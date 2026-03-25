import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Newspaper, FileText, Image, CalendarDays,
  GalleryHorizontal, Shield, BookOpen, FileSignature, Briefcase,
  Building2, Menu, Palette, Users, Settings, ChevronLeft,
  ChevronRight, Bell, LogOut, Globe, Eye, X, ArrowLeftRight,
  PanelLeft
} from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/site-admin/dashboard" },
  { icon: Newspaper, label: "Notícias", href: "/site-admin/noticias", badge: "12", badgeColor: "bg-blue-500" },
  { icon: FileText, label: "Páginas", href: "/site-admin/paginas" },
  { icon: Image, label: "Banners", href: "/site-admin/banners" },
  { icon: CalendarDays, label: "Agenda", href: "/site-admin/agenda" },
  { icon: GalleryHorizontal, label: "Galeria", href: "/site-admin/galeria" },
  { icon: Shield, label: "Transparência", href: "/site-admin/transparencia", badge: "3", badgeColor: "bg-red-500" },
  { icon: BookOpen, label: "Legislação", href: "/site-admin/legislacao" },
  { icon: FileSignature, label: "Licitações", href: "/site-admin/licitacoes" },
  { icon: Briefcase, label: "Serviços", href: "/site-admin/servicos" },
  { icon: Building2, label: "Secretarias", href: "/site-admin/secretarias" },
  { icon: Menu, label: "Menus", href: "/site-admin/menus" },
  { icon: Palette, label: "Aparência", href: "/site-admin/aparencia" },
  { icon: Users, label: "Usuários", href: "/site-admin/usuarios" },
  { icon: Settings, label: "Configurações", href: "/site-admin/configuracoes" },
];

const SEPARATORS: Record<string, string> = {
  "/site-admin/banners": "Conteúdo",
  "/site-admin/transparencia": "Legislação e Contratos",
  "/site-admin/menus": "Configuração",
  "/site-admin/usuarios": "Sistema",
};

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const [isActive] = useRoute(item.href + "/*?");
  const [isExact] = useRoute(item.href);
  const active = isActive || isExact;

  return (
    <Link href={item.href}>
      <span className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all",
        active
          ? "bg-primary text-white shadow-md shadow-primary/30"
          : "text-zinc-400 hover:text-white hover:bg-white/10"
      )} title={collapsed ? item.label : undefined}>
        <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} aria-hidden="true" />
        {!collapsed && <span className="flex-1">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className={cn("text-[10px] font-black text-white px-1.5 py-0.5 rounded-full min-w-5 text-center", item.badgeColor)}>
            {item.badge}
          </span>
        )}
        {collapsed && item.badge && (
          <span className={cn(
            "absolute left-8 top-1.5 w-4 h-4 text-[9px] font-black text-white rounded-full flex items-center justify-center", item.badgeColor
          )}>
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

interface CmsLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function CmsLayout({ children, title, actions }: CmsLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const currentItem = NAV_ITEMS.find(i => location.startsWith(i.href));

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col bg-zinc-900 border-r border-white/5 transition-all duration-300",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Menu do CMS"
      >
        {/* Logo / Brand */}
        <div className={cn("flex items-center gap-3 p-4 border-b border-white/5 h-16 flex-shrink-0", collapsed && "justify-center")}>
          {!collapsed && (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white leading-tight truncate">Parauapebas</p>
                <p className="text-[10px] text-zinc-500 leading-tight">CMS Institucional</p>
              </div>
              <span className="flex-shrink-0 text-[9px] font-black bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                Site
              </span>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" aria-label="Navegação CMS">
          {/* Module switcher */}
          {!collapsed && (
            <div className="mb-3 px-1">
              <button className="w-full flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-white/5">
                <ArrowLeftRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 text-left">Módulo Ouvidoria</span>
              </button>
            </div>
          )}

          {NAV_ITEMS.map((item, i) => (
            <div key={item.href} className="relative">
              {SEPARATORS[item.href] && !collapsed && (
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 pt-4 pb-1 mt-2">
                  {SEPARATORS[item.href]}
                </p>
              )}
              {SEPARATORS[item.href] && collapsed && (
                <div className="w-8 h-px bg-white/10 mx-auto my-3" />
              )}
              <SidebarLink item={item} collapsed={collapsed} />
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn("border-t border-white/5 p-3 flex-shrink-0 space-y-1", collapsed && "flex flex-col items-center")}>
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-black text-primary">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Admin Municipal</p>
                <p className="text-[10px] text-zinc-500 truncate">admin@parauapebas.pa.gov.br</p>
              </div>
            </div>
          )}
          <div className={cn("flex gap-1", collapsed ? "flex-col items-center" : "justify-end px-2")}>
            <Link href="/" target="_blank">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Ver Portal Público">
                <Eye className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Sair">
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors shadow-lg hidden lg:flex"
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", collapsed ? "lg:ml-16" : "lg:ml-60")}>
        {/* Top bar */}
        <header className="h-16 bg-zinc-900 border-b border-white/5 flex items-center gap-4 px-4 lg:px-6 flex-shrink-0 sticky top-0 z-20">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menu"
          >
            <PanelLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs text-zinc-500 hidden sm:block">CMS</span>
            {currentItem && (
              <>
                <span className="text-zinc-600 text-xs hidden sm:block">/</span>
                <span className="text-sm font-semibold text-white truncate">
                  {title ?? currentItem.label}
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {actions}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Notificações">
              <Bell className="w-4 h-4" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-label="3 notificações" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main id="cms-content" className="flex-1 bg-zinc-950 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
