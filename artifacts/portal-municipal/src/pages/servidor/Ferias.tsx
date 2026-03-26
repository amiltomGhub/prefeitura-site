import { useState } from "react";
import { Link } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Umbrella, Plus, Clock, CheckCircle, XCircle, AlertTriangle,
  Calendar, Info
} from "lucide-react";

const HISTORICO = [
  {
    id: "sol-001",
    periodoAquisitivo: "01/01/2024 – 31/12/2024",
    dataInicio: "10/07/2025",
    dataFim: "08/08/2025",
    qtdDias: 30,
    status: "aprovado",
    protocolo: "SOL-2025-0421",
    tipo: "gozado",
    timeline: [
      { status: "protocolado", descricao: "Solicitação protocolada", data: "02/06/2025" },
      { status: "em_analise", descricao: "Em análise pelo RH", data: "04/06/2025" },
      { status: "aprovado", descricao: "Férias aprovadas pelo RH", data: "06/06/2025" },
    ],
  },
  {
    id: "sol-002",
    periodoAquisitivo: "01/01/2023 – 31/12/2023",
    dataInicio: "05/01/2024",
    dataFim: "03/02/2024",
    qtdDias: 30,
    status: "aprovado",
    protocolo: "SOL-2024-0082",
    tipo: "gozado",
    timeline: [
      { status: "protocolado", descricao: "Solicitação protocolada", data: "12/12/2023" },
      { status: "aprovado", descricao: "Férias aprovadas pelo RH", data: "15/12/2023" },
    ],
  },
  {
    id: "sol-003",
    periodoAquisitivo: "01/01/2025 – 31/12/2025",
    dataInicio: "15/07/2026",
    dataFim: "13/08/2026",
    qtdDias: 30,
    status: "pendente",
    protocolo: "SOL-2026-0198",
    tipo: "programado",
    timeline: [
      { status: "protocolado", descricao: "Solicitação protocolada", data: "10/03/2026" },
      { status: "em_analise", descricao: "Em análise pelo RH", data: "12/03/2026" },
    ],
  },
];

const PERIODO_ATUAL = {
  descricao: "01/01/2025 – 31/12/2025",
  diasDisponiveis: 30,
  diasUsados: 0,
  vencimento: "31/01/2027",
  vencida: false,
};

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

  const pct = Math.round((PERIODO_ATUAL.diasUsados / PERIODO_ATUAL.diasDisponiveis) * 100);

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
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{PERIODO_ATUAL.descricao}</span>
                <Badge className={PERIODO_ATUAL.vencida ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-green-100 text-green-700 hover:bg-green-100"}>
                  {PERIODO_ATUAL.vencida ? "Vencido" : "Disponível"}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Dias usados: {PERIODO_ATUAL.diasUsados}</span>
                  <span>Disponíveis: {PERIODO_ATUAL.diasDisponiveis - PERIODO_ATUAL.diasUsados}</span>
                </div>
                <Progress value={pct} className="h-2.5" />
                <p className="text-xs text-gray-400 mt-1">
                  {PERIODO_ATUAL.diasDisponiveis} dias no total — vence em {PERIODO_ATUAL.vencimento}
                </p>
              </div>

              {PERIODO_ATUAL.vencida && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-xs">
                    Período aquisitivo vencido em {PERIODO_ATUAL.vencimento}. Entre em contato com o RH.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col justify-between">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-700">{PERIODO_ATUAL.diasDisponiveis - PERIODO_ATUAL.diasUsados}</p>
              <p className="text-sm text-gray-500 mt-1">dias disponíveis</p>
            </div>
            <Link href="/servidor/ferias/solicitar">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 gap-2">
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
          <div className="divide-y divide-gray-100">
            {HISTORICO.map((sol) => (
              <div key={sol.id}>
                <button
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setExpanded(expanded === sol.id ? null : sol.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sol.status === "aprovado" ? "bg-green-500" : sol.status === "pendente" ? "bg-amber-400" : "bg-red-500"}`} />
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ServidorLayout>
  );
}
