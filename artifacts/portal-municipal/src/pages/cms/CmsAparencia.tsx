import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard } from "@/components/cms/CmsCard";
import { cn } from "@/lib/utils";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Eye, EyeOff, Save, Monitor, Smartphone,
  Palette, Type, Layout, Settings, RotateCcw, ExternalLink,
  Star, CheckCircle, ChevronDown, ChevronRight
} from "lucide-react";

interface HomeSection {
  id: string;
  label: string;
  desc: string;
  enabled: boolean;
}

const INITIAL_SECTIONS: HomeSection[] = [
  { id: "hero", label: "Hero / Carrossel", desc: "Slides principais com CTA", enabled: true },
  { id: "servicos", label: "Serviços Rápidos", desc: "Grade de serviços populares", enabled: true },
  { id: "noticias", label: "Notícias em Destaque", desc: "Últimas notícias do portal", enabled: true },
  { id: "agenda", label: "Agenda e Eventos", desc: "Próximos eventos municipais", enabled: true },
  { id: "numeros", label: "Números do Município", desc: "Indicadores animados", enabled: true },
  { id: "transparencia", label: "Destaque Transparência", desc: "Widget LAI e orçamento", enabled: true },
  { id: "galeria", label: "Galeria de Fotos", desc: "Grid de fotos recentes", enabled: true },
  { id: "secretarias", label: "Secretarias", desc: "Grade de secretarias", enabled: false },
  { id: "canais", label: "Canais de Atendimento", desc: "WhatsApp, SIC, 156, redes sociais", enabled: true },
];

const HERO_LAYOUTS = [
  { id: "carousel", label: "Carrossel", icon: "🎠" },
  { id: "video", label: "Vídeo de Fundo", icon: "🎬" },
  { id: "static", label: "Imagem Estática", icon: "🖼️" },
  { id: "gradient", label: "Gradiente", icon: "🎨" },
];

const CONTENT_FONTS = ["Public Sans", "Inter", "Lato", "Open Sans", "Roboto", "Source Serif 4", "Merriweather"];

function SortableSection({ section, onToggle }: { section: HomeSection; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all", isDragging ? "shadow-xl border-primary/40 bg-zinc-800" : "border-white/5 bg-zinc-900/50 hover:border-white/10")}>
      <button {...attributes} {...listeners}
        className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing" aria-label="Arrastar">
        <GripVertical className="w-4 h-4" aria-hidden="true" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-200">{section.label}</p>
        <p className="text-xs text-zinc-500">{section.desc}</p>
      </div>
      <button
        onClick={() => onToggle(section.id)}
        className={cn("flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors", section.enabled ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-zinc-700/30 text-zinc-500 hover:bg-zinc-700/50")}
        aria-pressed={section.enabled}
      >
        {section.enabled ? <Eye className="w-3 h-3" aria-hidden="true" /> : <EyeOff className="w-3 h-3" aria-hidden="true" />}
        {section.enabled ? "Visível" : "Oculta"}
      </button>
    </div>
  );
}

export default function CmsAparencia() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [heroLayout, setHeroLayout] = useState("carousel");
  const [contentFont, setContentFont] = useState("Public Sans");
  const [activeTab, setActiveTab] = useState<"homepage" | "rodape" | "widget" | "fontes">("homepage");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [saved, setSaved] = useState(false);

  const [rodape, setRodape] = useState({
    texto: "Prefeitura Municipal de Parauapebas — CNPJ 04.105.134/0001-71",
    mostrarRedes: true,
    mostrarLai: true,
    mostrarEmag: true,
    facebook: "https://facebook.com/prefparauapebas",
    instagram: "https://instagram.com/prefparauapebas",
    youtube: "",
  });

  const [widget, setWidget] = useState({
    ativo: true,
    posicao: "direita" as "direita" | "esquerda",
    cor: "#1351B4",
    label: "Fale Conosco",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections(s => arrayMove(s, s.findIndex(i => i.id === active.id), s.findIndex(i => i.id === over.id)));
    }
  }

  function toggleSection(id: string) {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
  }

  async function handleSave() {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs: Array<{ id: typeof activeTab; label: string; icon: React.ComponentType<{className?:string}> }> = [
    { id: "homepage", label: "Seções da Homepage", icon: Layout },
    { id: "rodape", label: "Rodapé", icon: Settings },
    { id: "widget", label: "Widget Flutuante", icon: Star },
    { id: "fontes", label: "Fontes e Tipografia", icon: Type },
  ];

  return (
    <CmsLayout
      title="Aparência do Site"
      actions={
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Ver Portal
          </a>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" aria-hidden="true" />
            {saved ? "Salvo!" : "Salvar Configurações"}
          </button>
        </div>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn("flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                activeTab === id ? "border-primary text-primary" : "border-transparent text-zinc-500 hover:text-white")}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Homepage sections */}
        {activeTab === "homepage" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Hero Layout */}
              <CmsCard>
                <h3 className="text-sm font-bold text-white mb-4">Layout do Hero / Banner Principal</h3>
                <div className="grid grid-cols-2 gap-3">
                  {HERO_LAYOUTS.map(layout => (
                    <button key={layout.id} onClick={() => setHeroLayout(layout.id)}
                      className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all", heroLayout === layout.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20")}>
                      <span className="text-2xl">{layout.icon}</span>
                      <span className={cn("text-xs font-semibold", heroLayout === layout.id ? "text-primary" : "text-zinc-400")}>{layout.label}</span>
                      {heroLayout === layout.id && <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </CmsCard>

              {/* Sections order */}
              <CmsCard>
                <h3 className="text-sm font-bold text-white mb-1">Seções da Homepage</h3>
                <p className="text-xs text-zinc-500 mb-4">Arraste para reordenar. Clique em "Visível" para ativar/desativar.</p>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {sections.map(section => (
                        <SortableSection key={section.id} section={section} onToggle={toggleSection} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CmsCard>
            </div>

            {/* Preview pane */}
            <div className="lg:col-span-2">
              <CmsCard className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setPreviewMode("desktop")} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors", previewMode === "desktop" ? "bg-primary text-white" : "text-zinc-500 hover:text-white hover:bg-white/5")}>
                    <Monitor className="w-3.5 h-3.5" aria-hidden="true" /> Desktop
                  </button>
                  <button onClick={() => setPreviewMode("mobile")} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors", previewMode === "mobile" ? "bg-primary text-white" : "text-zinc-500 hover:text-white hover:bg-white/5")}>
                    <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> Mobile
                  </button>
                </div>
                <div className={cn("bg-zinc-800 rounded-xl overflow-hidden border border-white/5", previewMode === "mobile" ? "max-w-48 mx-auto" : "")}>
                  <div className="bg-primary h-8 flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full" />
                  </div>
                  {sections.filter(s => s.enabled).map(s => (
                    <div key={s.id} className="border-t border-white/5 px-3 py-2">
                      <div className="h-2 bg-white/5 rounded w-3/4 mb-1" />
                      <div className="h-1.5 bg-white/3 rounded w-1/2" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 text-center mt-3">{sections.filter(s => s.enabled).length} seções ativas</p>
              </CmsCard>
            </div>
          </div>
        )}

        {/* Rodapé */}
        {activeTab === "rodape" && (
          <div className="max-w-2xl space-y-6">
            <CmsCard>
              <h3 className="text-sm font-bold text-white mb-5">Configuração do Rodapé</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Texto do rodapé (copyright)</label>
                  <textarea rows={2} value={rodape.texto} onChange={e => setRodape(r => ({ ...r, texto: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary resize-none" />
                </div>
                <div className="space-y-2">
                  {([
                    { key: "mostrarRedes", label: "Exibir redes sociais" },
                    { key: "mostrarLai", label: "Exibir selo LAI" },
                    { key: "mostrarEmag", label: "Exibir selo e-MAG" },
                  ] as const).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={rodape[key]} onChange={e => setRodape(r => ({ ...r, [key]: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                      <span className="text-sm text-zinc-400">{label}</span>
                    </label>
                  ))}
                </div>
                {rodape.mostrarRedes && (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Redes Sociais</h4>
                    {([
                      { key: "facebook", label: "Facebook" },
                      { key: "instagram", label: "Instagram" },
                      { key: "youtube", label: "YouTube" },
                    ] as const).map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs text-zinc-500 mb-1">{label} (URL)</label>
                        <input type="url" value={rodape[key]} onChange={e => setRodape(r => ({ ...r, [key]: e.target.value }))}
                          placeholder="https://..." className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CmsCard>
          </div>
        )}

        {/* Widget */}
        {activeTab === "widget" && (
          <div className="max-w-xl space-y-6">
            <CmsCard>
              <h3 className="text-sm font-bold text-white mb-5">Widget Flutuante "Fale Conosco"</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={widget.ativo} onChange={e => setWidget(w => ({ ...w, ativo: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm text-zinc-400 font-medium">Ativar widget flutuante</span>
                </label>
                {widget.ativo && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Posição</label>
                      <div className="flex gap-3">
                        {(["direita", "esquerda"] as const).map(pos => (
                          <button key={pos} onClick={() => setWidget(w => ({ ...w, posicao: pos }))}
                            className={cn("flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all capitalize", widget.posicao === pos ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-zinc-500 hover:border-white/20")}>
                            {pos === "direita" ? "→ Direita" : "← Esquerda"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Cor do widget</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={widget.cor} onChange={e => setWidget(w => ({ ...w, cor: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                        <input type="text" value={widget.cor} onChange={e => setWidget(w => ({ ...w, cor: e.target.value }))} className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white font-mono w-32 focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Texto do botão</label>
                      <input type="text" value={widget.label} onChange={e => setWidget(w => ({ ...w, label: e.target.value }))} maxLength={20}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                    </div>
                    {/* Preview */}
                    <div className="bg-zinc-800 rounded-xl p-6 flex items-end" style={{ minHeight: "120px", justifyContent: widget.posicao === "direita" ? "flex-end" : "flex-start" }}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center" style={{ backgroundColor: widget.cor }}>
                          <span className="text-white text-sm" aria-hidden="true">💬</span>
                        </div>
                        <span className="text-xs text-zinc-400">{widget.label}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CmsCard>
          </div>
        )}

        {/* Fontes */}
        {activeTab === "fontes" && (
          <div className="max-w-xl space-y-6">
            <CmsCard>
              <h3 className="text-sm font-bold text-white mb-5">Tipografia Editorial</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Fonte da UI (interface)</label>
                  <div className="px-3 py-2.5 bg-zinc-800 border border-white/5 rounded-xl text-sm text-zinc-500">
                    Public Sans — padrão do Gov.br (fixo)
                  </div>
                </div>
                <div>
                  <label htmlFor="content-font" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Fonte do Conteúdo Editorial</label>
                  <select id="content-font" value={contentFont} onChange={e => setContentFont(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary">
                    {CONTENT_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                {/* Font preview */}
                <div className="bg-zinc-800 rounded-xl p-5 border border-white/5">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Pré-visualização — {contentFont}</h4>
                  <div style={{ fontFamily: contentFont }}>
                    <p className="text-xl font-bold text-white mb-1">Prefeitura inaugura novo hospital</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">A Prefeitura Municipal de Parauapebas inaugurou nesta terça-feira o novo Hospital Municipal Regional, que vai atender mais de 100 mil moradores com serviços de média e alta complexidade.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Tamanho base do conteúdo</label>
                  <div className="flex items-center gap-3">
                    {["14px", "15px", "16px", "17px", "18px"].map(size => (
                      <button key={size} className="px-3 py-1.5 text-xs font-semibold border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CmsCard>
          </div>
        )}
      </div>
    </CmsLayout>
  );
}
