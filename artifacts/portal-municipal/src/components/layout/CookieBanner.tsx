import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Link } from "wouter";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("gov-cookies-accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("gov-cookies-accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t-4 border-primary shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="bg-primary/10 p-3 rounded-full text-primary hidden sm:block">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg mb-1">Privacidade e Cookies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
              Utilizamos cookies para melhorar sua experiência em nosso portal, personalizar conteúdo e analisar o tráfego. 
              Ao continuar navegando, você concorda com a nossa{" "}
              <Link href="/privacidade" className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded">
                Política de Privacidade
              </Link>
              {" "}em conformidade com a LGPD (Lei Geral de Proteção de Dados).
            </p>
          </div>
        </div>
        
        <div className="flex flex-shrink-0 gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <button 
            onClick={acceptCookies}
            className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-md"
          >
            Concordar e Fechar
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Fechar banner"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
