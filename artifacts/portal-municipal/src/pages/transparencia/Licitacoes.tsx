import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListLicitacoes, useGetLicitacao } from "@workspace/api-client-react";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { formatCurrency, cn } from "@/lib/utils";
import { FileText, Search, Download, ChevronLeft, ChevronRight, X, FileDown, Eye, Clock, CheckCircle, AlertCircle, XCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT_YEAR = new Date().getFullYear();
const MODALIDADES = ["", "Pregão Eletrônico", "Pregão Presencial", "Tomada de Preços", "Convite", "Concorrência", "Dispensa", "Inexigibilidade", "RDC"];
const SITUACOES = ["", "Aberta", "Em andamento", "Encerrada", "Homologada", "Anulada", "Revogada", "Deserta", "Fracassada"];

function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const csv = [headers.join(";"), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";"))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ComponentType<{className?: string}> }> = {
  "Aberta": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  "Em andamento": { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  "Encerrada": { bg: "bg-zinc-100", text: "text-zinc-600", icon: XCircle },
  "Homologada": { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle },
  "Anulada": { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
  "Revogada": { bg: "bg-orange-100", text: "text-orange-700", icon: AlertTriangle },
  "Deserta": { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertTriangle },
  "Fracassada": { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
};

function StatusBadge({ situacao }: { situacao: string }) {
  const style = STATUS_STYLES[situacao] ?? { bg: "bg-muted", text: "text-muted-foreground", icon: AlertCircle };
  const Icon = style.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold", style.bg, style.text)}>
      <Icon className="w-3 h-3" aria-hidden="true" />
      {situacao}
    </span>
  );
}

function DetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, isLoading } = useGetLicitacao(id);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Detalhes da licitação"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-bold text-lg text-foreground">Detalhes da Licitação</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Fechar">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-5 bg-muted rounded" />)}
            </div>
          ) : data ? (
            <dl className="space-y-4">
              {[
                { term: "Número", value: data.numero },
                { term: "Modalidade", value: data.modalidade },
                { term: "Situação", value: <StatusBadge situacao={data.situacao} /> },
                { term: "Secretaria", value: data.secretaria ?? "—" },
                { term: "Objeto", value: data.objeto },
                { term: "Descrição", value: data.descricao ?? "—" },
                { term: "Valor Estimado", value: data.valorEstimado ? formatCurrency(data.valorEstimado) : "Sigilo" },
                { term: "Valor Homologado", value: data.valorHomologado ? formatCurrency(data.valorHomologado) : "—" },
                { term: "Data de Abertura", value: data.dataAbertura ? new Date(data.dataAbertura).toLocaleDateString("pt-BR") : "—" },
                { term: "Data de Encerramento", value: data.dataEncerrramento ? new Date(data.dataEncerrramento).toLocaleDateString("pt-BR") : "—" },
              ].map(({ term, value }) => (
                <div key={term} className="flex gap-4 py-2 border-b border-border last:border-0">
                  <dt className="w-36 flex-shrink-0 text-sm font-semibold text-muted-foreground">{term}</dt>
                  <dd className="flex-1 text-sm text-foreground">{value}</dd>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                {data.edital && (
                  <a href={data.edital} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                    <FileDown className="w-4 h-4" aria-hidden="true" /> Baixar Edital
                  </a>
                )}
                {data.ata && (
                  <a href={data.ata} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-border font-bold text-sm rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                    <Eye className="w-4 h-4" aria-hidden="true" /> Ver Ata de Resultado
                  </a>
                )}
              </div>
            </dl>
          ) : (
            <p className="text-muted-foreground text-center py-8">Licitação não encontrada.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Licitacoes() {
  const [page, setPage] = useState(1);
  const [ano, setAno] = useState(CURRENT_YEAR);
  const [modalidade, setModalidade] = useState("");
  const [situacao, setSituacao] = useState("");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, isLoading } = useListLicitacoes({
    page, limit: 12, ano,
    modalidade: modalidade || undefined,
    situacao: situacao || undefined,
  });

  const licitacoes = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filtered = useMemo(() =>
    licitacoes.filter(l =>
      !search.trim() ||
      l.numero.toLowerCase().includes(search.toLowerCase()) ||
      l.objeto.toLowerCase().includes(search.toLowerCase()) ||
      (l.secretaria?.toLowerCase().includes(search.toLowerCase()) ?? false)
    ), [licitacoes, search]);

  const handleExportCsv = useCallback(() => {
    exportCsv(filtered.map(l => ({
      Número: l.numero, Objeto: l.objeto, Modalidade: l.modalidade,
      Situação: l.situacao, Secretaria: l.secretaria ?? "",
      "Valor Estimado": l.valorEstimado ? formatCurrency(l.valorEstimado) : "",
      "Data Abertura": l.dataAbertura ? new Date(l.dataAbertura).toLocaleDateString("pt-BR") : "",
    })), `licitacoes-parauapebas-${ano}.csv`);
  }, [filtered, ano]);

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Licitações e Contratos"
        subtitle="Editais, pregões, dispensas e contratos. Publicação obrigatória conforme LAI, Art. 8°, §1°, IV."
        icon={FileText}
        breadcrumbs={[{ label: "Licitações" }]}
        laiRef="LAI, Art. 8°, §1°, IV — Lei 8.666/93 — Lei 14.133/21"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: total },
            { label: "Abertas", value: licitacoes.filter(l => l.situacao === "Aberta").length },
            { label: "Em Andamento", value: licitacoes.filter(l => l.situacao === "Em andamento").length },
            { label: "Homologadas", value: licitacoes.filter(l => l.situacao === "Homologada").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="font-black text-2xl text-foreground tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-end">
          <div>
            <label htmlFor="lic-ano" className="block text-xs font-semibold text-muted-foreground mb-1">Ano</label>
            <select id="lic-ano" value={ano} onChange={e => { setAno(+e.target.value); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lic-modalidade" className="block text-xs font-semibold text-muted-foreground mb-1">Modalidade</label>
            <select id="lic-modalidade" value={modalidade} onChange={e => { setModalidade(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              {MODALIDADES.map(m => <option key={m} value={m}>{m || "Todas"}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lic-situacao" className="block text-xs font-semibold text-muted-foreground mb-1">Situação</label>
            <select id="lic-situacao" value={situacao} onChange={e => { setSituacao(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary">
              {SITUACOES.map(s => <option key={s} value={s}>{s || "Todas"}</option>)}
            </select>
          </div>
          <div className="relative flex-1 min-w-48">
            <label htmlFor="lic-search" className="block text-xs font-semibold text-muted-foreground mb-1">Busca</label>
            <Search className="absolute left-3 bottom-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input id="lic-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Número, objeto, secretaria..." className="pl-9 pr-3 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary w-full" />
          </div>
          <button onClick={handleExportCsv} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-bold text-sm rounded-xl hover:bg-secondary/90 disabled:opacity-50 transition-colors">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tabela de licitações municipais">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Nº</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Objeto</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Modalidade</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Situação</th>
                  <th scope="col" className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Valor Est.</th>
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Abertura</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(7).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded" /></td>)}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Nenhuma licitação encontrada.</td></tr>
                ) : filtered.map(l => (
                  <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">{l.numero}</td>
                    <td className="px-4 py-3 max-w-xs"><p className="text-xs text-foreground line-clamp-2">{l.objeto}</p></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell whitespace-nowrap">{l.modalidade}</td>
                    <td className="px-4 py-3"><StatusBadge situacao={l.situacao} /></td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-foreground tabular-nums hidden md:table-cell">
                      {l.valorEstimado ? formatCurrency(l.valorEstimado) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap font-mono">
                      {l.dataAbertura ? new Date(l.dataAbertura).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDetailId(l.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label={`Ver detalhes da licitação ${l.numero}`}>
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Detalhes
                        </button>
                        {l.edital && (
                          <a href={l.edital} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={`Baixar edital da licitação ${l.numero}`}>
                            <FileDown className="w-3.5 h-3.5" aria-hidden="true" /> Edital
                          </a>
                        )}
                      </div>
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

      <AnimatePresence>
        {detailId && <DetailModal id={detailId} onClose={() => setDetailId(null)} />}
      </AnimatePresence>
    </Layout>
  );
}
