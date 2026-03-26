import { useState } from "react";
import { Link } from "wouter";
import { RhLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Users, Umbrella, ClipboardList, AlertTriangle, ArrowRight,
  TrendingUp, Clock, CheckCircle
} from "lucide-react";

const SERVIDORES_POR_SECRETARIA = [
  { secretaria: "SEMAD", total: 48 },
  { secretaria: "SEMUS", total: 127 },
  { secretaria: "SEMEC", total: 213 },
  { secretaria: "SEMOSP", total: 62 },
  { secretaria: "SEMATUR", total: 18 },
  { secretaria: "SEMAGRI", total: 24 },
];

const FERIAS_VENCIDAS = [
  { nome: "Carlos Lima", matricula: "0023411", secretaria: "SEMUS", periodo: "01/01/2023–31/12/2023", venceu: "31/01/2025" },
  { nome: "Pedro Rocha", matricula: "0018772", secretaria: "SEMEC", periodo: "01/01/2023–31/12/2023", venceu: "31/01/2025" },
  { nome: "Sandra Melo", matricula: "0031120", secretaria: "SEMOSP", periodo: "01/01/2024–31/12/2024", venceu: "01/03/2026" },
];

const REQS_PENDENTES = [
  { id: "req-rh-01", nome: "Marcos Alves", matricula: "0045211", tipo: "Licença Médica", protocolado: "15/03/2026", prazo: "15/04/2026" },
  { id: "req-rh-02", nome: "Júlia Santos", matricula: "0039021", tipo: "Progressão Horizontal", protocolado: "10/03/2026", prazo: "10/04/2026" },
  { id: "req-rh-03", nome: "Roberto Costa", matricula: "0027810", tipo: "Licença para Capacitação", protocolado: "05/03/2026", prazo: "05/04/2026" },
];

const FERIAS_PENDENTES_APROVACAO = [
  { id: "fv-01", nome: "Ana Lima", matricula: "0019283", secretaria: "SEMUS", dataInicio: "01/07/2026", qtdDias: 30, protocolado: "10/03/2026" },
  { id: "fv-02", nome: "Carlos Mendes", matricula: "0038291", secretaria: "SEMEC", dataInicio: "15/08/2026", qtdDias: 20, protocolado: "15/03/2026" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function KpiCard({ icon: Icon, label, value, badge, badgeColor }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
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
  return (
    <RhLayout title="Dashboard RH" subtitle="Visão geral da gestão de servidores">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Users} label="Total de Servidores Ativos" value={492} badge="Parauapebas" badgeColor="bg-blue-100 text-blue-700" />
        <KpiCard icon={Umbrella} label="Férias Pendentes Aprovação" value={FERIAS_PENDENTES_APROVACAO.length} badge={`${FERIAS_VENCIDAS.length} vencidas`} badgeColor="bg-red-100 text-red-700" />
        <KpiCard icon={ClipboardList} label="Requerimentos Pendentes" value={REQS_PENDENTES.length} badge="Aguardando análise" badgeColor="bg-amber-100 text-amber-700" />
        <KpiCard icon={TrendingUp} label="Folha do Mês (Líquido)" value="R$ 2,4M" badge="Março/2026" badgeColor="bg-green-100 text-green-700" />
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SERVIDORES_POR_SECRETARIA} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="secretaria" tick={{ fontSize: 11 }} width={70} />
                <Tooltip
                  formatter={(v) => [v, "Servidores"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {SERVIDORES_POR_SECRETARIA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
            {FERIAS_VENCIDAS.map((f, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{f.nome}</p>
                  <p className="text-xs text-gray-500">Mat. {f.matricula} — {f.secretaria}</p>
                  <p className="text-xs text-red-600 mt-0.5">Venceu em {f.venceu}</p>
                </div>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex-shrink-0 text-xs">Vencida</Badge>
              </div>
            ))}
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
          <div className="divide-y divide-gray-100">
            {REQS_PENDENTES.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{r.nome}</p>
                  <p className="text-xs text-gray-500">Mat. {r.matricula} — {r.tipo}</p>
                  <p className="text-xs text-gray-400">Protocolado em {r.protocolado} | Prazo: {r.prazo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">Aguardando</Badge>
                  <Link href={`/rh/requerimentos`}>
                    <Button variant="outline" size="sm" className="text-xs h-7">Analisar</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
          <div className="divide-y divide-gray-100">
            {FERIAS_PENDENTES_APROVACAO.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-3 gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{f.nome}</p>
                  <p className="text-xs text-gray-500">Mat. {f.matricula} — {f.secretaria}</p>
                  <p className="text-xs text-gray-400">
                    {f.qtdDias} dias a partir de {f.dataInicio} | Solicitado em {f.protocolado}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                    Rejeitar
                  </Button>
                  <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-700 gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />Aprovar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </RhLayout>
  );
}
