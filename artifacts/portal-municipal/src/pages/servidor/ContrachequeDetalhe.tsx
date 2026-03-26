import { Link, useParams } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer, Download, ArrowLeft, Building2, AlertCircle } from "lucide-react";
import { useContrachequeDetalhe } from "@/services/servidorApi";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function RowSkeleton() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-6 py-2"><Skeleton className="h-3 w-10" /></td>
      <td className="px-6 py-2"><Skeleton className="h-3 w-40" /></td>
      <td className="px-6 py-2 text-right"><Skeleton className="h-3 w-10 ml-auto" /></td>
      <td className="px-6 py-2 text-right"><Skeleton className="h-3 w-20 ml-auto" /></td>
    </tr>
  );
}

export default function ContrachequeDetalhe() {
  const params = useParams<{ mes: string; ano: string }>();
  const mes = Number(params.mes);
  const ano = Number(params.ano);

  const { data: contracheque, isLoading, error } = useContrachequeDetalhe(mes, ano);

  const vencimentos = contracheque?.linhas.filter(l => l.tipo === "vencimento") ?? [];
  const descontos = contracheque?.linhas.filter(l => l.tipo === "desconto") ?? [];
  const informativos = contracheque?.linhas.filter(l => l.tipo === "informativo") ?? [];

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

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
          <Button
            size="sm"
            className="gap-2 bg-blue-700 hover:bg-blue-800"
            onClick={() => window.open(`${apiBase}/api/servidor/contracheques/${mes}/${ano}/pdf`, "_blank")}
          >
            <Download className="h-4 w-4" />Download PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar o contracheque. Tente novamente.
        </div>
      )}

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
                  <p className="text-xs text-gray-500">
                    {contracheque?.servidor.secretaria ?? "Secretaria Municipal de Administração — SEMAD"}
                  </p>
                  <p className="text-xs text-gray-500">CNPJ: 04.914.588/0001-28 | Estado do Pará</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">DEMONSTRATIVO DE PAGAMENTO</p>
                <p className="text-sm text-blue-700 font-semibold">{MESES[mes - 1].toUpperCase()} / {ano}</p>
                <Badge className={`mt-1 ${contracheque?.status === "pago" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}`}>
                  {contracheque?.status === "pago" ? "Pago" : "Processando"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Dados do Servidor */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))
              ) : (
                <>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Nome</p><p className="font-semibold text-gray-800">{contracheque?.servidor.nome}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Matrícula</p><p className="font-semibold text-gray-800">{contracheque?.servidor.matricula}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Cargo</p><p className="font-semibold text-gray-800">{contracheque?.servidor.cargo}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Secretaria</p><p className="font-semibold text-gray-800">{contracheque?.servidor.secretaria}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Regime</p><p className="font-semibold text-gray-800">{contracheque?.servidor.regime}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Banco</p><p className="font-semibold text-gray-800">{contracheque?.servidor.banco}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Agência</p><p className="font-semibold text-gray-800">{contracheque?.servidor.agencia}</p></div>
                  <div><p className="text-gray-500 font-medium uppercase tracking-wide mb-0.5">Conta</p><p className="font-semibold text-gray-800">{contracheque?.servidor.conta}</p></div>
                </>
              )}
            </div>
          </div>

          {/* Vencimentos | Descontos */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
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
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
                    : vencimentos.map((v) => (
                      <tr key={v.codigo} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-2 text-gray-500">{v.codigo}</td>
                        <td className="px-6 py-2 text-gray-700">{v.descricao}</td>
                        <td className="px-6 py-2 text-right text-gray-500">{v.referencia}</td>
                        <td className="px-6 py-2 text-right font-medium text-green-700">{formatCurrency(v.valor)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

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
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : descontos.map((v) => (
                      <tr key={v.codigo} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-2 text-gray-500">{v.codigo}</td>
                        <td className="px-6 py-2 text-gray-700">{v.descricao}</td>
                        <td className="px-6 py-2 text-right text-gray-500">{v.referencia}</td>
                        <td className="px-6 py-2 text-right font-medium text-red-700">{formatCurrency(v.valor)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Informações Complementares */}
          {!isLoading && informativos.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="bg-blue-50 px-6 py-2 border-b border-gray-200">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Informações Complementares</p>
              </div>
              <div className="px-6 py-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {informativos.map((info) => (
                    <div key={info.codigo} className="text-xs">
                      <p className="text-gray-500">{info.descricao}</p>
                      <p className="font-medium text-gray-800">
                        {info.valor > 100 ? formatCurrency(info.valor) : info.valor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Totais */}
          <div className="bg-gray-900 text-white px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Bruto</p>
                {isLoading ? <Skeleton className="h-7 w-24 mx-auto" /> : <p className="text-xl font-bold text-green-400">{formatCurrency(contracheque?.totalBruto ?? 0)}</p>}
              </div>
              <div className="text-2xl text-gray-500">−</div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Descontos</p>
                {isLoading ? <Skeleton className="h-7 w-24 mx-auto" /> : <p className="text-xl font-bold text-red-400">{formatCurrency(contracheque?.totalDescontos ?? 0)}</p>}
              </div>
              <div className="text-2xl text-gray-500">=</div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Líquido a Receber</p>
                {isLoading ? <Skeleton className="h-8 w-28 mx-auto" /> : <p className="text-2xl font-bold text-white">{formatCurrency(contracheque?.totalLiquido ?? 0)}</p>}
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
