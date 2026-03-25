import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, StatusBadge } from "@/components/cms/CmsCard";
import { Briefcase, Plus, Pencil, Trash2, Eye, EyeOff, Search, GripVertical } from "lucide-react";

const SERVICOS = [
  { id: "s1", nome: "Nota Fiscal de Serviços Eletrônica (NFS-e)", categoria: "Fiscal", canal: "Online", status: "publicado" as const, destaque: true },
  { id: "s2", nome: "Alvarás e Licenças de Funcionamento", categoria: "Empresas", canal: "Presencial / Online", status: "publicado" as const, destaque: true },
  { id: "s3", nome: "Agendamento Médico pela Central 156", categoria: "Saúde", canal: "Telefone / App", status: "publicado" as const, destaque: true },
  { id: "s4", nome: "Certidão de Débitos Municipais", categoria: "Fiscal", canal: "Online", status: "publicado" as const, destaque: false },
  { id: "s5", nome: "Matrícula Escolar Municipal", categoria: "Educação", canal: "Online / Presencial", status: "publicado" as const, destaque: true },
  { id: "s6", nome: "Solicitação de Coleta de Entulho", categoria: "Serviços Urbanos", canal: "App / 156", status: "publicado" as const, destaque: false },
  { id: "s7", nome: "Programa de Habitação Popular", categoria: "Habitação", canal: "Presencial", status: "rascunho" as const, destaque: false },
];

export default function CmsServicos() {
  const [search, setSearch] = useState("");
  const filtered = SERVICOS.filter(s => !search || s.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <CmsLayout
      title="Gestão de Serviços"
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Novo Serviço
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar serviço..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>
        <CmsCard padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de serviços">
              <thead className="border-b border-white/10 bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Serviço</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Categoria</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Canal</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden xl:table-cell">Destaque</th>
                  <th scope="col" className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-200 text-sm">{s.nome}</td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs px-2 py-1 bg-white/5 rounded-lg text-zinc-400">{s.categoria}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-zinc-500">{s.canal}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className={`text-xs font-bold ${s.destaque ? "text-yellow-400" : "text-zinc-600"}`}>{s.destaque ? "★ Destaque" : "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
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
