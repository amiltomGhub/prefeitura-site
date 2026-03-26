import { useState } from "react";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServidor } from "@/contexts/ServidorContext";
import {
  User, Clock, History, Edit, Save, X, CheckCircle,
  Briefcase, Calendar, Building2, CreditCard
} from "lucide-react";

const DADOS_CADASTRAIS_INICIAIS = {
  nomeCompleto: "Ana Paula Ferreira Costa",
  cpf: "***.***.***-00",
  rg: "1.234.567 SSP/PA",
  dataNascimento: "15/04/1985",
  estadoCivil: "Casada",
  nomeMae: "Maria Ferreira Costa",
  email: "ana.costa@parauapebas.pa.gov.br",
  telefone: "(94) 9 8765-4321",
  endereco: "Rua das Palmeiras, 320 — Bairro Liberdade",
  municipio: "Parauapebas — PA",
  cep: "68.515-010",
  banco: "Banco do Brasil",
  agencia: "****-3",
  conta: "*****8-4",
};

const DADOS_FUNCIONAIS = {
  matricula: "0012345",
  cargo: "Analista Administrativo",
  classe: "C — Nível III",
  regime: "Estatutário",
  lotacao: "SEMAD — Secretaria Municipal de Administração",
  vinculo: "Efetivo",
  dataPosse: "02/01/2019",
  dataExercicio: "03/01/2019",
  escala: "8h/dia — Segunda a Sexta",
  portariaAdmissao: "Portaria n° 001/2019 — SEMAD",
};

const HISTORICO_FUNCIONAL = [
  { data: "02/01/2019", evento: "Posse e início do exercício", detalhe: "Cargo: Analista Administrativo — Portaria 001/2019", tipo: "admissao" },
  { data: "10/03/2020", evento: "Progressão Horizontal — Classe A → B", detalhe: "Interstício de 12 meses cumprido — Portaria 047/2020", tipo: "progressao" },
  { data: "15/06/2021", evento: "Licença para Capacitação", detalhe: "MBA em Gestão Pública — 6 meses — Portaria 112/2021", tipo: "licenca" },
  { data: "02/01/2022", evento: "Progressão Horizontal — Classe B → C", detalhe: "Interstício de 24 meses cumprido — Portaria 002/2022", tipo: "progressao" },
  { data: "20/07/2023", evento: "Adicional de Insalubridade concedido", detalhe: "Grau médio (20%) — Portaria 078/2023", tipo: "beneficio" },
  { data: "15/01/2025", evento: "Avaliação de Desempenho — Ótimo", detalhe: "Pontuação: 92/100 — Ciclo 2024", tipo: "avaliacao" },
];

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

export default function VidaFuncional() {
  const { servidor } = useServidor();
  const [editMode, setEditMode] = useState(false);
  const [dados, setDados] = useState(DADOS_CADASTRAIS_INICIAIS);
  const [tempDados, setTempDados] = useState(DADOS_CADASTRAIS_INICIAIS);

  const TEMPO_ANOS = 7;
  const TEMPO_MESES = 2;
  const TEMPO_DIAS = 24;
  const APOSENTADORIA_ANOS_RESTANTES = 25;
  const PCT_CARREIRA = Math.round((TEMPO_ANOS / (TEMPO_ANOS + APOSENTADORIA_ANOS_RESTANTES)) * 100);

  function salvarDados() {
    setDados(tempDados);
    setEditMode(false);
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
                {Object.entries(DADOS_FUNCIONAIS).map(([k, v]) => {
                  const labels: Record<string, string> = {
                    matricula: "Matrícula", cargo: "Cargo", classe: "Classe/Nível",
                    regime: "Regime", lotacao: "Lotação", vinculo: "Vínculo",
                    dataPosse: "Data de Posse", dataExercicio: "Data de Exercício",
                    escala: "Escala de Trabalho", portariaAdmissao: "Portaria de Admissão",
                  };
                  return (
                    <div key={k}>
                      <p className="text-xs text-gray-400 mb-0.5">{labels[k] ?? k}</p>
                      <p className="font-medium text-gray-800">{v}</p>
                    </div>
                  );
                })}
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
                  <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => { setTempDados(dados); setEditMode(true); }}>
                    <Edit className="h-3.5 w-3.5" />Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gray-500" onClick={() => setEditMode(false)}>
                      <X className="h-3.5 w-3.5" />Cancelar
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs bg-blue-700 hover:bg-blue-800" onClick={salvarDados}>
                      <Save className="h-3.5 w-3.5" />Salvar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { k: "email", label: "E-mail" },
                    { k: "telefone", label: "Telefone" },
                    { k: "endereco", label: "Endereço" },
                    { k: "municipio", label: "Município/UF" },
                    { k: "cep", label: "CEP" },
                  ].map(({ k, label }) => (
                    <div key={k}>
                      <Label className="text-xs font-medium mb-1.5 block">{label}</Label>
                      <Input
                        className="text-sm"
                        value={(tempDados as Record<string, string>)[k]}
                        onChange={(e) => setTempDados({ ...tempDados, [k]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { k: "nomeCompleto", label: "Nome Completo" },
                    { k: "cpf", label: "CPF" },
                    { k: "rg", label: "RG" },
                    { k: "dataNascimento", label: "Data de Nascimento" },
                    { k: "estadoCivil", label: "Estado Civil" },
                    { k: "nomeMae", label: "Nome da Mãe" },
                    { k: "email", label: "E-mail" },
                    { k: "telefone", label: "Telefone" },
                    { k: "endereco", label: "Endereço" },
                    { k: "municipio", label: "Município/UF" },
                    { k: "cep", label: "CEP" },
                  ].map(({ k, label }) => (
                    <div key={k}>
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="font-medium text-gray-800">{(dados as Record<string, string>)[k]}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Banco</p>
                  <p className="font-medium text-gray-800">{dados.banco}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Agência</p>
                  <p className="font-medium text-gray-800">{dados.agencia}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Conta</p>
                  <p className="font-medium text-gray-800">{dados.conta}</p>
                </div>
              </div>
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
              <div className="space-y-6">
                {HISTORICO_FUNCIONAL.map((ev, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      {i < HISTORICO_FUNCIONAL.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-2" />}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba 3 — Tempo de Serviço */}
        <TabsContent value="tempo">
          <div className="space-y-5">
            {/* Contador */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { valor: TEMPO_ANOS, label: "Anos" },
                { valor: TEMPO_MESES, label: "Meses" },
                { valor: TEMPO_DIAS, label: "Dias" },
              ].map(({ valor, label }) => (
                <Card key={label}>
                  <CardContent className="pt-6 text-center">
                    <p className="text-4xl font-bold text-blue-700">{valor}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Projeção */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Projeção de Aposentadoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Regime de Aposentadoria</p>
                    <p className="font-medium text-gray-800">RPPS — Regime Próprio</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Data de Ingresso</p>
                    <p className="font-medium text-gray-800">02/01/2019</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Tempo total necessário</p>
                    <p className="font-medium text-gray-800">25 anos (Regra de Transição)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Previsão de aposentadoria</p>
                    <p className="font-bold text-green-700">02/01/2049</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Tempo restante</p>
                    <p className="font-medium text-gray-800">{APOSENTADORIA_ANOS_RESTANTES} anos, 10 meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Progressão na carreira</p>
                    <p className="font-medium text-gray-800">{PCT_CARREIRA}% do tempo acumulado</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Ingresso (2019)</span>
                    <span>{PCT_CARREIRA}% concluído</span>
                    <span>Aposentadoria (2049)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
                      style={{ width: `${PCT_CARREIRA}%` }}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
                  <p className="font-medium mb-1">Informações baseadas na legislação atual</p>
                  <p>Esta projeção é estimada com base no tempo de serviço atual e pode variar conforme alterações na legislação previdenciária. Consulte o setor de RH para informações detalhadas.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ServidorLayout>
  );
}
