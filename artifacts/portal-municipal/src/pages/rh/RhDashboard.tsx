import { Link, Redirect } from "wouter";
import { RhLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Users, Umbrella, ClipboardList, AlertTriangle, ArrowRight,
  TrendingUp, Clock, CheckCircle, AlertCircle
} from "lucide-react";
import { useRhDashboard, useRhAprovarFerias } from "@/services/servidorApi";
import { useServidor } from "@/contexts/ServidorContext";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function formatCurrency(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function KpiCard({ icon: Icon, label, value, badge, badgeColor, loading }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  badge?: string;
  badgeColor?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold text-gray-900">{value}</p>}
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        {badge && (
          <Badge className={`${badgeColor} mt-3 text-xs hover:${badgeColor}`}>{badge}</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export default function RhDashboard() {
  const { servidor } = useServidor();
  const { toast } = useToast();
  const { data, isLoading, error } = useRhDashboard();
  const { mutateAsync: aprovarFerias } = useRhAprovarFerias();

  if (!servidor.isRH && !servidor.isAdmin) {
    return <Redirect to="/servidor/contracheque" />;
  }

  async function handleAprovarFerias(id: string) {
    try {
      await aprovarFerias({ id });
      toast({ title: "Férias aprovadas com sucesso!" });
    } catch {
      toast({ title: "Erro ao aprovar férias.", variant: "destructive" });
    }
  }

  return (
    <RhLayout title="Dashboard RH" subtitle="Visão geral da gestão de servidores">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar o dashboard. Verifique sua conexão.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Users}
          label="Total de Servidores Ativos"
          value={data?.totalServidoresAtivos ?? 0}
          badge={servidor.tenantId.replace("tenant-", "").replace(/-001$/, "")}
          badgeColor="bg-blue-100 text-blue-700"
          loading={isLoading}
        />
        <KpiCard
          icon={Umbrella}
          label="Férias Pendentes Aprovação"
          value={data?.feriasPendentesAprovacao ?? 0}
          badge={data?.feriasVencidas ? `${data.feriasVencidas} vencidas` : undefined}
          badgeColor="bg-red-100 text-red-700"
          loading={isLoading}
        />
        <KpiCard
          icon={ClipboardList}
          label="Requerimentos Pendentes"
          value={data?.requerimentosPendentes ?? 0}
          badge="Aguardando análise"
          badgeColor="bg-amber-100 text-amber-700"
          loading={isLoading}
        />
        <KpiCard
          icon={TrendingUp}
          label="Folha do Mês (Líquido)"
          value={data ? formatCurrency(data.folhaLiquidoMes) : "—"}
          badge={data?.folhaMesReferencia}
          badgeColor="bg-green-100 text-green-700"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de barras */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Servidores por Secretaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.servidoresPorSecretaria ?? []} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="secretaria" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip formatter={(v) => [v, "Servidores"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {(data?.servidoresPorSecretaria ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Férias Vencidas urgentes */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Férias Vencidas — Urgente
              </CardTitle>
              <Link href="/rh/ferias">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-blue-600">
                  Ver todas <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? [1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)
              : (data?.feriasVencidasLista ?? []).map((f, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.nome}</p>
                    <p className="text-xs text-gray-500">Mat. {f.matricula} — {f.secretaria}</p>
                    <p className="text-xs text-red-600 mt-0.5">Venceu em {f.venceu}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex-shrink-0 text-xs">Vencida</Badge>
                </div>
              ))
            }
            {!isLoading && (data?.feriasVencidasLista ?? []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Nenhuma férias vencida.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Requerimentos pendentes */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Requerimentos Pendentes de Análise
            </CardTitle>
            <Link href="/rh/requerimentos">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-blue-600">
                Ver fila completa <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(data?.requerimentosPendentesList ?? []).map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{r.nome}</p>
                    <p className="text-xs text-gray-500">Mat. {r.matricula} — {r.tipo}</p>
                    <p className="text-xs text-gray-400">Protocolado em {r.protocolado} | Prazo: {r.prazo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">Aguardando</Badge>
                    <Link href="/rh/requerimentos">
                      <Button variant="outline" size="sm" className="text-xs h-7">Analisar</Button>
                    </Link>
                  </div>
                </div>
              ))}
              {(data?.requerimentosPendentesList ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Nenhum requerimento pendente.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Férias pendentes de aprovação — preview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Umbrella className="h-4 w-4 text-blue-600" />
              Férias Aguardando Aprovação
            </CardTitle>
            <Link href="/rh/ferias">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-blue-600">
                Fila completa <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1,2].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(data?.feriasPendentesLista ?? []).slice(0, 3).map((f) => (
                <div key={f.id} className="flex items-center justify-between py-3 gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{f.nome}</p>
                    <p className="text-xs text-gray-500">Mat. {f.matricula} — {f.secretaria}</p>
                    <p className="text-xs text-gray-400">
                      {f.qtdDias} dias a partir de {f.dataInicio} | Solicitado em {f.protocolado}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => toast({ title: "Use a fila completa para rejeitar.", variant: "destructive" })}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs h-7 bg-green-600 hover:bg-green-700 gap-1"
                      onClick={() => handleAprovarFerias(f.id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />Aprovar
                    </Button>
                  </div>
                </div>
              ))}
              {(data?.feriasPendentesLista ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Nenhuma solicitação de férias pendente.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </RhLayout>
  );
}
