import { CmsLayout } from "@/components/cms/CmsLayout";
import { KpiCard, CmsCard } from "@/components/cms/CmsCard";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import {
  Newspaper, FileText, Eye, BarChart2, Shield,
  AlertTriangle, CheckCircle, Clock, ArrowRight, Plus,
  TrendingUp, Users, Calendar, HardDrive, RefreshCcw, ExternalLink
} from "lucide-react";

const LAI_ALERTS = [
  { category: "Relatório RREO — Bimestre 2/2026", deadline: "2026-04-30", daysLeft: 15, status: "warning" as const },
  { category: "Folha de Pagamento — Março/2026", deadline: "2026-04-05", daysLeft: -3, status: "error" as const },
  { category: "Contratos — Atualização mensal", deadline: "2026-04-10", daysLeft: 2, status: "error" as const },
];

const RECENT_ACTIVITY = [
  { action: "Notícia publicada", item: "Prefeitura inaugura nova UBS no Bairro Rio Verde", user: "Ana Santos", time: "há 23 min", icon: Newspaper, color: "text-green-400" },
  { action: "Banner atualizado", item: "Carrossel principal — Slide 3", user: "Carlos Lima", time: "há 1h", icon: FileText, color: "text-blue-400" },
  { action: "Documento LAI enviado", item: "Execução Orçamentária — Março 2026", user: "Maria Costa", time: "há 2h", icon: Shield, color: "text-purple-400" },
  { action: "Usuário adicionado", item: "joao.editor@parauapebas.pa.gov.br", user: "Admin", time: "há 4h", icon: Users, color: "text-yellow-400" },
  { action: "Notícia agendada", item: "Semana do Meio Ambiente 2026 — programação", user: "Ana Santos", time: "ontem", icon: Calendar, color: "text-orange-400" },
];

const TOP_PAGES = [
  { path: "/", title: "Página Inicial", views: 12847 },
  { path: "/transparencia", title: "Portal da Transparência", views: 8342 },
  { path: "/servicos", title: "Serviços ao Cidadão", views: 5219 },
  { path: "/transparencia/licitacoes", title: "Licitações", views: 3847 },
  { path: "/noticias", title: "Notícias", views: 2941 },
  { path: "/transparencia/sic", title: "SIC — e-SIC", views: 2104 },
  { path: "/municipio", title: "O Município", views: 1893 },
  { path: "/transparencia/servidores", title: "Servidores", views: 1654 },
];

export default function CmsDashboard() {
  return (
    <CmsLayout
      title="Dashboard"
      actions={
        <Link href="/site-admin/noticias/nova">
          <span className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nova Notícia
          </span>
        </Link>
      }
    >
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* LAI Alerts */}
        {LAI_ALERTS.length > 0 && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-bold text-red-300">Alertas de Conformidade LAI</h2>
              <span className="ml-auto text-xs text-red-400 font-semibold">{LAI_ALERTS.length} pendências</span>
            </div>
            <div className="space-y-2">
              {LAI_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {alert.daysLeft < 0 ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className="text-zinc-300 flex-1">{alert.category}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${alert.daysLeft < 0 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {alert.daysLeft < 0 ? `${Math.abs(alert.daysLeft)} dias ATRASADO` : `${alert.daysLeft} dias restantes`}
                  </span>
                  <Link href="/site-admin/transparencia">
                    <span className="text-xs text-primary hover:underline cursor-pointer">Publicar</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Notícias Publicadas" value="147" sub="este mês: 12" icon={Newspaper} color="blue" trend={{ value: 18, label: "vs mês ant." }} />
          <KpiCard label="Visitas Hoje" value="4.821" sub="média: 3.900/dia" icon={Eye} color="green" trend={{ value: 24, label: "vs ontem" }} />
          <KpiCard label="Documentos LAI" value="89%" sub="conformes com prazo" icon={Shield} color="yellow" />
          <KpiCard label="Pedidos SIC" value="127" sub="junho/2026 — 94% no prazo" icon={Users} color="default" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visits chart (mock) */}
          <div className="lg:col-span-8 space-y-6">
            <CmsCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white">Visitas — Últimos 7 dias</h2>
                <span className="text-xs text-zinc-500">Fonte: Analytics</span>
              </div>
              <div className="flex items-end gap-1.5 h-36">
                {[4200, 3800, 5100, 4650, 4821, 3950, 4300].map((v, i) => {
                  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
                  const max = 5500;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-zinc-600 tabular-nums">{(v/1000).toFixed(1)}k</span>
                      <div className="w-full rounded-t-md bg-primary/20 hover:bg-primary/40 transition-colors" style={{ height: `${(v / max) * 100}%` }} title={`${days[i]}: ${v.toLocaleString("pt-BR")} visitas`} />
                      <span className="text-[10px] text-zinc-600">{days[i]}</span>
                    </div>
                  );
                })}
              </div>
            </CmsCard>

            {/* Top Pages */}
            <CmsCard>
              <h2 className="text-base font-bold text-white mb-5">Páginas Mais Acessadas</h2>
              <ul className="space-y-3" role="list">
                {TOP_PAGES.map((page, i) => (
                  <li key={page.path} className="flex items-center gap-3">
                    <span className="text-xs font-black text-zinc-600 w-4 tabular-nums">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">{page.title}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{page.path}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(page.views / TOP_PAGES[0]!.views) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-zinc-400 tabular-nums w-12 text-right">{page.views.toLocaleString("pt-BR")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CmsCard>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick actions */}
            <CmsCard>
              <h2 className="text-sm font-bold text-white mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                {[
                  { icon: Newspaper, label: "Nova Notícia", href: "/site-admin/noticias/nova", color: "text-blue-400" },
                  { icon: Shield, label: "Publicar Documento LAI", href: "/site-admin/transparencia", color: "text-purple-400" },
                  { icon: FileText, label: "Nova Página", href: "/site-admin/paginas/nova", color: "text-green-400" },
                  { icon: RefreshCcw, label: "Limpar Cache do Portal", href: "#", color: "text-yellow-400" },
                ].map(({ icon: Icon, label, href, color }) => (
                  <Link key={label} href={href}>
                    <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer group">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} aria-hidden="true" />
                      {label}
                      <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </CmsCard>

            {/* Status do sistema */}
            <CmsCard>
              <h2 className="text-sm font-bold text-white mb-4">Status do Sistema</h2>
              <div className="space-y-3">
                {[
                  { label: "Portal Público", status: "online", uptime: "99.9%" },
                  { label: "API", status: "online", uptime: "100%" },
                  { label: "Banco de Dados", status: "online", uptime: "99.8%" },
                  { label: "Último Backup", status: "ok", uptime: "há 6h" },
                  { label: "SSL/TLS", status: "online", uptime: "válido" },
                ].map(({ label, status, uptime }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status === "online" || status === "ok" ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-xs text-zinc-400 flex-1">{label}</span>
                    <span className="text-xs font-bold text-zinc-500 tabular-nums">{uptime}</span>
                  </div>
                ))}
              </div>
            </CmsCard>

            {/* Recent activity */}
            <CmsCard>
              <h2 className="text-sm font-bold text-white mb-4">Atividade Recente</h2>
              <ul className="space-y-4" role="list" aria-label="Atividade recente do CMS">
                {RECENT_ACTIVITY.slice(0, 4).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-300">{item.action}</p>
                      <p className="text-[11px] text-zinc-600 truncate mt-0.5">{item.item}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-zinc-700">{item.user}</span>
                        <span className="text-[10px] text-zinc-700">·</span>
                        <span className="text-[10px] text-zinc-700">{item.time}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CmsCard>
          </div>
        </div>
      </div>
    </CmsLayout>
  );
}
