import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, CmsPageHeader, StatusBadge } from "@/components/cms/CmsCard";
import { CalendarDays, Plus, Pencil, Trash2, MapPin, Clock, Search, Tag } from "lucide-react";

const EVENTOS = [
  { id: "e1", titulo: "Semana do Meio Ambiente 2026", data: "2026-06-01", hora: "09:00", local: "Parque Natural do Carajás", categoria: "Meio Ambiente", status: "agendado" as const },
  { id: "e2", titulo: "Feira do Empreendedor Municipal", data: "2026-04-12", hora: "08:00", local: "Centro de Convenções de Parauapebas", categoria: "Economia", status: "agendado" as const },
  { id: "e3", titulo: "Vacinação contra Gripe — Dia D", data: "2026-04-05", hora: "07:00", local: "UBSs e Posto Central", categoria: "Saúde", status: "agendado" as const },
  { id: "e4", titulo: "Aniversário de Parauapebas — 38 anos", data: "2026-05-27", hora: "19:00", local: "Praça Cívica", categoria: "Institucional", status: "agendado" as const },
  { id: "e5", titulo: "Audiência Pública — LDO 2027", data: "2026-03-15", hora: "14:00", local: "Câmara Municipal", categoria: "Governo", status: "publicado" as const },
];

export default function CmsAgenda() {
  const [search, setSearch] = useState("");
  const filtered = EVENTOS.filter(e => !search || e.titulo.toLowerCase().includes(search.toLowerCase()));

  return (
    <CmsLayout
      title="Agenda"
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Novo Evento
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar evento..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>
        <div className="space-y-3">
          {filtered.map(ev => (
            <div key={ev.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-lg font-black text-primary">{new Date(ev.data).getDate()}</span>
                <span className="text-[10px] font-bold text-primary/70 uppercase">{new Date(ev.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-200 text-sm">{ev.titulo}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{ev.hora}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" />{ev.local}</span>
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" aria-hidden="true" />{ev.categoria}</span>
                </div>
              </div>
              <StatusBadge status={ev.status} />
              <div className="flex gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10" aria-label="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10" aria-label="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CmsLayout>
  );
}
