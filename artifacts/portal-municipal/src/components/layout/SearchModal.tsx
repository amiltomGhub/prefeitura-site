import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, ArrowRight, Newspaper, Wrench, FileText, Building2, BarChart2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  tipo: string;
  titulo: string;
  resumo?: string | null;
  url: string;
  relevancia: number;
}

interface GroupedResults {
  [tipo: string]: SearchResult[];
}

const TIPO_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  noticia:    { label: "Notícias",       icon: Newspaper,  color: "text-blue-600" },
  servico:    { label: "Serviços",       icon: Wrench,     color: "text-green-600" },
  licitacao:  { label: "Licitações",    icon: BarChart2,   color: "text-orange-600" },
  legislacao: { label: "Legislação",    icon: FileText,    color: "text-purple-600" },
  secretaria: { label: "Secretarias",   icon: Building2,   color: "text-zinc-600" },
};

const HISTORY_KEY = "gov-search-history";
const MAX_HISTORY = 5;

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{part}</mark> : part
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResults>({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load history
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
      setHistory(Array.isArray(saved) ? saved : []);
    } catch { setHistory([]); }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults({});
    }
  }, [isOpen]);

  // Keyboard shortcut: "/" opens modal, Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen && e.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        // Signal parent to open - handled by parent via state
      }
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults({});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/busca?q=${encodeURIComponent(q)}&limit=15&tenant=parauapebas`);
      const data = await res.json();
      const grouped: GroupedResults = {};
      for (const item of (data.data ?? [])) {
        if (!grouped[item.tipo]) grouped[item.tipo] = [];
        grouped[item.tipo]!.push(item);
      }
      setResults(grouped);
    } catch {
      setResults({});
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults({}); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => fetchResults(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchResults]);

  const saveHistory = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...history.filter(h => h !== q)].slice(0, MAX_HISTORY);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleGoToResults = () => {
    if (!query.trim()) return;
    saveHistory(query);
    navigate(`/busca?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleResultClick = (url: string) => {
    saveHistory(query);
    navigate(url);
    onClose();
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);
  const hasResults = totalResults > 0;
  const showHistory = !query.trim() && history.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Busca no portal"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[101] mx-auto sm:top-16 sm:max-w-2xl sm:rounded-2xl bg-background shadow-2xl border border-border overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGoToResults()}
                placeholder="Buscar notícias, serviços, legislação..."
                className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-base focus:outline-none"
                aria-label="Campo de busca"
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setResults({}); inputRef.current?.focus(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  aria-label="Limpar busca"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="ml-2 text-xs text-muted-foreground border border-border px-2 py-1 rounded font-mono hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Fechar busca (Esc)"
                title="Fechar (Esc)"
              >
                Esc
              </button>
            </div>

            {/* Results / History */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100svh - 200px)" }}
              role="listbox"
              aria-label="Resultados da busca"
            >
              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  <span>Buscando...</span>
                </div>
              )}

              {/* No results */}
              {!loading && query.length >= 2 && !hasResults && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
                  <p className="font-medium">Nenhum resultado para <strong>"{query}"</strong></p>
                  <p className="text-sm mt-1">Tente outros termos ou acesse a busca avançada.</p>
                </div>
              )}

              {/* History */}
              {showHistory && !loading && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      Buscas recentes
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors focus:outline-none focus:underline"
                    >
                      Limpar
                    </button>
                  </div>
                  <ul className="space-y-1" role="list">
                    {history.map(term => (
                      <li key={term}>
                        <button
                          onClick={() => handleHistoryClick(term)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors focus:outline-none focus:bg-muted group"
                          role="option"
                          aria-selected={false}
                        >
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-foreground" aria-hidden="true" />
                          <span className="flex-1 text-sm text-foreground">{term}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grouped results */}
              {!loading && hasResults && (
                <div className="p-2">
                  {Object.entries(results).map(([tipo, items]) => {
                    const meta = TIPO_META[tipo] ?? { label: tipo, icon: FileText, color: "text-zinc-600" };
                    const Icon = meta.icon;
                    return (
                      <div key={tipo} className="mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5">
                          <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", meta.color)} aria-hidden="true" />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{meta.label}</span>
                        </div>
                        <ul role="list">
                          {items.slice(0, 4).map(item => (
                            <li key={item.id}>
                              <button
                                onClick={() => handleResultClick(item.url)}
                                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors focus:outline-none focus:bg-muted group"
                                role="option"
                                aria-selected={false}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {highlight(item.titulo, query)}
                                  </p>
                                  {item.resumo && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                      {highlight(item.resumo, query)}
                                    </p>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" aria-hidden="true" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* "Ver todos os resultados" footer */}
              {!loading && hasResults && (
                <div className="border-t border-border px-4 py-3">
                  <button
                    onClick={handleGoToResults}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 py-2 rounded-lg hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    Ver todos os {totalResults} resultado{totalResults !== 1 ? "s" : ""} para "{query}"
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground bg-muted/30">
              <span><kbd className="font-mono border border-border rounded px-1 py-0.5 bg-background">↵</kbd> para buscar</span>
              <span><kbd className="font-mono border border-border rounded px-1 py-0.5 bg-background">Esc</kbd> para fechar</span>
              <span><kbd className="font-mono border border-border rounded px-1 py-0.5 bg-background">/</kbd> para abrir</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
