import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Building2, Phone, Mail, ArrowRight, Search } from "lucide-react";
import { useListSecretarias } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

export function SecretariasSection() {
  const { data, isLoading } = useListSecretarias();
  const [filter, setFilter] = useState("");

  const secretarias = data?.data ?? [];

  const filtered = useMemo(() => {
    if (!filter.trim()) return secretarias.slice(0, 8);
    const q = filter.toLowerCase();
    return secretarias.filter(s =>
      s.nome.toLowerCase().includes(q) ||
      s.sigla.toLowerCase().includes(q) ||
      s.descricao.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [secretarias, filter]);

  return (
    <section aria-labelledby="secretarias-heading" className="py-14 sm:py-20 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">Estrutura Municipal</p>
            <h2 id="secretarias-heading" className="text-2xl sm:text-3xl font-black text-foreground">
              Secretarias Municipais
            </h2>
            <div className="w-12 h-1.5 bg-secondary rounded-full mt-2" aria-hidden="true" />
          </div>
          <Link
            href="/governo/secretarias"
            className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline focus:outline-none focus:underline text-sm"
          >
            Ver todas <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Inline search */}
        <div className="relative mb-8 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filtrar secretaria..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            aria-label="Filtrar secretarias"
            role="searchbox"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-2xl p-5 space-y-3">
                <div className="w-12 h-12 bg-muted rounded-xl" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p>Nenhuma secretaria encontrada para "<strong>{filter}</strong>".</p>
          </div>
        ) : (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Secretarias municipais">
            {filtered.map((sec) => (
              <li key={sec.id}>
                <article className="h-full flex flex-col bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Building2 className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wide">{sec.sigla}</p>
                      <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {sec.nome}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {sec.descricao}
                  </p>

                  {sec.secretario && (
                    <p className="text-xs text-foreground font-medium mb-3">
                      Sec.: <span className="text-muted-foreground">{sec.secretario}</span>
                    </p>
                  )}

                  <div className="space-y-1.5 mb-4">
                    {sec.telefone && (
                      <a
                        href={`tel:${sec.telefone.replace(/\D/g, "")}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                        aria-label={`Telefone: ${sec.telefone}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                        {sec.telefone}
                      </a>
                    )}
                    {sec.email && (
                      <a
                        href={`mailto:${sec.email}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline truncate"
                        aria-label={`E-mail: ${sec.email}`}
                      >
                        <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{sec.email}</span>
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/governo/secretarias/${sec.slug}`}
                    className="text-xs font-semibold text-primary hover:underline focus:outline-none focus:underline flex items-center gap-1 mt-auto"
                    aria-label={`Saiba mais sobre ${sec.nome}`}
                  >
                    Saiba mais <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}

        {secretarias.length > 8 && (
          <div className="mt-6 text-center">
            <Link
              href="/governo/secretarias"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm"
            >
              Ver todas as secretarias
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
