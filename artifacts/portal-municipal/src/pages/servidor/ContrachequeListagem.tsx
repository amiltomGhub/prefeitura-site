import { useState } from "react";
import { Link } from "wouter";
import { ServidorLayout } from "@/components/servidor/ServidorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, TrendingUp, DollarSign, Minus, Calendar } from "lucide-react";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function gerarContracheques() {
  const hoje = new Date();
  const items = [];
  for (let i = 0; i < 24; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const bruto = 8500 + Math.random() * 1200;
    const descontos = bruto * (0.25 + Math.random() * 0.05);
    items.push({
      mes,
      ano,
      totalBruto: bruto,
      totalLiquido: bruto - descontos,
      totalDescontos: descontos,
      status: i === 0 ? "processando" : "pago",
      isAtual: i === 0,
    });
  }
  return items;
}

const CONTRACHEQUES = gerarContracheques();
const ANOS = [...new Set(CONTRACHEQUES.map(c => c.ano))];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ContrachequeListagem() {
  const [anoFiltro, setAnoFiltro] = useState<string>("todos");

  const filtered = anoFiltro === "todos"
    ? CONTRACHEQUES
    : CONTRACHEQUES.filter(c => c.ano === Number(anoFiltro));

  const ultimo = CONTRACHEQUES[0];

  return (
    <ServidorLayout title="Contracheques" subtitle="Histórico de 24 meses">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-gray-500">Último Bruto</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(ultimo.totalBruto)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-gray-500">Último Líquido</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(ultimo.totalLiquido)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg"><Minus className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-xs text-gray-500">Último Descontos</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(ultimo.totalDescontos)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-700">Competências</h2>
        <Select value={anoFiltro} onValueChange={setAnoFiltro}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Todos os anos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os anos</SelectItem>
            {ANOS.map(a => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <Card key={`${c.mes}-${c.ano}`} className={`relative overflow-hidden hover:shadow-md transition-shadow ${c.isAtual ? "ring-2 ring-blue-500" : ""}`}>
            {c.isAtual && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-600 text-white text-xs">Atual</Badge>
              </div>
            )}
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {MESES[c.mes - 1]} / {c.ano}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Bruto</span>
                  <span className="font-medium text-gray-800">{formatCurrency(c.totalBruto)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Descontos</span>
                  <span className="text-red-600">- {formatCurrency(c.totalDescontos)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold border-t pt-1 mt-1">
                  <span className="text-gray-700">Líquido</span>
                  <span className="text-green-700">{formatCurrency(c.totalLiquido)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <Badge variant={c.status === "pago" ? "default" : "secondary"} className={c.status === "pago" ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs" : "text-xs"}>
                  {c.status === "pago" ? "Pago" : "Processando"}
                </Badge>
                <div className="flex gap-1">
                  <Link href={`/servidor/contracheque/${c.mes}/${c.ano}`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-blue-600"
                    onClick={() => alert("Download do PDF — integração com backend")}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ServidorLayout>
  );
}
