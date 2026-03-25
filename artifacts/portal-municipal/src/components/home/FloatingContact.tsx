import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Phone, Smartphone, HeadphonesIcon, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/5594999999999?text=Olá%2C%20gostaria%20de%20informações.";

const QUICK_ITEMS = [
  {
    label: "Ouvidoria",
    desc: "Reclamações e sugestões",
    href: "/ouvidoria",
    icon: MessageSquare,
    color: "bg-red-100 text-red-700 border-red-200",
    external: false,
  },
  {
    label: "WhatsApp",
    desc: "Seg–Sex 08h às 17h",
    href: WHATSAPP_URL,
    icon: Smartphone,
    color: "bg-green-100 text-green-700 border-green-200",
    external: true,
  },
  {
    label: "SIC / LAI",
    desc: "Acesso à informação",
    href: "/transparencia/sic",
    icon: HeadphonesIcon,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    external: false,
  },
  {
    label: "Telefone",
    desc: "Central 156",
    href: "tel:156",
    icon: Phone,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    external: false,
  },
];

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3"
      aria-label="Contato rápido"
    >
      {/* Quick links menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Menu de contato rápido"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden w-64"
          >
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">Fale Conosco</h3>
                <p className="text-primary-foreground/70 text-xs">Canais de atendimento</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <ul role="list" className="p-2 space-y-1">
              {QUICK_ITEMS.map(({ label, desc, href, icon: Icon, color, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors focus:outline-none focus:bg-muted group"
                  >
                    <span className={cn("w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0", color)}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="floating-contact-menu"
        aria-label={isOpen ? "Fechar menu de contato" : "Abrir menu de contato — Fale Conosco"}
        className={cn(
          "flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-sm shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4",
          isOpen
            ? "bg-zinc-700 text-white focus:ring-zinc-400/40"
            : "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="hidden sm:inline">Fale Conosco</span>
      </motion.button>
    </div>
  );
}
