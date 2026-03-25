import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Menu, X, UserCircle, Phone, Mail, ChevronDown,
  MessageSquare, Headphones, Globe, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTenantConfig } from "@workspace/api-client-react";
import { MegaMenu } from "./MegaMenu";
import { SearchModal } from "./SearchModal";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { data: tenant } = useGetTenantConfig({ tenant: "parauapebas" });

  // Sticky behavior: hide identity bar on scroll
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  // "/" shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const mobileNavItems = [
    { label: "Início", href: "/" },
    { label: "O Município", href: "/o-municipio" },
    { label: "Governo", href: "/governo" },
    { label: "Notícias", href: "/noticias" },
    { label: "Transparência", href: "/transparencia" },
    { label: "Serviços", href: "/servicos" },
    { label: "Legislação", href: "/legislacao" },
    { label: "Galeria", href: "/galeria" },
    { label: "Agenda", href: "/agenda" },
    { label: "Licitações", href: "/licitacoes" },
    { label: "Concursos", href: "/concursos" },
    { label: "Contato", href: "/contato" },
    { label: "Ouvidoria", href: "/ouvidoria" },
  ];

  return (
    <>
      <header className={cn("sticky top-9 z-40 w-full bg-background transition-shadow duration-300", isScrolled ? "shadow-lg" : "shadow-sm border-b border-border")}>

        {/* ─── CAMADA 2: Barra de Identidade ─── */}
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-b border-border"
            >
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-3 gap-4">

                  {/* Logo + Nome */}
                  <Link
                    href="/"
                    className="flex items-center gap-3 group focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-xl p-1 -ml-1 flex-shrink-0"
                    aria-label={`Ir para a página inicial — ${tenant?.nome ?? "Prefeitura Municipal"}`}
                  >
                    <div className="w-14 h-14 flex-shrink-0 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={tenant?.brasao ?? `${import.meta.env.BASE_URL}images/brasao.png`}
                        alt={`Brasão de ${tenant?.nome ?? "Município"}`}
                        className="w-full h-full object-contain p-1"
                        width={56}
                        height={56}
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                        Prefeitura Municipal de
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                        {tenant?.nome ?? "Parauapebas"}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {tenant?.estado ?? "Pará"} · Gestão 2025–2028
                      </span>
                    </div>
                  </Link>

                  {/* Centro: Links rápidos */}
                  <div className="hidden xl:flex items-center gap-6 text-xs font-medium text-muted-foreground">
                    <a
                      href="/ouvidoria"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-none focus:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      Ouvidoria
                    </a>
                    <a
                      href="/transparencia/sic"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-none focus:underline"
                    >
                      <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
                      SIC / e-SIC
                    </a>
                    <a
                      href="/servicos"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-none focus:underline"
                    >
                      <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                      Serviços Online
                    </a>
                    <a
                      href="https://wa.me/5594999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-green-600 transition-colors focus:outline-none focus:underline"
                    >
                      <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>

                  {/* Direita: busca + área cidadão */}
                  <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                    <button
                      id="site-search"
                      onClick={() => setIsSearchOpen(true)}
                      className="flex items-center gap-2 w-56 xl:w-72 px-4 py-2.5 border-2 border-border rounded-xl bg-muted/40 text-muted-foreground text-sm hover:border-primary/40 hover:bg-muted transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      aria-label="Abrir busca no portal (tecla /)"
                      aria-haspopup="dialog"
                    >
                      <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span className="flex-1 text-left">Buscar no portal...</span>
                      <kbd className="hidden xl:inline font-mono text-[11px] border border-border rounded px-1.5 py-0.5 bg-background ml-1">/</kbd>
                    </button>

                    <a
                      href="/cidadao"
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 whitespace-nowrap"
                    >
                      <UserCircle className="w-4 h-4" aria-hidden="true" />
                      Área do Cidadão
                    </a>
                  </div>

                  {/* Mobile: search + hambúrguer */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2.5 rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Abrir busca"
                    >
                      <Search className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      aria-expanded={isMobileMenuOpen}
                      aria-controls="mobile-nav"
                      aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu principal"}
                      className="p-2.5 rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <AnimatePresence initial={false} mode="wait">
                        {isMobileMenuOpen
                          ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-7 h-7" aria-hidden="true" /></motion.div>
                          : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-7 h-7" aria-hidden="true" /></motion.div>
                        }
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── CAMADA 3: Barra de Navegação Principal ─── */}
        <div className="hidden lg:block bg-primary text-primary-foreground">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <MegaMenu onSearchOpen={() => setIsSearchOpen(true)} />

            {/* Compact logo when scrolled */}
            <AnimatePresence initial={false}>
              {isScrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 py-2 ml-4"
                >
                  <img
                    src={tenant?.brasao ?? `${import.meta.env.BASE_URL}images/brasao.png`}
                    alt=""
                    className="w-8 h-8 rounded-full bg-white/20 object-contain p-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-bold text-white hidden xl:inline truncate max-w-[200px]">
                    {tenant?.nome ?? "Parauapebas"}
                  </span>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="ml-2 p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                    aria-label="Buscar"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ─── Menu Mobile (Sheet lateral) ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              key="mobile-nav"
              id="mobile-nav"
              aria-label="Menu móvel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[min(320px,90vw)] bg-background shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary text-white">
                <span className="font-bold text-base">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto py-3">
                <ul role="list" className="space-y-0.5 px-3">
                  {mobileNavItems.map((item) => {
                    const active = item.href === "/" ? location === "/" : location.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block px-4 py-3 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                            active
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground hover:bg-muted"
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

              {/* Sheet footer */}
              <div className="border-t border-border p-4 space-y-3">
                <a
                  href="/cidadao"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
                >
                  <UserCircle className="w-5 h-5" aria-hidden="true" />
                  Área do Cidadão
                </a>
                <a
                  href="/ouvidoria"
                  className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary py-3 rounded-xl font-bold text-sm hover:bg-primary/5 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
                >
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  Ouvidoria Municipal
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
