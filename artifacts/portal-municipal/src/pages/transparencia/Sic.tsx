import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { SicRequestForm } from "@/components/transparencia/SicRequestForm";
import { ComplianceBadge } from "@/components/transparencia/ComplianceBadge";
import { MessageSquare, Clock, CheckCircle, XCircle, ChevronRight, Search, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { step: 1, label: "Pedido recebido", desc: "Protocolo gerado automaticamente.", done: true },
  { step: 2, label: "Em análise", desc: "Órgão responsável analisa o pedido.", done: false },
  { step: 3, label: "Resposta fornecida", desc: "Dentro de 20 dias corridos (prorrogáveis por mais 10).", done: false },
  { step: 4, label: "Prazo de recurso", desc: "10 dias para interpor recurso se insatisfeito.", done: false },
];

const STATS = [
  { label: "Pedidos Este Mês", value: "127", sub: "junho/2026", color: "text-primary" },
  { label: "Taxa de Resposta", value: "94%", sub: "dentro do prazo", color: "text-green-700" },
  { label: "Tempo Médio", value: "8 dias", sub: "de resposta", color: "text-orange-700" },
  { label: "Recursos", value: "12", sub: "em análise", color: "text-red-700" },
];

export default function Sic() {
  const [tab, setTab] = useState<"pedido" | "acompanhar" | "estatisticas">("pedido");
  const [protocolo, setProtocolo] = useState("");
  const [consultResult, setConsultResult] = useState<null | "found" | "not_found">(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocolo.trim()) return;
    setIsSearching(true);
    await new Promise(r => setTimeout(r, 800));
    setConsultResult(protocolo.length >= 10 ? "found" : "not_found");
    setIsSearching(false);
  };

  return (
    <Layout>
      <TransparenciaPageHeader
        title="SIC — Serviço de Informação ao Cidadão"
        subtitle="Formulário e-SIC para pedidos de acesso à informação. Prazo de resposta: 20 dias corridos (prorrogáveis por mais 10). LAI, Art. 9°."
        icon={MessageSquare}
        breadcrumbs={[{ label: "SIC" }]}
        laiRef="LAI, Art. 9°, I, b — Decreto 7.724/2012"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
        complianceLabel="e-SIC Ativo"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex border-b border-border mb-10" role="tablist" aria-label="Seções do SIC">
          {([
            { id: "pedido", label: "Fazer Pedido", icon: MessageSquare },
            { id: "acompanhar", label: "Acompanhar Pedido", icon: Search },
            { id: "estatisticas", label: "Estatísticas", icon: BarChart2 },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              aria-controls={`tab-panel-${id}`}
              id={`tab-${id}`}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-semibold border-b-2 transition-all focus:outline-none",
                tab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab: Fazer Pedido */}
        {tab === "pedido" && (
          <div id="tab-panel-pedido" role="tabpanel" aria-labelledby="tab-pedido" className="max-w-2xl">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Pedido de Acesso à Informação</h2>
              <p className="text-sm text-muted-foreground">
                Qualquer pessoa, física ou jurídica, pode fazer pedidos de acesso à informação sem necessidade de justificativa.
              </p>
            </div>

            {/* Timeline */}
            <div className="flex gap-0 mb-10 relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border z-0" style={{ left: "1.25rem", right: "1.25rem" }} aria-hidden="true" />
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center z-10 relative">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-black mb-2",
                    item.done ? "bg-primary border-primary text-white" : "bg-background border-border text-muted-foreground"
                  )}>
                    {item.done ? <CheckCircle className="w-5 h-5" aria-hidden="true" /> : item.step}
                  </div>
                  <p className="text-xs font-bold text-foreground leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{item.desc}</p>
                </div>
              ))}
            </div>

            <SicRequestForm />
          </div>
        )}

        {/* Tab: Acompanhar */}
        {tab === "acompanhar" && (
          <div id="tab-panel-acompanhar" role="tabpanel" aria-labelledby="tab-acompanhar" className="max-w-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">Acompanhar Pedido</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Insira o número do protocolo para verificar o status do seu pedido de informação.
            </p>

            <form onSubmit={handleConsultar} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  value={protocolo}
                  onChange={e => { setProtocolo(e.target.value); setConsultResult(null); }}
                  placeholder="Número do protocolo (ex: SIC-2026-000127)"
                  className="w-full pl-10 pr-3 py-3.5 border-2 border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-mono"
                  aria-label="Número do protocolo"
                  required
                />
              </div>
              <button type="submit" disabled={isSearching}
                className="px-5 py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 whitespace-nowrap">
                {isSearching ? "Consultando..." : "Consultar"}
              </button>
            </form>

            {consultResult === "found" && (
              <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Pedido #{protocolo}</h3>
                  <ComplianceBadge status="ok" label="Em Análise" />
                </div>
                <dl className="space-y-3">
                  {[
                    { term: "Status", value: "Em análise pelo órgão" },
                    { term: "Data do Pedido", value: "10/06/2026" },
                    { term: "Prazo de Resposta", value: "30/06/2026 (20 dias corridos)" },
                    { term: "Órgão Responsável", value: "Secretaria Municipal de Saúde" },
                    { term: "Dias Restantes", value: "12 dias" },
                  ].map(({ term, value }) => (
                    <div key={term} className="flex gap-4">
                      <dt className="w-40 flex-shrink-0 text-xs font-semibold text-muted-foreground">{term}</dt>
                      <dd className="flex-1 text-sm text-foreground font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
                {/* Countdown */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-orange-900">Prazo: 12 dias restantes</p>
                    <p className="text-xs text-orange-700">Vencimento em 30/06/2026 (LAI, Art. 11)</p>
                  </div>
                </div>
              </div>
            )}

            {consultResult === "not_found" && (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-2xl text-muted-foreground gap-3">
                <XCircle className="w-10 h-10 text-red-400" aria-hidden="true" />
                <p className="text-sm font-semibold">Protocolo não encontrado.</p>
                <p className="text-xs text-center">Verifique se o número está correto ou entre em contato com o SIC presencial.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Estatísticas */}
        {tab === "estatisticas" && (
          <div id="tab-panel-estatisticas" role="tabpanel" aria-labelledby="tab-estatisticas">
            <h2 className="text-xl font-bold text-foreground mb-2">Relatório Estatístico do SIC</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Estatísticas de pedidos de acesso à informação. Publicação obrigatória conforme Decreto 7.724/2012.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {STATS.map(({ label, value, sub, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5 text-center">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">{label}</p>
                  <p className={`text-3xl font-black ${color} tabular-nums`}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Por resultado */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">Resultado dos Pedidos</h3>
                <div className="space-y-3">
                  {[
                    { label: "Respondidos com acesso concedido", pct: 68, color: "bg-green-500" },
                    { label: "Respondidos parcialmente", pct: 15, color: "bg-yellow-500" },
                    { label: "Acesso negado (justificado)", pct: 8, color: "bg-orange-500" },
                    { label: "Em andamento", pct: 9, color: "bg-blue-500" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-bold text-foreground">{pct}%</span></div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por secretaria */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">Pedidos por Secretaria</h3>
                <ul className="space-y-2">
                  {[
                    { sec: "Secretaria de Saúde", n: 34 },
                    { sec: "Secretaria de Educação", n: 28 },
                    { sec: "Secretaria de Finanças", n: 22 },
                    { sec: "Secretaria de Obras", n: 18 },
                    { sec: "Gabinete do Prefeito", n: 14 },
                    { sec: "Outras Secretarias", n: 11 },
                  ].map(({ sec, n }) => (
                    <li key={sec} className="flex items-center gap-3">
                      <div className="flex-1 text-xs text-muted-foreground">{sec}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(n / 34) * 100}%` }} /></div>
                        <span className="text-xs font-bold text-foreground tabular-nums w-6 text-right">{n}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
