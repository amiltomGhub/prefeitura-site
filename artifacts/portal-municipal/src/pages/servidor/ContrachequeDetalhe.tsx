import { Link, useParams } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { useServidor } from "@/contexts/ServidorContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, ArrowLeft, Building2 } from "lucide-react";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const VERBAS_VENCIMENTOS = [
  { codigo: "0001", descricao: "Vencimento Base", referencia: "100%", valor: 5000.00 },
  { codigo: "0020", descricao: "Gratificação de Nível Superior", referencia: "30%", valor: 1500.00 },
  { codigo: "0035", descricao: "Adicional de Tempo de Serviço (7 anos)", referencia: "21%", valor: 1050.00 },
  { codigo: "0042", descricao: "Adicional de Insalubridade", referencia: "20%", valor: 1000.00 },
];

const VERBAS_DESCONTOS = [
  { codigo: "1001", descricao: "INSS", referencia: "11%", valor: 550.00 },
  { codigo: "1020", descricao: "IRRF", referencia: "15%", valor: 637.50 },
  { codigo: "1035", descricao: "Plano de Saúde — Servidor", referencia: "", valor: 210.00 },
  { codigo: "1042", descricao: "Plano de Saúde — Dependentes", referencia: "", valor: 350.00 },
  { codigo: "1055", descricao: "Contribuição Previdenciária Municipal", referencia: "4%", valor: 220.00 },
];

const INFORMACOES = [
  { descricao: "Salário de Contribuição INSS", valor: 5000.00 },
  { descricao: "Base Cálculo IRRF", valor: 7550.00 },
  { descricao: "Dedução INSS para IRRF", valor: 550.00 },
  { descricao: "Total de Dependentes IRRF", valor: 1 },
];

export default function ContrachequeDetalhe() {
  const params = useParams<{ mes: string; ano: string }>();
  const { servidor } = useServidor();
  const mes = Number(params.mes);
  const ano = Number(params.ano);

  const totalBruto = VERBAS_VENCIMENTOS.reduce((s, v) => s + v.valor, 0);
  const totalDescontos = VERBAS_DESCONTOS.reduce((s, v) => s + v.valor, 0);
  const totalLiquido = totalBruto - totalDescontos;

  return (
    <ServidorLayout
      title={`Contracheque — ${MESES[mes - 1]}/${ano}`}
      subtitle="Demonstrativo de Pagamento"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/servidor/contracheque">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />Voltar
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />Imprimir
          </Button>
          <Button size="sm" className="gap-2 bg-blue-700 hover:bg-blue-800" onClick={() => alert("Download PDF")}>
            <Download className="h-4 w-4" />Download PDF
          </Button>
        </div>
      </div>

      {/* Contracheque document */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Cabeçalho */}
          <div className="border-b-2 border-gray-800 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm uppercase tracking-wide">Prefeitura Municipal de Parauapebas</p>
                  <p className="text-xs text-gray-500">Secretaria Municipal de Administração — SEMAD</p>
                  <p className="text-xs text-gray-500">CNPJ: 04.914.588/0001-28 | Estado do Pará</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">DEMONSTRATIVO DE PAGAMENTO</p>
                <p className="text-sm text-blue-700 font-semibold">{MESES[mes - 1].toUpperCase()} / {ano}</p>
                <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">Pago</Badge>
              </div>
            </div>
          </div>

          {/* Dados do Servidor */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Nome</p>
                <p className="font-semibold text-gray-800">{servidor.nome}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Matrícula</p>
                <p className="font-semibold text-gray-800">{servidor.matricula}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Cargo</p>
                <p className="font-semibold text-gray-800">{servidor.cargo}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Secretaria</p>
                <p className="font-semibold text-gray-800">{servidor.secretaria}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Regime</p>
                <p className="font-semibold text-gray-800">Estatutário</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Banco</p>
                <p className="font-semibold text-gray-800">Banco do Brasil</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Agência</p>
                <p className="font-semibold text-gray-800">****-3</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Conta</p>
                <p className="font-semibold text-gray-800">*****8-4</p>
              </div>
            </div>
          </div>

          {/* Vencimentos | Descontos */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Vencimentos */}
            <div>
              <div className="bg-green-50 px-6 py-2 border-b border-gray-200">
                <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Vencimentos</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-2 text-left text-gray-500 font-medium">Cód.</th>
                    <th className="px-6 py-2 text-left text-gray-500 font-medium">Descrição</th>
                    <th className="px-6 py-2 text-right text-gray-500 font-medium">Ref.</th>
                    <th className="px-6 py-2 text-right text-gray-500 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {VERBAS_VENCIMENTOS.map((v) => (
                    <tr key={v.codigo} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-2 text-gray-500">{v.codigo}</td>
                      <td className="px-6 py-2 text-gray-700">{v.descricao}</td>
                      <td className="px-6 py-2 text-right text-gray-500">{v.referencia}</td>
                      <td className="px-6 py-2 text-right font-medium text-green-700">{formatCurrency(v.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Descontos */}
            <div>
              <div className="bg-red-50 px-6 py-2 border-b border-gray-200">
                <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Descontos</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-2 text-left text-gray-500 font-medium">Cód.</th>
                    <th className="px-6 py-2 text-left text-gray-500 font-medium">Descrição</th>
                    <th className="px-6 py-2 text-right text-gray-500 font-medium">Ref.</th>
                    <th className="px-6 py-2 text-right text-gray-500 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {VERBAS_DESCONTOS.map((v) => (
                    <tr key={v.codigo} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-2 text-gray-500">{v.codigo}</td>
                      <td className="px-6 py-2 text-gray-700">{v.descricao}</td>
                      <td className="px-6 py-2 text-right text-gray-500">{v.referencia}</td>
                      <td className="px-6 py-2 text-right font-medium text-red-700">{formatCurrency(v.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informações Complementares */}
          <div className="border-t border-gray-200">
            <div className="bg-blue-50 px-6 py-2 border-b border-gray-200">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Informações Complementares</p>
            </div>
            <div className="px-6 py-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {INFORMACOES.map((info) => (
                  <div key={info.descricao} className="text-xs">
                    <p className="text-gray-500">{info.descricao}</p>
                    <p className="font-medium text-gray-800">
                      {typeof info.valor === "number" && info.valor > 100
                        ? formatCurrency(info.valor)
                        : info.valor}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totais */}
          <div className="bg-gray-900 text-white px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Bruto</p>
                <p className="text-xl font-bold text-green-400">{formatCurrency(totalBruto)}</p>
              </div>
              <div className="text-2xl text-gray-500">−</div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Descontos</p>
                <p className="text-xl font-bold text-red-400">{formatCurrency(totalDescontos)}</p>
              </div>
              <div className="text-2xl text-gray-500">=</div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Líquido a Receber</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalLiquido)}</p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="px-6 py-3 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              Documento gerado eletronicamente — Portal do Servidor de Parauapebas | {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
    </ServidorLayout>
  );
}
