import { useState } from "react";
import { Link } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const REQUERIMENTOS = [
  {
    id: "req-001",
    protocolo: "REQ-2026-0312",
    tipo: "declaracao_tempo_servico",
    tipoLabel: "Declaração de Tempo de Serviço",
    status: "deferido",
    dataSolicitacao: "10/02/2026",
    prazo: "10/03/2026",
    despacho: "Declaração emitida e disponível para retirada.",
  },
  {
    id: "req-002",
    protocolo: "REQ-2026-0198",
    tipo: "licenca_medica",
    tipoLabel: "Licença Médica",
    status: "em_analise",
    dataSolicitacao: "15/03/2026",
    prazo: "15/04/2026",
    despacho: null,
  },
  {
    id: "req-003",
    protocolo: "REQ-2025-0821",
    tipo: "progressao_horizontal",
    tipoLabel: "Progressão Horizontal",
    status: "indeferido",
    dataSolicitacao: "20/10/2025",
    prazo: "20/11/2025",
    despacho: "Não atende os requisitos mínimos de tempo no cargo conforme Art. 42 do PCCR.",
  },
  {
    id: "req-004",
    protocolo: "REQ-2025-0510",
    tipo: "licenca_capacitacao",
    tipoLabel: "Licença para Capacitação",
    status: "deferido",
    dataSolicitacao: "05/06/2025",
    prazo: "05/07/2025",
    despacho: "Aprovado conforme Decreto Municipal 3.441/2024.",
  },
];

function statusConfig(s: string) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    deferido: { label: "Deferido", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
    indeferido: { label: "Indeferido", color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3" /> },
    em_analise: { label: "Em análise", color: "bg-amber-100 text-amber-700", icon: <Clock className="h-3 w-3" /> },
    protocolado: { label: "Protocolado", color: "bg-blue-100 text-blue-700", icon: <FileText className="h-3 w-3" /> },
    arquivado: { label: "Arquivado", color: "bg-gray-100 text-gray-600", icon: <FileText className="h-3 w-3" /> },
  };
  return map[s] ?? { label: s, color: "bg-gray-100 text-gray-600", icon: null };
}

const STATUS_OPTIONS = ["todos", "deferido", "indeferido", "em_analise", "protocolado"];
const TIPO_OPTIONS = ["todos", "declaracao_tempo_servico", "licenca_medica", "progressao_horizontal", "licenca_capacitacao"];
const TIPO_LABELS: Record<string, string> = {
  todos: "Todos os tipos",
  declaracao_tempo_servico: "Declaração de Tempo de Serviço",
  licenca_medica: "Licença Médica",
  progressao_horizontal: "Progressão Horizontal",
  licenca_capacitacao: "Licença para Capacitação",
};

export default function Requerimentos() {
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const filtered = REQUERIMENTOS.filter((r) => {
    const matchSearch = r.tipoLabel.toLowerCase().includes(search.toLowerCase()) || r.protocolo.includes(search);
    const matchStatus = statusFiltro === "todos" || r.status === statusFiltro;
    const matchTipo = tipoFiltro === "todos" || r.tipo === tipoFiltro;
    return matchSearch && matchStatus && matchTipo;
  });

  return (
    <ServidorLayout title="Requerimentos" subtitle="Acompanhe suas solicitações">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 text-sm"
            placeholder="Buscar por protocolo ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "todos" ? "Todos os status" : statusConfig(s).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {TIPO_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{TIPO_LABELS[t] ?? t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Link href="/servidor/requerimentos/novo">
          <Button className="bg-blue-700 hover:bg-blue-800 gap-2 flex-shrink-0">
            <Plus className="h-4 w-4" />Novo Requerimento
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">
            {filtered.length} resultado(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile: card list */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((r) => {
              const sc = statusConfig(r.status);
              return (
                <div key={r.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.tipoLabel}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.protocolo}</p>
                    </div>
                    <Badge className={`${sc.color} flex items-center gap-1 text-xs hover:${sc.color}`}>
                      {sc.icon}{sc.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Solicitado em {r.dataSolicitacao}</p>
                    <Link href={`/servidor/requerimentos/${r.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-blue-600">
                        <Eye className="h-3.5 w-3.5" />Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Protocolo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Solicitado em</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => {
                  const sc = statusConfig(r.status);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{r.protocolo}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">{r.tipoLabel}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{r.dataSolicitacao}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${sc.color} flex items-center gap-1 w-fit text-xs hover:${sc.color}`}>
                          {sc.icon}{sc.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/servidor/requerimentos/${r.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-blue-600">
                            <Eye className="h-3.5 w-3.5" />Detalhes
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Nenhum requerimento encontrado.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ServidorLayout>
  );
}
