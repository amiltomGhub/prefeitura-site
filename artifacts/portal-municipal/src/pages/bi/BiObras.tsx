import { BiLayout } from "@/components/bi/BiLayout";
import { BiCard, BiSection } from "@/components/bi/BiCard";
import { BI_OBRAS } from "@/data/bi-mock";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle, PauseCircle, Construction } from "lucide-react";

const STATUS_CONFIG = {
  em_andamento: { label: "Em andamento", cor: "#3B82F6", bg: "bg-blue-500/15", border: "border-blue-500/30", Icon: Construction },
  concluida: { label: "Concluída", cor: "#22C55E", bg: "bg-green-500/15", border: "border-green-500/30", Icon: CheckCircle },
  paralisada: { label: "Paralisada", cor: "#EF4444", bg: "bg-red-500/15", border: "border-red-500/30", Icon: PauseCircle },
};

const GANTT_MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MES_INDEX: Record<string, number> = { Jan: 0, Fev: 1, Mar: 2, Abr: 3, Mai: 4, Jun: 5, Jul: 6, Ago: 7, Set: 8, Out: 9, Nov: 10, Dez: 11 };

function parseObra(inicio: string, fim: string) {
  const [imStr, iyStr] = inicio.split("/");
  const [fmStr, fyStr] = fim.split("/");
  const im = imStr ? MES_INDEX[imStr] ?? 0 : 0;
  const fm = fmStr ? MES_INDEX[fmStr] ?? 11 : 11;
  const iy = parseInt(iyStr ?? "26", 10);
  const fy = parseInt(fyStr ?? "26", 10);
  const startCol = iy <= 26 ? im : 0;
  const endCol = fy <= 26 ? fm : 11;
  return { startCol, span: Math.max(1, endCol - startCol + 1) };
}

export default function BiObras() {
  const ativas = BI_OBRAS.filter(o => o.status === "em_andamento");
  const paralisadas = BI_OBRAS.filter(o => o.status === "paralisada");
  const concluidas = BI_OBRAS.filter(o => o.status === "concluida");
  const atrasadas = BI_OBRAS.filter(o => o.pctFisico < o.pctEsperado && o.status === "em_andamento");

  return (
    <BiLayout title="Obras & Infraestrutura — BI Analítico">
      <div className="p-5 lg:p-8 max-w-screen-2xl mx-auto space-y-8">

        {/* Cards resumo */}
        <BiSection title="Painel de Obras" subtitle="Acompanhamento de obras e projetos de infraestrutura">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Obras Ativas", val: String(ativas.length), color: "#3B82F6", sub: "em andamento" },
              { label: "Concluídas no período", val: String(concluidas.length), color: "#22C55E", sub: "no exercício" },
              { label: "Paralisadas", val: String(paralisadas.length), color: "#EF4444", sub: "requerem atenção" },
              { label: "Com atraso no cronograma", val: String(atrasadas.length), color: "#F59E0B", sub: "abaixo do esperado" },
            ].map(item => (
              <BiCard key={item.label}>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-2xl font-black tabular-nums" style={{ color: item.color }}>{item.val}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{item.sub}</p>
              </BiCard>
            ))}
          </div>
        </BiSection>

        {/* Alertas de atraso */}
        {atrasadas.length > 0 && (
          <BiCard className="border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="text-xs font-bold text-yellow-400">Obras com execução física abaixo do cronograma contratual</p>
            </div>
            <div className="space-y-2">
              {atrasadas.map(o => (
                <div key={o.id} className="flex items-center gap-3 text-xs text-zinc-300">
                  <span className="flex-1 font-medium">{o.nome}</span>
                  <span className="text-red-400 font-bold">{o.pctFisico}% realizado</span>
                  <span className="text-zinc-500">vs</span>
                  <span className="text-yellow-400 font-bold">{o.pctEsperado}% esperado</span>
                  <span className="text-zinc-600">({o.secretaria})</span>
                </div>
              ))}
            </div>
          </BiCard>
        )}

        {/* Lista de obras */}
        <BiSection title="Todas as Obras" subtitle="Status detalhado e execução física">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {BI_OBRAS.map(obra => {
              const cfg = STATUS_CONFIG[obra.status];
              const atrasada = obra.pctFisico < obra.pctEsperado && obra.status === "em_andamento";
              return (
                <BiCard key={obra.id} className={cn("border", cfg.border, atrasada && "border-yellow-500/30")}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white leading-snug">{obra.nome}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{obra.secretaria} · {obra.bairro}</p>
                    </div>
                    <span className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0", cfg.bg)} style={{ color: cfg.cor }}>
                      <cfg.Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-500">Execução física</span>
                        <div className="flex items-center gap-2">
                          {atrasada && <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                          <span className="font-bold" style={{ color: atrasada ? "#F59E0B" : cfg.cor }}>{obra.pctFisico}%</span>
                          <span className="text-zinc-600">/ esperado {obra.pctEsperado}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                        <div className="absolute h-full bg-zinc-600 rounded-full" style={{ width: `${obra.pctEsperado}%` }} />
                        <div className="absolute h-full rounded-full transition-all" style={{ width: `${obra.pctFisico}%`, backgroundColor: atrasada ? "#F59E0B" : cfg.cor }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Valor: <span className="font-bold text-zinc-300">{formatCurrency(obra.valor)}</span></span>
                      <span>{obra.inicio} → {obra.fim}</span>
                    </div>
                  </div>
                </BiCard>
              );
            })}
          </div>
        </BiSection>

        {/* Gantt */}
        <BiSection title="Cronograma Gantt — 2026" subtitle="Timeline de obras por mês">
          <BiCard noPad>
            <div className="p-4 overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 pr-4 text-zinc-600 font-semibold w-56">Obra</th>
                    {GANTT_MESES.map(m => (
                      <th key={m} className="text-center py-2 text-zinc-600 font-semibold w-16">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BI_OBRAS.map(obra => {
                    const cfg = STATUS_CONFIG[obra.status];
                    const { startCol, span } = parseObra(obra.inicio, obra.fim);
                    return (
                      <tr key={obra.id} className="border-b border-white/5">
                        <td className="py-2.5 pr-4">
                          <p className="text-zinc-200 font-medium leading-snug">{obra.nome}</p>
                          <p className="text-zinc-600 text-[10px]">{obra.secretaria}</p>
                        </td>
                        {GANTT_MESES.map((_, colIdx) => {
                          const inRange = colIdx >= startCol && colIdx < startCol + span;
                          const isFirst = colIdx === startCol;
                          const isLast = colIdx === startCol + span - 1;
                          return (
                            <td key={colIdx} className="py-2.5 relative">
                              {inRange && (
                                <div
                                  className="h-5 text-[9px] font-bold flex items-center justify-center text-white"
                                  style={{
                                    backgroundColor: cfg.cor + "40",
                                    borderTop: `2px solid ${cfg.cor}`,
                                    borderBottom: `2px solid ${cfg.cor}`,
                                    borderLeft: isFirst ? `2px solid ${cfg.cor}` : "none",
                                    borderRight: isLast ? `2px solid ${cfg.cor}` : "none",
                                    borderRadius: isFirst && isLast ? 4 : isFirst ? "4px 0 0 4px" : isLast ? "0 4px 4px 0" : 0,
                                  }}
                                >
                                  {isFirst ? `${obra.pctFisico}%` : ""}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </BiCard>
        </BiSection>
      </div>
    </BiLayout>
  );
}
