import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, KpiCard, StatusBadge } from "@/components/cms/CmsCard";
import { FileSignature, Plus, Pencil, Trash2, Search, Eye, Upload, AlertCircle, CheckCircle, Clock } from "lucide-react";

const LICITACOES = [
  { id: "lc1", numero: "001/2026", modalidade: "Pregão Eletrônico", objeto: "Aquisição de medicamentos — Lote 1 — SESAU 2026", valor: "R$ 2.847.000,00", status: "publicado" as const, dataAbertura: "2026-04-10" },
  { id: "lc2", numero: "002/2026", modalidade: "Concorrência", objeto: "Obras de pavimentação — Av. Carajás — Trecho 3", valor: "R$ 12.400.000,00", status: "publicado" as const, dataAbertura: "2026-05-03" },
  { id: "lc3", numero: "003/2026", modalidade: "Pregão Eletrônico", objeto: "Serviços de limpeza e conservação dos prédios municipais", valor: "R$ 980.000,00", status: "rascunho" as const, dataAbertura: "" },
  { id: "lc4", numero: "004/2026", modalidade: "Dispensa", objeto: "Aquisição de materiais de escritório — Emergencial", valor: "R$ 45.000,00", status: "publicado" as const, dataAbertura: "2026-03-20" },
];

export default function CmsLicitacoesCms() {
  const [search, setSearch] = useState("");
  const filtered = LICITACOES.filter(l => !search || l.objeto.toLowerCase().includes(search.toLowerCase()) || l.numero.includes(search));

  return (
    <CmsLayout
      title="Gestão de Licitações"
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Nova Licitação
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Total" value={LICITACOES.length} icon={FileSignature} color="blue" />
          <KpiCard label="Publicadas" value={LICITACOES.filter(l => l.status === "publicado").length} icon={CheckCircle} color="green" />
          <KpiCard label="Rascunhos" value={LICITACOES.filter(l => l.status === "rascunho").length} icon={Clock} color="default" />
          <KpiCard label="Alertas" value={0} icon={AlertCircle} color="yellow" />
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar licitação..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>
        <CmsCard padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de licitações">
              <thead className="border-b border-white/10 bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Número</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Objeto</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Modalidade</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Valor</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{l.numero}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300 max-w-xs line-clamp-2">{l.objeto}</td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs px-2 py-1 bg-white/5 rounded-lg text-zinc-400">{l.modalidade}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs font-bold text-zinc-400 tabular-nums">{l.valor}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10" aria-label="Ver"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10" aria-label="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10" aria-label="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CmsCard>
      </div>
    </CmsLayout>
  );
}
