import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  DollarSign, TrendingDown, TrendingUp, FileBarChart, Users,
  Plane, FileSignature, Handshake, GitBranch, Database,
  MessageSquare, Shield, BookOpen, LayoutGrid,
  BarChart3, ScrollText, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  hasMega?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "O Município", href: "/o-municipio" },
  { label: "Governo", href: "/governo" },
  { label: "Notícias", href: "/noticias" },
  { label: "Transparência", hasMega: true },
  { label: "Serviços", href: "/servicos" },
  { label: "Legislação", href: "/legislacao" },
  { label: "Galeria", href: "/galeria" },
  { label: "Agenda", href: "/agenda" },
  { label: "Contato", href: "/contato" },
];

interface MegaColumn {
  title: string;
  items: Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
}

const TRANSPARENCIA_COLUMNS: MegaColumn[] = [
  {
    title: "Financeiro",
    items: [
      { label: "Orçamento (LOA, LDO, PPA)", href: "/transparencia/orcamento", icon: BarChart3 },
      { label: "Receitas Arrecadadas", href: "/transparencia/receitas", icon: TrendingUp },
      { label: "Despesas Realizadas", href: "/transparencia/despesas", icon: TrendingDown },
      { label: "Balancete Financeiro", href: "/transparencia/balancete", icon: FileBarChart },
      { label: "Balanço Anual", href: "/transparencia/balanco", icon: DollarSign },
      { label: "RREO / RGF", href: "/transparencia/rreo-rgf", icon: ScrollText },
    ],
  },
  {
    title: "Pessoal e Contratos",
    items: [
      { label: "Servidores / Folha de Pagamento", href: "/transparencia/servidores", icon: Users },
      { label: "Diárias e Passagens", href: "/transparencia/diarias", icon: Plane },
      { label: "Licitações e Contratos", href: "/licitacoes", icon: FileSignature },
      { label: "Convênios", href: "/transparencia/convenios", icon: Handshake },
      { label: "Emendas Parlamentares", href: "/transparencia/emendas", icon: GitBranch },
    ],
  },
  {
    title: "Institucional / LAI",
    items: [
      { label: "Estrutura Organizacional", href: "/governo/estrutura-organizacional", icon: LayoutGrid },
      { label: "Atos Normativos", href: "/legislacao?tipo=portaria", icon: FileText },
      { label: "Legislação Municipal", href: "/legislacao", icon: BookOpen },
      { label: "Controle Interno", href: "/transparencia/controle-interno", icon: Shield },
      { label: "Dados Abertos", href: "/transparencia/dados-abertos", icon: Database },
      { label: "SIC / LAI / Ouvidoria", href: "/transparencia/sic", icon: MessageSquare },
    ],
  },
];

interface MegaMenuProps {
  onSearchOpen: () => void;
}

export function MegaMenu({ onSearchOpen }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [location] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => { setActiveMenu(null); }, [location]);

  const isActive = (item: NavItem) => {
    if (item.href === "/") return location === "/";
    if (item.href) return location.startsWith(item.href);
    if (item.hasMega) return location.startsWith("/transparencia");
    return false;
  };

  return (
    <div ref={menuRef} className="relative">
      <ul
        id="main-nav"
        role="menubar"
        aria-label="Menu de navegação principal"
        className="flex items-center"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const isMenuOpen = activeMenu === item.label;

          if (item.hasMega) {
            return (
              <li key={item.label} role="none" className="relative">
                <button
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => openMenu(item.label)}
                  onClick={() => setActiveMenu(isMenuOpen ? null : item.label)}
                  className={cn(
                    "inline-flex items-center gap-1 px-4 lg:px-5 py-4 text-sm font-semibold border-b-[3px] transition-colors focus:outline-none focus:bg-white/10",
                    active || isMenuOpen
                      ? "border-yellow-400 text-white"
                      : "border-transparent text-white/85 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform duration-200", isMenuOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>

                {/* Mega Dropdown */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      role="menu"
                      aria-label="Submenu de Transparência"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-[720px] bg-background shadow-2xl border border-border rounded-b-2xl overflow-hidden z-50"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={scheduleClose}
                    >
                      {/* Header */}
                      <div className="bg-primary/5 border-b border-border px-6 py-3 flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-bold text-primary">Portal da Transparência</h2>
                          <p className="text-xs text-muted-foreground">Conformidade com a LAI — Lei 12.527/2011</p>
                        </div>
                        <Link
                          href="/transparencia"
                          className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline focus:outline-none focus:underline flex items-center gap-1"
                          role="menuitem"
                        >
                          Ver tudo
                        </Link>
                      </div>

                      {/* Columns */}
                      <div className="grid grid-cols-3 gap-0 divide-x divide-border p-2">
                        {TRANSPARENCIA_COLUMNS.map((col) => (
                          <div key={col.title} className="px-3 py-3">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                              {col.title}
                            </h3>
                            <ul role="list">
                              {col.items.map((link) => {
                                const Icon = link.icon;
                                return (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      role="menuitem"
                                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors focus:outline-none focus:bg-primary/5 focus:text-primary group"
                                    >
                                      <Icon
                                        className="w-4 h-4 text-muted-foreground group-hover:text-primary group-focus:text-primary flex-shrink-0 transition-colors"
                                        aria-hidden="true"
                                      />
                                      <span className="line-clamp-1">{link.label}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          }

          return (
            <li key={item.label} role="none">
              <Link
                href={item.href!}
                role="menuitem"
                className={cn(
                  "inline-flex items-center px-4 lg:px-5 py-4 text-sm font-semibold border-b-[3px] transition-colors focus:outline-none focus:bg-white/10 whitespace-nowrap",
                  active
                    ? "border-yellow-400 text-white"
                    : "border-transparent text-white/85 hover:text-white hover:bg-white/10"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
