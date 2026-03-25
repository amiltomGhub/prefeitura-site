import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListDespesas } from "@workspace/api-client-react";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { formatCurrency, cn } from "@/lib/utils";
import { TrendingDown, Search, Download, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const CURRENT_YEAR = new Date().getFullYear();

function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const csv = [
    headers.join(";"),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";"))
  ].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Despesas() {
  const [page, setPage] = useState(1);
  const [ano, setAno] = useState(CURRENT_YEAR);
  const [mes, setMes] = useState<number | undefined>(undefined);
  const [secretaria, setSecretaria] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListDespesas({ page, limit: 15, ano, mes, secretaria: secretaria || undefined });
  const despesas = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleExportCsv = useCallback(() => {
    const rows = despesas.map(d => ({
      Data: d.data ? new Date(d.data).toLocaleDateString("pt-BR") : "",
      Descrição: d.descricao,
      Secretaria: d.secretaria,
      Categoria: d.categoria,
      Valor: formatCurrency(d.valor),
      Beneficiário: d.beneficiario ?? "",
    }));
    exportCsv(rows, `despesas-parauapebas-${ano}${mes ? `-${mes}` : ""}.csv`);
  }, [despesas, ano, mes]);

  const filtered = useMemo(() =>
    despesas.filter(d =>
      !search.trim() ||
      d.descricao.toLowerCase().includes(search.toLowerCase()) ||
      d.secretaria.toLowerCase().includes(search.toLowerCase()) ||
      (d.beneficiario?.toLowerCase().includes(search.toLowerCase()) ?? false)
    ),
    [despesas, search]
  );

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Despesas Públicas"
        subtitle="Acompanhe os empenhos, liquidações e pagamentos do município. Publicação obrigatória conforme LAI, Art. 8°, §1°, III."
        icon={TrendingDown}
        breadcrumbs={[{ label: "Despesas" }]}
        laiRef="LAI, Art. 8°, §1°, III — Decreto 7.185/2010"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-end" role="search" aria-label="Filtros de despesas">
          <div>
            <label htmlFor="desp-ano" className="block text-xs font-semibold text-muted-foreground mb-1">Ano</label>
            <select id="desp-ano" value={ano} onChange={e => { setAno(+e.target.value); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="desp-mes" className="block text-xs font-semibold text-muted-foreground mb-1">Mês</label>
            <select id="desp-mes" value={mes ?? ""} onChange={e => { setMes(e.target.value ? +e.target.value : undefined); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              <option value="">Todos</option>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="desp-sec" className="block text-xs font-semibold text-muted-foreground mb-1">Secretaria</label>
            <input id="desp-sec" type="text" value={secretaria} onChange={e => { setSecretaria(e.target.value); setPage(1); }}
              placeholder="Ex: Saúde..." className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-40" />
          </div>
          <div className="relative flex-1 min-w-48">
            <label htmlFor="desp-search" className="block text-xs font-semibold text-muted-foreground mb-1">Busca</label>
            <Search className="absolute left-3 bottom-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input id="desp-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Descrição, beneficiário..." className="pl-9 pr-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-full" />
          </div>
          <button onClick={handleExportCsv} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-bold text-sm rounded-xl hover:bg-secondary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-4 focus:ring-secondary/30"
            aria-label="Exportar lista como CSV">
            <Download className="w-4 h-4" aria-hidden="true" />
            Exportar CSV
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total de Registros", value: total.toLocaleString("pt-BR"), sub: null },
            { label: "Total Filtrado", value: filtered.length.toLocaleString("pt-BR"), sub: "nesta página" },
            { label: "Soma da Página", value: formatCurrency(filtered.reduce((s, d) => s + d.valor, 0)), sub: null },
            { label: "Maior Empenho", value: filtered.length ? formatCurrency(Math.max(...filtered.map(d => d.valor))) : "—", sub: null },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="font-black text-lg text-foreground">{value}</p>
              {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tabela de despesas municipais">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Data</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Descrição</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Secretaria</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Categoria</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Beneficiário</th>
                  <th scope="col" className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(6).fill(0).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">Nenhuma despesa encontrada.</td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {d.data ? new Date(d.data).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-foreground line-clamp-2 text-xs leading-relaxed">{d.descricao}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{d.secretaria}</td>
                    <td className="px-4 py-3 text-xs hidden sm:table-cell">
                      <span className="px-2 py-1 bg-muted rounded-lg font-medium text-foreground">{d.categoria}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell max-w-32 truncate">{d.beneficiario ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-black text-sm text-foreground whitespace-nowrap tabular-nums">
                      {formatCurrency(d.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} — {total.toLocaleString("pt-BR")} registros
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted disabled:opacity-40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Página anterior">
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn("w-9 h-9 rounded-xl text-sm font-bold border transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                      p === page ? "bg-primary text-white border-primary" : "border-border hover:bg-muted")}
                    aria-label={`Ir para página ${p}`} aria-current={p === page ? "page" : undefined}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted disabled:opacity-40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Próxima página">
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
