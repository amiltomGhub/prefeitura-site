import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useGetOrcamento } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { 
  BarChart3, PieChart, FileText, Users, Landmark, 
  ArrowRight, Download, Info
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell 
} from 'recharts';

const COLORS = ['#1351B4', '#168821', '#F0A500', '#E11D48', '#8B5CF6', '#06B6D4'];

export default function TransparenciaHub() {
  const currentYear = new Date().getFullYear();
  const { data: orcamento, isLoading } = useGetOrcamento({ ano: currentYear });

  const categories = [
    { title: "Despesas", icon: BarChart3, href: "/transparencia/despesas", desc: "Consultar gastos detalhados." },
    { title: "Receitas", icon: Landmark, href: "/transparencia/receitas", desc: "Acompanhe a arrecadação." },
    { title: "Servidores", icon: Users, href: "/transparencia/servidores", desc: "Folha de pagamento e cargos." },
    { title: "Licitações", icon: FileText, href: "/licitacoes", desc: "Editais e contratos." },
  ];

  // Dummy data if API empty
  const chartData = orcamento?.categorias || [
    { nome: "Saúde", valor: 45000000, percentual: 30 },
    { nome: "Educação", valor: 52000000, percentual: 35 },
    { nome: "Infraestrutura", valor: 22000000, percentual: 15 },
    { nome: "Segurança", valor: 15000000, percentual: 10 },
    { nome: "Outros", valor: 16000000, percentual: 10 },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary text-primary-foreground pt-12 pb-24 border-b-8 border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-primary-foreground/80 mb-6 text-sm font-medium">
            <Link href="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <span className="text-white">Transparência</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 flex items-center gap-4">
            <PieChart className="w-12 h-12 text-secondary opacity-90" />
            Portal da Transparência
          </h1>
          <p className="text-xl max-w-3xl text-primary-foreground/90 leading-relaxed">
            Acompanhe a arrecadação e a aplicação dos recursos públicos. 
            Informação clara e acessível em cumprimento à Lei de Acesso à Informação (LAI).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-24">
        
        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 hover:-translate-y-1 transition-transform">
            <h3 className="text-muted-foreground font-semibold uppercase tracking-wider text-sm mb-2">Receita Prevista ({currentYear})</h3>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? "Carregando..." : formatCurrency(orcamento?.receitaPrevista || 150000000)}
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 hover:-translate-y-1 transition-transform">
            <h3 className="text-muted-foreground font-semibold uppercase tracking-wider text-sm mb-2">Despesa Empenhada</h3>
            <div className="text-3xl font-bold text-destructive">
              {isLoading ? "Carregando..." : formatCurrency(orcamento?.despesaRealizada || 95000000)}
            </div>
          </div>
          <div className="bg-secondary rounded-2xl shadow-xl border border-secondary-border p-8 text-secondary-foreground hover:-translate-y-1 transition-transform">
            <h3 className="text-secondary-foreground/80 font-semibold uppercase tracking-wider text-sm mb-2">Saldo Atual</h3>
            <div className="text-3xl font-bold">
              {isLoading ? "Carregando..." : formatCurrency(orcamento?.saldoAtual || 55000000)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Categories Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={cat.href}
                className="bg-card border-2 border-border hover:border-primary rounded-2xl p-6 group transition-all focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <cat.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </Link>
            ))}
            
            <div className="sm:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex gap-4">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Dados Abertos</h4>
                <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mb-3">Baixe as bases de dados completas em formato aberto (CSV, JSON).</p>
                <button className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 hover:underline">
                  <Download className="w-4 h-4" /> Acessar Catálogo
                </button>
              </div>
            </div>
          </div>

          {/* Charts Area */}
          <div className="lg:col-span-7 bg-card rounded-2xl border border-border shadow-md p-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 font-serif">Despesas por Categoria</h2>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <div>
                    <div className="text-sm font-semibold">{item.nome}</div>
                    <div className="text-xs text-muted-foreground">{item.percentual}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
