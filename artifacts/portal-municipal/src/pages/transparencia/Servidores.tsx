import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListServidores } from "@workspace/api-client-react";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { formatCurrency, cn } from "@/lib/utils";
import { Users, Search, Download, ChevronLeft, ChevronRight, Info, Shield } from "lucide-react";

function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const csv = [headers.join(";"), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";"))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

const VINCULOS = ["", "Efetivo", "Comissionado", "Temporário", "CLT", "Estagiário"];

export default function Servidores() {
  const [page, setPage] = useState(1);
  const [secretaria, setSecretaria] = useState("");
  const [nome, setNome] = useState("");
  const [vinculo, setVinculo] = useState("");

  const { data, isLoading } = useListServidores({
    page, limit: 15,
    secretaria: secretaria || undefined,
    nome: nome || undefined,
  });

  const servidores = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filtered = useMemo(() =>
    servidores.filter(s =>
      !vinculo || s.vinculo === vinculo
    ), [servidores, vinculo]);

  const handleExportCsv = useCallback(() => {
    exportCsv(filtered.map(s => ({
      Nome: s.nome,
      Cargo: s.cargo,
      Secretaria: s.secretaria,
      Vínculo: s.vinculo,
      Admissão: s.admissao ? new Date(s.admissao).toLocaleDateString("pt-BR") : "",
      "Remuneração Bruta": s.remuneracao ? formatCurrency(s.remuneracao) : "Não informado",
    })), `servidores-parauapebas.csv`);
  }, [filtered]);

  const totalFolha = filtered.reduce((s, srv) => s + (srv.remuneracao ?? 0), 0);

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Servidores e Folha de Pagamento"
        subtitle="Relação de servidores públicos, cargos, vínculos e remunerações. Dados publicados por obrigação legal (LAI, Art. 8°, §1°, VI)."
        icon={Users}
        breadcrumbs={[{ label: "Servidores" }]}
        laiRef="LAI, Art. 8°, §1°, VI — Art. 7°, §3°"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* LGPD notice */}
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-8">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-blue-800">
            <strong>Aviso LGPD:</strong> Os dados pessoais dos servidores são publicados em cumprimento à obrigação legal prevista no
            Art. 7°, §3°, II da Lei 12.527/2011 (LAI), sendo base legal da LGPD (Lei 13.709/2018) o Art. 7°, II (cumprimento de obrigação legal ou regulatória).
            Dados sensíveis como CPF, endereço e dados bancários são omitidos.
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total de Servidores", value: total.toLocaleString("pt-BR") },
            { label: "Efetivos", value: servidores.filter(s => s.vinculo === "Efetivo").length.toLocaleString("pt-BR") },
            { label: "Comissionados", value: servidores.filter(s => s.vinculo === "Comissionado").length.toLocaleString("pt-BR") },
            { label: "Soma da Folha (pág.)", value: formatCurrency(totalFolha) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="font-black text-lg text-foreground tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-end">
          <div className="relative flex-1 min-w-48">
            <label htmlFor="srv-nome" className="block text-xs font-semibold text-muted-foreground mb-1">Buscar por nome</label>
            <Search className="absolute left-3 bottom-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input id="srv-nome" type="search" value={nome} onChange={e => { setNome(e.target.value); setPage(1); }}
              placeholder="Nome do servidor..." className="pl-9 pr-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-full" />
          </div>
          <div>
            <label htmlFor="srv-sec" className="block text-xs font-semibold text-muted-foreground mb-1">Secretaria</label>
            <input id="srv-sec" type="text" value={secretaria} onChange={e => { setSecretaria(e.target.value); setPage(1); }}
              placeholder="Ex: Saúde..." className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-36" />
          </div>
          <div>
            <label htmlFor="srv-vinculo" className="block text-xs font-semibold text-muted-foreground mb-1">Vínculo</label>
            <select id="srv-vinculo" value={vinculo} onChange={e => setVinculo(e.target.value)}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              {VINCULOS.map(v => <option key={v} value={v}>{v || "Todos"}</option>)}
            </select>
          </div>
          <button onClick={handleExportCsv} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-bold text-sm rounded-xl hover:bg-secondary/90 disabled:opacity-50 transition-colors">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Relação de servidores municipais">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Nome</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Cargo</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Secretaria</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Vínculo</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Admissão</th>
                  <th scope="col" className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Remuneração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(6).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded" /></td>)}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhum servidor encontrado.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-sm text-foreground">{s.nome}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{s.cargo}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{s.secretaria}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-bold",
                        s.vinculo === "Efetivo" ? "bg-blue-100 text-blue-700" :
                        s.vinculo === "Comissionado" ? "bg-orange-100 text-orange-700" :
                        "bg-muted text-muted-foreground"
                      )}>{s.vinculo}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden lg:table-cell">
                      {s.admissao ? new Date(s.admissao).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-sm tabular-nums">
                      {s.remuneracao ? (
                        <span className="text-foreground">{formatCurrency(s.remuneracao)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Não informado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Página {page} de {totalPages} — {total.toLocaleString("pt-BR")} servidores</p>
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
