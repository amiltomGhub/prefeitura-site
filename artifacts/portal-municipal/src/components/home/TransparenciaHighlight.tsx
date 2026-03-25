import { Link } from "wouter";
import {
  BarChart2, TrendingDown, TrendingUp, Users,
  GraduationCap, FileText, BookOpen, MessageSquare,
  ArrowRight, Shield
} from "lucide-react";
import { useGetOrcamento } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

const LAI_ITEMS = [
  { label: "Licitações", desc: "Editais e resultados", href: "/licitacoes", icon: BarChart2 },
  { label: "Contratos", desc: "Gestão contratual", href: "/transparencia/contratos", icon: FileText },
  { label: "Despesas", desc: "Empenhos e pagamentos", href: "/transparencia/despesas", icon: TrendingDown },
  { label: "Receitas", desc: "Arrecadação municipal", href: "/transparencia/receitas", icon: TrendingUp },
  { label: "Servidores", desc: "Folha de pagamento", href: "/transparencia/servidores", icon: Users },
  { label: "Concursos", desc: "Seleções e vagas", href: "/concursos", icon: GraduationCap },
  { label: "Legislação", desc: "Leis e decretos", href: "/legislacao", icon: BookOpen },
  { label: "SIC / LAI", desc: "Acesso à informação", href: "/transparencia/sic", icon: MessageSquare },
];

export function TransparenciaHighlight() {
  const currentYear = new Date().getFullYear();
  const { data: orcamento } = useGetOrcamento({ ano: currentYear });

  const execPct = orcamento
    ? Math.round((orcamento.despesaRealizada / orcamento.despesaPrevista) * 100)
    : null;

  return (
    <section
      aria-labelledby="transparencia-heading"
      className="py-14 sm:py-20 bg-zinc-900 text-white relative overflow-hidden"
    >
      {/* Mandatory LAI marker */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Shield className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
        <span>LAI — Lei 12.527/2011</span>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left: heading + orçamento widget */}
          <div className="lg:col-span-4">
            <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">Acesso Obrigatório</p>
            <h2 id="transparencia-heading" className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
              Portal da<br />Transparência
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Em conformidade com a Lei de Acesso à Informação (LAI — Lei 12.527/2011), disponibilizamos todas as informações públicas do município.
            </p>

            {/* Orçamento widget */}
            {orcamento && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Orçamento {currentYear}</h3>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Receita Arrecadada</span>
                    <span className="font-semibold text-green-400">{formatCurrency(orcamento.receitaRealizada)}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((orcamento.receitaRealizada / orcamento.receitaPrevista) * 100, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round((orcamento.receitaRealizada / orcamento.receitaPrevista) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Percentual da receita arrecadada"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Previsto: {formatCurrency(orcamento.receitaPrevista)}</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Despesa Realizada</span>
                    <span className="font-semibold text-orange-400">{formatCurrency(orcamento.despesaRealizada)}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((orcamento.despesaRealizada / orcamento.despesaPrevista) * 100, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={execPct ?? 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Percentual da despesa realizada"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {execPct !== null ? `${execPct}% executado` : ""} — Previsto: {formatCurrency(orcamento.despesaPrevista)}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Saldo Atual</span>
                    <span className={`font-bold ${orcamento.saldoAtual >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatCurrency(orcamento.saldoAtual)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/transparencia"
              className="flex items-center justify-center gap-2 w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              Acessar Portal Completo
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Right: 8 LAI shortcuts */}
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">
              Itens de acesso obrigatório — LAI Art. 8°
            </p>
            <ul
              role="list"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              aria-label="Atalhos do Portal da Transparência"
            >
              {LAI_ITEMS.map(({ label, desc, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary h-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center mb-3 transition-colors">
                      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {label}
                    </h3>
                    <p className="text-[11px] text-zinc-500 leading-tight">{desc}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
