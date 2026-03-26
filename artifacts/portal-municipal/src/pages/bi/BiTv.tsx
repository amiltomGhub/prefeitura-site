import { useEffect, useState } from "react";
import { Link } from "wouter";
import { BI_KPIS, BI_ALERTAS, BI_MUNICIPIO, BI_OUVIDORIA, BI_FINANCEIRO, BI_PESSOAL } from "@/data/bi-mock";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { Tv2, Clock, RefreshCw } from "lucide-react";

const PANELS = ["cockpit", "ouvidoria", "financeiro", "pessoal"] as const;
type PanelId = (typeof PANELS)[number];
const PANEL_DURATION = 30; // seconds

const TOOLTIP_STYLE = { backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#fff" };

function TVKpi({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black tabular-nums" style={{ color }}>{value}</p>
      {sub && <p className="text-sm text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}

function CockpitPanel() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <TVKpi label="Receita arrecadada" value={`${BI_KPIS.receita.pct}%`} color="#22C55E" sub={formatCurrency(BI_KPIS.receita.valor)} />
        <TVKpi label="Despesas executadas" value={`${BI_KPIS.despesa.pct}%`} color="#3B82F6" sub={formatCurrency(BI_KPIS.despesa.valor)} />
        <TVKpi label="Pessoal / RCL (LRF)" value={`${BI_KPIS.lrf.pct}%`} color="#F59E0B" sub={`Limite: ${BI_KPIS.lrf.limite}%`} />
        <TVKpi label="Resultado" value={formatCurrency(BI_KPIS.resultado.valor)} color="#8B5CF6" sub="Superávit" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <TVKpi label="Manifestações abertas" value={String(BI_KPIS.manifestacoes.abertas)} color="#EF4444" />
        <TVKpi label="SLA ouvidoria" value={`${BI_KPIS.sla.pct}%`} color="#06B6D4" sub={`Meta: ${BI_KPIS.sla.meta}%`} />
        <TVKpi label="Servidores ativos" value={BI_KPIS.servidores.ativos.toLocaleString("pt-BR")} color="#F97316" />
        <TVKpi label="NPS cidadão" value={String(BI_KPIS.nps.score)} color="#EC4899" sub="Net Promoter Score" />
      </div>
      <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-4">
        <p className="text-sm font-bold text-red-400 mb-3">⚠️ Alertas Críticos</p>
        <div className="space-y-2">
          {BI_ALERTAS.filter(a => a.urgencia === "critica" || a.urgencia === "alta").slice(0, 3).map(a => (
            <div key={a.id} className="flex items-center gap-3 text-sm">
              <span>{a.icone}</span>
              <span className="text-zinc-300">{a.titulo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OuvidoriaPanel() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <TVKpi label="Manifestações abertas" value={String(BI_KPIS.manifestacoes.abertas)} color="#EF4444" />
        <TVKpi label="Taxa SLA" value={`${BI_KPIS.sla.pct}%`} color="#22C55E" sub={`Meta: ${BI_KPIS.sla.meta}%`} />
        <TVKpi label="NPS do cidadão" value={String(BI_OUVIDORIA.nps.score)} color="#EC4899" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
          <p className="text-sm font-bold text-white mb-3">Volume diário (últimos 15 dias)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BI_OUVIDORIA.volumeDiario.slice(-15)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="tv-ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: "#52525b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#52525b" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area dataKey="atual" stroke="#3B82F6" fill="url(#tv-ga)" strokeWidth={2} dot={false} name="Manifestações" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
          <p className="text-sm font-bold text-white mb-3">Por tipo</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={BI_OUVIDORIA.porTipo} dataKey="valor" nameKey="nome" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {BI_OUVIDORIA.porTipo.map((e) => <Cell key={e.nome} fill={e.cor} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "#71717a" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function FinanceiroPanel() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <TVKpi label="Receita arrecadada" value={formatCurrency(BI_KPIS.receita.valor)} color="#22C55E" sub={`${BI_KPIS.receita.pct}% da meta`} />
        <TVKpi label="Despesas executadas" value={formatCurrency(BI_KPIS.despesa.valor)} color="#EF4444" sub={`${BI_KPIS.despesa.pct}% da dotação`} />
        <TVKpi label="Pessoal / RCL" value={`${BI_KPIS.lrf.pct}%`} color="#F59E0B" sub={`Limite LRF: ${BI_KPIS.lrf.limite}%`} />
      </div>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
        <p className="text-sm font-bold text-white mb-3">Receitas vs Despesas — {new Date().getFullYear()}</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={BI_FINANCEIRO.receitaVsDespesaMensal} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#52525b" }} />
            <YAxis tick={{ fontSize: 10, fill: "#52525b" }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#71717a" }} />
            <Line dataKey="receita" stroke="#22C55E" strokeWidth={2.5} dot={false} name="Receita" />
            <Line dataKey="despesa" stroke="#EF4444" strokeWidth={2.5} dot={false} name="Despesa" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PessoalPanel() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <TVKpi label="Servidores ativos" value={BI_PESSOAL.forca.ativos.toLocaleString("pt-BR")} color="#22C55E" />
        <TVKpi label="Afastados" value={String(BI_PESSOAL.forca.afastados)} color="#EF4444" />
        <TVKpi label="Em férias" value={String(BI_PESSOAL.forca.ferias)} color="#3B82F6" />
        <TVKpi label="Cargos vagos" value={String(BI_PESSOAL.forca.vagos)} color="#F59E0B" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
          <p className="text-sm font-bold text-white mb-3">Evolução da folha</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BI_PESSOAL.folhaMensal.slice(-6)} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#52525b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#52525b" }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#71717a" }} />
              <Bar dataKey="bruto" fill="#F97316" name="Bruto" radius={[2, 2, 0, 0]} />
              <Bar dataKey="liquido" fill="#22C55E" name="Líquido" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
          <p className="text-sm font-bold text-white mb-3">Por secretaria</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BI_PESSOAL.porSecretaria} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#52525b" }} />
              <YAxis dataKey="sec" type="category" tick={{ fontSize: 10, fill: "#a1a1aa" }} width={65} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="qtd" fill="#8B5CF6" radius={[0, 3, 3, 0]} name="Servidores" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const PANEL_COMPONENTS: Record<PanelId, React.ComponentType> = {
  cockpit: CockpitPanel,
  ouvidoria: OuvidoriaPanel,
  financeiro: FinanceiroPanel,
  pessoal: PessoalPanel,
};

const PANEL_LABELS: Record<PanelId, string> = {
  cockpit: "Cockpit do Prefeito",
  ouvidoria: "Ouvidoria",
  financeiro: "Financeiro",
  pessoal: "Pessoal",
};

export default function BiTv() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [countdown, setCountdown] = useState(PANEL_DURATION);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setActiveIdx(i => (i + 1) % PANELS.length);
          return PANEL_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Panel = PANEL_COMPONENTS[PANELS[activeIdx]!];
  const now = new Date();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-zinc-900 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
            <Tv2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-base font-black text-white">Sala de Situação — {BI_MUNICIPIO.nome}/{BI_MUNICIPIO.uf}</p>
            <p className="text-xs text-zinc-500">Prefeito {BI_MUNICIPIO.prefeito} · Exercício {BI_MUNICIPIO.exercicio}</p>
          </div>
        </div>

        {/* Panel tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-800 rounded-xl p-1">
          {PANELS.map((p, i) => (
            <button
              key={p}
              onClick={() => { setActiveIdx(i); setCountdown(PANEL_DURATION); }}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
                activeIdx === i ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              {PANEL_LABELS[p]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizado {BI_MUNICIPIO.ultimaAtualizacao}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {now.toLocaleTimeString("pt-BR")}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                <circle cx="16" cy="16" r="12" fill="none" stroke="#3f3f46" strokeWidth="3" />
                <circle
                  cx="16" cy="16" r="12" fill="none" stroke="#7c3aed" strokeWidth="3"
                  strokeDasharray={`${(countdown / PANEL_DURATION) * 75.4} 75.4`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-violet-400">{countdown}</span>
            </div>
          </div>
          <Link href="/bi">
            <span className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer">Sair</span>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-800 flex-shrink-0">
        <div
          className="h-full bg-violet-600 transition-none"
          style={{ width: `${((PANEL_DURATION - countdown) / PANEL_DURATION) * 100}%` }}
        />
      </div>

      {/* Panel label */}
      <div className="px-8 pt-4 pb-1 flex-shrink-0">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">
          {PANELS.map((p, i) => (
            <span key={p} className={cn(i === activeIdx ? "text-violet-400" : "")}>
              {i > 0 && <span className="text-zinc-700 mx-2">›</span>}
              {PANEL_LABELS[p]}
            </span>
          ))}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Panel />
      </div>
    </div>
  );
}
