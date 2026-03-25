import { Link } from "wouter";
import { CalendarDays, ArrowRight, Newspaper } from "lucide-react";
import { useListNoticias } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

function SkeletonMain() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-border bg-card">
      <div className="h-64 sm:h-80 bg-muted" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-6 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse flex gap-3 border-b border-border pb-4">
      <div className="w-24 h-20 bg-muted rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </div>
  );
}

const CAT_COLORS: Record<string, string> = {
  educacao: "bg-blue-100 text-blue-700",
  saude: "bg-green-100 text-green-700",
  obras: "bg-orange-100 text-orange-700",
  concursos: "bg-purple-100 text-purple-700",
  social: "bg-pink-100 text-pink-700",
  financeiro: "bg-yellow-100 text-yellow-700",
  turismo: "bg-teal-100 text-teal-700",
};

function catColor(cat: string) {
  return CAT_COLORS[cat.toLowerCase()] ?? "bg-primary/10 text-primary";
}

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

export function NewsSection() {
  const { data, isLoading } = useListNoticias({ limit: 4, destaque: true });
  const noticias = data?.data ?? [];

  return (
    <section aria-labelledby="noticias-heading" className="py-14 sm:py-20 bg-muted/40 border-y border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">Comunicação Oficial</p>
            <h2 id="noticias-heading" className="text-2xl sm:text-3xl font-black text-foreground font-serif">
              Notícias em Destaque
            </h2>
            <div className="w-12 h-1.5 bg-primary rounded-full mt-2" aria-hidden="true" />
          </div>
          <Link
            href="/noticias"
            className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline focus:outline-none focus:underline text-sm"
          >
            Ver todas as notícias <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Notícia principal — desktop esquerda */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <SkeletonMain />
            ) : noticias[0] ? (
              <Link
                href={`/noticias/${noticias[0].slug}`}
                className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={noticias[0].imagemCapa ?? PLACEHOLDER_IMG}
                    alt={noticias[0].titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
                  <span className={cn("absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide", catColor(noticias[0].categoria))}>
                    {noticias[0].categoria}
                  </span>
                </div>
                <div className="p-6">
                  <time
                    dateTime={noticias[0].dataPublicacao}
                    className="flex items-center gap-2 text-xs text-muted-foreground mb-3"
                  >
                    <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                    {formatDate(noticias[0].dataPublicacao)}
                  </time>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                    {noticias[0].titulo}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">
                    {noticias[0].resumo}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                    Leia mais <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-border bg-card text-muted-foreground gap-3">
                <Newspaper className="w-10 h-10 opacity-30" aria-hidden="true" />
                <p>Nenhuma notícia em destaque no momento.</p>
              </div>
            )}
          </div>

          {/* 3 notícias secundárias — desktop direita */}
          <div className="lg:col-span-5">
            <ul className="space-y-0 divide-y divide-border" role="list">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <li key={i} className="py-4 first:pt-0"><SkeletonCard /></li>)
              ) : noticias.slice(1, 4).map((noticia) => (
                <li key={noticia.id} className="py-4 first:pt-0 last:pb-0">
                  <Link
                    href={`/noticias/${noticia.slug}`}
                    className="group flex gap-4 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
                  >
                    <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={noticia.imagemCapa ?? PLACEHOLDER_IMG}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-1", catColor(noticia.categoria))}>
                        {noticia.categoria}
                      </span>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {noticia.titulo}
                      </h3>
                      <time dateTime={noticia.dataPublicacao} className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" aria-hidden="true" />
                        {formatDate(noticia.dataPublicacao)}
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {!isLoading && noticias.length > 0 && (
              <div className="mt-6">
                <Link
                  href="/noticias"
                  className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary/5 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm"
                >
                  <Newspaper className="w-4 h-4" aria-hidden="true" />
                  Ver todas as notícias
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
