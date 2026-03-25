import { ReactNode } from "react";
import { AccessibilityBar } from "./AccessibilityBar";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CookieBanner } from "./CookieBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <AccessibilityBar />
      <SiteHeader />
      <main id="main-content" className="flex-1 flex flex-col outline-none" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <CookieBanner />
    </div>
  );
}
