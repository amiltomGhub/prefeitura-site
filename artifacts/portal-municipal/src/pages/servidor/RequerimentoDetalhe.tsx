import { Link, useParams } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, AlertTriangle, AlertCircle } from "lucide-react";
import { useRequerimentoDetalhe } from "@/services/servidorApi";

function statusConfig(s: string) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    deferido: { label: "Deferido", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
    indeferido: { label: "Indeferido", color: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4 text-red-600" /> },
    em_analise: { label: "Em análise", color: "bg-amber-100 text-amber-700", icon: <Clock className="h-4 w-4 text-amber-500" /> },
    protocolado: { label: "Protocolado", color: "bg-blue-100 text-blue-700", icon: <FileText className="h-4 w-4 text-blue-600" /> },
    arquivado: { label: "Arquivado", color: "bg-gray-100 text-gray-600", icon: <FileText className="h-4 w-4" /> },
  };
  return map[s] ?? { label: s, color: "bg-gray-100 text-gray-600", icon: <Clock className="h-4 w-4" /> };
}

function timelineIcon(s: string) {
  if (s === "deferido") return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (s === "indeferido") return <XCircle className="h-5 w-5 text-red-500" />;
  if (s === "em_analise") return <Clock className="h-5 w-5 text-amber-400" />;
  return <FileText className="h-5 w-5 text-blue-400" />;
}

export default function RequerimentoDetalhe() {
  const params = useParams<{ id: string }>();
  const { data: req, isLoading, error } = useRequerimentoDetalhe(params.id ?? "");

  if (isLoading) {
    return (
      <ServidorLayout title="Requerimento" subtitle="Carregando...">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </ServidorLayout>
    );
  }

  if (error || !req) {
    return (
      <ServidorLayout title="Requerimento não encontrado">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
            <AlertCircle className="h-4 w-4" />
            {error ? "Não foi possível carregar o requerimento." : "Requerimento não encontrado."}
          </div>
          <Link href="/servidor/requerimentos">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </ServidorLayout>
    );
  }

  const sc = statusConfig(req.status);

  return (
    <ServidorLayout
      title={req.tipoLabel}
      subtitle={`Protocolo: ${req.protocolo}`}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <Link href="/servidor/requerimentos">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />Voltar
            </Button>
          </Link>
          <Badge className={`${sc.color} flex items-center gap-1.5 hover:${sc.color}`}>
            {sc.icon}{sc.label}
          </Badge>
        </div>

        {/* Status alert for indeferido — shows recurso only if within deadline */}
        {req.status === "indeferido" && (() => {
          const prazoRecurso = req.prazoRecurso
            ? new Date(req.prazoRecurso.split("/").reverse().join("-"))
            : null;
          const hoje = new Date();
          const dentroPrazo = prazoRecurso ? hoje <= prazoRecurso : false;
          const prazoStr = prazoRecurso ? prazoRecurso.toLocaleDateString("pt-BR") : null;
          return (
            <div className={`flex items-start gap-3 p-4 rounded-lg border ${dentroPrazo ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"}`}>
              <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${dentroPrazo ? "text-amber-600" : "text-gray-400"}`} />
              <div>
                <p className={`text-sm font-medium ${dentroPrazo ? "text-amber-700" : "text-gray-600"}`}>
                  {dentroPrazo && prazoStr
                    ? `Este requerimento foi indeferido. Você pode apresentar recurso até ${prazoStr}.`
                    : prazoStr
                      ? `Prazo de recurso encerrado em ${prazoStr}.`
                      : "Este requerimento foi indeferido."}
                </p>
                {dentroPrazo && (
                  <Button size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 text-xs">
                    Protocolar Recurso
                  </Button>
                )}
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Dados do Requerimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Protocolo</p>
                  <p className="font-mono font-medium text-gray-800">{req.protocolo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Tipo</p>
                  <p className="font-medium text-gray-800">{req.tipoLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Data de solicitação</p>
                  <p className="font-medium text-gray-800">{req.dataSolicitacao}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Prazo de análise</p>
                  <p className="font-medium text-gray-800">{req.prazo}</p>
                </div>
              </div>

              {/* Documentos */}
              {req.documentos && req.documentos.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-2">Documentos anexados</p>
                  <div className="space-y-2">
                    {req.documentos.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-700">{d.nome}</span>
                        <span className="text-gray-400">{d.tamanho}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Despacho */}
              {req.despacho && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-2">Parecer / Despacho</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{req.despacho}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Tramitação</CardTitle>
            </CardHeader>
            <CardContent>
              {req.timeline && req.timeline.length > 0 ? (
                <div className="space-y-4">
                  {req.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0">{timelineIcon(t.status)}</div>
                        {i < req.timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className="text-xs font-medium text-gray-700">{t.descricao}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Nenhuma tramitação registrada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ServidorLayout>
  );
}
