import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Link } from "wouter";
import { Contrast, Type, Settings2, Map } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityBar() {
  const { 
    highContrast, 
    setHighContrast, 
    increaseFontSize, 
    decreaseFontSize, 
    resetAccessibility 
  } = useAccessibility();

  return (
    <div className="bg-zinc-900 text-zinc-300 py-1.5 text-xs font-medium w-full z-50 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        
        {/* Skip Links - Visible only on focus for Screen Readers */}
        <div className="flex gap-4">
          <a href="#main-content" accessKey="1" className="skip-link">Ir para o conteúdo (1)</a>
          <a href="#main-nav" accessKey="2" className="skip-link">Ir para o menu (2)</a>
          <a href="#site-search" accessKey="3" className="skip-link">Ir para a busca (3)</a>
          <a href="#site-footer" accessKey="4" className="skip-link">Ir para o rodapé (4)</a>
          
          <div className="hidden md:flex gap-3">
            <span className="opacity-70">Atalhos:</span>
            <a href="#main-content" className="hover:text-white focus:text-white transition-colors">Conteúdo [1]</a>
            <a href="#main-nav" className="hover:text-white focus:text-white transition-colors">Menu [2]</a>
            <a href="#site-search" className="hover:text-white focus:text-white transition-colors">Busca [3]</a>
            <a href="#site-footer" className="hover:text-white focus:text-white transition-colors">Rodapé [4]</a>
          </div>
        </div>

        {/* Accessibility Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 border-r border-zinc-700 pr-4 sm:pr-6">
            <button 
              onClick={decreaseFontSize}
              className="flex items-center gap-1 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 transition-colors"
              aria-label="Diminuir tamanho da fonte"
              title="Diminuir fonte"
            >
              <Type className="w-3 h-3" />-
            </button>
            <button 
              onClick={resetAccessibility}
              className="hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 transition-colors"
              aria-label="Tamanho de fonte normal e contraste padrão"
              title="Tamanho normal"
            >
              A
            </button>
            <button 
              onClick={increaseFontSize}
              className="flex items-center gap-1 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 transition-colors"
              aria-label="Aumentar tamanho da fonte"
              title="Aumentar fonte"
            >
              <Type className="w-4 h-4" />+
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={cn(
                "flex items-center gap-1.5 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 transition-colors",
                highContrast && "text-yellow-400 font-bold"
              )}
              aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
              aria-pressed={highContrast}
            >
              <Contrast className="w-4 h-4" />
              <span className="hidden sm:inline">Alto Contraste</span>
            </button>
            
            <Link href="/mapa-do-site" className="flex items-center gap-1.5 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 transition-colors">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa do Site</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
