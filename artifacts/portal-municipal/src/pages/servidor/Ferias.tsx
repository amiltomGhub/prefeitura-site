import { useState } from "react";
import { Link } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Umbrella, Plus, Clock, CheckCircle, XCircle, AlertTriangle,
  Calendar, Info, AlertCircle
} from "lucide-react";
import { useFeriasSaldo, useFeriasHistorico } from "@/services/servidorApi";

function statusColor(s: string) {
  if (s === "aprovado") return "bg-green-100 text-green-700";
  if (s === "pendente" || s === "em_analise") return "bg-amber-100 text-amber-700";
  if (s === "rejeitado") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    aprovado: "Aprovado",
    pendente: "Pendente",
    em_analise: "Em análise",
    rejeitado: "Rejeitado",
    protocolado: "Protocolado",
    programado: "Programado",
    cancelado: "Cancelado",
  };
  return map[s] ?? s;
}

function timelineIcon(s: string) {
  if (s === "aprovado") return <CheckCircle className="h-4 w-4 text-green-600" />;
  if (s === "rejeitado") return <XCircle className="h-4 w-4 text-red-600" />;
  return <Clock className="h-4 w-4 text-amber-500" />;
}

export default function Ferias() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: saldo, isLoading: loadingSaldo, error: errSaldo } = useFeriasSaldo();
  const { data: historico, isLoading: loadingHistorico, error: errHistorico } = useFeriasHistorico();

  const periodoAtual = saldo?.periodoAtual ?? null;
  const pct = periodoAtual
    ? Math.round(((periodoAtual.diasTotal - periodoAtual.diasDisponiveis) / periodoAtual.diasTotal) * 100)
    : 0;

  return (
    <ServidorLayout title="Férias" subtitle="Saldo e histórico de solicitações">
      {/* Saldo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Umbrella className="h-4 w-4 text-blue-600" />
                Período Aquisitivo Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingSaldo ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ) : errSaldo ? (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Não foi possível carregar o saldo de férias.
                </div>
              ) : periodoAtual ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{periodoAtual.dataInicio} – {periodoAtual.dataFim}</span>
                    <Badge className={periodoAtual.vencida ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-green-100 text-green-700 hover:bg-green-100"}>
                      {periodoAtual.vencida ? "Vencido" : "Disponível"}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Dias usados: {periodoAtual.diasTotal - periodoAtual.diasDisponiveis}</span>
                      <span>Disponíveis: {periodoAtual.diasDisponiveis}</span>
                    </div>
                    <Progress value={pct} className="h-2.5" />
                    <p className="text-xs text-gray-400 mt-1">
                      {periodoAtual.diasTotal} dias no total — vence em {periodoAtual.vencimento}
                    </p>
                  </div>
                  {periodoAtual.vencida && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700 text-xs">
                        Período aquisitivo vencido em {periodoAtual.vencimento}. Entre em contato com o RH.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Nenhum período aquisitivo ativo encontrado.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col justify-between">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              {loadingSaldo ? (
                <Skeleton className="h-12 w-20 mx-auto" />
              ) : (
                <p className="text-4xl font-bold text-blue-700">{periodoAtual?.diasDisponiveis ?? "–"}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">dias disponíveis</p>
            </div>
            <Link href="/servidor/ferias/solicitar">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 gap-2" disabled={!periodoAtual || periodoAtual.diasDisponiveis < 5}>
                <Plus className="h-4 w-4" />
                Solicitar Férias
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Histórico */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Histórico de Solicitações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingHistorico ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : errHistorico ? (
            <div className="flex items-center gap-2 text-red-600 text-sm p-6">
              <AlertCircle className="h-4 w-4" />
              Não foi possível carregar o histórico.
            </div>
          ) : historico && historico.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {historico.map((sol) => (
                <div key={sol.id}>
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    onClick={() => setExpanded(expanded === sol.id ? null : sol.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sol.status === "aprovado" ? "bg-green-500" : sol.status === "pendente" || sol.status === "em_analise" ? "bg-amber-400" : "bg-red-500"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {sol.dataInicio} – {sol.dataFim}
                          <span className="text-gray-400 ml-2 text-xs">({sol.qtdDias} dias)</span>
                        </p>
                        <p className="text-xs text-gray-500">Prot. {sol.protocolo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={`${statusColor(sol.status)} hover:${statusColor(sol.status)} text-xs`}>
                        {statusLabel(sol.status)}
                      </Badge>
                      <Info className={`h-4 w-4 text-gray-400 transition-transform ${expanded === sol.id ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {expanded === sol.id && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-3 mt-3">Período aquisitivo: {sol.periodoAquisitivo}</p>
                      {sol.timeline && sol.timeline.length > 0 && (
                        <div className="space-y-3">
                          {sol.timeline.map((t, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className="p-0.5">{timelineIcon(t.status)}</div>
                                {i < sol.timeline.length - 1 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                              </div>
                              <div className="pb-2">
                                <p className="text-xs font-medium text-gray-700">{t.descricao}</p>
                                <p className="text-xs text-gray-400">{t.data}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Umbrella className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Nenhuma solicitação de férias encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ServidorLayout>
  );
}
