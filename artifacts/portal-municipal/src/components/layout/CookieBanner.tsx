import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, ChevronDown, ChevronUp, Check, Shield, BarChart2, Megaphone } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type CookieCategory = "essential" | "analytics" | "marketing";

interface CookiePrefs {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp?: string;
}

const COOKIE_KEY = "gov-cookie-prefs";
const COOKIE_EXPIRY_DAYS = 365;

function getCookiePrefs(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCookiePrefs(prefs: CookiePrefs) {
  const data = { ...prefs, timestamp: new Date().toISOString() };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
  // Also set an actual cookie for SSR/middleware awareness
  const expires = new Date(Date.now() + COOKIE_EXPIRY_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(data))};expires=${expires};path=/;SameSite=Lax`;
}

const CATEGORIES: Array<{
  key: CookieCategory;
  label: string;
  description: string;
  required: boolean;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: "essential",
    label: "Essenciais",
    description: "Necessários para o funcionamento básico do portal. Incluem gerenciamento de sessão, preferências de acessibilidade e segurança. Não podem ser desativados.",
    required: true,
    icon: Shield,
  },
  {
    key: "analytics",
    label: "Análise e Desempenho",
    description: "Nos ajudam a entender como os cidadãos utilizam o portal, identificar áreas de melhoria e otimizar os serviços públicos. Dados são anonimizados.",
    required: false,
    icon: BarChart2,
  },
  {
    key: "marketing",
    label: "Comunicação e Campanhas",
    description: "Permitem a personalização de comunicados, campanhas institucionais e informações relevantes para o cidadão conforme suas interações no portal.",
    required: false,
    icon: Megaphone,
  },
];

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({ essential: true, analytics: false, marketing: false });
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getCookiePrefs();
    if (!saved) {
      // Show after a short delay for better UX
      const t = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(t);
    } else {
      setPrefs(saved);
    }
  }, []);

  // Trap focus inside banner when config is open
  useEffect(() => {
    if (isVisible && bannerRef.current) {
      const firstFocusable = bannerRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isVisible]);

  const handleAcceptAll = () => {
    const all: CookiePrefs = { essential: true, analytics: true, marketing: true };
    saveCookiePrefs(all);
    setPrefs(all);
    setIsVisible(false);
  };

  const handleRejectOptional = () => {
    const minimal: CookiePrefs = { essential: true, analytics: false, marketing: false };
    saveCookiePrefs(minimal);
    setPrefs(minimal);
    setIsVisible(false);
  };

  const handleSavePrefs = () => {
    saveCookiePrefs(prefs);
    setIsVisible(false);
  };

  const toggleCategory = (cat: CookieCategory) => {
    if (cat === "essential") return;
    setPrefs(p => ({ ...p, [cat]: !p[cat] }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop for modal config view */}
          {isConfigOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[59]"
              aria-hidden="true"
              onClick={() => setIsConfigOpen(false)}
            />
          )}

          <motion.div
            ref={bannerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Preferências de privacidade e cookies"
            aria-live="polite"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[60] bg-background border-t-4 border-primary shadow-[0_-20px_60px_rgba(0,0,0,0.15)]",
              isConfigOpen ? "rounded-t-2xl" : ""
            )}
          >
            {/* Config Panel (expandable) */}
            <AnimatePresence>
              {isConfigOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-b border-border"
                >
                  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                    <h3 className="font-bold text-foreground text-base mb-1">Gerenciar preferências de cookies</h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      Escolha quais categorias de cookies você autoriza. As suas preferências serão armazenadas por {COOKIE_EXPIRY_DAYS} dias.
                    </p>

                    <div className="space-y-3">
                      {CATEGORIES.map(({ key, label, description, required, icon: Icon }) => (
                        <div
                          key={key}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border transition-colors",
                            prefs[key] ? "border-primary/30 bg-primary/3" : "border-border bg-muted/30"
                          )}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <Icon className={cn("w-5 h-5", prefs[key] ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-foreground">{label}</span>
                              {required && (
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  Obrigatório
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                          </div>
                          <button
                            role="switch"
                            aria-checked={prefs[key]}
                            aria-label={`${prefs[key] ? "Desativar" : "Ativar"} cookies ${label.toLowerCase()}`}
                            onClick={() => toggleCategory(key)}
                            disabled={required}
                            className={cn(
                              "relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                              prefs[key] ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-600",
                              required && "opacity-60 cursor-not-allowed"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                                prefs[key] ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                      <button
                        onClick={handleSavePrefs}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Salvar preferências
                      </button>
                      <button
                        onClick={() => setIsConfigOpen(false)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Banner */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon + Text */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0 hidden sm:flex">
                    <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-sm sm:text-base">
                      Privacidade e Cookies — LGPD
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      Utilizamos cookies para melhorar sua experiência e os serviços públicos do portal.{" "}
                      <Link href="/privacidade" className="text-primary font-medium hover:underline focus:outline-none focus:underline">
                        Política de Privacidade
                      </Link>
                      {" "}(Lei 13.709/2018).
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 whitespace-nowrap"
                  >
                    Aceitar Todos
                  </button>

                  <button
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    aria-expanded={isConfigOpen}
                    aria-controls="cookie-config-panel"
                    className="flex items-center gap-1.5 flex-1 sm:flex-none border-2 border-border text-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-muted transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 whitespace-nowrap justify-center"
                  >
                    Configurar
                    {isConfigOpen
                      ? <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      : <ChevronUp className="w-4 h-4" aria-hidden="true" />
                    }
                  </button>

                  <button
                    onClick={handleRejectOptional}
                    className="flex-1 sm:flex-none text-sm text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap"
                  >
                    Rejeitar Opcionais
                  </button>

                  <button
                    onClick={handleRejectOptional}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Fechar banner de cookies (aceitar apenas essenciais)"
                    title="Fechar"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
