import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, StatusBadge } from "@/components/cms/CmsCard";
import { BookOpen, Plus, Upload, Pencil, Trash2, Download, Search, Filter } from "lucide-react";

const TIPOS = ["Lei", "Decreto", "Portaria", "Resolução", "Instrução Normativa"];

const ATOS = [
  { id: "l1", numero: "4.821/2026", tipo: "Lei", ementa: "Dispõe sobre o Plano Plurianual 2026-2029", data: "2026-01-02", status: "publicado" as const },
  { id: "l2", numero: "4.810/2025", tipo: "Lei", ementa: "Lei Orçamentária Anual para o exercício de 2025", data: "2025-12-28", status: "publicado" as const },
  { id: "l3", numero: "2.107/2026", tipo: "Decreto", ementa: "Estabelece normas para a política municipal de assistência social", data: "2026-02-15", status: "publicado" as const },
  { id: "l4", numero: "001/2026", tipo: "Portaria", ementa: "Designa servidor para Encarregado de Dados (LGPD)", data: "2026-01-08", status: "publicado" as const },
  { id: "l5", numero: "4.799/2025", tipo: "Lei", ementa: "Institui a Semana Municipal de Combate ao Racismo", data: "2025-11-10", status: "publicado" as const },
];

export default function CmsLegislacaoCms() {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const filtered = ATOS.filter(a =>
    (!search || a.ementa.toLowerCase().includes(search.toLowerCase()) || a.numero.includes(search)) &&
    (!tipo || a.tipo === tipo)
  );

  return (
    <CmsLayout
      title="Gestão de Legislação"
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Upload className="w-4 h-4" aria-hidden="true" /> Publicar Ato
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por número ou ementa..."
              className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
          </div>
          <select value={tipo} onChange={e => setTipo(e.target.value)}
            className="px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary">
            <option value="">Todos os tipos</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <CmsCard padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de atos legislativos">
              <thead className="border-b border-white/10 bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Número</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Tipo</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Ementa</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Data</th>
                  <th scope="col" className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(ato => (
                  <tr key={ato.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{ato.numero}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-white/5 rounded-lg text-zinc-400">{ato.tipo}</span></td>
                    <td className="px-4 py-3 text-xs text-zinc-300 max-w-sm">{ato.ementa}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-zinc-600 font-mono">{new Date(ato.data).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10" aria-label="Baixar PDF"><Download className="w-3.5 h-3.5" /></button>
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
