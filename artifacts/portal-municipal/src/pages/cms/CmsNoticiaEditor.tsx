import { useState } from "react";
import { Link, useRoute } from "wouter";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, StatusBadge } from "@/components/cms/CmsCard";
import { TiptapEditor } from "@/components/cms/TiptapEditor";
import { cn } from "@/lib/utils";
import {
  ChevronLeft, Save, Eye, Clock, Globe, Tag, Image,
  Star, Settings, History, AlertCircle, CheckCircle, X,
  Upload, Trash2, Hash, Search
} from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const CATEGORIES = ["Saúde", "Educação", "Concursos", "Obras", "Meio Ambiente", "Institucional", "Serviços", "Segurança", "Esporte", "Cultura"];
const SECRETARIAS = ["SESAU", "SEMED", "SEMOSP", "SEFAZ", "Gabinete", "SEMIN", "SESPORT", "SECULTURA"];

export default function CmsNoticiaEditor() {
  const [isNew] = useRoute("/site-admin/noticias/nova");
  const [activeTab, setActiveTab] = useState<"editor" | "seo" | "historico">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    titulo: isNew ? "" : "Prefeitura inaugura nova UBS no Bairro Rio Verde",
    slug: isNew ? "" : "prefeitura-inaugura-nova-ubs-no-bairro-rio-verde",
    categoria: "Saúde",
    secretaria: "SESAU",
    status: "rascunho" as "rascunho" | "publicado" | "agendado",
    destaque: false,
    dataPublicacao: "",
    tags: ["saúde", "UBS", "inauguração"] as string[],
    altTextCapa: "",
    seoTitle: "",
    seoDesc: "",
    content: "",
  });
  const [tagInput, setTagInput] = useState("");

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    const titulo = e.target.value;
    setForm(f => ({ ...f, titulo, slug: slugify(titulo) }));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  async function handleSave(publish = false) {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    if (publish) setForm(f => ({ ...f, status: "publicado" }));
    setSavedSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <CmsLayout
      title={isNew ? "Nova Notícia" : "Editar Notícia"}
      actions={
        <div className="flex items-center gap-2">
          <a href="#" target="_blank" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Pré-visualizar
          </a>
          <button onClick={() => handleSave(false)} disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-50 transition-colors">
            <Save className="w-3.5 h-3.5" aria-hidden="true" /> {isSaving ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={() => handleSave(true)} disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            {form.status === "publicado" ? "Atualizar" : "Publicar"}
          </button>
        </div>
      }
    >
      {savedSuccess && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-green-900/90 border border-green-500/30 rounded-xl px-4 py-3 shadow-lg text-sm text-green-300 font-semibold" role="alert">
          <CheckCircle className="w-4 h-4" aria-hidden="true" /> Salvo com sucesso!
        </div>
      )}

      <div className="flex flex-col lg:flex-row h-full min-h-screen">
        {/* Main editor */}
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {/* Back */}
            <Link href="/site-admin/noticias">
              <span className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white mb-6 cursor-pointer transition-colors">
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Voltar para Notícias
              </span>
            </Link>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              {(["editor", "seo", "historico"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cn("px-4 py-2.5 text-sm font-medium border-b-2 transition-all capitalize",
                    activeTab === tab ? "border-primary text-primary" : "border-transparent text-zinc-500 hover:text-white"
                  )}>
                  {tab === "editor" ? "Editor" : tab === "seo" ? "SEO" : "Histórico"}
                </button>
              ))}
            </div>

            {activeTab === "editor" && (
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label htmlFor="noticia-titulo" className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Título da Notícia *</label>
                  <input
                    id="noticia-titulo"
                    type="text"
                    value={form.titulo}
                    onChange={handleTituloChange}
                    placeholder="Digite o título da notícia..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white text-xl font-bold placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
                    aria-required="true"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="noticia-slug" className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Slug (URL)</label>
                  <div className="flex items-center gap-0 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
                    <span className="px-3 py-2.5 bg-zinc-800 text-xs text-zinc-600 border-r border-white/10 font-mono whitespace-nowrap">/noticias/</span>
                    <input
                      id="noticia-slug"
                      type="text"
                      value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                      className="flex-1 px-3 py-2.5 bg-zinc-900 text-xs font-mono text-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Imagem de capa */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Imagem de Capa (16:9) *</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-3 group-hover:text-primary transition-colors" aria-hidden="true" />
                    <p className="text-sm text-zinc-500 mb-1">Arraste uma imagem ou <span className="text-primary">clique para selecionar</span></p>
                    <p className="text-xs text-zinc-700">Dimensão mínima: 1200×675px · Formatos: JPG, PNG, WebP · Máx: 5MB</p>
                    <input type="file" accept="image/*" className="sr-only" aria-label="Selecionar imagem de capa" />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="noticia-alt" className="block text-xs font-semibold text-zinc-500 mb-1">Alt text da imagem (acessibilidade) *</label>
                    <input
                      id="noticia-alt"
                      type="text"
                      value={form.altTextCapa}
                      onChange={e => setForm(f => ({ ...f, altTextCapa: e.target.value }))}
                      placeholder="Descrição da imagem para leitores de tela..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Editor */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Conteúdo *</label>
                  <TiptapEditor
                    content={form.content}
                    onChange={html => setForm(f => ({ ...f, content: html }))}
                    placeholder="Escreva o conteúdo da notícia aqui..."
                    minHeight={450}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-zinc-300 font-medium">
                        <Hash className="w-3 h-3 text-zinc-500" aria-hidden="true" />
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors" aria-label={`Remover tag ${tag}`}>
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                      placeholder="Adicionar tag..."
                      className="flex-1 px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button onClick={addTag} className="px-3 py-2 text-xs font-bold text-primary border border-primary/30 rounded-xl hover:bg-primary/10 transition-colors">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-1">Pré-visualização Google</h3>
                  <p className="text-xs text-zinc-500 mb-4">Como a notícia aparecerá nos resultados de busca</p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 text-sm font-medium line-clamp-1">{form.seoTitle || form.titulo || "Título da Notícia"}</p>
                    <p className="text-xs text-green-500 mt-0.5 font-mono">parauapebas.pa.gov.br/noticias/{form.slug}</p>
                    <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">{form.seoDesc || "Meta descrição aparecerá aqui. Recomendado: 120-160 caracteres."}</p>
                  </div>
                </div>
                {[
                  { label: "Meta Title", id: "seo-title", value: form.seoTitle, key: "seoTitle" as const, placeholder: "Título para SEO (máx 60 chars)", max: 60 },
                  { label: "Meta Description", id: "seo-desc", value: form.seoDesc, key: "seoDesc" as const, placeholder: "Descrição para SEO (120-160 chars)", max: 160 },
                ].map(({ label, id, value, key, placeholder, max }) => (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor={id} className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
                      <span className={cn("text-xs tabular-nums", value.length > max ? "text-red-400" : "text-zinc-600")}>{value.length}/{max}</span>
                    </div>
                    {key === "seoDesc" ? (
                      <textarea id={id} rows={3} value={value} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder} maxLength={max}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors resize-none" />
                    ) : (
                      <input id={id} type="text" value={value} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder} maxLength={max}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "historico" && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 mb-4">Histórico de versões da notícia (últimas 10 versões).</p>
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-zinc-900 border border-white/10 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-zinc-400">v{3 - i}</div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-300 font-medium">Versão {3 - i}</p>
                      <p className="text-xs text-zinc-600">{i === 0 ? "Atual" : i === 1 ? "Ontem 15:30" : "22/03/2026 09:00"} · Ana Santos</p>
                    </div>
                    <button className="text-xs text-primary hover:underline">Restaurar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-white/5 bg-zinc-900/50 p-6 space-y-5 flex-shrink-0">
          {/* Status */}
          <CmsCard>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={form.status} />
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof f.status }))}
                className="flex-1 text-xs bg-zinc-800 border border-white/10 rounded-lg px-2 py-1.5 text-zinc-300 focus:outline-none focus:border-primary">
                <option value="rascunho">Rascunho</option>
                <option value="agendado">Agendado</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
            {form.status === "agendado" && (
              <div>
                <label htmlFor="noticia-data" className="block text-xs text-zinc-500 mb-1">Data e hora de publicação</label>
                <input
                  id="noticia-data"
                  type="datetime-local"
                  value={form.dataPublicacao}
                  onChange={e => setForm(f => ({ ...f, dataPublicacao: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
            <div className="flex items-center gap-2 mt-3">
              <input type="checkbox" id="destaque" checked={form.destaque} onChange={e => setForm(f => ({ ...f, destaque: e.target.checked }))}
                className="w-4 h-4 rounded accent-primary" />
              <label htmlFor="destaque" className="text-xs text-zinc-400 cursor-pointer flex items-center gap-1.5">
                <Star className="w-3 h-3 text-yellow-400" aria-hidden="true" /> Destaque na homepage
              </label>
            </div>
          </CmsCard>

          {/* Categoria e Secretaria */}
          <CmsCard>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Classificação</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="noticia-cat" className="block text-xs text-zinc-500 mb-1">Categoria *</label>
                <select id="noticia-cat" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-primary">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="noticia-sec" className="block text-xs text-zinc-500 mb-1">Secretaria de origem</label>
                <select id="noticia-sec" value={form.secretaria} onChange={e => setForm(f => ({ ...f, secretaria: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-primary">
                  {SECRETARIAS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </CmsCard>

          {/* Ações */}
          <CmsCard>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Ações</h3>
            <div className="space-y-2">
              <button onClick={() => handleSave(false)} disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-zinc-300 border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-50 transition-colors">
                <Save className="w-4 h-4" aria-hidden="true" /> Salvar Rascunho
              </button>
              <button onClick={() => handleSave(true)} disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Globe className="w-4 h-4" aria-hidden="true" />
                {isSaving ? "Publicando..." : form.status === "publicado" ? "Atualizar" : "Publicar"}
              </button>
              {!isNew && (
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" aria-hidden="true" /> Excluir Notícia
                </button>
              )}
            </div>
          </CmsCard>
        </aside>
      </div>
    </CmsLayout>
  );
}
