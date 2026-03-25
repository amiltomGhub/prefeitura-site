import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListLegislacao } from "@workspace/api-client-react";
import type { ListLegislacaoTipo } from "@workspace/api-client-react";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { cn } from "@/lib/utils";
import { BookOpen, Search, Download, FileDown, ChevronLeft, ChevronRight, Tag } from "lucide-react";

const TIPOS: Array<{ value: ListLegislacaoTipo | ""; label: string; color: string }> = [
  { value: "", label: "Todos", color: "bg-muted text-muted-foreground" },
  { value: "lei", label: "Lei", color: "bg-blue-100 text-blue-700" },
  { value: "decreto", label: "Decreto", color: "bg-purple-100 text-purple-700" },
  { value: "portaria", label: "Portaria", color: "bg-orange-100 text-orange-700" },
  { value: "resolucao", label: "Resolução", color: "bg-green-100 text-green-700" },
  { value: "instrucao-normativa", label: "Instrução Normativa", color: "bg-teal-100 text-teal-700" },
];

const CURRENT_YEAR = new Date().getFullYear();

function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const csv = [headers.join(";"), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";"))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function Legislacao() {
  const [page, setPage] = useState(1);
  const [tipo, setTipo] = useState<ListLegislacaoTipo | "">("");
  const [ano, setAno] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListLegislacao({
    tipo: tipo || undefined,
    ano,
    q: search.trim() || undefined,
    page,
    limit: 15,
  });

  const legislacoes = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleExportCsv = useCallback(() => {
    exportCsv(legislacoes.map(l => ({
      Número: l.numero,
      Tipo: l.tipo,
      Ano: l.ano,
      "Data Publicação": new Date(l.dataPublicacao).toLocaleDateString("pt-BR"),
      Ementa: l.ementa,
      Tags: l.tags?.join(", ") ?? "",
    })), `legislacao-parauapebas${tipo ? `-${tipo}` : ""}${ano ? `-${ano}` : ""}.csv`);
  }, [legislacoes, tipo, ano]);

  function tipoColor(t: string) {
    return TIPOS.find(x => x.value === t)?.color ?? "bg-muted text-muted-foreground";
  }

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Atos Normativos e Legislação"
        subtitle="Consulte leis, decretos, portarias, resoluções e instruções normativas. Busca por número, data, tipo e ementa."
        icon={BookOpen}
        breadcrumbs={[{ label: "Legislação" }]}
        laiRef="LAI, Art. 8°, §1°, I"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Type tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filtrar por tipo de ato normativo">
          {TIPOS.map(({ value, label, color }) => (
            <button
              key={value}
              role="tab"
              aria-selected={tipo === value}
              onClick={() => { setTipo(value as ListLegislacaoTipo | ""); setPage(1); }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/20",
                tipo === value
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-background border-border hover:border-primary/40 text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-end">
          <div>
            <label htmlFor="leg-ano" className="block text-xs font-semibold text-muted-foreground mb-1">Ano</label>
            <select id="leg-ano" value={ano ?? ""} onChange={e => { setAno(e.target.value ? +e.target.value : undefined); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              <option value="">Todos</option>
              {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="relative flex-1 min-w-64">
            <label htmlFor="leg-search" className="block text-xs font-semibold text-muted-foreground mb-1">Busca por número ou ementa</label>
            <Search className="absolute left-3 bottom-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input id="leg-search" type="search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Ex: Decreto 1234 ou 'saúde'..." className="pl-9 pr-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-full" />
          </div>
          <button onClick={handleExportCsv} disabled={legislacoes.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-bold text-sm rounded-xl hover:bg-secondary/90 disabled:opacity-50 transition-colors">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
          </button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {total.toLocaleString("pt-BR")} ato{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>

        {/* List */}
        {isLoading ? (
          <ul className="space-y-3">
            {Array(8).fill(0).map((_, i) => (
              <li key={i} className="animate-pulse bg-card border border-border rounded-2xl p-5">
                <div className="flex gap-4">
                  <div className="w-16 h-10 bg-muted rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : legislacoes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="text-sm">Nenhum ato normativo encontrado.</p>
          </div>
        ) : (
          <ul className="space-y-3" role="list" aria-label="Lista de atos normativos">
            {legislacoes.map(l => (
              <li key={l.id}>
                <article className="group flex gap-4 p-5 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all">
                  {/* Number badge */}
                  <div className="flex-shrink-0 text-center min-w-20">
                    <div className={cn("inline-flex flex-col items-center px-3 py-2 rounded-xl text-xs font-bold", tipoColor(l.tipo))}>
                      <span className="text-[10px] uppercase tracking-wide opacity-70">{l.tipo}</span>
                      <span className="text-base font-black">{l.numero}</span>
                      <span className="text-[10px] opacity-70">{l.ano}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {l.ementa}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        Publicado em: {new Date(l.dataPublicacao).toLocaleDateString("pt-BR")}
                      </span>
                      {l.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                          <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {l.arquivoPdf && (
                    <a href={l.arquivoPdf} target="_blank" rel="noopener noreferrer" download
                      className="flex-shrink-0 self-center flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Baixar ${l.tipo} ${l.numero}/${l.ano}`}>
                      <FileDown className="w-3.5 h-3.5" aria-hidden="true" /> PDF
                    </a>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-muted-foreground">Página {page} de {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted disabled:opacity-40" aria-label="Anterior">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-mono px-3">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted disabled:opacity-40" aria-label="Próxima">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
