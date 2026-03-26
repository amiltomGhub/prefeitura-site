import { useState } from "react";
import { Link } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, ClipboardList } from "lucide-react";

const STEPS = ["Configuração", "Confirmação", "Protocolo"];

interface FormData {
  periodoAquisitivoId: string;
  dataInicio: string;
  qtdDias: number;
  parcelas: number;
  adiantamento13: boolean;
  abonoPecuniario: boolean;
  qtdDiasAbono: number;
  confirmado: boolean;
}

const PERIODO_DISPONIVEL = {
  id: "pa-001-2",
  descricao: "01/01/2025 – 31/12/2025",
  diasDisponiveis: 30,
  vencimento: "31/01/2027",
};

export default function FeriasSolicitar() {
  const [step, setStep] = useState(0);
  const [protocolo, setProtocolo] = useState("");
  const [form, setForm] = useState<FormData>({
    periodoAquisitivoId: PERIODO_DISPONIVEL.id,
    dataInicio: "",
    qtdDias: 30,
    parcelas: 1,
    adiantamento13: false,
    abonoPecuniario: false,
    qtdDiasAbono: 0,
    confirmado: false,
  });

  const dataFim = form.dataInicio
    ? (() => {
        const d = new Date(form.dataInicio);
        d.setDate(d.getDate() + form.qtdDias - 1);
        return d.toLocaleDateString("pt-BR");
      })()
    : "";

  const canProceedStep0 =
    form.dataInicio &&
    form.qtdDias >= 5 &&
    form.qtdDias <= 30 &&
    (!form.abonoPecuniario || form.qtdDiasAbono >= 5);

  function handleSubmit() {
    const prot = `SOL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setProtocolo(prot);
    setStep(2);
  }

  return (
    <ServidorLayout title="Solicitar Férias" subtitle="Formulário de solicitação de férias">
      <div className="max-w-2xl mx-auto">
        {/* Progress steps */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                i < step ? "bg-green-100 text-green-700" :
                i === step ? "bg-blue-700 text-white shadow-sm" :
                "bg-gray-100 text-gray-400"
              }`}>
                {i < step ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
                <span className="hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Configuração */}
        {step === 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Configurar Período de Férias</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* Período aquisitivo */}
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Período Aquisitivo</Label>
                <div className="border border-blue-200 bg-blue-50 rounded-lg px-4 py-3 text-sm">
                  <p className="font-medium text-blue-800">{PERIODO_DISPONIVEL.descricao}</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {PERIODO_DISPONIVEL.diasDisponiveis} dias disponíveis — vence em {PERIODO_DISPONIVEL.vencimento}
                  </p>
                </div>
              </div>

              {/* Data de início */}
              <div>
                <Label htmlFor="dataInicio" className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Data de Início <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={form.dataInicio}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">Fins de semana e feriados são bloqueados pelo RH.</p>
              </div>

              {/* Quantidade de dias */}
              <div>
                <Label htmlFor="qtdDias" className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Quantidade de Dias (5 a 30) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="qtdDias"
                  type="number"
                  min={5}
                  max={30}
                  value={form.qtdDias}
                  onChange={(e) => setForm({ ...form, qtdDias: Number(e.target.value) })}
                />
                {form.dataInicio && <p className="text-xs text-gray-500 mt-1">Retorno previsto: {dataFim}</p>}
              </div>

              {/* Parcelamento */}
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Parcelamento</Label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, parcelas: p })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.parcelas === p ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {p}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Extras */}
              <div className="space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50">
                <p className="text-xs font-medium text-gray-700 mb-2">Benefícios adicionais</p>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="adiantamento13"
                    checked={form.adiantamento13}
                    onCheckedChange={(v) => setForm({ ...form, adiantamento13: !!v })}
                  />
                  <div>
                    <Label htmlFor="adiantamento13" className="text-sm text-gray-700 cursor-pointer">Adiantamento 13° salário</Label>
                    <p className="text-xs text-gray-400">Disponível no 1° semestre</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="abono"
                    checked={form.abonoPecuniario}
                    onCheckedChange={(v) => setForm({ ...form, abonoPecuniario: !!v })}
                  />
                  <div className="flex-1">
                    <Label htmlFor="abono" className="text-sm text-gray-700 cursor-pointer">Abono pecuniário (venda de dias)</Label>
                    <p className="text-xs text-gray-400">Máximo 1/3 dos dias (10 dias)</p>
                    {form.abonoPecuniario && (
                      <Input
                        type="number"
                        min={5}
                        max={10}
                        className="mt-2 h-8 text-xs"
                        placeholder="Qtd. dias (5–10)"
                        value={form.qtdDiasAbono || ""}
                        onChange={(e) => setForm({ ...form, qtdDiasAbono: Number(e.target.value) })}
                      />
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-blue-700 hover:bg-blue-800 gap-2"
                disabled={!canProceedStep0}
                onClick={() => setStep(1)}
              >
                Continuar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Confirmação */}
        {step === 1 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Confirmar Solicitação</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Período aquisitivo</span>
                  <span className="font-medium">{PERIODO_DISPONIVEL.descricao}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de início</span>
                  <span className="font-medium">{new Date(form.dataInicio).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retorno</span>
                  <span className="font-medium">{dataFim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantidade de dias</span>
                  <span className="font-medium">{form.qtdDias} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parcelamento</span>
                  <span className="font-medium">{form.parcelas} parcela(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Adiantamento 13°</span>
                  <Badge className={form.adiantamento13 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>{form.adiantamento13 ? "Sim" : "Não"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Abono pecuniário</span>
                  <span className="font-medium">{form.abonoPecuniario ? `Sim — ${form.qtdDiasAbono} dias` : "Não"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border border-gray-200 rounded-lg p-4">
                <Checkbox
                  id="confirmar"
                  checked={form.confirmado}
                  onCheckedChange={(v) => setForm({ ...form, confirmado: !!v })}
                />
                <Label htmlFor="confirmar" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                  Confirmo que as informações estão corretas e autorizo o encaminhamento desta solicitação ao setor de RH para análise e aprovação.
                </Label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4" />Voltar
                </Button>
                <Button
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                  disabled={!form.confirmado}
                  onClick={handleSubmit}
                >
                  Protocolar Solicitação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Protocolo */}
        {step === 2 && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Solicitação Protocolada!</h2>
                <p className="text-gray-500 text-sm mt-1">Sua solicitação foi enviada ao RH para análise.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm text-left max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500">Protocolo</span>
                  <span className="font-mono font-bold text-blue-700">{protocolo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data</span>
                  <span className="font-medium">{new Date().toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Período solicitado</span>
                  <span className="font-medium">{new Date(form.dataInicio).toLocaleDateString("pt-BR")} – {dataFim}</span>
                </div>
              </div>
              {/* Mini-timeline */}
              <div className="max-w-xs mx-auto space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">Protocolado</p>
                    <p className="text-xs text-gray-400">{new Date().toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Em análise pelo RH</p>
                    <p className="text-xs text-gray-300">Aguardando</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-300">Decisão</p>
                    <p className="text-xs text-gray-300">Aguardando</p>
                  </div>
                </div>
              </div>
              <Link href="/servidor/ferias">
                <Button variant="outline" className="w-full max-w-xs">Voltar para Férias</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </ServidorLayout>
  );
}
