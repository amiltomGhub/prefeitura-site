import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ChevronDown, Building2, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTenantConfig } from "@workspace/api-client-react";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { data: tenant } = useGetTenantConfig();

  const navItems = [
    { label: "Início", href: "/" },
    { label: "O Município", href: "/municipio" },
    { label: "Governo", href: "/governo" },
    { label: "Serviços", href: "/servicos" },
    { label: "Transparência", href: "/transparencia" },
    { label: "Notícias", href: "/noticias" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 shadow-sm transition-colors duration-200">
      {/* Top Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-4 group focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-xl p-1 -ml-1">
            <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-primary/5 rounded-full flex items-center justify-center overflow-hidden">
              {tenant?.brasao ? (
                <img src={tenant.brasao} alt={`Brasão de ${tenant?.nome || 'Município'}`} className="w-full h-full object-contain p-1" />
              ) : (
                <img src={`${import.meta.env.BASE_URL}images/brasao.png`} alt="Brasão do Município" className="w-full h-full object-contain p-1" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-wider">
                Prefeitura Municipal de
              </span>
              <span className="text-xl md:text-3xl font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                {tenant?.nome || "São Exemplo"}
              </span>
            </div>
          </Link>

          {/* Desktop Search & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <form id="site-search" className="relative group" onSubmit={(e) => e.preventDefault()}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                className="block w-64 xl:w-80 pl-10 pr-3 py-2.5 border-2 border-border rounded-xl leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                placeholder="Buscar no portal..."
                aria-label="Buscar no portal"
              />
            </form>
            
            <a href="#" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-xl transition-colors">
              <UserCircle className="w-5 h-5" />
              <span>Área do Cidadão</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <button className="p-2 text-foreground hover:bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation (Desktop) */}
      <nav id="main-nav" className="hidden lg:block bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center -mb-px">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-6 py-4 text-sm font-semibold border-b-4 transition-colors hover:bg-primary-foreground/10 focus:outline-none focus:bg-primary-foreground/10",
                      isActive 
                        ? "border-accent text-white" 
                        : "border-transparent text-primary-foreground/90 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border absolute w-full shadow-xl">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location === item.href || (item.href !== "/" && location.startsWith(item.href))
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border px-4">
              <a href="#" className="flex items-center justify-center gap-2 w-full text-base font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-3 rounded-xl transition-colors">
                <UserCircle className="w-6 h-6" />
                <span>Entrar na Área do Cidadão</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
