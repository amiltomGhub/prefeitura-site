import { useEffect, useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Link } from "wouter";
import { Contrast, Map, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

function LiveClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time dateTime={time.toISOString()} className="tabular-nums hidden sm:inline">
      {time.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
      {" "}
      {time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </time>
  );
}

export function AccessibilityBar() {
  const { highContrast, setHighContrast, fontSize, increaseFontSize, decreaseFontSize, resetAccessibility } = useAccessibility();

  return (
    <>
      {/* Skip links — visíveis apenas no foco (e-MAG obrigatório) */}
      <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-0 focus-within:left-0 focus-within:z-[200] focus-within:flex focus-within:gap-2 focus-within:p-2 focus-within:bg-black">
        <a
          href="#main-content"
          accessKey="1"
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
        >
          Ir para o conteúdo principal [Alt+1]
        </a>
        <a
          href="#main-nav"
          accessKey="2"
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
        >
          Ir para o menu [Alt+2]
        </a>
        <a
          href="#site-search"
          accessKey="3"
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
        >
          Ir para a busca [Alt+3]
        </a>
        <a
          href="#site-footer"
          accessKey="4"
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
        >
          Ir para o rodapé [Alt+4]
        </a>
        <Link
          href="/acessibilidade"
          accessKey="5"
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
        >
          Acessibilidade [Alt+5]
        </Link>
      </div>

      {/* Barra de Acessibilidade principal */}
      <div
        role="navigation"
        aria-label="Barra de acessibilidade"
        className="sticky top-0 z-50 w-full"
        style={{ backgroundColor: "#333", color: "#d4d4d4" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4 text-xs font-medium">

          {/* Atalhos de teclado (visíveis) */}
          <div className="hidden md:flex items-center gap-3 text-zinc-400">
            <span className="text-zinc-500">Atalhos:</span>
            <a href="#main-content" className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors">Conteúdo [1]</a>
            <a href="#main-nav" className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors">Menu [2]</a>
            <a href="#site-search" className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors">Busca [3]</a>
            <a href="#site-footer" className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors">Rodapé [4]</a>
          </div>

          {/* Controles direita */}
          <div className="flex items-center gap-1 sm:gap-3 ml-auto">
            {/* Relógio */}
            <span className="text-zinc-500 text-[11px]">
              <LiveClock />
            </span>

            <span className="hidden sm:block w-px h-4 bg-zinc-600" aria-hidden="true" />

            {/* Tamanho de fonte */}
            <div
              role="group"
              aria-label="Tamanho da fonte"
              className="flex items-center gap-0.5"
            >
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === "small"}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-40 transition-colors text-[11px] font-bold"
                aria-label="Diminuir fonte"
                title="Fonte menor (A-)"
              >
                T<sup className="text-[8px]">-</sup>
              </button>
              <button
                onClick={resetAccessibility}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors text-sm font-bold",
                  fontSize === "normal" && !highContrast && "text-white"
                )}
                aria-label="Tamanho de fonte padrão"
                title="Fonte padrão (A)"
              >
                A
              </button>
              <button
                onClick={increaseFontSize}
                disabled={fontSize === "large"}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-40 transition-colors text-base font-bold"
                aria-label="Aumentar fonte"
                title="Fonte maior (A+)"
              >
                T<sup className="text-[8px]">+</sup>
              </button>
            </div>

            <span className="hidden sm:block w-px h-4 bg-zinc-600" aria-hidden="true" />

            {/* Alto contraste */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              aria-pressed={highContrast}
              className={cn(
                "flex items-center gap-1.5 px-2 h-7 rounded hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors",
                highContrast && "text-yellow-400 font-bold"
              )}
              title={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
            >
              <Contrast className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Alto Contraste</span>
            </button>

            <span className="hidden sm:block w-px h-4 bg-zinc-600" aria-hidden="true" />

            {/* Links */}
            <Link
              href="/mapa-do-site"
              className="hidden sm:flex items-center gap-1.5 px-2 h-7 rounded hover:text-white hover:bg-zinc-700 focus:text-white focus:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
            >
              <Map className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mapa do Site</span>
            </Link>

            <Link
              href="/acessibilidade"
              className="hidden sm:flex items-center gap-1.5 px-2 h-7 rounded hover:text-white hover:bg-zinc-700 focus:text-white focus:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Acessibilidade</span>
            </Link>

            {/* VLibras placeholder */}
            <div
              aria-label="VLibras — Tradutor de Libras"
              title="VLibras — Acessibilidade em Libras (WCAG 2.1 AA)"
              className="hidden sm:flex items-center justify-center w-7 h-7 rounded bg-zinc-700 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors cursor-pointer text-[10px] font-bold text-white"
              tabIndex={0}
              role="button"
            >
              Vlb
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
