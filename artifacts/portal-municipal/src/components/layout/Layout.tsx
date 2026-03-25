import { ReactNode } from "react";
import { AccessibilityBar } from "./AccessibilityBar";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CookieBanner } from "./CookieBanner";
import { Breadcrumb } from "./Breadcrumb";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {/* Barra de Acessibilidade — sticky top:0, altura 36px (h-9) */}
      <AccessibilityBar />

      {/* Header principal — sticky top-9 (abaixo da barra de acessibilidade) */}
      <SiteHeader />

      {/* Breadcrumb automático em páginas internas */}
      <Breadcrumb />

      {/* Conteúdo principal */}
      <main
        id="main-content"
        className="flex-1 flex flex-col outline-none"
        tabIndex={-1}
      >
        {children}
      </main>

      <SiteFooter />
      <CookieBanner />
    </div>
  );
}
