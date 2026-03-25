import { useState } from "react";
import { Link } from "wouter";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, StatusBadge } from "@/components/cms/CmsCard";
import { cn } from "@/lib/utils";
import {
  FileText, Plus, Pencil, Lock, Trash2, Globe, Eye, Search,
  LayoutTemplate, AlignLeft, Image, Table, Code, ChevronDown, ChevronRight, Type
} from "lucide-react";

interface Pagina {
  id: string;
  titulo: string;
  slug: string;
  status: "publicado" | "rascunho" | "arquivado";
  blocos: number;
  updatedAt: string;
  locked?: boolean;
}

const PAGINAS: Pagina[] = [
  { id: "acessibilidade", titulo: "Acessibilidade", slug: "/acessibilidade", status: "publicado", blocos: 3, updatedAt: "2026-01-10", locked: true },
  { id: "mapa-do-site", titulo: "Mapa do Site", slug: "/mapa-do-site", status: "publicado", blocos: 1, updatedAt: "2026-02-01", locked: true },
  { id: "privacidade", titulo: "Política de Privacidade (LGPD)", slug: "/privacidade", status: "publicado", blocos: 5, updatedAt: "2026-03-01", locked: true },
  { id: "historia", titulo: "História do Município", slug: "/municipio/historia", status: "publicado", blocos: 4, updatedAt: "2026-01-15" },
  { id: "turismo", titulo: "Turismo em Parauapebas", slug: "/turismo", status: "rascunho", blocos: 2, updatedAt: "2026-03-20" },
  { id: "equipe", titulo: "Equipe de Governo 2025-2028", slug: "/governo/equipe", status: "publicado", blocos: 2, updatedAt: "2026-01-02" },
];

const BLOCK_TYPES = [
  { id: "texto", label: "Texto", icon: AlignLeft },
  { id: "imagem", label: "Imagem", icon: Image },
  { id: "tabela", label: "Tabela", icon: Table },
  { id: "iframe", label: "Iframe", icon: Code },
  { id: "destaque", label: "Destaque", icon: ChevronRight },
  { id: "accordion", label: "Accordion", icon: ChevronDown },
  { id: "contato", label: "Contato", icon: Globe },
  { id: "galeria", label: "Galeria", icon: LayoutTemplate },
];

export default function CmsPaginas() {
  const [search, setSearch] = useState("");

  const filtered = PAGINAS.filter(p =>
    !search || p.titulo.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  return (
    <CmsLayout
      title="Páginas Estáticas"
      actions={
        <Link href="/site-admin/paginas/nova">
          <span className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> Nova Página
          </span>
        </Link>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Block types palette */}
        <CmsCard className="mb-8">
          <h2 className="text-sm font-bold text-white mb-3">Tipos de Blocos Disponíveis</h2>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map(({ id, label, icon: Icon }) => (
              <div key={id} className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl">
                <Icon className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                <span className="text-xs text-zinc-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-3">Cada página pode ter múltiplos blocos. Arraste para reordenar dentro do editor.</p>
        </CmsCard>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar página..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>

        {/* Pages list */}
        <CmsCard padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de páginas">
              <thead className="border-b border-white/10 bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Título</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Blocos</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Atualizado</th>
                  <th scope="col" className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(page => (
                  <tr key={page.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {page.locked && <Lock className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" aria-label="Página protegida — não pode ser excluída" />}
                        <div>
                          <p className="font-medium text-zinc-200 text-sm">{page.titulo}</p>
                          <p className="text-xs text-zinc-600 font-mono">{page.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={page.status} /></td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-bold text-zinc-500 tabular-nums">{page.blocos} bloco{page.blocos !== 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-zinc-600 font-mono">{new Date(page.updatedAt).toLocaleDateString("pt-BR")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/site-admin/paginas/${page.id}/editar`}>
                          <span className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 cursor-pointer" title="Editar">
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </Link>
                        <a href={page.slug} target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10" title="Ver página">
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                        {!page.locked && (
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
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
