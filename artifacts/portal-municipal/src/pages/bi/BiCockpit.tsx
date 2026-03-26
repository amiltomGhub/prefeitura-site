import { useState } from "react";
import { Link } from "wouter";
import {
  DollarSign, TrendingDown, BarChart2, Users, Megaphone, Clock, Star, Shield,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from "recharts";
import { BiLayout } from "@/components/bi/BiLayout";
import { BiCard, BIKpiCard, BiSection, BiAlertItem, BiLabel } from "@/components/bi/BiCard";
import { BiSparkline } from "@/components/bi/BiSparkline";
import { BiChoropleth } from "@/components/bi/BiChoropleth";
import { BI_KPIS, BI_ALERTAS, BI_BAIRROS, BI_MUNICIPIO } from "@/data/bi-mock";
import { formatCurrency } from "@/lib/utils";

type BairroSel = (typeof BI_BAIRROS)[number] | null;

const CAMADAS = [
  { id: "ouvidoria", label: "Ouvidoria", cor: "#EF4444" },
  { id: "obras", label: "Obras", cor: "#F97316" },
  { id: "saude", label: "Saúde", cor: "#22C55E" },
  { id: "educacao", label: "Educação", cor: "#3B82F6" },
];

export default function BiCockpit() {
  const [selectedBairro, setSelectedBairro] = useState<BairroSel>(null);
  const [camadaAtiva, setCamadaAtiva] = useState("ouvidoria");

  const topBairros = [...BI_BAIRROS].sort((a, b) => b.demandas - a.demandas).slice(0, 5);

  return (
    <BiLayout title={`Cockpit — ${BI_MUNICIPIO.nome}`}>
      <div className="p-5 lg:p-8 max-w-screen-2xl mx-auto space-y-8">

        {/* ─── KPIs ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-base font-black text-white">Cockpit do Prefeito</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Sala de Situação Digital — {BI_MUNICIPIO.nome}/{BI_MUNICIPIO.uf} · Exercício {BI_MUNICIPIO.exercicio}</p>
            </div>
          </div>

          {/* Linha 1 — Finanças */}
          <div className="mb-2">
            <BiLabel className="mb-2 px-1">Finanças e Orçamento</BiLabel>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link href="/bi/financeiro">
                <BIKpiCard
                  label="Receita arrecadada"
                  value={`${BI_KPIS.receita.pct}%`}
                  sub={`${formatCurrency(BI_KPIS.receita.valor)} / meta ${formatCurrency(BI_KPIS.receita.meta)}`}
                  variacao={BI_KPIS.receita.variacao}
                  variacaoLabel="vs período ant."
                  icon={DollarSign}
                  cor="bg-green-500/15 text-green-400"
                  status="ok"
                  spark={<BiSparkline data={BI_KPIS.receita.spark} color="#22C55E" />}
                />
              </Link>
              <Link href="/bi/financeiro">
                <BIKpiCard
                  label="Despesas executadas"
                  value={`${BI_KPIS.despesa.pct}%`}
                  sub={`${formatCurrency(BI_KPIS.despesa.valor)} / dotação`}
                  variacao={BI_KPIS.despesa.variacao}
                  icon={TrendingDown}
                  cor="bg-blue-500/15 text-blue-400"
                  status="ok"
                  spark={<BiSparkline data={BI_KPIS.despesa.spark} color="#3B82F6" />}
                />
              </Link>
              <Link href="/bi/financeiro">
                <BIKpiCard
                  label="Resultado do período"
                  value={formatCurrency(BI_KPIS.resultado.valor)}
                  sub={BI_KPIS.resultado.tipo === "superavit" ? "Superávit" : "Déficit"}
                  variacao={BI_KPIS.resultado.variacao}
                  icon={BarChart2}
                  cor="bg-violet-500/15 text-violet-400"
                  status="ok"
                  spark={<BiSparkline data={BI_KPIS.resultado.spark} color="#8B5CF6" />}
                />
              </Link>
              <Link href="/bi/financeiro">
                <BIKpiCard
                  label="Pessoal / RCL (LRF)"
                  value={`${BI_KPIS.lrf.pct}%`}
                  sub={`Limite: ${BI_KPIS.lrf.limite}%`}
                  variacao={BI_KPIS.lrf.variacao}
                  invertColors
                  icon={Shield}
                  cor="bg-yellow-500/15 text-yellow-400"
                  status="ok"
                  spark={<BiSparkline data={BI_KPIS.lrf.spark} color="#F59E0B" />}
                />
              </Link>
            </div>
          </div>

          {/* Linha 2 — Operacional */}
          <div>
            <BiLabel className="mb-2 mt-5 px-1">Operacional</BiLabel>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link href="/bi/ouvidoria">
                <BIKpiCard
                  label="Manifestações abertas"
                  value={String(BI_KPIS.manifestacoes.abertas)}
                  variacao={BI_KPIS.manifestacoes.variacao}
                  variacaoLabel="vs período ant."
                  invertColors
                  icon={Megaphone}
                  cor="bg-red-500/15 text-red-400"
                  spark={<BiSparkline data={BI_KPIS.manifestacoes.spark} color="#EF4444" />}
                />
              </Link>
              <Link href="/bi/ouvidoria">
                <BIKpiCard
                  label="% resolvidas no prazo (SLA)"
                  value={`${BI_KPIS.sla.pct}%`}
                  sub={`Meta: ${BI_KPIS.sla.meta}%`}
                  variacao={BI_KPIS.sla.variacao}
                  icon={Clock}
                  cor="bg-cyan-500/15 text-cyan-400"
                  status={BI_KPIS.sla.pct >= BI_KPIS.sla.meta ? "ok" : "warning"}
                  spark={<BiSparkline data={BI_KPIS.sla.spark} color="#06B6D4" />}
                />
              </Link>
              <Link href="/bi/pessoal">
                <BIKpiCard
                  label="Servidores ativos"
                  value={BI_KPIS.servidores.ativos.toLocaleString("pt-BR")}
                  sub={`${BI_KPIS.servidores.afastados} afastados`}
                  variacao={BI_KPIS.servidores.variacao}
                  icon={Users}
                  cor="bg-orange-500/15 text-orange-400"
                  spark={<BiSparkline data={BI_KPIS.servidores.spark} color="#F97316" />}
                />
              </Link>
              <Link href="/bi/ouvidoria">
                <BIKpiCard
                  label="NPS do cidadão"
                  value={String(BI_KPIS.nps.score)}
                  sub="Net Promoter Score"
                  variacao={BI_KPIS.nps.variacao}
                  icon={Star}
                  cor="bg-pink-500/15 text-pink-400"
                  spark={<BiSparkline data={BI_KPIS.nps.spark} color="#EC4899" />}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Mapa + Top Bairros ───────────────────────────────────── */}
        <BiSection title="Mapa da Cidade" subtitle="Intensidade de demandas por bairro · clique para detalhes">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <BiCard noPad>
                {/* Camadas */}
                <div className="flex items-center gap-2 flex-wrap p-3 border-b border-white/5">
                  {CAMADAS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCamadaAtiva(c.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors border ${
                        camadaAtiva === c.id
                          ? "text-white border-transparent"
                          : "text-zinc-400 border-white/10 hover:text-white"
                      }`}
                      style={camadaAtiva === c.id ? { backgroundColor: c.cor + "30", borderColor: c.cor } : {}}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.cor }} />
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="p-4">
                  <BiChoropleth onSelectBairro={setSelectedBairro} />
                </div>
              </BiCard>
            </div>

            <div className="space-y-3">
              {/* Selected bairro detail */}
              {selectedBairro && (
                <BiCard className="border-violet-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-white">{selectedBairro.nome}</p>
                    <button onClick={() => setSelectedBairro(null)} className="text-xs text-zinc-500 hover:text-white">✕</button>
                  </div>
                  <p className="text-3xl font-black text-white tabular-nums mb-1">{selectedBairro.demandas}</p>
                  <p className="text-xs text-zinc-500">manifestações no período</p>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <Link href="/bi/ouvidoria">
                      <span className="text-xs text-violet-400 hover:text-violet-300 cursor-pointer">Ver detalhe da ouvidoria →</span>
                    </Link>
                  </div>
                </BiCard>
              )}

              {/* Top 5 bairros */}
              <BiCard>
                <p className="text-xs font-bold text-white mb-3">Top 5 — Mais demandas</p>
                <div className="space-y-2.5">
                  {topBairros.map((b, i) => (
                    <div key={b.id} className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-600 w-3">{i + 1}</span>
                      <span className="flex-1 text-xs text-zinc-300">{b.nome}</span>
                      <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(b.demandas / topBairros[0]!.demandas) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-zinc-400 w-8 text-right">{b.demandas}</span>
                    </div>
                  ))}
                </div>
              </BiCard>

              {/* Quick links */}
              <BiCard>
                <p className="text-xs font-bold text-white mb-3">Acesso rápido</p>
                <div className="space-y-1">
                  {[
                    { label: "Ouvidoria BI", href: "/bi/ouvidoria", color: "text-red-400" },
                    { label: "Financeiro BI", href: "/bi/financeiro", color: "text-green-400" },
                    { label: "Pessoal BI", href: "/bi/pessoal", color: "text-orange-400" },
                    { label: "Obras BI", href: "/bi/obras", color: "text-yellow-400" },
                    { label: "Saúde & Educação", href: "/bi/social", color: "text-cyan-400" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}>
                      <span className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${l.color}`}>
                        → {l.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </BiCard>
            </div>
          </div>
        </BiSection>

        {/* ─── Alertas ─────────────────────────────────────────────── */}
        <BiSection title="Alertas — Ações necessárias" subtitle="Itens que exigem atenção imediata do gestor">
          <BiCard>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-red-400">{BI_ALERTAS.filter(a => a.urgencia === "critica").length} críticos</span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs text-orange-400">{BI_ALERTAS.filter(a => a.urgencia === "alta").length} alta prioridade</span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs text-yellow-400">{BI_ALERTAS.filter(a => a.urgencia === "media").length} média prioridade</span>
            </div>
            <div className="space-y-2">
              {BI_ALERTAS.map((a) => (
                <BiAlertItem key={a.id} {...a} />
              ))}
            </div>
          </BiCard>
        </BiSection>
      </div>
    </BiLayout>
  );
}
