import { useState } from "react";
import { CmsLayout } from "@/components/cms/CmsLayout";
import { CmsCard, KpiCard } from "@/components/cms/CmsCard";
import { cn } from "@/lib/utils";
import {
  Shield, AlertTriangle, CheckCircle, Clock, Upload, FileText,
  Download, History, X, Plus, ChevronDown, ExternalLink, Bell, Save
} from "lucide-react";

type ConformidadeStatus = "conforme" | "atencao" | "pendente";

interface LaiCategory {
  id: string;
  titulo: string;
  laiRef: string;
  prazo: string;
  ultimaPublicacao?: string;
  status: ConformidadeStatus;
  historico: Array<{ data: string; arquivo: string; autor: string }>;
}

const CATEGORIES: LaiCategory[] = [
  { id: "orcamento", titulo: "Orçamento (LOA/LDO/PPA)", laiRef: "Art. 8°, §1°, II", prazo: "30 dias após aprovação", ultimaPublicacao: "2026-01-05", status: "conforme", historico: [{ data: "2026-01-05", arquivo: "LOA-2026.pdf", autor: "Maria Costa" }, { data: "2025-07-15", arquivo: "LDO-2026.pdf", autor: "Maria Costa" }] },
  { id: "despesas", titulo: "Despesas Públicas", laiRef: "Art. 8°, §1°, III", prazo: "Atualização mensal", ultimaPublicacao: "2026-03-01", status: "conforme", historico: [{ data: "2026-03-01", arquivo: "despesas-fev-2026.pdf", autor: "João Lima" }] },
  { id: "receitas", titulo: "Receitas Municipais", laiRef: "Art. 8°, §1°, III", prazo: "Atualização mensal", ultimaPublicacao: "2026-03-01", status: "conforme", historico: [{ data: "2026-03-01", arquivo: "receitas-fev-2026.pdf", autor: "João Lima" }] },
  { id: "licitacoes", titulo: "Licitações e Contratos", laiRef: "Art. 8°, §1°, IV", prazo: "Imediato após abertura", ultimaPublicacao: "2026-03-20", status: "conforme", historico: [{ data: "2026-03-20", arquivo: "licitacoes-mar-2026.pdf", autor: "Carlos Silva" }] },
  { id: "servidores", titulo: "Folha de Pagamento", laiRef: "Art. 8°, §1°, VI", prazo: "Até o 5° dia útil do mês", ultimaPublicacao: "2026-03-05", status: "conforme", historico: [] },
  { id: "rreo", titulo: "RREO — Bimestral", laiRef: "LRF, Art. 52", prazo: "30 dias após período", ultimaPublicacao: "2026-02-28", status: "atencao", historico: [] },
  { id: "rgf", titulo: "RGF — Quadrimestral", laiRef: "LRF, Art. 55", prazo: "30 dias após período", ultimaPublicacao: "2025-08-30", status: "pendente", historico: [] },
  { id: "contratos", titulo: "Contratos Vigentes", laiRef: "Art. 8°, §1°, IV", prazo: "Atualização mensal", ultimaPublicacao: "2026-03-01", status: "conforme", historico: [] },
];

const STATUS_CONFIG: Record<ConformidadeStatus, { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }> = {
  conforme: { label: "Conforme", icon: CheckCircle, bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  atencao: { label: "Atenção", icon: AlertTriangle, bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  pendente: { label: "Pendente", icon: AlertTriangle, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

function UploadModal({ category, onClose, onUpload }: { category: LaiCategory; onClose: () => void; onUpload: (id: string) => void }) {
  const [form, setForm] = useState({ exercicio: new Date().getFullYear().toString(), periodo: "", descricao: "" });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-bold text-white">Publicar Documento LAI</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{category.titulo} — {category.laiRef}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" aria-label="Fechar"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer group">
            <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-2 group-hover:text-primary transition-colors" aria-hidden="true" />
            <p className="text-sm text-zinc-400 mb-0.5">Arraste o arquivo PDF ou <span className="text-primary">clique para selecionar</span></p>
            <p className="text-xs text-zinc-600">Apenas PDF · Máximo 50MB</p>
            <input type="file" accept=".pdf" className="sr-only" aria-label="Selecionar arquivo PDF" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Exercício/Ano</label>
              <input type="number" value={form.exercicio} onChange={e => setForm(f => ({ ...f, exercicio: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Período de referência</label>
              <input type="text" value={form.periodo} onChange={e => setForm(f => ({ ...f, periodo: e.target.value }))}
                placeholder="Ex: Março/2026 ou 1° Bimestre"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Descrição</label>
            <textarea rows={3} value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Descreva o conteúdo do documento..."
              className="w-full px-3 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>
        <div className="flex gap-3 justify-end p-6 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">Cancelar</button>
          <button onClick={() => { onUpload(category.id); onClose(); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
            <Upload className="w-4 h-4" aria-hidden="true" /> Publicar Documento
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CmsTransparenciaCms() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [uploadTarget, setUploadTarget] = useState<LaiCategory | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const totals = {
    conforme: categories.filter(c => c.status === "conforme").length,
    atencao: categories.filter(c => c.status === "atencao").length,
    pendente: categories.filter(c => c.status === "pendente").length,
  };

  const handleUpload = (id: string) => {
    setCategories(cs => cs.map(c => c.id === id ? {
      ...c,
      status: "conforme" as const,
      ultimaPublicacao: new Date().toISOString().split("T")[0]!,
      historico: [{ data: new Date().toLocaleDateString("pt-BR"), arquivo: "documento-uploaded.pdf", autor: "Admin" }, ...c.historico],
    } : c));
  };

  return (
    <CmsLayout title="Gestão da Transparência (LAI)">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Alerts */}
        {totals.pendente + totals.atencao > 0 && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
            <Bell className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-red-300 mb-1">
                {totals.pendente} pendência(s) + {totals.atencao} atenção — Conformidade LAI em risco
              </p>
              <p className="text-xs text-red-400">Publique os documentos abaixo para regularizar a situação.</p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KpiCard label="Conformes" value={totals.conforme} icon={CheckCircle} color="green" sub="dentro do prazo" />
          <KpiCard label="Atenção" value={totals.atencao} icon={AlertTriangle} color="yellow" sub="próximos ao vencimento" />
          <KpiCard label="Pendentes" value={totals.pendente} icon={AlertTriangle} color="red" sub="fora do prazo ou ausentes" />
        </div>

        {/* Category list */}
        <h2 className="text-base font-bold text-white mb-4">Categorias de Publicação Obrigatória</h2>
        <div className="space-y-3" role="list" aria-label="Categorias LAI">
          {categories.map(cat => {
            const sc = STATUS_CONFIG[cat.status];
            const Icon = sc.icon;
            const isExpanded = expanded === cat.id;
            return (
              <div key={cat.id} className={cn("border rounded-2xl overflow-hidden transition-all", sc.border, isExpanded ? sc.bg : "bg-zinc-900 border-white/5")}>
                <div className="flex items-center gap-4 p-4">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", sc.bg)}>
                    <Icon className={cn("w-5 h-5", sc.text)} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-zinc-200 text-sm">{cat.titulo}</h3>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", sc.bg, sc.text)}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-zinc-600 font-mono">{cat.laiRef}</span>
                      <span className="text-xs text-zinc-600">Prazo: {cat.prazo}</span>
                      {cat.ultimaPublicacao && (
                        <span className="flex items-center gap-1 text-xs text-zinc-600">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          Última: {new Date(cat.ultimaPublicacao).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setUploadTarget(cat)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors">
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" /> Publicar
                    </button>
                    {cat.historico.length > 0 && (
                      <button onClick={() => setExpanded(isExpanded ? null : cat.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                        aria-expanded={isExpanded} aria-label="Ver histórico">
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Histórico */}
                {isExpanded && cat.historico.length > 0 && (
                  <div className="border-t border-white/5 px-4 pb-4">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-3 mb-2">Histórico de Versões</h4>
                    <ul className="space-y-2" role="list">
                      {cat.historico.map((h, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs">
                          <FileText className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" aria-hidden="true" />
                          <span className="text-zinc-300 flex-1 font-mono">{h.arquivo}</span>
                          <span className="text-zinc-600">{h.data}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-600">{h.autor}</span>
                          <button className="text-primary hover:underline ml-auto" aria-label={`Baixar ${h.arquivo}`}>
                            <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Export report */}
        <div className="mt-8 flex gap-3 justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar Relatório de Conformidade (PDF)
          </button>
        </div>
      </div>

      {uploadTarget && (
        <UploadModal category={uploadTarget} onClose={() => setUploadTarget(null)} onUpload={handleUpload} />
      )}
    </CmsLayout>
  );
}
