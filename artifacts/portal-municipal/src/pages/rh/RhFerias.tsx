import { useState } from "react";
import { Redirect } from "wouter";
import { RhLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useServidor } from "@/contexts/ServidorContext";
import {
  CheckCircle, XCircle, Clock, Search, Calendar,
  Umbrella, AlertCircle
} from "lucide-react";
import {
  useRhFeriasPendentes, useRhAprovarFerias, useRhRejeitarFerias,
  type RhFeriasPendenteItem
} from "@/services/servidorApi";

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const SECRETARIA_COLORS: Record<string, string> = {
  SEMUS: "bg-blue-500",
  SEMEC: "bg-green-500",
  SEMAD: "bg-purple-500",
  SEMOSP: "bg-orange-500",
  SEMATUR: "bg-pink-500",
  SEMAGRI: "bg-teal-500",
};

function parseBR(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return new Date(dateStr);
}

function CalendarioFerias({ solicitacoes }: { solicitacoes: RhFeriasPendenteItem[] }) {
  const hoje = new Date();
  const [viewYear, setViewYear] = useState(hoje.getFullYear());
  const [viewMonth, setViewMonth] = useState(hoje.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDow = firstDay.getDay();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const agendados = solicitacoes.filter(s => {
    const ini = parseBR(s.dataInicio);
    const fim = parseBR(s.dataFim);
    if (!ini || !fim) return false;
    const monthStart = new Date(viewYear, viewMonth, 1);
    const monthEnd = new Date(viewYear, viewMonth + 1, 0);
    return ini <= monthEnd && fim >= monthStart;
  });

  function getFeriasForDay(day: number): RhFeriasPendenteItem[] {
    const date = new Date(viewYear, viewMonth, day);
    return solicitacoes.filter(s => {
      const ini = parseBR(s.dataInicio);
      const fim = parseBR(s.dataFim);
      return ini && fim && date >= ini && date <= fim;
    });
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Header do calendário */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">← Anterior</button>
        <h3 className="text-sm font-semibold text-gray-800">{MONTH_NAMES[viewMonth]} / {viewYear}</h3>
        <button onClick={nextMonth} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Próximo →</button>
      </div>

      {/* Grade do calendário */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
          <div key={d} className="py-1 font-medium text-gray-500">{d}</div>
        ))}
        {Array.from({ length: startDow }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const ferias = getFeriasForDay(day);
          const isHoje = new Date().toDateString() === new Date(viewYear, viewMonth, day).toDateString();
          return (
            <div
              key={day}
              className={`relative min-h-[44px] p-1 rounded border text-xs ${
                isHoje ? "border-blue-400 bg-blue-50" : ferias.length > 0 ? "border-gray-200 bg-white" : "border-transparent"
              }`}
            >
              <span className={`text-xs font-medium ${isHoje ? "text-blue-700" : "text-gray-600"}`}>{day}</span>
              {ferias.length > 0 && (
                <div className="mt-0.5 space-y-0.5">
                  {ferias.slice(0, 2).map((f, fi) => (
                    <div
                      key={fi}
                      title={`${f.nome} — ${f.secretaria}`}
                      className={`w-full h-1.5 rounded-sm ${SECRETARIA_COLORS[f.secretaria] ?? "bg-gray-400"} opacity-80`}
                    />
                  ))}
                  {ferias.length > 2 && (
                    <span className="text-[9px] text-gray-500">+{ferias.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      {agendados.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Servidores com férias neste mês:</p>
          <div className="space-y-1">
            {agendados.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${SECRETARIA_COLORS[s.secretaria] ?? "bg-gray-400"}`} />
                <span className="font-medium text-gray-700">{s.nome}</span>
                <span className="text-gray-400">— {s.dataInicio} a {s.dataFim}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RhFerias() {
  const { servidor } = useServidor();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [motivos, setMotivos] = useState<Record<string, string>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [secretariaFiltro, setSecretariaFiltro] = useState("todas");

  const { data: solicitacoes, isLoading, error } = useRhFeriasPendentes();
  const { mutateAsync: aprovarFerias } = useRhAprovarFerias();
  const { mutateAsync: rejeitarFerias } = useRhRejeitarFerias();

  if (!servidor.isRH && !servidor.isAdmin) {
    return <Redirect to="/servidor/contracheque" />;
  }

  const pendentes = (solicitacoes ?? []).filter(s => s.status === "pendente");
  const secretarias = [...new Set((solicitacoes ?? []).map(s => s.secretaria))];

  const filtered = pendentes.filter(s => {
    const matchSearch = s.nome.toLowerCase().includes(search.toLowerCase()) || s.protocolo.includes(search);
    const matchSec = secretariaFiltro === "todas" || s.secretaria === secretariaFiltro;
    return matchSearch && matchSec;
  });

  async function aprovar(id: string) {
    try {
      await aprovarFerias({ id });
      setSelecionados(p => p.filter(x => x !== id));
      const sol = (solicitacoes ?? []).find(s => s.id === id);
      toast({ title: "Férias aprovadas!", description: `Solicitação ${sol?.protocolo} aprovada.` });
    } catch {
      toast({ title: "Erro ao aprovar férias.", variant: "destructive" });
    }
  }

  async function rejeitar(id: string) {
    const motivo = motivos[id];
    if (!motivo?.trim()) return;
    try {
      await rejeitarFerias({ id, motivo });
      setRejectingId(null);
      const sol = (solicitacoes ?? []).find(s => s.id === id);
      toast({ title: "Férias rejeitadas.", description: `Motivo registrado para ${sol?.nome}.` });
    } catch {
      toast({ title: "Erro ao rejeitar férias.", variant: "destructive" });
    }
  }

  async function aprovarLote() {
    try {
      await Promise.all(selecionados.map(id => aprovarFerias({ id })));
      toast({ title: `${selecionados.length} solicitação(ões) aprovada(s) em lote!` });
      setSelecionados([]);
    } catch {
      toast({ title: "Erro ao aprovar em lote.", variant: "destructive" });
    }
  }

  function toggleSelecionado(id: string) {
    setSelecionados(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  return (
    <RhLayout title="Férias — Fila de Aprovação" subtitle="Gerencie as solicitações de férias">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar as solicitações de férias.
        </div>
      )}

      <Tabs defaultValue="fila">
        <TabsList className="mb-6">
          <TabsTrigger value="fila" className="gap-2 text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5" />
            Fila de Aprovação
            {pendentes.length > 0 && (
              <Badge className="bg-amber-500 text-white text-xs ml-1 hover:bg-amber-500">{pendentes.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2 text-xs sm:text-sm">
            <Calendar className="h-3.5 w-3.5" />
            Calendário da Secretaria
          </TabsTrigger>
        </TabsList>

        {/* Aba: Fila de aprovação */}
        <TabsContent value="fila">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9 text-sm" placeholder="Nome ou protocolo..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={secretariaFiltro} onValueChange={setSecretariaFiltro}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as secretarias</SelectItem>
                {secretarias.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {selecionados.length > 0 && (
              <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={aprovarLote}>
                <CheckCircle className="h-4 w-4" />
                Aprovar {selecionados.length} selecionada(s)
              </Button>
            )}
          </div>

          {/* Cards */}
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(sol => {
                const isRejecting = rejectingId === sol.id;
                return (
                  <Card key={sol.id}>
                    <CardContent className="pt-5 pb-5">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                        {/* Checkbox */}
                        <div className="flex-shrink-0 pt-1">
                          <Checkbox
                            checked={selecionados.includes(sol.id)}
                            onCheckedChange={() => toggleSelecionado(sol.id)}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">{sol.nome}</p>
                              <p className="text-xs text-gray-500">Mat. {sol.matricula} — {sol.cargo} — {sol.secretaria}</p>
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
                              <Clock className="h-3 w-3" />Aguardando
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 rounded-lg p-3 mb-3">
                            <div>
                              <p className="text-gray-400 mb-0.5">Período de férias</p>
                              <p className="font-medium text-gray-700">{sol.dataInicio} – {sol.dataFim}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5">Quantidade</p>
                              <p className="font-medium text-gray-700">{sol.qtdDias} dias</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5">Período aquisitivo</p>
                              <p className="font-medium text-gray-700">{sol.periodoAquisitivo}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5">Protocolo</p>
                              <p className="font-mono font-medium text-blue-600">{sol.protocolo}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            {sol.adiantamento13 && (
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">Adiantamento 13°</Badge>
                            )}
                            {sol.abonoPecuniario && (
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Abono Pecuniário</Badge>
                            )}
                          </div>

                          {isRejecting && (
                            <div className="mt-3 space-y-2">
                              <Textarea
                                placeholder="Informe o motivo da rejeição (obrigatório)..."
                                className="text-sm min-h-[80px]"
                                value={motivos[sol.id] ?? ""}
                                onChange={(e) => setMotivos({ ...motivos, [sol.id]: e.target.value })}
                              />
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setRejectingId(null)}>Cancelar</Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={!motivos[sol.id]?.trim()}
                                  onClick={() => rejeitar(sol.id)}
                                >
                                  Confirmar Rejeição
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Ações */}
                        {!isRejecting && (
                          <div className="flex lg:flex-col gap-2 flex-shrink-0">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1.5 flex-1 lg:flex-none" onClick={() => aprovar(sol.id)}>
                              <CheckCircle className="h-4 w-4" />Aprovar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5 flex-1 lg:flex-none" onClick={() => setRejectingId(sol.id)}>
                              <XCircle className="h-4 w-4" />Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <Umbrella className="h-10 w-10 mx-auto mb-3" />
                  <p>Nenhuma solicitação pendente encontrada.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Aba: Calendário */}
        <TabsContent value="calendario">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Calendário de Férias — Visão Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <CalendarioFerias solicitacoes={solicitacoes ?? []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </RhLayout>
  );
}
