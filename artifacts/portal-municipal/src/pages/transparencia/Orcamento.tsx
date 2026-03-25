import { Layout } from "@/components/layout/Layout";
import { useGetOrcamento } from "@workspace/api-client-react";
import { TransparenciaPageHeader } from "@/components/transparencia/TransparenciaPageHeader";
import { DocumentDownloadList } from "@/components/transparencia/DocumentDownloadList";
import { ComplianceBadge } from "@/components/transparencia/ComplianceBadge";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { BarChart2, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";

const YEARS = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];
const PIE_COLORS = ["#1351B4", "#168821", "#FFCD07", "#E11D48", "#8B5CF6", "#06B6D4"];

const DOCS_BY_YEAR: Record<number, Array<{ id: string; title: string; description: string; fileUrl?: string; publishedAt: string; fileType: "PDF"; fileSize: string; year: number }>> = {
  [new Date().getFullYear()]: [
    {
      id: "loa-current",
      title: `LOA ${new Date().getFullYear()} — Lei Orçamentária Anual`,
      description: "Lei Orçamentária Anual aprovada pela Câmara Municipal.",
      publishedAt: "2024-01-05T00:00:00Z",
      fileType: "PDF",
      fileSize: "4,2 MB",
      year: new Date().getFullYear(),
    },
    {
      id: "ldo-current",
      title: `LDO ${new Date().getFullYear()} — Lei de Diretrizes Orçamentárias`,
      description: "Diretrizes para elaboração da LOA e das metas fiscais.",
      publishedAt: "2024-07-15T00:00:00Z",
      fileType: "PDF",
      fileSize: "2,1 MB",
      year: new Date().getFullYear(),
    },
    {
      id: "ppa-2022-2025",
      title: "PPA 2022-2025 — Plano Plurianual",
      description: "Plano Plurianual com programas e metas para o período 2022-2025.",
      publishedAt: "2021-12-20T00:00:00Z",
      fileType: "PDF",
      fileSize: "8,7 MB",
      year: 2022,
    },
    {
      id: "rdeo-current",
      title: `RDEO — Relatório de Execução Orçamentária ${new Date().toLocaleString("pt-BR", { month: "long" })}`,
      description: "Relatório de execução orçamentária do mês vigente.",
      publishedAt: new Date().toISOString(),
      fileType: "PDF",
      fileSize: "1,8 MB",
      year: new Date().getFullYear(),
    },
  ],
};

function ProgressBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function Orcamento() {
  const [selectedYear, setSelectedYear] = useState(YEARS[0]!);
  const { data: orcamento, isLoading } = useGetOrcamento({ ano: selectedYear });

  const docs = DOCS_BY_YEAR[selectedYear] ?? DOCS_BY_YEAR[YEARS[0]!] ?? [];

  return (
    <Layout>
      <TransparenciaPageHeader
        title="Orçamento Público"
        subtitle="Documentos orçamentários (LOA, LDO e PPA) e relatórios de execução. Publicação obrigatória conforme LAI, Art. 8°, §1°, II."
        icon={BarChart2}
        laiRef="LAI, Art. 8°, §1°, II — Decreto 7.185/2010"
        lastUpdated={new Date().toISOString()}
        complianceStatus="ok"
        complianceLabel="Documentos Publicados"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Year selector */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-sm font-semibold text-muted-foreground">Exercício:</span>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                selectedYear === y
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-border hover:border-primary"
              }`}
              aria-pressed={selectedYear === y}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse h-28 bg-muted rounded-2xl" />
            ))}
          </div>
        ) : orcamento && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Receita Prevista", value: orcamento.receitaPrevista, color: "text-green-700", bg: "bg-green-50 border-green-200" },
              { label: "Receita Realizada", value: orcamento.receitaRealizada, color: "text-green-600", bg: "bg-green-50/50 border-green-100" },
              { label: "Despesa Prevista", value: orcamento.despesaPrevista, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
              { label: "Despesa Realizada", value: orcamento.despesaRealizada, color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} border rounded-2xl p-5`}>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">{label} {selectedYear}</p>
                <p className={`text-xl font-black ${color}`}>{formatCurrency(value)}</p>
              </div>
            ))}
          </div>
        )}

        {orcamento && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Progress bars */}
            <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-bold text-foreground">Execução Orçamentária</h2>
              <ProgressBar value={orcamento.receitaRealizada} max={orcamento.receitaPrevista} color="bg-green-500" label="Receita — % realizada" />
              <ProgressBar value={orcamento.despesaRealizada} max={orcamento.despesaPrevista} color="bg-orange-500" label="Despesa — % realizada" />
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Saldo Atual</span>
                  <span className={`font-black text-lg ${orcamento.saldoAtual >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {formatCurrency(orcamento.saldoAtual)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <ComplianceBadge status="ok" label="RREO Publicado" />
              </div>
            </div>

            {/* Pie chart by category */}
            <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Despesas por Área</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orcamento.categorias} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={80} paddingAngle={4}>
                      {orcamento.categorias.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                    <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Document list */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-bold text-foreground">Documentos do Exercício {selectedYear}</h2>
          <span className="text-xs text-muted-foreground">{docs.length} documento{docs.length !== 1 ? "s" : ""}</span>
        </div>
        <DocumentDownloadList documents={docs} isLoading={false} emptyMessage="Nenhum documento publicado para este exercício." />
      </div>
    </Layout>
  );
}
