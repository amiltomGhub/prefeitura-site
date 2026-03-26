import { useState } from "react";
import { RhLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, XCircle, Clock, Search, Calendar,
  Umbrella, AlertTriangle, Users
} from "lucide-react";

const SOLICITACOES = [
  {
    id: "fv-01",
    nome: "Ana Lima",
    matricula: "0019283",
    secretaria: "SEMUS",
    cargo: "Enfermeira",
    dataInicio: "01/07/2026",
    dataFim: "30/07/2026",
    qtdDias: 30,
    periodoAquisitivo: "01/01/2025 – 31/12/2025",
    protocolado: "10/03/2026",
    protocolo: "SOL-2026-0198",
    adiantamento13: false,
    abonoPecuniario: false,
    status: "pendente",
  },
  {
    id: "fv-02",
    nome: "Carlos Mendes",
    matricula: "0038291",
    secretaria: "SEMEC",
    cargo: "Professor",
    dataInicio: "15/08/2026",
    dataFim: "03/09/2026",
    qtdDias: 20,
    periodoAquisitivo: "01/01/2025 – 31/12/2025",
    protocolado: "15/03/2026",
    protocolo: "SOL-2026-0212",
    adiantamento13: true,
    abonoPecuniario: false,
    status: "pendente",
  },
  {
    id: "fv-03",
    nome: "Mariana Costa",
    matricula: "0027183",
    secretaria: "SEMAD",
    cargo: "Assistente Administrativo",
    dataInicio: "10/09/2026",
    dataFim: "09/10/2026",
    qtdDias: 30,
    periodoAquisitivo: "01/01/2025 – 31/12/2025",
    protocolado: "20/03/2026",
    protocolo: "SOL-2026-0245",
    adiantamento13: false,
    abonoPecuniario: true,
    status: "pendente",
  },
];

type StatusMap = Record<string, "pendente" | "aprovado" | "rejeitado">;
type MotivosMap = Record<string, string>;

export default function RhFerias() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<StatusMap>(() =>
    Object.fromEntries(SOLICITACOES.map((s) => [s.id, s.status as "pendente"]))
  );
  const [motivos, setMotivos] = useState<MotivosMap>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [secretariaFiltro, setSecretariaFiltro] = useState("todas");

  const secretarias = [...new Set(SOLICITACOES.map((s) => s.secretaria))];

  const filtered = SOLICITACOES.filter((s) => {
    const matchSearch = s.nome.toLowerCase().includes(search.toLowerCase()) || s.protocolo.includes(search);
    const matchSec = secretariaFiltro === "todas" || s.secretaria === secretariaFiltro;
    return matchSearch && matchSec;
  });

  function aprovar(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: "aprovado" }));
    setSelecionados((prev) => prev.filter((x) => x !== id));
    toast({ title: "Férias aprovadas com sucesso!", description: `Solicitação ${SOLICITACOES.find((s) => s.id === id)?.protocolo} aprovada.` });
  }

  function rejeitar(id: string) {
    const motivo = motivos[id];
    if (!motivo?.trim()) return;
    setStatuses((prev) => ({ ...prev, [id]: "rejeitado" }));
    setRejectingId(null);
    toast({ title: "Férias rejeitadas.", description: `Motivo registrado para ${SOLICITACOES.find((s) => s.id === id)?.nome}.` });
  }

  function aprovarLote() {
    const novos: StatusMap = { ...statuses };
    selecionados.forEach((id) => { novos[id] = "aprovado"; });
    setStatuses(novos);
    setSelecionados([]);
    toast({ title: `${selecionados.length} solicitação(ões) aprovada(s) em lote!` });
  }

  function toggleSelecionado(id: string) {
    setSelecionados((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <RhLayout title="Férias — Fila de Aprovação" subtitle="Gerencie as solicitações de férias">
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
            {secretarias.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
      <div className="space-y-4">
        {filtered.map((sol) => {
          const status = statuses[sol.id];
          const isRejecting = rejectingId === sol.id;

          return (
            <Card key={sol.id} className={`transition-all ${status !== "pendente" ? "opacity-60" : ""}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  {/* Checkbox (só se pendente) */}
                  {status === "pendente" && (
                    <div className="flex-shrink-0 pt-1">
                      <Checkbox
                        checked={selecionados.includes(sol.id)}
                        onCheckedChange={() => toggleSelecionado(sol.id)}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{sol.nome}</p>
                        <p className="text-xs text-gray-500">Mat. {sol.matricula} — {sol.cargo} — {sol.secretaria}</p>
                      </div>
                      {status === "pendente" ? (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
                          <Clock className="h-3 w-3" />Aguardando
                        </Badge>
                      ) : status === "aprovado" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />Aprovado
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />Rejeitado
                        </Badge>
                      )}
                    </div>

                    {/* Período e detalhes */}
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

                    {/* Badges extras */}
                    <div className="flex gap-2 flex-wrap">
                      {sol.adiantamento13 && (
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">
                          Adiantamento 13°
                        </Badge>
                      )}
                      {sol.abonoPecuniario && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
                          Abono Pecuniário
                        </Badge>
                      )}
                    </div>

                    {/* Rejeição */}
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
                  {status === "pendente" && !isRejecting && (
                    <div className="flex lg:flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 gap-1.5 flex-1 lg:flex-none"
                        onClick={() => aprovar(sol.id)}
                      >
                        <CheckCircle className="h-4 w-4" />Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5 flex-1 lg:flex-none"
                        onClick={() => setRejectingId(sol.id)}
                      >
                        <XCircle className="h-4 w-4" />Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Umbrella className="h-10 w-10 mx-auto mb-3" />
          <p>Nenhuma solicitação encontrada.</p>
        </div>
      )}
    </RhLayout>
  );
}
