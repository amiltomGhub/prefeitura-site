import { BiLayout } from "@/components/bi/BiLayout";
import { BiCard, BiSection } from "@/components/bi/BiCard";
import { BiGauge, BiProgressGauge } from "@/components/bi/BiGauge";
import { BI_FINANCEIRO } from "@/data/bi-mock";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const TOOLTIP_STYLE = { backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#fff" };

function LRFStatus({ pct, limite, label }: { pct: number; limite: number; label: string }) {
  const ratio = pct / limite;
  const color = ratio > 1 ? "text-red-400" : ratio > 0.9 ? "text-yellow-400" : "text-green-400";
  const bgColor = ratio > 1 ? "bg-red-500/15 border-red-500/30" : ratio > 0.9 ? "bg-yellow-500/15 border-yellow-500/30" : "bg-green-500/15 border-green-500/30";
  const Icon = ratio > 1 ? AlertTriangle : ratio > 0.9 ? Clock : CheckCircle;
  return (
    <div className={cn("rounded-xl border p-4 flex flex-col items-center gap-3", bgColor)}>
      <BiGauge
        value={pct}
        max={limite}
        label={label}
        sublabel={`Limite: ${limite}%`}
        size={120}
        thresholds={{ warning: limite * 0.9, critical: limite }}
        invertThresholds
      />
      <div className={cn("flex items-center gap-1.5 text-xs font-bold", color)}>
        <Icon className="w-3.5 h-3.5" />
        {pct.toFixed(1)}% / {limite}% RCL
      </div>
    </div>
  );
}

export default function BiFinanceiro() {
  const { orcamento, porFuncao, receitaVsDespesaMensal, receitasPorFonte, lrf, contratos } = BI_FINANCEIRO;

  return (
    <BiLayout title="Financeiro — BI Analítico">
      <div className="p-5 lg:p-8 max-w-screen-2xl mx-auto space-y-8">

        {/* ROW 1 — Orçamento LOA */}
        <BiSection title="Orçamento (LOA)" subtitle="Execução orçamentária por função de governo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BiCard>
              <p className="text-xs font-bold text-white mb-3">Dotação x Execução</p>
              <div className="space-y-3">
                {[
                  { label: "Dotação Inicial", val: orcamento.dotacaoInicial, color: "#52525b" },
                  { label: "Suplementações (+)", val: orcamento.suplementacoes, color: "#22C55E" },
                  { label: "Reduções (-)", val: orcamento.reducoes, color: "#EF4444" },
                  { label: "Dotação Atual", val: orcamento.dotacaoAtual, color: "#3B82F6" },
                  { label: "Executado", val: orcamento.executado, color: "#8B5CF6" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{item.label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: item.color }}>{formatCurrency(item.val)}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <BiProgressGauge label="% Execução global" value={orcamento.executado} max={orcamento.dotacaoAtual} color="#8B5CF6" />
                </div>
              </div>
            </BiCard>
            <BiCard className="lg:col-span-2">
              <p className="text-xs font-bold text-white mb-4">Execução por função de governo</p>
              <div className="space-y-2.5">
                {porFuncao.map((f) => (
                  <div key={f.funcao} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300">{f.funcao}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">{formatCurrency(f.executado)}</span>
                        <span className="text-[10px] font-bold" style={{ color: f.cor }}>
                          {Math.round((f.executado / f.dotacao) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(f.executado / f.dotacao) * 100}%`, backgroundColor: f.cor }} />
                    </div>
                  </div>
                ))}
              </div>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 2 — Receitas x Despesas */}
        <BiSection title="Receitas vs Despesas" subtitle="Evolução mensal do exercício e composição das receitas">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <BiCard className="lg:col-span-3">
              <p className="text-xs font-bold text-white mb-4">Receitas vs Despesas — {new Date().getFullYear()}</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={receitaVsDespesaMensal} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#52525b" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Line dataKey="receita" stroke="#22C55E" strokeWidth={2} dot={false} name="Receita" />
                  <Line dataKey="despesa" stroke="#EF4444" strokeWidth={2} dot={false} name="Despesa" />
                </LineChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard className="lg:col-span-2">
              <p className="text-xs font-bold text-white mb-4">Receitas por fonte</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={receitasPorFonte} dataKey="valor" nameKey="fonte" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {receitasPorFonte.map((f) => <Cell key={f.fonte} fill={f.cor} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 3 — LRF */}
        <BiSection title="LRF — Lei de Responsabilidade Fiscal" subtitle="Indicadores críticos de controle fiscal">
          <BiCard>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Gauges LRF</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Verde: dentro do limite · Amarelo: atenção (90%) · Vermelho: limite atingido</p>
              </div>
              <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-1 rounded-lg">Fonte: SIAFEM · Atualizado hoje</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <LRFStatus pct={lrf.pessoal.pct} limite={lrf.pessoal.limite} label="Gastos c/ Pessoal / RCL" />
              <LRFStatus pct={lrf.divida.pct} limite={lrf.divida.limite} label="Dívida Consolidada / RCL" />
              <LRFStatus pct={lrf.credito.pct} limite={lrf.credito.limite} label="Operações de Crédito / RCL" />
            </div>
          </BiCard>
        </BiSection>

        {/* ROW 4 — Licitações */}
        <BiSection title="Licitações e Contratos" subtitle="Funil de contratações e contratos próximos do vencimento">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Funil de licitações</p>
              <div className="space-y-2">
                {contratos.funil.map((item, i) => {
                  const maxVal = contratos.funil[0]!.valor;
                  const pct = (item.valor / maxVal) * 100;
                  const colors = ["#3B82F6", "#8B5CF6", "#F97316", "#22C55E"];
                  return (
                    <div key={item.etapa} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-36 flex-shrink-0">{item.etapa}</span>
                      <div className="flex-1 h-6 bg-zinc-800 rounded-lg overflow-hidden relative">
                        <div className="h-full rounded-lg transition-all" style={{ width: `${pct}%`, backgroundColor: colors[i] }} />
                        <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-white">{item.valor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs font-bold text-white mb-3">Valor contratado por secretaria</p>
                <div className="space-y-2">
                  {contratos.porSecretaria.map((s) => (
                    <div key={s.sec} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 w-20 flex-shrink-0">{s.sec}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.valor / contratos.porSecretaria[0]!.valor) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-zinc-400 w-24 text-right">{formatCurrency(s.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Contratos próximos do vencimento (60 dias)</p>
              <div className="space-y-3">
                {contratos.proxVencimento.map((c) => (
                  <div key={c.numero} className={cn(
                    "rounded-xl border p-3 space-y-1.5",
                    c.diasRestantes <= 20 ? "bg-red-500/8 border-red-500/20" : c.diasRestantes <= 35 ? "bg-yellow-500/8 border-yellow-500/20" : "bg-zinc-800 border-white/5"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">Contrato {c.numero}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        c.diasRestantes <= 20 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {c.diasRestantes}d restantes
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-snug">{c.objeto}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{c.secretaria}</span>
                      <span className="font-bold text-zinc-400">{formatCurrency(c.valor)}</span>
                      <span>Venc. {c.vencimento}</span>
                    </div>
                  </div>
                ))}
              </div>
            </BiCard>
          </div>
        </BiSection>
      </div>
    </BiLayout>
  );
}
