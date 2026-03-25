import { useState } from "react";
import { Link } from "wouter";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, CmsPageHeader, StatusBadge } from "@/components/cms/CmsCard";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Filter, Eye, Pencil, Trash2, Copy,
  Calendar, User, Tag, MoreVertical, ChevronLeft, ChevronRight,
  Newspaper, ArrowUpDown, ExternalLink
} from "lucide-react";

type Status = "publicado" | "rascunho" | "agendado" | "arquivado";

interface Noticia {
  id: string;
  titulo: string;
  status: Status;
  categoria: string;
  autor: string;
  dataPublicacao: string;
  views: number;
  secretaria: string;
  destaque: boolean;
}

const MOCK_NOTICIAS: Noticia[] = [
  { id: "1", titulo: "Prefeitura inaugura nova UBS no Bairro Rio Verde", status: "publicado", categoria: "Saúde", autor: "Ana Santos", dataPublicacao: "2026-03-25", views: 1847, secretaria: "SESAU", destaque: true },
  { id: "2", titulo: "Inscrições abertas para Concurso Público Municipal 2026", status: "publicado", categoria: "Concursos", autor: "Carlos Lima", dataPublicacao: "2026-03-24", views: 4231, secretaria: "Gabinete", destaque: false },
  { id: "3", titulo: "Semana do Meio Ambiente 2026 — confira a programação completa", status: "agendado", categoria: "Meio Ambiente", autor: "Ana Santos", dataPublicacao: "2026-04-01", views: 0, secretaria: "SEMIN", destaque: false },
  { id: "4", titulo: "Obras da Avenida dos Ipês são concluídas com 15 dias de antecedência", status: "publicado", categoria: "Obras", autor: "Pedro Melo", dataPublicacao: "2026-03-22", views: 2104, secretaria: "SEMOSP", destaque: true },
  { id: "5", titulo: "Prefeitura distribui 5.000 kits escolares para alunos da rede municipal", status: "publicado", categoria: "Educação", autor: "Maria Costa", dataPublicacao: "2026-03-21", views: 3982, secretaria: "SEMED", destaque: false },
  { id: "6", titulo: "DRAFT: Resultado do processo seletivo simplificado", status: "rascunho", categoria: "Concursos", autor: "Carlos Lima", dataPublicacao: "", views: 0, secretaria: "Gabinete", destaque: false },
  { id: "7", titulo: "Nota de Pesar — falecimento do ex-vereador José da Silva", status: "arquivado", categoria: "Institucional", autor: "Gabinete", dataPublicacao: "2026-01-10", views: 543, secretaria: "Gabinete", destaque: false },
  { id: "8", titulo: "Campanha de vacinação contra gripe começa no dia 5 de abril", status: "agendado", categoria: "Saúde", autor: "Ana Santos", dataPublicacao: "2026-04-03", views: 0, secretaria: "SESAU", destaque: false },
];

const STATUS_OPTS: Array<{ value: string; label: string }> = [
  { value: "", label: "Todos os Status" },
  { value: "publicado", label: "Publicado" },
  { value: "rascunho", label: "Rascunho" },
  { value: "agendado", label: "Agendado" },
  { value: "arquivado", label: "Arquivado" },
];

const CATS = ["", "Saúde", "Educação", "Concursos", "Obras", "Meio Ambiente", "Institucional", "Serviços"];

export default function CmsNoticias() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const LIMIT = 6;

  const filtered = MOCK_NOTICIAS.filter(n =>
    (!search || n.titulo.toLowerCase().includes(search.toLowerCase()) || n.autor.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || n.status === filterStatus) &&
    (!filterCat || n.categoria === filterCat)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const paged = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const toggleAll = () => {
    if (selected.length === paged.length) setSelected([]);
    else setSelected(paged.map(n => n.id));
  };

  const toggleOne = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const kpis = {
    total: MOCK_NOTICIAS.length,
    publicadas: MOCK_NOTICIAS.filter(n => n.status === "publicado").length,
    rascunhos: MOCK_NOTICIAS.filter(n => n.status === "rascunho").length,
    agendadas: MOCK_NOTICIAS.filter(n => n.status === "agendado").length,
  };

  return (
    <CmsLayout
      title="Notícias"
      actions={
        <Link href="/site-admin/noticias/nova">
          <span className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nova Notícia
          </span>
        </Link>
      }
    >
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* KPI summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: kpis.total, color: "text-white" },
            { label: "Publicadas", value: kpis.publicadas, color: "text-green-400" },
            { label: "Rascunhos", value: kpis.rascunhos, color: "text-zinc-400" },
            { label: "Agendadas", value: kpis.agendadas, color: "text-blue-400" },
          ].map(({ label, value, color }) => (
            <CmsCard key={label} padding="sm">
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-2xl font-black tabular-nums ${color}`}>{value}</p>
            </CmsCard>
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex flex-wrap gap-3 mb-6 items-end">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar notícia, autor..."
              className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
              aria-label="Buscar notícias"
            />
          </div>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
            aria-label="Filtrar por status">
            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
            aria-label="Filtrar por categoria">
            {CATS.map(c => <option key={c} value={c}>{c || "Todas as Categorias"}</option>)}
          </select>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="mb-4 flex items-center gap-3 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl">
            <span className="text-sm font-semibold text-primary">{selected.length} selecionados</span>
            <div className="flex gap-2 ml-auto">
              <button className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Publicar</button>
              <button className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Arquivar</button>
              <button className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">Excluir</button>
            </div>
          </div>
        )}

        {/* Table */}
        <CmsCard padding="none" className="overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de notícias">
              <thead className="border-b border-white/10 bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left w-10">
                    <input type="checkbox" checked={selected.length === paged.length && paged.length > 0}
                      onChange={toggleAll} className="rounded border-zinc-600 accent-primary" aria-label="Selecionar todas" />
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Título</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Categoria</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Autor</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Publicação</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden xl:table-cell">Views</th>
                  <th scope="col" className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paged.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-zinc-600 text-sm">Nenhuma notícia encontrada.</td></tr>
                ) : paged.map(n => (
                  <tr key={n.id} className={cn("hover:bg-white/3 transition-colors", selected.includes(n.id) && "bg-primary/5")}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(n.id)} onChange={() => toggleOne(n.id)}
                        className="rounded border-zinc-600 accent-primary" aria-label={`Selecionar ${n.titulo}`} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {n.destaque && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" title="Destaque na homepage" aria-label="Destaque" />}
                        <p className="font-medium text-zinc-200 line-clamp-1 text-sm">{n.titulo}</p>
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5 font-mono">/noticias/{n.id}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={n.status} /></td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-1 bg-white/5 rounded-lg text-zinc-400">{n.categoria}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-[10px] font-black text-primary">{n.autor.charAt(0)}</span>
                        </div>
                        <span className="text-xs text-zinc-400">{n.autor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-zinc-500 font-mono">
                        {n.dataPublicacao ? new Date(n.dataPublicacao).toLocaleDateString("pt-BR") : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell">
                      <span className="text-xs font-bold text-zinc-400 tabular-nums">{n.views.toLocaleString("pt-BR")}</span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/site-admin/noticias/${n.id}/editar`}>
                          <span className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Editar">
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </Link>
                        {n.status === "publicado" && (
                          <a href={`/noticias/${n.id}`} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors" title="Ver no portal">
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        )}
                        <button
                          onClick={() => setOpenMenu(openMenu === n.id ? null : n.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Mais ações"
                        >
                          <MoreVertical className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        {openMenu === n.id && (
                          <div className="absolute right-0 top-10 z-30 w-44 bg-zinc-800 border border-white/10 rounded-xl shadow-xl overflow-hidden" role="menu">
                            {[
                              { icon: Copy, label: "Duplicar", action: () => {} },
                              { icon: Eye, label: n.status === "publicado" ? "Despublicar" : "Publicar", action: () => {} },
                              { icon: Trash2, label: "Excluir", action: () => {}, danger: true },
                            ].map(({ icon: Icon, label, action, danger }) => (
                              <button key={label} onClick={() => { action(); setOpenMenu(null); }}
                                className={cn("flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-sm hover:bg-white/5 transition-colors", danger ? "text-red-400 hover:text-red-300" : "text-zinc-400 hover:text-white")}>
                                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CmsCard>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-600">{filtered.length} notícias · página {page} de {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors" aria-label="Anterior">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-zinc-500 font-mono px-2">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors" aria-label="Próxima">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </CmsLayout>
  );
}
