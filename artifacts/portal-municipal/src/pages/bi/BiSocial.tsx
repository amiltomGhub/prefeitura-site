import { BiLayout } from "@/components/bi/BiLayout";
import { BiCard, BiSection } from "@/components/bi/BiCard";
import { BiGauge } from "@/components/bi/BiGauge";
import { BI_SOCIAL } from "@/data/bi-mock";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend
} from "recharts";

const TOOLTIP_STYLE = { backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#fff" };

export default function BiSocial() {
  const { saude, educacao } = BI_SOCIAL;

  return (
    <BiLayout title="Saúde & Educação — BI Analítico">
      <div className="p-5 lg:p-8 max-w-screen-2xl mx-auto space-y-8">

        {/* ─── SAÚDE ───────────────────────────────────────────────── */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-red-500/50 rounded-full" />
          <BiSection title="Saúde Municipal" subtitle="Indicadores das UBS, vacinação e hospitalização" className="pl-4">

            {/* Atendimentos */}
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Atendimentos nas UBS — {new Date().getFullYear()}</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={saude.atendimentosMensais} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#52525b" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => v.toLocaleString("pt-BR")} />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Line dataKey="consultas" stroke="#EF4444" strokeWidth={2} dot={false} name="Consultas" />
                  <Line dataKey="exames" stroke="#F97316" strokeWidth={2} dot={false} name="Exames" />
                </LineChart>
              </ResponsiveContainer>
            </BiCard>

            {/* Vacinas */}
            <div>
              <p className="text-xs font-bold text-white mb-3">Cobertura vacinal</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {saude.vacinas.map((v) => (
                  <BiCard key={v.tipo} className="flex flex-col items-center py-4 gap-1">
                    <BiGauge
                      value={v.cobertura}
                      label={v.tipo}
                      sublabel={`Meta: ${v.meta}%`}
                      size={110}
                      thresholds={{ warning: v.meta * 0.9, critical: v.meta }}
                      invertThresholds={false}
                    />
                  </BiCard>
                ))}
              </div>
            </div>

            {/* Internações */}
            <div className="grid grid-cols-2 gap-4">
              <BiCard>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total de internações</p>
                <p className="text-3xl font-black text-white tabular-nums">{saude.internacoes.total.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-zinc-500 mt-1">no período</p>
              </BiCard>
              <BiCard>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Tempo médio de espera</p>
                <p className="text-3xl font-black text-white tabular-nums">{saude.internacoes.tempoMedio}</p>
                <p className="text-xs text-zinc-500 mt-1">dias (hospitalização)</p>
              </BiCard>
            </div>
          </BiSection>
        </div>

        {/* ─── EDUCAÇÃO ────────────────────────────────────────────── */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500/50 rounded-full" />
          <BiSection title="Educação Municipal" subtitle="Matrículas, abandono escolar e infraestrutura" className="pl-4">

            {/* Matrículas */}
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Matrículas por nível de ensino</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={educacao.matriculasPorNivel} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="nivel" tick={{ fontSize: 9, fill: "#a1a1aa" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => v.toLocaleString("pt-BR")} />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Bar dataKey="matriculas" fill="#3B82F6" name="Matrículas" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="capacidade" fill="#3B82F6" fillOpacity={0.2} name="Capacidade" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </BiCard>

            {/* Abandono + Infraestrutura */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BiCard>
                <p className="text-xs font-bold text-white mb-4">Taxa de abandono escolar (%)</p>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={educacao.taxaAbandono} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="ano" tick={{ fontSize: 9, fill: "#52525b" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#52525b" }} unit="%" />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => `${v}%`} />
                    <Line dataKey="taxa" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: "#8B5CF6" }} name="Taxa abandono" />
                  </LineChart>
                </ResponsiveContainer>
              </BiCard>
              <BiCard>
                <p className="text-xs font-bold text-white mb-4">Infraestrutura escolar — estado de conservação</p>
                <div className="flex flex-col gap-3 mt-4">
                  {[
                    { label: "Bom estado", pct: educacao.infraestrutura.bomEstado, color: "#22C55E" },
                    { label: "Regular", pct: educacao.infraestrutura.regular, color: "#F59E0B" },
                    { label: "Ruim / necessita reforma", pct: educacao.infraestrutura.ruim, color: "#EF4444" },
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300">{item.label}</span>
                        <span className="font-bold tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </BiCard>
            </div>
          </BiSection>
        </div>
      </div>
    </BiLayout>
  );
}
