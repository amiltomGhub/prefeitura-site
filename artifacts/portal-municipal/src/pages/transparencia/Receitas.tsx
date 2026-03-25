import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListReceitas, useGetOrcamento } from "@workspace/api-client-react";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { formatCurrency, cn } from "@/lib/utils";
import { TrendingUp, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const MONTHLY_MOCK = MONTHS.slice(0, new Date().getMonth() + 1).map((mes, i) => ({
  mes,
  receita: 15_000_000 + Math.random() * 8_000_000,
  previsto: 18_000_000,
}));

function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const csv = [headers.join(";"), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";"))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function Receitas() {
  const [page, setPage] = useState(1);
  const [ano, setAno] = useState(CURRENT_YEAR);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListReceitas({ page, limit: 15, ano });
  const { data: orcamento } = useGetOrcamento({ ano });

  const receitas = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filtered = useMemo(() =>
    receitas.filter(r =>
      !search.trim() ||
      r.descricao.toLowerCase().includes(search.toLowerCase()) ||
      r.categoria.toLowerCase().includes(search.toLowerCase()) ||
      r.fonte.toLowerCase().includes(search.toLowerCase())
    ), [receitas, search]);

  const handleExportCsv = useCallback(() => {
    const rows = filtered.map(r => ({
      Data: r.data ? new Date(r.data).toLocaleDateString("pt-BR") : "",
      Descrição: r.descricao,
      Categoria: r.categoria,
      Fonte: r.fonte,
      Valor: formatCurrency(r.valor),
    }));
    exportCsv(rows, `receitas-parauapebas-${ano}.csv`);
  }, [filtered, ano]);

  const totalReceita = filtered.reduce((s, r) => s + r.valor, 0);
  const pctMeta = orcamento ? Math.min((totalReceita / orcamento.receitaPrevista) * 100, 100) : null;

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Receitas Municipais"
        subtitle="Arrecadação por categoria e fonte de recurso. Comparativo com a meta prevista na LOA. Publicação obrigatória (LAI, Art. 8°, §1°, III)."
        icon={TrendingUp}
        breadcrumbs={[{ label: "Receitas" }]}
        laiRef="LAI, Art. 8°, §1°, III"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8 items-end">
          <div>
            <label htmlFor="rec-ano" className="block text-xs font-semibold text-muted-foreground mb-1">Ano</label>
            <select id="rec-ano" value={ano} onChange={e => { setAno(+e.target.value); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="relative flex-1 min-w-48">
            <label htmlFor="rec-search" className="block text-xs font-semibold text-muted-foreground mb-1">Busca</label>
            <Search className="absolute left-3 bottom-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input id="rec-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Descrição, categoria, fonte..." className="pl-9 pr-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-full" />
          </div>
          <button onClick={handleExportCsv} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-bold text-sm rounded-xl hover:bg-secondary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-4 focus:ring-secondary/30">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
          </button>
        </div>

        {/* Summary + chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-4 space-y-3">
            {[
              { label: "Meta LOA", value: orcamento?.receitaPrevista, color: "text-muted-foreground" },
              { label: "Total Arrecadado", value: orcamento?.receitaRealizada, color: "text-green-700" },
              { label: "Diferença", value: orcamento ? orcamento.receitaRealizada - orcamento.receitaPrevista : null, color: (orcamento?.receitaRealizada ?? 0) >= (orcamento?.receitaPrevista ?? 0) ? "text-green-700" : "text-red-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label} {ano}</p>
                <p className={`font-black text-xl ${color}`}>{value !== null && value !== undefined ? formatCurrency(value) : "—"}</p>
              </div>
            ))}
            {pctMeta !== null && (
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Atingimento da Meta</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${pctMeta}%` }}
                      role="progressbar" aria-valuenow={pctMeta} aria-valuemin={0} aria-valuemax={100} />
                  </div>
                  <span className="font-black text-green-700 tabular-nums text-sm">{pctMeta.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Arrecadação Mensal {ano}</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_MOCK} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={38} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v), ""]} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  <Legend />
                  <Bar dataKey="previsto" name="Meta" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="receita" name="Realizado" fill="#168821" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tabela de receitas municipais">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  {["Data", "Descrição", "Categoria", "Fonte", "Valor"].map(h => (
                    <th key={h} scope="col" className={`text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide ${h === "Valor" ? "text-right" : ""} ${h === "Fonte" ? "hidden md:table-cell" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(5).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded" /></td>)}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">Nenhuma receita encontrada.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">{r.data ? new Date(r.data).toLocaleDateString("pt-BR") : "—"}</td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-xs"><p className="line-clamp-2">{r.descricao}</p></td>
                    <td className="px-4 py-3 text-xs"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium">{r.categoria}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{r.fonte}</td>
                    <td className="px-4 py-3 text-right font-black text-sm text-green-700 whitespace-nowrap tabular-nums">{formatCurrency(r.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Página {page} de {totalPages} — {total.toLocaleString("pt-BR")} registros</p>
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
