// ─── BI Mock Data ───────────────────────────────────────────────────────────

export const BI_MUNICIPIO = {
  nome: "Parauapebas",
  uf: "PA",
  prefeito: "Dr. João Silva",
  exercicio: 2026,
  ultimaAtualizacao: "26/03/2026 às 14:35",
};

// ─── Sparkline helpers ───────────────────────────────────────────────────────
function sparkLine(base: number, variance: number, count = 7) {
  return Array.from({ length: count }, (_, i) => ({
    d: i,
    v: Math.round(base + (Math.random() - 0.5) * variance),
  }));
}

// ─── KPIs ────────────────────────────────────────────────────────────────────
export const BI_KPIS = {
  receita: {
    valor: 87_432_100,
    meta: 98_000_000,
    pct: 89.2,
    variacao: +4.1,
    spark: sparkLine(85_000_000, 8_000_000),
  },
  despesa: {
    valor: 79_108_500,
    dotacao: 98_000_000,
    pct: 80.7,
    variacao: +2.3,
    spark: sparkLine(77_000_000, 5_000_000),
  },
  resultado: {
    valor: 8_323_600,
    tipo: "superavit" as const,
    variacao: +12.5,
    spark: sparkLine(7_000_000, 3_000_000),
  },
  lrf: {
    pct: 47.8,
    limite: 54,
    status: "ok" as const,
    variacao: -0.3,
    spark: sparkLine(47, 2),
  },
  manifestacoes: {
    abertas: 312,
    variacao: -8.2,
    spark: sparkLine(310, 80),
  },
  sla: {
    pct: 91.4,
    meta: 90,
    variacao: +3.1,
    spark: sparkLine(91, 5),
  },
  servidores: {
    ativos: 4_218,
    afastados: 187,
    variacao: +0.4,
    spark: sparkLine(4200, 100),
  },
  nps: {
    score: 67,
    variacao: +5,
    spark: sparkLine(65, 8),
  },
};

// ─── Alertas ─────────────────────────────────────────────────────────────────
export const BI_ALERTAS = [
  { id: 1, urgencia: "critica" as const, icone: "⚠️", titulo: "SLA vencido — 14 manifestações sem resposta há +10 dias", acao: "/rh/requerimentos", link: "Ver manifestações" },
  { id: 2, urgencia: "critica" as const, icone: "💰", titulo: "Gastos com pessoal em 47.8% RCL — alerta de tendência crescente", acao: "/bi/financeiro", link: "Ver financeiro" },
  { id: 3, urgencia: "alta" as const, icone: "📋", titulo: "Pedido LAI #2026-0892 atrasado em 3 dias (prazo: 20 dias úteis)", acao: "/site-admin/transparencia", link: "Atender pedido" },
  { id: 4, urgencia: "alta" as const, icone: "🏖️", titulo: "23 servidores com férias vencidas há mais de 12 meses", acao: "/bi/pessoal", link: "Ver pessoal" },
  { id: 5, urgencia: "media" as const, icone: "🏗️", titulo: "Obra Av. das Flores — execução física 12% abaixo do cronograma", acao: "/bi/obras", link: "Ver obras" },
];

// ─── Bairros (Choropleth) ────────────────────────────────────────────────────
export const BI_BAIRROS = [
  { id: "rio-verde", nome: "Rio Verde", demandas: 142, lat: 30, lng: 20, w: 90, h: 60 },
  { id: "cidade-nova", nome: "Cidade Nova", demandas: 98, lat: 130, lng: 30, w: 80, h: 55 },
  { id: "marabaixo", nome: "Marabaixo", demandas: 213, lat: 60, lng: 100, w: 95, h: 65 },
  { id: "buritis", nome: "Buritis", demandas: 176, lat: 170, lng: 90, w: 85, h: 60 },
  { id: "palmares", nome: "Palmares", demandas: 89, lat: 25, lng: 175, w: 90, h: 55 },
  { id: "tiradentes", nome: "Tiradentes", demandas: 134, lat: 125, lng: 165, w: 85, h: 60 },
  { id: "centro", nome: "Centro", demandas: 267, lat: 90, lng: 235, w: 100, h: 65 },
  { id: "jardim-america", nome: "Jardim América", demandas: 61, lat: 200, lng: 220, w: 80, h: 55 },
];

// ─── Ouvidoria ────────────────────────────────────────────────────────────────
export const BI_OUVIDORIA = {
  volumeDiario: Array.from({ length: 30 }, (_, i) => ({
    dia: `${i + 1}/03`,
    atual: Math.round(8 + Math.random() * 22),
    anterior: Math.round(6 + Math.random() * 18),
  })),
  porTipo: [
    { nome: "Reclamação", valor: 124, cor: "#EF4444" },
    { nome: "Solicitação", valor: 89, cor: "#3B82F6" },
    { nome: "Denúncia", valor: 47, cor: "#F97316" },
    { nome: "Sugestão", valor: 28, cor: "#8B5CF6" },
    { nome: "Elogio", valor: 24, cor: "#22C55E" },
  ],
  topCategorias: [
    { cat: "Iluminação pública", total: 89, resolvidas: 71 },
    { cat: "Coleta de lixo", total: 76, resolvidas: 62 },
    { cat: "Buraco na via", total: 68, resolvidas: 45 },
    { cat: "Abastecimento d'água", total: 54, resolvidas: 48 },
    { cat: "Saúde — filas/atendimento", total: 48, resolvidas: 31 },
    { cat: "Barulho/perturbação", total: 41, resolvidas: 35 },
    { cat: "Poda de árvores", total: 37, resolvidas: 29 },
    { cat: "Obras inacabadas", total: 33, resolvidas: 21 },
    { cat: "Transporte público", total: 29, resolvidas: 22 },
    { cat: "Animais soltos", total: 24, resolvidas: 19 },
  ],
  porSecretaria: [
    { sec: "SEMAS", recebidas: 121, noPrazo: 98, atrasadas: 23 },
    { sec: "SEMOV", recebidas: 89, noPrazo: 67, atrasadas: 22 },
    { sec: "SEMSA", recebidas: 76, noPrazo: 69, atrasadas: 7 },
    { sec: "SEMED", recebidas: 54, noPrazo: 50, atrasadas: 4 },
    { sec: "SEMAFI", recebidas: 38, noPrazo: 36, atrasadas: 2 },
  ],
  slaGeral: 91.4,
  slaMeta: 90,
  nps: { score: 67, promotores: 54, neutros: 29, detratores: 17 },
  avaliacoes: [
    { estrelas: 5, pct: 41 },
    { estrelas: 4, pct: 26 },
    { estrelas: 3, pct: 18 },
    { estrelas: 2, pct: 9 },
    { estrelas: 1, pct: 6 },
  ],
  canais: [
    { nome: "Portal Web", valor: 148, cor: "#3B82F6" },
    { nome: "Presencial", valor: 72, cor: "#8B5CF6" },
    { nome: "WhatsApp", valor: 51, cor: "#22C55E" },
    { nome: "Telefone", valor: 29, cor: "#F97316" },
    { nome: "E-mail", valor: 18, cor: "#EF4444" },
    { nome: "Instagram", valor: 14, cor: "#EC4899" },
  ],
  semResolucao: [
    { protocolo: "OUV-2026-000213", secretaria: "SEMAS", diasAbertos: 28, responsavel: "Maria Costa" },
    { protocolo: "OUV-2026-000189", secretaria: "SEMOV", diasAbertos: 25, responsavel: "Carlos Lima" },
    { protocolo: "OUV-2026-000201", secretaria: "SEMSA", diasAbertos: 21, responsavel: "Ana Paula" },
    { protocolo: "OUV-2026-000175", secretaria: "SEMED", diasAbertos: 19, responsavel: "João Melo" },
    { protocolo: "OUV-2026-000234", secretaria: "SEMAS", diasAbertos: 18, responsavel: "Maria Costa" },
  ],
};

// ─── Financeiro ───────────────────────────────────────────────────────────────
export const BI_FINANCEIRO = {
  orcamento: {
    dotacaoInicial: 120_000_000,
    suplementacoes: 8_500_000,
    reducoes: 2_100_000,
    dotacaoAtual: 126_400_000,
    executado: 98_000_000,
    pctExecucao: 77.5,
  },
  porFuncao: [
    { funcao: "Saúde", dotacao: 30_000_000, executado: 24_200_000, cor: "#EF4444" },
    { funcao: "Educação", dotacao: 28_000_000, executado: 22_100_000, cor: "#3B82F6" },
    { funcao: "Obras/Infraestr.", dotacao: 22_000_000, executado: 16_800_000, cor: "#F97316" },
    { funcao: "Admin. Geral", dotacao: 18_000_000, executado: 15_200_000, cor: "#8B5CF6" },
    { funcao: "Assistência Social", dotacao: 12_000_000, executado: 9_700_000, cor: "#22C55E" },
    { funcao: "Outros", dotacao: 16_400_000, executado: 10_000_000, cor: "#6B7280" },
  ],
  receitaVsDespesaMensal: Array.from({ length: 12 }, (_, i) => ({
    mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i],
    receita: Math.round(7_000_000 + Math.random() * 3_000_000),
    despesa: Math.round(6_500_000 + Math.random() * 2_500_000),
  })),
  receitasPorFonte: [
    { fonte: "FPM", valor: 38_000_000, cor: "#3B82F6" },
    { fonte: "ISS", valor: 12_500_000, cor: "#22C55E" },
    { fonte: "ICMS-Cota", valor: 18_200_000, cor: "#F97316" },
    { fonte: "IPTU", valor: 4_800_000, cor: "#8B5CF6" },
    { fonte: "Convênios", valor: 9_400_000, cor: "#EC4899" },
    { fonte: "Outros", valor: 4_532_100, cor: "#6B7280" },
  ],
  lrf: {
    pessoal: { pct: 47.8, limite: 54, status: "ok" as const },
    divida: { pct: 82.3, limite: 120, status: "ok" as const },
    credito: { pct: 11.2, limite: 16, status: "ok" as const },
  },
  contratos: {
    funil: [
      { etapa: "Licitações abertas", valor: 12 },
      { etapa: "Em andamento", valor: 8 },
      { etapa: "Homologadas", valor: 6 },
      { etapa: "Contratos ativos", valor: 47 },
    ],
    porSecretaria: [
      { sec: "SEMOV", valor: 22_400_000 },
      { sec: "SEMSA", valor: 14_800_000 },
      { sec: "SEMED", valor: 11_200_000 },
      { sec: "SEMAS", valor: 7_600_000 },
      { sec: "SEMAFI", valor: 4_100_000 },
    ],
    proxVencimento: [
      { numero: "2024/089", objeto: "Manutenção de equipamentos de TI", secretaria: "SEMAFI", valor: 240_000, vencimento: "15/04/2026", diasRestantes: 20 },
      { numero: "2024/102", objeto: "Limpeza e conservação predial", secretaria: "SEMAS", valor: 480_000, vencimento: "22/04/2026", diasRestantes: 27 },
      { numero: "2025/018", objeto: "Fornecimento de merenda escolar", secretaria: "SEMED", valor: 1_200_000, vencimento: "30/04/2026", diasRestantes: 35 },
    ],
  },
};

// ─── Pessoal ──────────────────────────────────────────────────────────────────
export const BI_PESSOAL = {
  forca: {
    ativos: 4218,
    afastados: 187,
    ferias: 312,
    vagos: 89,
  },
  porVinculo: [
    { tipo: "Efetivo", qtd: 2841, cor: "#3B82F6" },
    { tipo: "Comissionado", qtd: 642, cor: "#8B5CF6" },
    { tipo: "Contratado", qtd: 487, cor: "#F97316" },
    { tipo: "CLT", qtd: 248, cor: "#22C55E" },
  ],
  porSecretaria: [
    { sec: "SEMED", qtd: 1247 },
    { sec: "SEMSA", qtd: 891 },
    { sec: "SEMAS", qtd: 624 },
    { sec: "SEMOV", qtd: 487 },
    { sec: "SEMAFI", qtd: 312 },
    { sec: "Outros", qtd: 657 },
  ],
  feriasVencidas: [
    { nome: "Ana Paula S.", secretaria: "SEMSA", mesesSemFerias: 18, impacto: 8_400 },
    { nome: "Carlos Melo R.", secretaria: "SEMED", mesesSemFerias: 16, impacto: 6_200 },
    { nome: "Fernanda Lima T.", secretaria: "SEMAS", mesesSemFerias: 14, impacto: 5_800 },
    { nome: "José Roberto A.", secretaria: "SEMOV", mesesSemFerias: 13, impacto: 7_100 },
    { nome: "Maria Costa B.", secretaria: "SEMAFI", mesesSemFerias: 13, impacto: 6_900 },
  ],
  folhaMensal: Array.from({ length: 12 }, (_, i) => ({
    mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i],
    bruto: Math.round(14_500_000 + Math.random() * 1_500_000),
    descontos: Math.round(3_200_000 + Math.random() * 500_000),
    liquido: Math.round(11_300_000 + Math.random() * 1_000_000),
  })),
  absenteismo: [
    { sec: "SEMSA", taxa: 4.8, motivo_saude: 62, motivo_licenca: 24, motivo_outros: 14 },
    { sec: "SEMED", taxa: 3.2, motivo_saude: 55, motivo_licenca: 30, motivo_outros: 15 },
    { sec: "SEMAS", taxa: 2.9, motivo_saude: 50, motivo_licenca: 33, motivo_outros: 17 },
    { sec: "SEMOV", taxa: 2.1, motivo_saude: 45, motivo_licenca: 35, motivo_outros: 20 },
    { sec: "SEMAFI", taxa: 1.8, motivo_saude: 40, motivo_licenca: 40, motivo_outros: 20 },
  ],
};

// ─── Obras ────────────────────────────────────────────────────────────────────
export const BI_OBRAS = [
  { id: 1, nome: "Pavimentação Av. das Flores", secretaria: "SEMOV", status: "em_andamento" as const, pctFisico: 58, pctEsperado: 70, valor: 4_800_000, inicio: "Jan/26", fim: "Jun/26", bairro: "Marabaixo" },
  { id: 2, nome: "UBS Rio Verde — Reforma", secretaria: "SEMSA", status: "em_andamento" as const, pctFisico: 82, pctEsperado: 80, valor: 1_200_000, inicio: "Nov/25", fim: "Abr/26", bairro: "Rio Verde" },
  { id: 3, nome: "Praça do Trabalhador", secretaria: "SEMAS", status: "concluida" as const, pctFisico: 100, pctEsperado: 100, valor: 680_000, inicio: "Set/25", fim: "Fev/26", bairro: "Centro" },
  { id: 4, nome: "Escola Municipal Tiradentes", secretaria: "SEMED", status: "paralisada" as const, pctFisico: 34, pctEsperado: 55, valor: 2_200_000, inicio: "Jun/25", fim: "Ago/26", bairro: "Tiradentes" },
  { id: 5, nome: "Drenagem Bairro Buritis", secretaria: "SEMOV", status: "em_andamento" as const, pctFisico: 41, pctEsperado: 45, valor: 3_100_000, inicio: "Fev/26", fim: "Out/26", bairro: "Buritis" },
  { id: 6, nome: "CRAS Jardim América", secretaria: "SEMAS", status: "em_andamento" as const, pctFisico: 19, pctEsperado: 25, valor: 890_000, inicio: "Mar/26", fim: "Nov/26", bairro: "Jardim América" },
];

// ─── Social ───────────────────────────────────────────────────────────────────
export const BI_SOCIAL = {
  saude: {
    atendimentosMensais: Array.from({ length: 12 }, (_, i) => ({
      mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i],
      consultas: Math.round(18_000 + Math.random() * 6_000),
      exames: Math.round(8_000 + Math.random() * 3_000),
    })),
    vacinas: [
      { tipo: "Covid-19", cobertura: 84.2, meta: 90 },
      { tipo: "Influenza", cobertura: 72.8, meta: 80 },
      { tipo: "Tríplice Viral", cobertura: 94.1, meta: 95 },
      { tipo: "Poliomielite", cobertura: 96.3, meta: 95 },
    ],
    internacoes: { total: 1842, tempoMedio: 4.3 },
  },
  educacao: {
    matriculasPorNivel: [
      { nivel: "Creche", matriculas: 2840, capacidade: 3200 },
      { nivel: "Pré-escola", matriculas: 3420, capacidade: 3600 },
      { nivel: "Ens. Fund. I", matriculas: 12480, capacidade: 13000 },
      { nivel: "Ens. Fund. II", matriculas: 8920, capacidade: 9500 },
    ],
    taxaAbandono: [
      { ano: 2022, taxa: 3.8 },
      { ano: 2023, taxa: 3.1 },
      { ano: 2024, taxa: 2.7 },
      { ano: 2025, taxa: 2.4 },
      { ano: 2026, taxa: 1.9 },
    ],
    infraestrutura: { bomEstado: 68, regular: 24, ruim: 8 },
  },
};
