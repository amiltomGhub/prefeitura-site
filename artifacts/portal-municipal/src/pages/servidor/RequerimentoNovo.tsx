import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useCriarRequerimento } from "@/services/servidorApi";
import { useToast } from "@/hooks/use-toast";

const TIPOS = [
  { value: "declaracao_tempo_servico", label: "Declaração de Tempo de Serviço", campos: [] },
  {
    value: "licenca_medica",
    label: "Licença Médica",
    campos: [
      { id: "cid", label: "CID (Código Internacional de Doenças)", type: "text", required: true },
      { id: "medico", label: "Nome do Médico / CRM", type: "text", required: true },
      { id: "diasSolicitados", label: "Dias Solicitados", type: "number", required: true },
    ],
  },
  {
    value: "progressao_horizontal",
    label: "Progressão Horizontal",
    campos: [
      { id: "classeAtual", label: "Classe Atual", type: "text", required: true },
      { id: "classeRequerida", label: "Classe Requerida", type: "text", required: true },
    ],
  },
  {
    value: "licenca_capacitacao",
    label: "Licença para Capacitação",
    campos: [
      { id: "instituicao", label: "Instituição de Ensino", type: "text", required: true },
      { id: "curso", label: "Nome do Curso/Pós-Graduação", type: "text", required: true },
      { id: "dataInicio", label: "Data de Início do Curso", type: "date", required: true },
      { id: "dataFim", label: "Data de Conclusão prevista", type: "date", required: true },
    ],
  },
  {
    value: "adicional_insalubridade",
    label: "Adicional de Insalubridade",
    campos: [
      { id: "setor", label: "Setor / Local de Trabalho", type: "text", required: true },
    ],
  },
  { value: "certidao_funcional", label: "Certidão Funcional", campos: [] },
  { value: "abono_permanencia", label: "Abono Permanência", campos: [] },
];

interface Arquivo {
  nome: string;
  tamanho: string;
}

export default function RequerimentoNovo() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [tipo, setTipo] = useState("");
  const [campos, setCampos] = useState<Record<string, string>>({});
  const [justificativa, setJustificativa] = useState("");
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [preview, setPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [novoReqId, setNovoReqId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: criarRequerimento, isPending, error: apiError } = useCriarRequerimento();

  const tipoSelecionado = TIPOS.find((t) => t.value === tipo);
  const camposValidos = tipoSelecionado?.campos.every(
    (c) => !c.required || !!campos[c.id]
  ) ?? true;
  const canPreview = tipo && camposValidos && justificativa.length >= 100;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      setArquivos((prev) => [
        ...prev,
        { nome: f.name, tamanho: (f.size / 1024).toFixed(0) + " KB" },
      ]);
    });
    e.target.value = "";
  }

  async function handleSubmit() {
    const justificativaCompleta = justificativa + (Object.keys(campos).length > 0
      ? "\n\n" + Object.entries(campos).map(([k, v]) => {
          const campo = tipoSelecionado?.campos.find(c => c.id === k);
          return `${campo?.label ?? k}: ${v}`;
        }).join("; ")
      : "");

    try {
      const resultado = await criarRequerimento({
        tipo,
        justificativa: justificativaCompleta,
        documentos: arquivos.map(a => a.nome),
      });
      setProtocolo(resultado.protocolo);
      setNovoReqId(resultado.id);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao protocolar requerimento.";
      toast({ title: "Erro ao protocolar", description: msg, variant: "destructive" });
    }
  }

  if (submitted) {
    return (
      <ServidorLayout title="Requerimento Protocolado" subtitle="">
        <div className="max-w-lg mx-auto text-center space-y-5 py-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Requerimento Protocolado!</h2>
            <p className="text-gray-500 text-sm mt-1">Seu requerimento foi encaminhado ao RH.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">Protocolo</span>
              <span className="font-mono font-bold text-blue-700">{protocolo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo</span>
              <span className="font-medium">{tipoSelecionado?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data</span>
              <span className="font-medium">{new Date().toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            {novoReqId && (
              <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => navigate(`/servidor/requerimentos/${novoReqId}`)}>
                Ver Detalhes
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/servidor/requerimentos")}>
              Ver Requerimentos
            </Button>
          </div>
        </div>
      </ServidorLayout>
    );
  }

  return (
    <ServidorLayout title="Novo Requerimento" subtitle="Preencha os dados e envie ao RH">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/servidor/requerimentos">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />Voltar
            </Button>
          </Link>
        </div>

        {apiError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
            <AlertCircle className="h-4 w-4" />
            {apiError instanceof Error ? apiError.message : "Erro ao protocolar requerimento."}
          </div>
        )}

        {!preview ? (
          <Card>
            <CardHeader><CardTitle className="text-base">Dados do Requerimento</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* Tipo */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Tipo de Requerimento <span className="text-red-500">*</span></Label>
                <Select value={tipo} onValueChange={(v) => { setTipo(v); setCampos({}); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos dinâmicos */}
              {tipoSelecionado && tipoSelecionado.campos.length > 0 && (
                <div className="space-y-4 border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Informações específicas</p>
                  {tipoSelecionado.campos.map((campo) => (
                    <div key={campo.id}>
                      <Label className="text-xs font-medium mb-1.5 block">
                        {campo.label}{campo.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Input
                        type={campo.type}
                        value={campos[campo.id] ?? ""}
                        onChange={(e) => setCampos({ ...campos, [campo.id]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Justificativa */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">
                  Justificativa <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-2">({justificativa.length}/100 mín.)</span>
                </Label>
                <Textarea
                  placeholder="Descreva de forma detalhada o motivo do requerimento..."
                  className="min-h-[120px] text-sm"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                />
                {justificativa.length > 0 && justificativa.length < 100 && (
                  <p className="text-xs text-red-500 mt-1">Mínimo de 100 caracteres.</p>
                )}
              </div>

              {/* Upload de documentos */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Documentos de Suporte</Label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Clique para selecionar arquivos</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — máx. 5 MB por arquivo</p>
                </div>
                <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
                {arquivos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {arquivos.map((a, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700 truncate">{a.nome}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">{a.tamanho}</span>
                        </div>
                        <button onClick={() => setArquivos((prev) => prev.filter((_, j) => j !== i))}>
                          <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-blue-700 hover:bg-blue-800"
                disabled={!canPreview}
                onClick={() => setPreview(true)}
              >
                Pré-visualizar e Protocolar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo</span>
                  <span className="font-medium">{tipoSelecionado?.label}</span>
                </div>
                {Object.entries(campos).map(([k, v]) => {
                  const campo = tipoSelecionado?.campos.find((c) => c.id === k);
                  return (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500">{campo?.label ?? k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  );
                })}
                <div>
                  <p className="text-gray-500 mb-1">Justificativa</p>
                  <p className="text-gray-700 text-xs bg-white border rounded p-3">{justificativa}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Documentos</p>
                  {arquivos.length === 0 ? (
                    <p className="text-xs text-gray-400">Nenhum documento anexado</p>
                  ) : (
                    <div className="space-y-1">
                      {arquivos.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{a.nome}</Badge>
                          <span className="text-gray-400">{a.tamanho}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setPreview(false)} disabled={isPending}>
                  Editar
                </Button>
                <Button
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  {isPending ? "Protocolando..." : "Confirmar e Protocolar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ServidorLayout>
  );
}
