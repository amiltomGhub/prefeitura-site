import { useState } from "react";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  User, Clock, History, Edit, Save, X, AlertCircle,
  Briefcase, Calendar, Building2, CreditCard
} from "lucide-react";
import { usePerfilServidor, useAtualizarPerfil, useHistoricoFuncional, useTempoServico } from "@/services/servidorApi";

function tipoColor(t: string) {
  const map: Record<string, string> = {
    admissao: "bg-blue-100 text-blue-700",
    progressao: "bg-green-100 text-green-700",
    licenca: "bg-amber-100 text-amber-700",
    beneficio: "bg-purple-100 text-purple-700",
    avaliacao: "bg-indigo-100 text-indigo-700",
  };
  return map[t] ?? "bg-gray-100 text-gray-600";
}

function tipoLabel(t: string) {
  const map: Record<string, string> = {
    admissao: "Admissão", progressao: "Progressão", licenca: "Licença",
    beneficio: "Benefício", avaliacao: "Avaliação",
  };
  return map[t] ?? t;
}

function FieldSkeleton() {
  return (
    <div>
      <Skeleton className="h-3 w-24 mb-1" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

export default function VidaFuncional() {
  const [editMode, setEditMode] = useState(false);
  const [tempDados, setTempDados] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: perfil, isLoading: loadingPerfil, error: errPerfil } = usePerfilServidor();
  const { data: historico, isLoading: loadingHistorico } = useHistoricoFuncional();
  const { data: tempoServico, isLoading: loadingTempo } = useTempoServico();
  const { mutateAsync: atualizarPerfil, isPending: saving } = useAtualizarPerfil();

  const DADOS_FUNCIONAIS_LABELS: Record<string, string> = {
    matricula: "Matrícula", cargo: "Cargo", classe: "Classe/Nível",
    regime: "Regime", lotacao: "Lotação", vinculo: "Vínculo",
    dataPosse: "Data de Posse", dataExercicio: "Data de Exercício",
    escala: "Escala de Trabalho", portariaAdmissao: "Portaria de Admissão",
  };

  const FUNCIONAIS_KEYS = ["matricula", "cargo", "classe", "regime", "lotacao", "vinculo", "dataPosse", "dataExercicio", "escala", "portariaAdmissao"];
  const EDITAVEIS_KEYS = ["email", "telefone", "endereco", "municipio", "cep"];
  const EDITAVEIS_LABELS: Record<string, string> = {
    email: "E-mail", telefone: "Telefone", endereco: "Endereço",
    municipio: "Município/UF", cep: "CEP",
  };
  const PESSOAIS_KEYS = ["nomeCompleto", "cpf", "rg", "dataNascimento", "estadoCivil", "nomeMae", "email", "telefone", "endereco", "municipio", "cep"];
  const PESSOAIS_LABELS: Record<string, string> = {
    nomeCompleto: "Nome Completo", cpf: "CPF", rg: "RG",
    dataNascimento: "Data de Nascimento", estadoCivil: "Estado Civil",
    nomeMae: "Nome da Mãe", email: "E-mail", telefone: "Telefone",
    endereco: "Endereço", municipio: "Município/UF", cep: "CEP",
  };

  async function salvarDados() {
    try {
      await atualizarPerfil(tempDados);
      setEditMode(false);
      toast({ title: "Dados atualizados", description: "Suas informações foram salvas com sucesso." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar.";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
  }

  return (
    <ServidorLayout title="Vida Funcional" subtitle="Dados cadastrais, histórico e tempo de serviço">
      <Tabs defaultValue="cadastrais">
        <TabsList className="mb-6">
          <TabsTrigger value="cadastrais" className="gap-2 text-xs sm:text-sm">
            <User className="h-3.5 w-3.5" />Dados Cadastrais
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2 text-xs sm:text-sm">
            <History className="h-3.5 w-3.5" />Histórico Funcional
          </TabsTrigger>
          <TabsTrigger value="tempo" className="gap-2 text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5" />Tempo de Serviço
          </TabsTrigger>
        </TabsList>

        {/* Aba 1 — Dados Cadastrais */}
        <TabsContent value="cadastrais" className="space-y-5">
          {errPerfil && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              Não foi possível carregar os dados do perfil.
            </div>
          )}

          {/* Funcionais (read-only) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Dados Funcionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {loadingPerfil
                  ? Array.from({ length: 10 }).map((_, i) => <FieldSkeleton key={i} />)
                  : FUNCIONAIS_KEYS.map((k) => (
                    <div key={k}>
                      <p className="text-xs text-gray-400 mb-0.5">{DADOS_FUNCIONAIS_LABELS[k]}</p>
                      <p className="font-medium text-gray-800">{(perfil as Record<string, string> | undefined)?.[k] ?? "—"}</p>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          {/* Pessoais (editáveis) */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Dados Pessoais
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs ml-1">Editável</Badge>
                </CardTitle>
                {!editMode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => {
                      const init: Record<string, string> = {};
                      EDITAVEIS_KEYS.forEach(k => { init[k] = (perfil as Record<string, string> | undefined)?.[k] ?? ""; });
                      setTempDados(init);
                      setEditMode(true);
                    }}
                    disabled={loadingPerfil}
                  >
                    <Edit className="h-3.5 w-3.5" />Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gray-500" onClick={() => setEditMode(false)} disabled={saving}>
                      <X className="h-3.5 w-3.5" />Cancelar
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs bg-blue-700 hover:bg-blue-800" onClick={salvarDados} disabled={saving}>
                      <Save className="h-3.5 w-3.5" />{saving ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingPerfil ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 11 }).map((_, i) => <FieldSkeleton key={i} />)}
                </div>
              ) : editMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EDITAVEIS_KEYS.map((k) => (
                    <div key={k}>
                      <Label className="text-xs font-medium mb-1.5 block">{EDITAVEIS_LABELS[k]}</Label>
                      <Input
                        className="text-sm"
                        value={tempDados[k] ?? ""}
                        onChange={(e) => setTempDados({ ...tempDados, [k]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {PESSOAIS_KEYS.map((k) => (
                    <div key={k}>
                      <p className="text-xs text-gray-400 mb-0.5">{PESSOAIS_LABELS[k]}</p>
                      <p className="font-medium text-gray-800">{(perfil as Record<string, string> | undefined)?.[k] ?? "—"}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dados bancários */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                Dados Bancários
                <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 text-xs ml-1">Somente RH pode alterar</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPerfil ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1,2,3].map(i => <FieldSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Banco</p>
                    <p className="font-medium text-gray-800">{perfil?.banco ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Agência</p>
                    <p className="font-medium text-gray-800">{perfil?.agencia ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Conta</p>
                    <p className="font-medium text-gray-800">{perfil?.conta ?? "—"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba 2 — Histórico */}
        <TabsContent value="historico">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Histórico de Eventos Funcionais</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistorico ? (
                <div className="space-y-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : historico && historico.length > 0 ? (
                <div className="space-y-6">
                  {historico.map((ev, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        {i < historico.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-2" />}
                      </div>
                      <div className="pb-6 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800">{ev.evento}</p>
                          <Badge className={`${tipoColor(ev.tipo)} hover:${tipoColor(ev.tipo)} text-xs flex-shrink-0`}>
                            {tipoLabel(ev.tipo)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{ev.detalhe}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{ev.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">Nenhum evento funcional encontrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba 3 — Tempo de Serviço */}
        <TabsContent value="tempo">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {loadingTempo ? (
                [1,2,3].map(i => (
                  <Card key={i}>
                    <CardContent className="pt-6 text-center">
                      <Skeleton className="h-12 w-16 mx-auto mb-2" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </CardContent>
                  </Card>
                ))
              ) : [
                { valor: tempoServico?.anos ?? 0, label: "Anos" },
                { valor: tempoServico?.meses ?? 0, label: "Meses" },
                { valor: tempoServico?.diasAdicionais ?? 0, label: "Dias" },
              ].map(({ valor, label }) => (
                <Card key={label}>
                  <CardContent className="pt-6 text-center">
                    <p className="text-4xl font-bold text-blue-700">{valor}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Projeção de Aposentadoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingTempo ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => <FieldSkeleton key={i} />)}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Data de Ingresso</p>
                        <p className="font-medium text-gray-800">{tempoServico?.dataAdmissao ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Regime de Aposentadoria</p>
                        <p className="font-medium text-gray-800">RPPS — Regime Próprio</p>
                      </div>
                      {tempoServico?.projecaoAposentadoria && (
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Previsão de aposentadoria</p>
                          <p className="font-bold text-green-700">{tempoServico.projecaoAposentadoria}</p>
                        </div>
                      )}
                    </div>

                    {tempoServico?.percentualProgresso !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Ingresso</span>
                          <span>{tempoServico.percentualProgresso}% concluído</span>
                          <span>Aposentadoria</span>
                        </div>
                        <Progress value={tempoServico.percentualProgresso} className="h-3" />
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
                      <p className="font-medium mb-1">Informações baseadas na legislação atual</p>
                      <p>Esta projeção é estimada com base no tempo de serviço atual e pode variar conforme alterações na legislação previdenciária. Consulte o setor de RH para informações detalhadas.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ServidorLayout>
  );
}
