import { BiLayout } from "@/components/bi/BiLayout";
import { BiCard, BiSection, BiLabel } from "@/components/bi/BiCard";
import { BiGauge } from "@/components/bi/BiGauge";
import { BI_OUVIDORIA } from "@/data/bi-mock";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis
} from "recharts";
import { cn } from "@/lib/utils";

const TOOLTIP_STYLE = { backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#fff" };

export default function BiOuvidoria() {
  const npsData = [
    { name: "Promotores", value: BI_OUVIDORIA.nps.promotores, fill: "#22C55E" },
    { name: "Neutros", value: BI_OUVIDORIA.nps.neutros, fill: "#F59E0B" },
    { name: "Detratores", value: BI_OUVIDORIA.nps.detratores, fill: "#EF4444" },
  ];

  return (
    <BiLayout title="Ouvidoria — BI Analítico">
      <div className="p-5 lg:p-8 max-w-screen-2xl mx-auto space-y-8">

        {/* ROW 1 — Volume */}
        <BiSection title="Volume e Tendência" subtitle="Manifestações diárias no período selecionado">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Volume diário (atual vs período anterior)</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={BI_OUVIDORIA.volumeDiario} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dia" tick={{ fontSize: 9, fill: "#52525b" }} interval={4} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line dataKey="atual" stroke="#3B82F6" strokeWidth={2} dot={false} name="Atual" />
                  <Line dataKey="anterior" stroke="#52525b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Período ant." />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                </LineChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Acumulado do período</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={BI_OUVIDORIA.volumeDiario} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="ga1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dia" tick={{ fontSize: 9, fill: "#52525b" }} interval={4} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area dataKey="atual" stroke="#8B5CF6" fill="url(#ga1)" strokeWidth={2} dot={false} name="Volume" />
                </AreaChart>
              </ResponsiveContainer>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 2 — Composição */}
        <BiSection title="Composição" subtitle="Distribuição por tipo e categorias mais demandadas">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <BiCard className="lg:col-span-2">
              <p className="text-xs font-bold text-white mb-4">Por tipo de manifestação</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={BI_OUVIDORIA.porTipo} dataKey="valor" nameKey="nome" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {BI_OUVIDORIA.porTipo.map((e) => <Cell key={e.nome} fill={e.cor} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard className="lg:col-span-3">
              <p className="text-xs font-bold text-white mb-4">Top 10 categorias</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={BI_OUVIDORIA.topCategorias} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#52525b" }} />
                  <YAxis dataKey="cat" type="category" tick={{ fontSize: 9, fill: "#a1a1aa" }} width={130} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="total" fill="#3B82F6" radius={[0, 3, 3, 0]} name="Total" />
                  <Bar dataKey="resolvidas" fill="#22C55E" radius={[0, 3, 3, 0]} name="Resolvidas" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                </BarChart>
              </ResponsiveContainer>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 3 — Performance */}
        <BiSection title="Performance Operacional" subtitle="SLA por secretaria e taxa de resolução">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BiCard className="lg:col-span-2">
              <p className="text-xs font-bold text-white mb-4">Manifestações por secretaria (recebidas | no prazo | atrasadas)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={BI_OUVIDORIA.porSecretaria} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sec" tick={{ fontSize: 9, fill: "#a1a1aa" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Bar dataKey="recebidas" fill="#3B82F6" name="Recebidas" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="noPrazo" fill="#22C55E" name="No prazo" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="atrasadas" fill="#EF4444" name="Atrasadas" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard className="flex flex-col items-center justify-center gap-2">
              <p className="text-xs font-bold text-white self-start mb-1">Taxa de resolução no prazo</p>
              <BiGauge
                value={BI_OUVIDORIA.slaGeral}
                label="SLA Geral"
                sublabel={`Meta: ${BI_OUVIDORIA.slaMeta}%`}
                size={140}
                thresholds={{ warning: BI_OUVIDORIA.slaMeta, critical: BI_OUVIDORIA.slaMeta }}
                invertThresholds={false}
              />
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 4 — NPS */}
        <BiSection title="Satisfação e Qualidade" subtitle="Net Promoter Score e avaliações dos cidadãos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BiCard className="flex flex-col items-center justify-center py-6">
              <p className="text-xs font-bold text-white mb-2">NPS Score</p>
              <p className="text-5xl font-black tabular-nums" style={{ color: BI_OUVIDORIA.nps.score > 50 ? "#22C55E" : BI_OUVIDORIA.nps.score > 0 ? "#F59E0B" : "#EF4444" }}>
                {BI_OUVIDORIA.nps.score}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Net Promoter Score</p>
              <div className="flex gap-3 mt-3">
                {npsData.map(d => (
                  <div key={d.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-[10px] text-zinc-500">{d.name} {d.value}%</span>
                  </div>
                ))}
              </div>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-3">Distribuição de avaliações</p>
              <div className="space-y-2">
                {[...BI_OUVIDORIA.avaliacoes].reverse().map((a) => (
                  <div key={a.estrelas} className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 w-6">{a.estrelas}★</span>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: `${a.pct}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-zinc-500 w-7">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </BiCard>
            <BiCard className="sm:col-span-2">
              <p className="text-xs font-bold text-white mb-3">Distribuição NPS</p>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={npsData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2}>
                    {npsData.map((e) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 5 — Canais */}
        <BiSection title="Canais de Entrada" subtitle="Origem das manifestações e tendência digital">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Por canal</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={BI_OUVIDORIA.canais} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                    {BI_OUVIDORIA.canais.map((c) => <Cell key={c.nome} fill={c.cor} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-3">Top manifestações sem resolução</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2 pr-3 text-zinc-600 font-semibold">Protocolo</th>
                      <th className="text-left py-2 pr-3 text-zinc-600 font-semibold">Secretaria</th>
                      <th className="text-right py-2 pr-3 text-zinc-600 font-semibold">Dias</th>
                      <th className="text-left py-2 text-zinc-600 font-semibold">Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BI_OUVIDORIA.semResolucao.map((m) => (
                      <tr key={m.protocolo} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="py-2.5 pr-3 font-mono text-violet-400">{m.protocolo}</td>
                        <td className="py-2.5 pr-3 text-zinc-300">{m.secretaria}</td>
                        <td className="py-2.5 pr-3 text-right">
                          <span className={cn("font-bold tabular-nums", m.diasAbertos > 20 ? "text-red-400" : "text-yellow-400")}>{m.diasAbertos}</span>
                        </td>
                        <td className="py-2.5 text-zinc-400">{m.responsavel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BiCard>
          </div>
        </BiSection>
      </div>
    </BiLayout>
  );
}
