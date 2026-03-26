import { Link, useParams } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, AlertTriangle } from "lucide-react";

const REQUERIMENTOS: Record<string, {
  id: string; protocolo: string; tipo: string; tipoLabel: string;
  status: string; dataSolicitacao: string; prazo: string; despacho: string | null;
  documentos: { nome: string; tamanho: string }[];
  timeline: { status: string; descricao: string; data: string; responsavel?: string }[];
  prazoRecurso?: string;
}> = {
  "req-001": {
    id: "req-001",
    protocolo: "REQ-2026-0312",
    tipo: "declaracao_tempo_servico",
    tipoLabel: "Declaração de Tempo de Serviço",
    status: "deferido",
    dataSolicitacao: "10/02/2026",
    prazo: "10/03/2026",
    despacho: "DESPACHO — 10 de março de 2026\n\nAnalisado e julgado procedente.\n\nDECISÃO: DEFERIDO\n\nA declaração foi emitida e está disponível para retirada na SEMAD, mediante apresentação de documento de identificação.",
    documentos: [],
    timeline: [
      { status: "protocolado", descricao: "Requerimento protocolado pelo servidor", data: "10/02/2026" },
      { status: "em_analise", descricao: "Recebido e encaminhado para análise técnica", data: "11/02/2026", responsavel: "RH / SEMAD" },
      { status: "deferido", descricao: "Requerimento deferido pelo RH", data: "10/03/2026", responsavel: "João Silva — Gerente RH" },
    ],
  },
  "req-002": {
    id: "req-002",
    protocolo: "REQ-2026-0198",
    tipo: "licenca_medica",
    tipoLabel: "Licença Médica",
    status: "em_analise",
    dataSolicitacao: "15/03/2026",
    prazo: "15/04/2026",
    despacho: null,
    documentos: [{ nome: "laudo_medico.pdf", tamanho: "234 KB" }],
    timeline: [
      { status: "protocolado", descricao: "Requerimento protocolado", data: "15/03/2026" },
      { status: "em_analise", descricao: "Encaminhado para análise", data: "16/03/2026", responsavel: "RH / SEMAD" },
    ],
  },
  "req-003": {
    id: "req-003",
    protocolo: "REQ-2025-0821",
    tipo: "progressao_horizontal",
    tipoLabel: "Progressão Horizontal",
    status: "indeferido",
    dataSolicitacao: "20/10/2025",
    prazo: "20/11/2025",
    despacho: "DESPACHO — 20 de novembro de 2025\n\nDECISÃO: INDEFERIDO\n\nMOTIVO: O servidor não atende os requisitos mínimos de interstício no cargo conforme Art. 42, §1° do PCCR — são necessários 24 meses na classe atual e o servidor possui apenas 18 meses.\n\nPRAZO PARA RECURSO: 15 dias a partir desta data.",
    documentos: [{ nome: "comprovante_cargo.pdf", tamanho: "128 KB" }],
    timeline: [
      { status: "protocolado", descricao: "Requerimento protocolado", data: "20/10/2025" },
      { status: "em_analise", descricao: "Em análise", data: "21/10/2025", responsavel: "RH / SEMAD" },
      { status: "indeferido", descricao: "Requerimento indeferido — interstício insuficiente", data: "20/11/2025", responsavel: "João Silva — Gerente RH" },
    ],
    prazoRecurso: "05/12/2025",
  },
};

function statusConfig(s: string) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    deferido: { label: "Deferido", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
    indeferido: { label: "Indeferido", color: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4 text-red-600" /> },
    em_analise: { label: "Em análise", color: "bg-amber-100 text-amber-700", icon: <Clock className="h-4 w-4 text-amber-500" /> },
    protocolado: { label: "Protocolado", color: "bg-blue-100 text-blue-700", icon: <FileText className="h-4 w-4 text-blue-600" /> },
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
  const req = REQUERIMENTOS[params.id ?? ""];

  if (!req) {
    return (
      <ServidorLayout title="Requerimento não encontrado">
        <div className="text-center py-20">
          <p className="text-gray-500">Requerimento não encontrado.</p>
          <Link href="/servidor/requerimentos">
            <Button variant="outline" className="mt-4">Voltar</Button>
          </Link>
        </div>
      </ServidorLayout>
    );
  }

  const sc = statusConfig(req.status);
  const hoje = new Date();
  const prazoRecurso = req.prazoRecurso ? new Date(req.prazoRecurso.split("/").reverse().join("-")) : null;
  const dentroPrazo = prazoRecurso ? hoje <= prazoRecurso : false;

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

        {/* Status alert */}
        {req.status === "indeferido" && req.prazoRecurso && (
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${dentroPrazo ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"}`}>
            <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${dentroPrazo ? "text-amber-600" : "text-gray-400"}`} />
            <div>
              <p className={`text-sm font-medium ${dentroPrazo ? "text-amber-700" : "text-gray-600"}`}>
                {dentroPrazo
                  ? `Você pode recorrer desta decisão até ${req.prazoRecurso}.`
                  : `Prazo de recurso encerrado em ${req.prazoRecurso}.`}
              </p>
              {dentroPrazo && (
                <Button size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 text-xs">
                  Protocolar Recurso
                </Button>
              )}
            </div>
          </div>
        )}

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
              {req.documentos.length > 0 && (
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
              <div className="space-y-4">
                {req.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0">{timelineIcon(t.status)}</div>
                      {i < req.timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-xs font-medium text-gray-700">{t.descricao}</p>
                      {t.responsavel && <p className="text-xs text-gray-500 mt-0.5">{t.responsavel}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">{t.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ServidorLayout>
  );
}
