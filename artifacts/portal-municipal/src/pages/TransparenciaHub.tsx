import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useGetOrcamento } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { TransparencyCard } from "@/components/transparencia/TransparencyCard";
import { ComplianceBadge } from "@/components/transparencia/ComplianceBadge";
import { useState } from "react";
import {
  BarChart2, TrendingDown, TrendingUp, Users, FileText, BookOpen,
  MessageSquare, Database, Shield, Search, ExternalLink, ArrowRight,
  PieChartIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const PIE_COLORS = ["#1351B4", "#168821", "#FFCD07", "#E11D48", "#8B5CF6", "#06B6D4"];

const LAI_SECTIONS = [
  {
    icon: BarChart2,
    title: "Orçamento",
    description: "LOA, LDO e PPA. Documentos orçamentários por exercício com download em PDF.",
    href: "/transparencia/orcamento",
    laiRef: "LAI, Art. 8°, §1°, II",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: false,
  },
  {
    icon: TrendingDown,
    title: "Despesas",
    description: "Empenhos, liquidações e pagamentos. Filtros por secretaria, período e categoria.",
    href: "/transparencia/despesas",
    laiRef: "LAI, Art. 8°, §1°, III",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Receitas",
    description: "Arrecadação municipal por fonte e categoria. Comparativo mensal com gráficos.",
    href: "/transparencia/receitas",
    laiRef: "LAI, Art. 8°, §1°, III",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: false,
  },
  {
    icon: FileText,
    title: "Licitações e Contratos",
    description: "Editais, pregões, dispensas e contratos com download e status detalhado.",
    href: "/transparencia/licitacoes",
    laiRef: "LAI, Art. 8°, §1°, IV",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: true,
    badge: "Popular",
  },
  {
    icon: Users,
    title: "Servidores",
    description: "Folha de pagamento, cargos e vínculos. Remunerações com aviso LGPD.",
    href: "/transparencia/servidores",
    laiRef: "LAI, Art. 8°, §1°, VI",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: false,
  },
  {
    icon: BookOpen,
    title: "Atos Normativos",
    description: "Decretos, portarias, leis e resoluções. Busca por número, data ou ementa.",
    href: "/transparencia/legislacao",
    laiRef: "LAI, Art. 8°, §1°, I",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: false,
  },
  {
    icon: MessageSquare,
    title: "SIC — Serviço de Informação ao Cidadão",
    description: "Formulário e-SIC, acompanhamento por protocolo e estatísticas de atendimento.",
    href: "/transparencia/sic",
    laiRef: "LAI, Art. 9°, I, b",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: true,
    badge: "e-SIC",
  },
  {
    icon: Database,
    title: "Dados Abertos",
    description: "Catálogo de datasets públicos nos formatos CSV, JSON e XML com metadados.",
    href: "/transparencia/dados-abertos",
    laiRef: "LAI, Art. 8°, §3°, II",
    complianceStatus: "ok" as const,
    lastUpdated: new Date().toISOString(),
    highlight: false,
  },
];

const MONTHLY_MOCK = [
  { mes: "Jan", receita: 18000000, despesa: 14000000 },
  { mes: "Fev", receita: 16000000, despesa: 15500000 },
  { mes: "Mar", receita: 22000000, despesa: 18000000 },
  { mes: "Abr", receita: 19000000, despesa: 17000000 },
  { mes: "Mai", receita: 21000000, despesa: 19000000 },
  { mes: "Jun", receita: 24000000, despesa: 20000000 },
];

export default function TransparenciaHub() {
  const currentYear = new Date().getFullYear();
  const { data: orcamento, isLoading } = useGetOrcamento({ ano: currentYear });
  const [searchQuery, setSearchQuery] = useState("");

  const execPct = orcamento
    ? Math.round((orcamento.despesaRealizada / orcamento.despesaPrevista) * 100)
    : 0;

  const pieData = orcamento?.categorias ?? [
    { nome: "Saúde", valor: 45000000, percentual: 30 },
    { nome: "Educação", valor: 52000000, percentual: 35 },
    { nome: "Infraestrutura", valor: 22000000, percentual: 15 },
    { nome: "Segurança", valor: 15000000, percentual: 10 },
    { nome: "Outros", valor: 16000000, percentual: 10 },
  ];

  const filteredSections = LAI_SECTIONS.filter(s =>
    !searchQuery.trim() ||
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-zinc-900 text-white border-b-4 border-primary py-10 sm:py-14">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-white">Início</Link></li>
              <li aria-hidden="true">/</li>
              <li><span className="text-white font-medium" aria-current="page">Transparência</span></li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">LAI — Lei 12.527/2011</span>
                <ComplianceBadge status="ok" label="Portal Conforme" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <PieChartIcon className="w-7 h-7 text-primary" />
                </div>
                Portal da Transparência
              </h1>
              <p className="text-zinc-300 max-w-2xl text-sm sm:text-base leading-relaxed mb-6">
                Em cumprimento ao <strong className="text-white">Art. 8° da Lei 12.527/2011</strong> (LAI),
                disponibilizamos todas as informações de publicação obrigatória do município de Parauapebas — PA.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/transparencia/sic" className="flex items-center gap-2 text-sm font-bold bg-primary px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40">
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  Fazer Pedido e-SIC
                </Link>
                <Link href="/ouvidoria" className="flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white border border-zinc-600 px-4 py-2.5 rounded-xl hover:border-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40">
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Ouvidoria
                </Link>
                <Link href="/transparencia/dados-abertos" className="flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white border border-zinc-600 px-4 py-2.5 rounded-xl hover:border-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40">
                  <Database className="w-4 h-4" aria-hidden="true" />
                  Dados Abertos
                </Link>
              </div>
            </div>

            {/* Dashboard rápido */}
            <div className="grid grid-cols-2 gap-3 lg:w-80 flex-shrink-0">
              {[
                { label: "Receita Prevista", value: orcamento?.receitaPrevista, color: "text-green-400" },
                { label: "Receita Realizada", value: orcamento?.receitaRealizada, color: "text-green-300" },
                { label: "Despesa Prevista", value: orcamento?.despesaPrevista, color: "text-orange-400" },
                { label: "Despesa Realizada", value: orcamento?.despesaRealizada, color: "text-orange-300" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-[11px] text-zinc-500 mb-1 uppercase tracking-wide font-medium">{label} {currentYear}</p>
                  <p className={`font-black text-lg ${color}`}>
                    {isLoading ? "—" : formatCurrency(value ?? 0)}
                  </p>
                </div>
              ))}
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400 font-medium">Execução orçamentária</span>
                  <span className="text-white font-bold">{execPct}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(execPct, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={execPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Execução orçamentária: ${execPct}%`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Buscador de seções */}
        <div className="relative mb-10 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar seção de transparência..."
            className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-2xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            aria-label="Buscar seção de transparência"
          />
        </div>

        {/* Seções obrigatórias LAI */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Seções de Publicação Obrigatória
          </h2>
          <p className="text-sm text-muted-foreground">
            Itens exigidos pelo Art. 8° da Lei de Acesso à Informação.
          </p>
        </div>

        {filteredSections.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p>Nenhuma seção encontrada para "<strong>{searchQuery}</strong>".</p>
          </div>
        ) : (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {filteredSections.map((section) => (
              <li key={section.href}>
                <TransparencyCard {...section} />
              </li>
            ))}
          </ul>
        )}

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Bar chart */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">Receita vs Despesa — {currentYear}</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_MOCK} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={40} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), ""]}
                    contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Legend />
                  <Bar dataKey="receita" name="Receita" fill="#168821" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesa" name="Despesa" fill="#1351B4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">Despesas por Categoria</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="valor" nameKey="nome">
                    {pieData.map((_, i) => (
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

        {/* Quick links footer */}
        <div className="bg-muted/40 border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Links Úteis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="https://www.portaltransparencia.gov.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline focus:outline-none focus:underline">
              <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              Portal da Transparência Federal
            </a>
            <a href="https://www.cgu.gov.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline focus:outline-none focus:underline">
              <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              CGU — Controladoria-Geral da União
            </a>
            <a href="https://www.tce.pa.gov.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline focus:outline-none focus:underline">
              <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              TCE-PA — Tribunal de Contas do Estado
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
