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
  GripVertical, Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  Link2, FileText, Globe, AlignJustify, X, Save, Eye
} from "lucide-react";

type MenuItemType = "pagina" | "url" | "secao" | "dropdown";
interface MenuItem {
  id: string;
  label: string;
  type: MenuItemType;
  href?: string;
  children: MenuItem[];
  expanded?: boolean;
}

type MenuSlot = "header" | "footer-col1" | "footer-col2" | "footer-col3" | "mobile";

const MENU_LABELS: Record<MenuSlot, string> = {
  header: "Menu Principal (Header)",
  "footer-col1": "Rodapé — Coluna 1",
  "footer-col2": "Rodapé — Coluna 2",
  "footer-col3": "Rodapé — Coluna 3",
  mobile: "Menu Mobile",
};

const INITIAL_MENUS: Record<MenuSlot, MenuItem[]> = {
  header: [
    { id: "m1", label: "Início", type: "pagina", href: "/", children: [] },
    { id: "m2", label: "O Município", type: "pagina", href: "/municipio", children: [] },
    { id: "m3", label: "Governo", type: "dropdown", children: [
      { id: "m3-1", label: "Secretarias", type: "pagina", href: "/governo/secretarias", children: [] },
      { id: "m3-2", label: "Prefeito", type: "pagina", href: "/governo/prefeito", children: [] },
    ]},
    { id: "m4", label: "Notícias", type: "pagina", href: "/noticias", children: [] },
    { id: "m5", label: "Transparência", type: "dropdown", children: [
      { id: "m5-1", label: "Orçamento", type: "pagina", href: "/transparencia/orcamento", children: [] },
      { id: "m5-2", label: "Despesas", type: "pagina", href: "/transparencia/despesas", children: [] },
      { id: "m5-3", label: "SIC / e-SIC", type: "pagina", href: "/transparencia/sic", children: [] },
    ]},
    { id: "m6", label: "Serviços", type: "pagina", href: "/servicos", children: [] },
    { id: "m7", label: "Contato", type: "pagina", href: "/contato", children: [] },
  ],
  "footer-col1": [
    { id: "f1-1", label: "Sobre o Município", type: "pagina", href: "/municipio", children: [] },
    { id: "f1-2", label: "Secretarias", type: "pagina", href: "/secretarias", children: [] },
    { id: "f1-3", label: "Legislação", type: "pagina", href: "/legislacao", children: [] },
  ],
  "footer-col2": [
    { id: "f2-1", label: "Portal da Transparência", type: "pagina", href: "/transparencia", children: [] },
    { id: "f2-2", label: "SIC — e-SIC", type: "pagina", href: "/transparencia/sic", children: [] },
    { id: "f2-3", label: "Dados Abertos", type: "pagina", href: "/transparencia/dados-abertos", children: [] },
  ],
  "footer-col3": [
    { id: "f3-1", label: "Ouvidoria", type: "url", href: "/ouvidoria", children: [] },
    { id: "f3-2", label: "Mapa do Site", type: "pagina", href: "/mapa-do-site", children: [] },
    { id: "f3-3", label: "Acessibilidade", type: "pagina", href: "/acessibilidade", children: [] },
  ],
  mobile: [],
};

const TYPE_ICONS: Record<MenuItemType, React.ComponentType<{className?: string}>> = {
  pagina: FileText,
  url: Globe,
  secao: AlignJustify,
  dropdown: ChevronDown,
};

function SortableMenuItem({ item, depth, onEdit, onDelete, onToggle }: {
  item: MenuItem; depth: number; onEdit: (item: MenuItem) => void; onDelete: (id: string) => void; onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const TypeIcon = TYPE_ICONS[item.type];

  return (
    <div ref={setNodeRef} style={style} className={cn("relative", depth > 0 && "ml-6 pl-4 border-l border-white/5")}>
      <div className={cn("flex items-center gap-2 py-2 px-3 rounded-xl group hover:bg-white/5 transition-colors", isDragging && "ring-1 ring-primary/30 bg-white/5")}>
        <button {...attributes} {...listeners} className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:text-zinc-400 cursor-grab active:cursor-grabbing" aria-label="Arrastar">
          <GripVertical className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <TypeIcon className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 text-sm text-zinc-300 font-medium">{item.label}</span>
        {item.href && <span className="text-xs text-zinc-600 font-mono truncate max-w-32 hidden md:block">{item.href}</span>}
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", item.type === "dropdown" ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-zinc-500")}>
          {item.type}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.children.length > 0 && (
            <button onClick={() => onToggle(item.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Expandir/recolher">
              {item.expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
          <button onClick={() => onEdit(item)} className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Editar">
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button onClick={() => onDelete(item.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" aria-label="Excluir">
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      {item.children.length > 0 && (item.expanded !== false) && (
        <div className="mt-0.5">
          {item.children.map(child => (
            <SortableMenuItem key={child.id} item={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemFormModal({ item, onClose, onSave }: { item?: Partial<MenuItem>; onClose: () => void; onSave: (data: Partial<MenuItem>) => void }) {
  const [form, setForm] = useState<Partial<MenuItem>>({ label: "", type: "pagina", href: "", ...item });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-white">{item?.id ? "Editar Item" : "Novo Item de Menu"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" aria-label="Fechar"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Texto do item *</label>
            <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="Ex: Notícias" className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Tipo</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as MenuItemType }))}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary">
              <option value="pagina">Página interna</option>
              <option value="url">URL externa</option>
              <option value="secao">Seção da página</option>
              <option value="dropdown">Dropdown (sem link)</option>
            </select>
          </div>
          {form.type !== "dropdown" && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Link / Href</label>
              <input type="text" value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                placeholder="/caminho ou https://..." className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-primary" />
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end p-5 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">Cancelar</button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" aria-hidden="true" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CmsMenus() {
  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [activeMenu, setActiveMenu] = useState<MenuSlot>("header");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMenus(m => ({
        ...m,
        [activeMenu]: arrayMove(m[activeMenu], m[activeMenu].findIndex(i => i.id === active.id), m[activeMenu].findIndex(i => i.id === over.id))
      }));
    }
  }

  function toggleItem(id: string) {
    setMenus(m => ({ ...m, [activeMenu]: m[activeMenu].map(i => i.id === id ? { ...i, expanded: !i.expanded } : i) }));
  }

  function deleteItem(id: string) {
    setMenus(m => ({ ...m, [activeMenu]: m[activeMenu].filter(i => i.id !== id) }));
  }

  function addItem(data: Partial<MenuItem>) {
    const newItem: MenuItem = { id: `item-${Date.now()}`, label: data.label ?? "Novo Item", type: data.type ?? "pagina", href: data.href, children: [] };
    setMenus(m => ({ ...m, [activeMenu]: [...m[activeMenu], newItem] }));
  }

  function editItem(data: Partial<MenuItem>) {
    if (!editingItem) return;
    setMenus(m => ({ ...m, [activeMenu]: m[activeMenu].map(i => i.id === editingItem.id ? { ...i, ...data } : i) }));
  }

  const currentMenu = menus[activeMenu];

  return (
    <CmsLayout title="Configuração de Menus">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-white">Configuração de Menus</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Arraste para reordenar. Máximo 2 níveis de profundidade.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" aria-hidden="true" /> Novo Item
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
              <Save className="w-4 h-4" aria-hidden="true" /> Salvar Menu
            </button>
          </div>
        </div>

        {/* Menu selector */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Selecionar menu">
          {(Object.keys(MENU_LABELS) as MenuSlot[]).map(slot => (
            <button key={slot} role="tab" aria-selected={activeMenu === slot} onClick={() => setActiveMenu(slot)}
              className={cn("px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                activeMenu === slot ? "bg-primary text-white border-primary" : "border-white/10 text-zinc-500 hover:text-white hover:border-white/20")}>
              {MENU_LABELS[slot]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Item list */}
          <div className="lg:col-span-3">
            <CmsCard>
              <h2 className="text-sm font-bold text-white mb-4">{MENU_LABELS[activeMenu]}</h2>
              {currentMenu.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 text-sm">
                  <AlignJustify className="w-8 h-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
                  <p>Nenhum item neste menu.</p>
                  <button onClick={() => setShowNewForm(true)} className="mt-4 text-primary text-xs hover:underline">+ Adicionar item</button>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={currentMenu.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-0.5">
                      {currentMenu.map(item => (
                        <SortableMenuItem key={item.id} item={item} depth={0} onEdit={setEditingItem} onDelete={deleteItem} onToggle={toggleItem} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CmsCard>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <CmsCard>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-zinc-500" aria-hidden="true" />
                <h2 className="text-sm font-bold text-white">Pré-visualização</h2>
              </div>
              {activeMenu === "header" ? (
                <div className="bg-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-primary px-3 py-2.5">
                    <nav className="flex items-center gap-0 flex-wrap" aria-label="Pré-visualização do menu">
                      {currentMenu.map(item => (
                        <div key={item.id} className="relative group">
                          <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white/90 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                            {item.label}
                            {item.children.length > 0 && <ChevronDown className="w-3 h-3" aria-hidden="true" />}
                          </span>
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className="px-3 py-2 border-t border-white/5">
                    <p className="text-[10px] text-zinc-600">{currentMenu.length} itens no menu</p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-800 rounded-xl p-3">
                  <h3 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">{MENU_LABELS[activeMenu]}</h3>
                  <ul className="space-y-1">
                    {currentMenu.map(item => (
                      <li key={item.id}>
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer py-0.5">
                          <ChevronRight className="w-3 h-3 text-zinc-600" aria-hidden="true" /> {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CmsCard>
          </div>
        </div>
      </div>

      {showNewForm && <ItemFormModal onClose={() => setShowNewForm(false)} onSave={addItem} />}
      {editingItem && <ItemFormModal item={editingItem} onClose={() => setEditingItem(null)} onSave={editItem} />}
    </CmsLayout>
  );
}
