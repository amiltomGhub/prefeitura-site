import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard } from "@/components/cms/CmsCard";
import { GalleryHorizontal, Plus, Upload, Pencil, Trash2, Search } from "lucide-react";

const ALBUMS = [
  { id: "a1", titulo: "Inauguração UBS Rio Verde", fotos: 24, data: "2026-03-25", capa: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400&h=260&fit=crop" },
  { id: "a2", titulo: "Semana do Meio Ambiente 2025", fotos: 48, data: "2025-06-07", capa: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=260&fit=crop" },
  { id: "a3", titulo: "Feira do Empreendedor 2025", fotos: 36, data: "2025-04-15", capa: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=260&fit=crop" },
  { id: "a4", titulo: "Obras Av. dos Ipês — Conclusão", fotos: 18, data: "2026-03-22", capa: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=260&fit=crop" },
  { id: "a5", titulo: "Aniversário de Parauapebas 2025", fotos: 120, data: "2025-05-27", capa: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=260&fit=crop" },
  { id: "a6", titulo: "Entrega de Kits Escolares 2026", fotos: 12, data: "2026-03-21", capa: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=260&fit=crop" },
];

export default function CmsGaleria() {
  const [search, setSearch] = useState("");
  const filtered = ALBUMS.filter(a => !search || a.titulo.toLowerCase().includes(search.toLowerCase()));

  return (
    <CmsLayout
      title="Galeria de Fotos"
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Novo Álbum
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar álbum..."
            className="w-full pl-10 pr-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" />
        </div>

        {/* Upload area */}
        <div className="mb-6 border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-zinc-500">Arraste fotos aqui ou <span className="text-primary">clique para selecionar</span></p>
          <p className="text-xs text-zinc-700 mt-0.5">JPG, PNG, WebP — máx 10MB por foto</p>
          <input type="file" accept="image/*" multiple className="sr-only" aria-label="Selecionar fotos" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(album => (
            <div key={album.id} className="group bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
              <div className="relative h-40 overflow-hidden">
                <img src={album.capa} alt={album.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 bg-red-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-red-500/50 transition-colors" aria-label="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {album.fotos} fotos
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-zinc-300 line-clamp-2">{album.titulo}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">{new Date(album.data).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CmsLayout>
  );
}
