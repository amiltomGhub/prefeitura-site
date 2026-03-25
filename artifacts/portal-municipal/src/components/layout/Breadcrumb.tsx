import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "o-municipio": "O Município",
  "governo": "Governo",
  "secretarias": "Secretarias",
  "estrutura-organizacional": "Estrutura Organizacional",
  "noticias": "Notícias",
  "transparencia": "Transparência",
  "orcamento": "Orçamento",
  "despesas": "Despesas",
  "receitas": "Receitas",
  "servidores": "Servidores",
  "sic": "SIC / e-SIC",
  "lai": "Acesso à Informação",
  "servicos": "Serviços",
  "legislacao": "Legislação",
  "agenda": "Agenda",
  "licitacoes": "Licitações",
  "concursos": "Concursos",
  "galeria": "Galeria",
  "contato": "Contato",
  "acessibilidade": "Acessibilidade",
  "mapa-do-site": "Mapa do Site",
  "privacidade": "Privacidade",
  "busca": "Resultados da Busca",
  "ouvidoria": "Ouvidoria",
  "dados-abertos": "Dados Abertos",
  "balancete": "Balancete",
  "balanco": "Balanço Anual",
  "rreo-rgf": "RREO / RGF",
  "diarias": "Diárias e Passagens",
  "convenios": "Convênios",
  "emendas": "Emendas Parlamentares",
  "controle-interno": "Controle Interno",
  "lei": "Lei",
  "decreto": "Decreto",
  "portaria": "Portaria",
  "resolucao": "Resolução",
};

export function Breadcrumb() {
  const [location] = useLocation();

  // Don't show on homepage
  if (location === "/" || location === "") return null;

  const parts = location.replace(/^\//, "").split("/").filter(Boolean);
  const crumbs = parts.map((part, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const label = ROUTE_LABELS[part] ?? decodeURIComponent(part).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const isLast = idx === parts.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Você está em"
      className="bg-muted/50 border-b border-border"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <ol
          role="list"
          className="flex items-center flex-wrap gap-1 text-xs text-muted-foreground"
        >
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none focus:text-primary focus:underline rounded"
              aria-label="Início"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Início</span>
            </Link>
          </li>

          {crumbs.map(({ href, label, isLast }) => (
            <li key={href} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground truncate max-w-[200px] capitalize"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-primary transition-colors focus:outline-none focus:text-primary focus:underline capitalize truncate max-w-[160px]"
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
