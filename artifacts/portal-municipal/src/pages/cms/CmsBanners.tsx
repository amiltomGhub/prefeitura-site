import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, CmsPageHeader, StatusBadge } from "@/components/cms/CmsCard";
import { cn } from "@/lib/utils";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, GripVertical, Pencil, Trash2, Eye, EyeOff,
  Upload, X, Image, ArrowUp, ArrowDown, Save, Calendar, Monitor, Smartphone
} from "lucide-react";

interface Banner {
  id: string;
  titulo: string;
  subtitulo?: string;
  ctaLabel?: string;
  ctaLink?: string;
  status: "ativo" | "inativo";
  dataInicio?: string;
  dataFim?: string;
  imageDesktop?: string;
  imageMobile?: string;
  order: number;
}

const INITIAL_BANNERS: Banner[] = [
  { id: "b1", titulo: "Semana de Prevenção ao Câncer de Mama", subtitulo: "Outubro Rosa — Cuide-se!", ctaLabel: "Saiba mais", ctaLink: "/saude/outubro-rosa", status: "ativo", dataInicio: "2026-10-01", dataFim: "2026-10-31", order: 0, imageDesktop: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop", imageMobile: "" },
  { id: "b2", titulo: "Concurso Público Municipal 2026", subtitulo: "Inscrições abertas! 450 vagas.", ctaLabel: "Inscreva-se", ctaLink: "/concursos", status: "ativo", order: 1, imageDesktop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=600&fit=crop" },
  { id: "b3", titulo: "Nova UBS Rio Verde inaugurada", subtitulo: "Mais saúde para todos os moradores", ctaLabel: "Ver notícia", ctaLink: "/noticias/nova-ubs-rio-verde", status: "inativo", order: 2, imageDesktop: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1920&h=600&fit=crop" },
  { id: "b4", titulo: "Semana do Meio Ambiente 2026", subtitulo: "Programação especial para toda a família", ctaLabel: "Ver programação", ctaLink: "/agenda/meio-ambiente-2026", status: "ativo", dataInicio: "2026-06-01", dataFim: "2026-06-07", order: 3, imageDesktop: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=600&fit=crop" },
];

function SortableBannerRow({ banner, onEdit, onDelete, onToggle }: {
  banner: Banner;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-3 p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:border-white/10 transition-all", isDragging && "shadow-2xl ring-2 ring-primary/30")}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors flex-shrink-0"
        aria-label="Arrastar para reordenar"
      >
        <GripVertical className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Order badge */}
      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-black text-zinc-500">{banner.order + 1}</span>
      </div>

      {/* Preview */}
      <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
        {banner.imageDesktop && (
          <img src={banner.imageDesktop} alt={banner.titulo} className="w-full h-full object-cover" loading="lazy" />
        )}
        {!banner.imageDesktop && (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-5 h-5 text-zinc-600" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-zinc-200 truncate">{banner.titulo}</p>
        {banner.subtitulo && <p className="text-xs text-zinc-500 truncate mt-0.5">{banner.subtitulo}</p>}
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {banner.ctaLabel && (
            <span className="text-[10px] text-zinc-600">CTA: {banner.ctaLabel}</span>
          )}
          {banner.dataInicio && (
            <span className="flex items-center gap-1 text-[10px] text-zinc-600">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {new Date(banner.dataInicio).toLocaleDateString("pt-BR")}
              {banner.dataFim && ` → ${new Date(banner.dataFim).toLocaleDateString("pt-BR")}`}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <StatusBadge status={banner.status} className="flex-shrink-0 hidden sm:inline-flex" />

      {/* Image indicators */}
      <div className="flex items-center gap-1.5 flex-shrink-0 hidden md:flex">
        <span className={cn("flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded", banner.imageDesktop ? "text-green-400 bg-green-400/10" : "text-zinc-600 bg-white/5")}>
          <Monitor className="w-3 h-3" aria-hidden="true" /> Desktop
        </span>
        <span className={cn("flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded", banner.imageMobile ? "text-green-400 bg-green-400/10" : "text-zinc-600 bg-white/5")}>
          <Smartphone className="w-3 h-3" aria-hidden="true" /> Mobile
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onToggle(banner.id)}
          className={cn("w-8 h-8 flex items-center justify-center rounded-lg transition-colors", banner.status === "ativo" ? "text-green-400 hover:text-zinc-400 hover:bg-white/5" : "text-zinc-600 hover:text-green-400 hover:bg-green-400/10")}
          title={banner.status === "ativo" ? "Desativar banner" : "Ativar banner"}>
          {banner.status === "ativo" ? <Eye className="w-3.5 h-3.5" aria-hidden="true" /> : <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>
        <button onClick={() => onEdit(banner.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors" title="Editar banner">
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button onClick={() => onDelete(banner.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Excluir banner">
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function BannerFormModal({ banner, onClose, onSave }: {
  banner?: Partial<Banner>;
  onClose: () => void;
  onSave: (data: Partial<Banner>) => void;
}) {
  const [form, setForm] = useState<Partial<Banner>>({
    titulo: "", subtitulo: "", ctaLabel: "", ctaLink: "", status: "ativo",
    dataInicio: "", dataFim: "", imageDesktop: "", imageMobile: "",
    ...banner,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Editar banner">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-bold text-white text-lg">{banner?.id ? "Editar Banner" : "Novo Banner"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" aria-label="Fechar">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Título *</label>
              <input type="text" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Subtítulo</label>
              <input type="text" value={form.subtitulo} onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Texto do CTA</label>
              <input type="text" value={form.ctaLabel} onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Link do CTA</label>
              <input type="text" value={form.ctaLink} onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Início de exibição</label>
              <input type="date" value={form.dataInicio} onChange={e => setForm(f => ({ ...f, dataInicio: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Fim de exibição</label>
              <input type="date" value={form.dataFim} onChange={e => setForm(f => ({ ...f, dataFim: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary" />
            </div>
            {/* Image upload areas */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                <Monitor className="w-3 h-3 inline mr-1" aria-hidden="true" />Desktop (1920×600)
              </label>
              <div className="border border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-5 h-5 text-zinc-600 mx-auto mb-1" aria-hidden="true" />
                <p className="text-xs text-zinc-600">Clique para enviar</p>
                <input type="file" accept="image/*" className="sr-only" aria-label="Upload imagem desktop" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                <Smartphone className="w-3 h-3 inline mr-1" aria-hidden="true" />Mobile (768×400)
              </label>
              <div className="border border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-5 h-5 text-zinc-600 mx-auto mb-1" aria-hidden="true" />
                <p className="text-xs text-zinc-600">Clique para enviar</p>
                <input type="file" accept="image/*" className="sr-only" aria-label="Upload imagem mobile" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="banner-ativo" checked={form.status === "ativo"} onChange={e => setForm(f => ({ ...f, status: e.target.checked ? "ativo" : "inativo" }))}
              className="w-4 h-4 rounded accent-primary" />
            <label htmlFor="banner-ativo" className="text-sm text-zinc-400 cursor-pointer">Ativo (exibir no portal)</label>
          </div>
        </div>
        <div className="flex gap-3 justify-end p-6 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" aria-hidden="true" /> Salvar Banner
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CmsBanners() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBanners(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((b, idx) => ({ ...b, order: idx }));
      });
    }
  }

  function toggleBanner(id: string) {
    setBanners(bs => bs.map(b => b.id === id ? { ...b, status: b.status === "ativo" ? "inativo" : "ativo" } : b));
  }

  function deleteBanner(id: string) {
    if (window.confirm("Excluir este banner?")) {
      setBanners(bs => bs.filter(b => b.id !== id).map((b, i) => ({ ...b, order: i })));
    }
  }

  const editingBanner = editingId ? banners.find(b => b.id === editingId) : undefined;

  return (
    <CmsLayout
      title="Banners / Carrossel"
      actions={
        <button onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" /> Novo Banner
        </button>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-white">Banners / Carrossel</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Arraste para reordenar. {banners.filter(b => b.status === "ativo").length} banners ativos.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600">Pré-visualização:</span>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="Desktop">
                <Monitor className="w-4 h-4" aria-hidden="true" />
              </button>
              <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="Mobile">
                <Smartphone className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Live preview area */}
        <div className="mb-8 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-zinc-600 font-mono ml-2">pré-visualização do carrossel</span>
          </div>
          {banners.filter(b => b.status === "ativo")[0]?.imageDesktop && (
            <div className="relative h-40 overflow-hidden">
              <img
                src={banners.filter(b => b.status === "ativo")[0]!.imageDesktop}
                alt={banners.filter(b => b.status === "ativo")[0]!.titulo}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent flex items-center px-8">
                <div>
                  <p className="text-white font-black text-lg">{banners.filter(b => b.status === "ativo")[0]!.titulo}</p>
                  <p className="text-zinc-300 text-sm mt-0.5">{banners.filter(b => b.status === "ativo")[0]!.subtitulo}</p>
                </div>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {banners.filter(b => b.status === "ativo").map((_, i) => (
                  <div key={i} className={cn("h-1 rounded-full transition-all", i === 0 ? "w-5 bg-white" : "w-2 bg-white/40")} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sortable list */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2" role="list" aria-label="Lista de banners">
              {banners.map(banner => (
                <SortableBannerRow
                  key={banner.id}
                  banner={banner}
                  onEdit={setEditingId}
                  onDelete={deleteBanner}
                  onToggle={toggleBanner}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-8 flex gap-3">
          <button onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
            <Plus className="w-4 h-4" aria-hidden="true" /> Adicionar Banner
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" aria-hidden="true" /> Salvar Ordem
          </button>
        </div>
      </div>

      {(editingId || showNewForm) && (
        <BannerFormModal
          banner={editingBanner}
          onClose={() => { setEditingId(null); setShowNewForm(false); }}
          onSave={(data) => {
            if (editingId) {
              setBanners(bs => bs.map(b => b.id === editingId ? { ...b, ...data } : b));
            } else {
              setBanners(bs => [...bs, { id: `b${Date.now()}`, ...data, order: bs.length } as Banner]);
            }
          }}
        />
      )}
    </CmsLayout>
  );
}
