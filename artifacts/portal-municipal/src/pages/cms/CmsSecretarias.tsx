import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, StatusBadge } from "@/components/cms/CmsCard";
import { Building2, Plus, Pencil, Trash2, Search, Phone, Mail, Globe } from "lucide-react";

const SECRETARIAS = [
  { id: "sec1", sigla: "SESAU", nome: "Secretaria Municipal de Saúde", titular: "Dr. Rafael Mendes", email: "sesau@parauapebas.pa.gov.br", fone: "(94) 3183-2100", status: "publicado" as const },
  { id: "sec2", sigla: "SEMED", nome: "Secretaria Municipal de Educação", titular: "Profª. Juliana Torres", email: "semed@parauapebas.pa.gov.br", fone: "(94) 3183-2200", status: "publicado" as const },
  { id: "sec3", sigla: "SEMOSP", nome: "Secretaria de Obras e Serviços Públicos", titular: "Eng. Roberto Farias", email: "semosp@parauapebas.pa.gov.br", fone: "(94) 3183-2300", status: "publicado" as const },
  { id: "sec4", sigla: "SEFAZ", nome: "Secretaria Municipal de Fazenda", titular: "Pedro Barros", email: "sefaz@parauapebas.pa.gov.br", fone: "(94) 3183-2400", status: "publicado" as const },
  { id: "sec5", sigla: "SEMIN", nome: "Secretaria de Meio Ambiente e Infraestrutura", titular: "Biól. Luciana Santos", email: "semin@parauapebas.pa.gov.br", fone: "(94) 3183-2500", status: "publicado" as const },
  { id: "sec6", sigla: "SEGOV", nome: "Secretaria de Governo", titular: "Carlos Andrade", email: "segov@parauapebas.pa.gov.br", fone: "(94) 3183-2600", status: "publicado" as const },
];

export default function CmsSecretarias() {
  const [search, setSearch] = useState("");
  const filtered = SECRETARIAS.filter(s => !search || s.nome.toLowerCase().includes(search.toLowerCase()) || s.sigla.includes(search.toUpperCase()));

  return (
    <CmsLayout
      title="Gestão de Secretarias"
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Nova Secretaria
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar secretaria..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(sec => (
            <div key={sec.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-black text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-lg">{sec.sigla}</span>
                  <h3 className="font-semibold text-zinc-200 text-sm mt-2 leading-tight">{sec.nome}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Titular: {sec.titular}</p>
                </div>
                <StatusBadge status={sec.status} />
              </div>
              <div className="space-y-1.5 border-t border-white/5 pt-3">
                <a href={`mailto:${sec.email}`} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" /> {sec.email}
                </a>
                <span className="flex items-center gap-2 text-xs text-zinc-500">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" /> {sec.fone}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-400 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" /> Editar
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 border border-white/5 rounded-lg hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CmsLayout>
  );
}
