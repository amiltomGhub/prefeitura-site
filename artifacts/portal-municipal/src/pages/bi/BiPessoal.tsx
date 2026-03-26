import { BiLayout } from "@/components/bi/BiLayout";
import { BiCard, BiSection } from "@/components/bi/BiCard";
import { BiGauge, BiProgressGauge } from "@/components/bi/BiGauge";
import { BI_PESSOAL, BI_FINANCEIRO } from "@/data/bi-mock";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLTIP_STYLE = { backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#fff" };

export default function BiPessoal() {
  const { forca, porVinculo, porSecretaria, feriasVencidas, folhaMensal, absenteismo } = BI_PESSOAL;

  return (
    <BiLayout title="Pessoal — BI Analítico">
      <div className="p-5 lg:p-8 max-w-screen-2xl mx-auto space-y-8">

        {/* ROW 1 — Força de Trabalho */}
        <BiSection title="Força de Trabalho" subtitle="Composição e distribuição do quadro funcional">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Servidores Ativos", val: forca.ativos.toLocaleString("pt-BR"), color: "#22C55E", sub: "em exercício" },
              { label: "Afastados", val: String(forca.afastados), color: "#EF4444", sub: "saúde, judicial, etc." },
              { label: "Em Férias", val: String(forca.ferias), color: "#3B82F6", sub: "no período" },
              { label: "Cargos Vagos", val: String(forca.vagos), color: "#F59E0B", sub: "aguardando provimento" },
            ].map((item) => (
              <BiCard key={item.label}>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-2xl font-black tabular-nums" style={{ color: item.color }}>{item.val}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{item.sub}</p>
              </BiCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Por vínculo empregatício</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={porVinculo} dataKey="qtd" nameKey="tipo" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                    {porVinculo.map((v) => <Cell key={v.tipo} fill={v.cor} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Servidores por secretaria</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={porSecretaria} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#52525b" }} />
                  <YAxis dataKey="sec" type="category" tick={{ fontSize: 9, fill: "#a1a1aa" }} width={70} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="qtd" fill="#8B5CF6" radius={[0, 3, 3, 0]} name="Servidores" />
                </BarChart>
              </ResponsiveContainer>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 2 — Férias */}
        <BiSection title="Gestão de Férias" subtitle="Servidores com férias vencidas e impacto financeiro">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BiCard>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <p className="text-xs font-bold text-yellow-400">Férias vencidas — mais de 12 meses sem gozar</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left pb-2 pr-3 text-zinc-600 font-semibold">Servidor</th>
                      <th className="text-left pb-2 pr-3 text-zinc-600 font-semibold">Secretaria</th>
                      <th className="text-right pb-2 pr-3 text-zinc-600 font-semibold">Meses</th>
                      <th className="text-right pb-2 text-zinc-600 font-semibold">Impacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feriasVencidas.map((s) => (
                      <tr key={s.nome} className="border-b border-white/5">
                        <td className="py-2.5 pr-3 text-zinc-200">{s.nome}</td>
                        <td className="py-2.5 pr-3 text-zinc-400">{s.secretaria}</td>
                        <td className="py-2.5 pr-3 text-right font-bold text-red-400 tabular-nums">{s.mesesSemFerias}</td>
                        <td className="py-2.5 text-right font-bold text-orange-400 tabular-nums">{formatCurrency(s.impacto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Calendário de férias — concentração por mês</p>
              <div className="grid grid-cols-6 gap-1.5">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((mes, i) => {
                  const intensity = Math.random();
                  const bg = intensity > 0.7 ? "bg-blue-500" : intensity > 0.4 ? "bg-blue-500/50" : "bg-zinc-800";
                  const count = Math.round(intensity * 280);
                  return (
                    <div key={mes} className="flex flex-col items-center gap-1" title={`${mes}: ${count} servidores`}>
                      <div className={cn("w-full h-8 rounded-md", bg)} />
                      <span className="text-[9px] text-zinc-600">{mes}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-600 mt-2">Concentração de férias — azul mais intenso = mais servidores</p>
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 3 — Folha */}
        <BiSection title="Folha de Pagamento" subtitle="Evolução mensal e conformidade LRF">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BiCard className="lg:col-span-2">
              <p className="text-xs font-bold text-white mb-4">Evolução da folha — {new Date().getFullYear()}</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={folhaMensal} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#52525b" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Line dataKey="bruto" stroke="#F97316" strokeWidth={2} dot={false} name="Bruto" />
                  <Line dataKey="descontos" stroke="#EF4444" strokeWidth={1.5} dot={false} name="Descontos" />
                  <Line dataKey="liquido" stroke="#22C55E" strokeWidth={2} dot={false} name="Líquido" />
                </LineChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard className="flex flex-col items-center justify-center">
              <p className="text-xs font-bold text-white self-start mb-3">LRF — Gastos com pessoal</p>
              <BiGauge
                value={BI_FINANCEIRO.lrf.pessoal.pct}
                max={BI_FINANCEIRO.lrf.pessoal.limite}
                label="Pessoal / RCL"
                sublabel={`Limite: ${BI_FINANCEIRO.lrf.pessoal.limite}%`}
                size={140}
                thresholds={{ warning: BI_FINANCEIRO.lrf.pessoal.limite * 0.9, critical: BI_FINANCEIRO.lrf.pessoal.limite }}
                invertThresholds
              />
            </BiCard>
          </div>
        </BiSection>

        {/* ROW 4 — Absenteísmo */}
        <BiSection title="Absenteísmo e Afastamentos" subtitle="Taxas por secretaria e motivos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Taxa de absenteísmo por secretaria (%)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={absenteismo} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sec" tick={{ fontSize: 9, fill: "#a1a1aa" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#52525b" }} unit="%" />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="taxa" fill="#F97316" name="Taxa %" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </BiCard>
            <BiCard>
              <p className="text-xs font-bold text-white mb-4">Motivos de afastamento — SEMSA</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { nome: "Saúde", valor: absenteismo[0]!.motivo_saude, fill: "#EF4444" },
                      { nome: "Licença", valor: absenteismo[0]!.motivo_licenca, fill: "#3B82F6" },
                      { nome: "Outros", valor: absenteismo[0]!.motivo_outros, fill: "#6B7280" },
                    ]}
                    dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={75} paddingAngle={3}
                  >
                    {[
                      { fill: "#EF4444" },
                      { fill: "#3B82F6" },
                      { fill: "#6B7280" },
                    ].map((c, i) => <Cell key={i} fill={c.fill} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: "#71717a" }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </BiCard>
          </div>
        </BiSection>
      </div>
    </BiLayout>
  );
}
