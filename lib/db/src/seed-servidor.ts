/**
 * Seed: Portal do Servidor
 * Cria 3 servidores com 24 meses de contracheques, períodos aquisitivos,
 * solicitações de férias e requerimentos em diferentes estados.
 */
import { db } from "./index";
import {
  servidoresCadastroTable,
  contrachequeTable,
  contrachequeLinhasTable,
  periodosAquisitivosTable,
  solicitacoesFeriasTable,
  requerimentosTable,
  historicoFuncionalTable,
  tenantsTable,
  usuariosTable,
} from "./schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createHash, randomBytes } from "crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(password + salt).digest("hex");
  return `${salt}:${hash}`;
}

const DEFAULT_TENANT_SLUG = "parauapebas";

async function main() {
  console.log("⏳ Iniciando seed do Portal do Servidor...");

  const [tenant] = await db
    .select()
    .from(tenantsTable)
    .where(eq(tenantsTable.slug, DEFAULT_TENANT_SLUG))
    .limit(1);

  if (!tenant) throw new Error(`Tenant '${DEFAULT_TENANT_SLUG}' não encontrado. Execute o seed principal primeiro.`);
  const tenantId = tenant.id;

  // ── Servidores ────────────────────────────────────────────────────────────
  const servidores = [
    {
      id: "srv-001",
      nome: "Ana Paula Ferreira Costa",
      cpf: "12345678901",
      matricula: "2019.001",
      email: "ana.costa@parauapebas.pa.gov.br",
      emailPessoal: "ana.costa@gmail.com",
      telefone: "(94) 99123-4567",
      dataNascimento: "1985-03-15",
      cargo: "Analista de Sistemas",
      codigoCargo: "TI-003",
      nivel: "III",
      referencia: "B",
      vinculo: "estatutario",
      status: "ativo",
      dataIngresso: "2019-03-01",
      concursoOrigem: "Concurso Público 001/2019",
      secretaria: "SEMGOV - Secretaria Municipal de Gestão",
      localTrabalho: "Prefeitura Municipal - Bloco A",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      conta: "00012345-6",
      tipoConta: "corrente",
      salarioBase: 5850.00,
      endereco: "Rua das Palmeiras",
      numero: "123",
      bairro: "Centro",
      cidade: "Parauapebas",
      estado: "PA",
      cep: "68515-000",
      dependentes: [{ nome: "Lucas Costa", parentesco: "filho", dataNascimento: "2010-08-20" }],
      tenantId,
    },
    {
      id: "srv-002",
      nome: "Carlos Eduardo Mendes Silva",
      cpf: "98765432100",
      matricula: "2015.087",
      email: "carlos.silva@parauapebas.pa.gov.br",
      emailPessoal: "carlos.mendes@hotmail.com",
      telefone: "(94) 99234-5678",
      dataNascimento: "1978-11-22",
      cargo: "Assistente Administrativo",
      codigoCargo: "ADM-001",
      nivel: "II",
      referencia: "A",
      vinculo: "estatutario",
      status: "ativo",
      dataIngresso: "2015-06-15",
      concursoOrigem: "Concurso Público 003/2015",
      secretaria: "SEMFAZ - Secretaria Municipal de Fazenda",
      localTrabalho: "Secretaria de Fazenda - Sala 205",
      banco: "Caixa Econômica Federal",
      agencia: "0987",
      conta: "00098765-3",
      tipoConta: "corrente",
      salarioBase: 3200.00,
      endereco: "Avenida das Acácias",
      numero: "456",
      bairro: "Parque dos Carajás",
      cidade: "Parauapebas",
      estado: "PA",
      cep: "68516-000",
      dependentes: [
        { nome: "Maria Silva", parentesco: "cônjuge", dataNascimento: "1980-05-10" },
        { nome: "Pedro Silva", parentesco: "filho", dataNascimento: "2008-02-14" },
        { nome: "Sofia Silva", parentesco: "filha", dataNascimento: "2012-09-30" },
      ],
      tenantId,
    },
    {
      id: "srv-003",
      nome: "Fernanda Lima Rodrigues",
      cpf: "45678901234",
      matricula: "2021.042",
      email: "fernanda.rodrigues@parauapebas.pa.gov.br",
      emailPessoal: "fern.lima@yahoo.com.br",
      telefone: "(94) 99345-6789",
      dataNascimento: "1992-07-08",
      cargo: "Professora Municipal",
      codigoCargo: "EDU-002",
      nivel: "I",
      referencia: "C",
      vinculo: "estatutario",
      status: "ativo",
      dataIngresso: "2021-02-01",
      concursoOrigem: "Concurso Público 002/2020",
      secretaria: "SEMEC - Secretaria Municipal de Educação",
      localTrabalho: "EMEF Prof. João Paulo II",
      banco: "Bradesco",
      agencia: "2233",
      conta: "00045678-9",
      tipoConta: "corrente",
      salarioBase: 4100.00,
      endereco: "Travessa das Mangueiras",
      numero: "789",
      bairro: "Novo Brasil",
      cidade: "Parauapebas",
      estado: "PA",
      cep: "68517-000",
      dependentes: [],
      tenantId,
    },
  ];

  for (const s of servidores) {
    await db.insert(servidoresCadastroTable).values(s).onConflictDoNothing();
    console.log(`  ✅ Servidor: ${s.nome}`);
  }

  // ── Contracheques (24 meses) ──────────────────────────────────────────────
  const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const linhasPadrao = (salarioBase: number, tipo: "normal" | "ferias" = "normal") => {
    const insalubridade = salarioBase * 0.1;
    const adicional = salarioBase * 0.05;
    const totalBruto = salarioBase + insalubridade + adicional + (tipo === "ferias" ? salarioBase * 0.33 : 0);
    const inss = Math.min(totalBruto * 0.11, 908.86);
    const irrf = totalBruto > 4664.68 ? totalBruto * 0.275 - 869.36
      : totalBruto > 3751.05 ? totalBruto * 0.225 - 636.13
      : totalBruto > 2826.65 ? totalBruto * 0.15 - 354.8
      : totalBruto > 1903.98 ? totalBruto * 0.075 - 142.8
      : 0;
    const previdencia = salarioBase * 0.14;
    const totalDescontos = inss + irrf + previdencia;
    const totalLiquido = totalBruto - totalDescontos;

    return { totalBruto, totalDescontos, totalLiquido, inss, irrf, previdencia, insalubridade, adicional };
  };

  for (const srv of servidores) {
    const hoje = new Date();
    let totalCC = 0;

    for (let i = 0; i < 24; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      const competencia = `${MESES[mes - 1]}/${ano}`;

      const isFerias = mes === 7;
      const vals = linhasPadrao(srv.salarioBase, isFerias ? "ferias" : "normal");
      const status = i === 0 ? "pendente" : "pago";
      const ccId = randomUUID();

      await db.insert(contrachequeTable).values({
        id: ccId,
        tenantId,
        servidorId: srv.id,
        mes,
        ano,
        competencia,
        totalBruto: vals.totalBruto,
        totalDescontos: vals.totalDescontos,
        totalLiquido: vals.totalLiquido,
        status,
        cargoNaCompetencia: srv.cargo,
        secretariaNaCompetencia: srv.secretaria,
        nivelNaCompetencia: srv.nivel,
      }).onConflictDoNothing();

      // Linhas
      const linhas = [
        { tipo: "vencimento", codigo: "001", descricao: "Vencimento Básico", valor: srv.salarioBase, sortOrder: 1 },
        { tipo: "vencimento", codigo: "010", descricao: "Adicional de Insalubridade (10%)", valor: vals.insalubridade, sortOrder: 2 },
        { tipo: "vencimento", codigo: "020", descricao: "Adicional de Tempo de Serviço (5%)", valor: vals.adicional, sortOrder: 3 },
        ...(isFerias ? [{ tipo: "vencimento", codigo: "030", descricao: "1/3 Constitucional de Férias", valor: srv.salarioBase * 0.33, sortOrder: 4 }] : []),
        { tipo: "desconto", codigo: "101", descricao: "INSS", valor: vals.inss, sortOrder: 10 },
        { tipo: "desconto", codigo: "102", descricao: "IRRF", valor: Math.max(0, vals.irrf), sortOrder: 11 },
        { tipo: "desconto", codigo: "103", descricao: "Previdência Municipal", valor: vals.previdencia, sortOrder: 12 },
        { tipo: "informativo", codigo: "200", descricao: "Base de Cálculo IRRF", valor: vals.totalBruto - vals.inss, sortOrder: 20 },
        { tipo: "informativo", codigo: "201", descricao: "Base de Cálculo INSS", valor: vals.totalBruto, sortOrder: 21 },
      ];

      for (const l of linhas) {
        await db.insert(contrachequeLinhasTable).values({
          id: randomUUID(),
          contrachequeId: ccId,
          ...l,
          referencia: competencia,
        }).onConflictDoNothing();
      }

      totalCC++;
    }
    console.log(`  ✅ ${totalCC} contracheques para ${srv.nome}`);
  }

  // ── Períodos Aquisitivos ───────────────────────────────────────────────────
  const periodosData = [
    // srv-001 — 2 períodos
    {
      id: "pa-001-1",
      servidorId: "srv-001",
      dataInicio: "2023-03-01",
      dataFim: "2024-02-29",
      diasDireito: 30,
      diasGozados: 30,
      diasVendidos: 0,
      diasSaldo: 0,
      prazoLimite: "2025-02-28",
      status: "esgotado",
    },
    {
      id: "pa-001-2",
      servidorId: "srv-001",
      dataInicio: "2024-03-01",
      dataFim: "2025-02-28",
      diasDireito: 30,
      diasGozados: 0,
      diasVendidos: 10,
      diasSaldo: 20,
      prazoLimite: "2026-02-28",
      status: "disponivel",
    },
    // srv-002 — 3 períodos
    {
      id: "pa-002-1",
      servidorId: "srv-002",
      dataInicio: "2021-06-15",
      dataFim: "2022-06-14",
      diasDireito: 30,
      diasGozados: 30,
      diasVendidos: 0,
      diasSaldo: 0,
      prazoLimite: "2023-06-14",
      status: "esgotado",
    },
    {
      id: "pa-002-2",
      servidorId: "srv-002",
      dataInicio: "2022-06-15",
      dataFim: "2023-06-14",
      diasDireito: 30,
      diasGozados: 20,
      diasVendidos: 0,
      diasSaldo: 10,
      prazoLimite: "2024-06-14",
      status: "vencido",
    },
    {
      id: "pa-002-3",
      servidorId: "srv-002",
      dataInicio: "2023-06-15",
      dataFim: "2024-06-14",
      diasDireito: 30,
      diasGozados: 0,
      diasVendidos: 0,
      diasSaldo: 30,
      prazoLimite: "2025-06-14",
      status: "disponivel",
    },
    // srv-003 — 1 período
    {
      id: "pa-003-1",
      servidorId: "srv-003",
      dataInicio: "2022-02-01",
      dataFim: "2023-01-31",
      diasDireito: 30,
      diasGozados: 15,
      diasVendidos: 0,
      diasSaldo: 15,
      prazoLimite: "2024-01-31",
      status: "disponivel",
    },
  ];

  for (const p of periodosData) {
    await db.insert(periodosAquisitivosTable).values(p).onConflictDoNothing();
  }
  console.log("  ✅ Períodos aquisitivos criados");

  // ── Solicitações de Férias ────────────────────────────────────────────────
  const solicitacoes = [
    {
      id: "sf-001",
      tenantId,
      servidorId: "srv-001",
      periodoAquisitivoId: "pa-001-2",
      protocolo: "FER-2025-000001",
      dataInicio: "2025-07-07",
      dataFim: "2025-07-26",
      dataRetorno: "2025-07-27",
      qtdDias: 20,
      parcelamento: 1,
      adiantamento13: false,
      abonoPecuniario: false,
      diasAbono: 0,
      status: "aprovado",
      aprovadoPor: "Maria Gestão RH",
      aprovadoEm: new Date("2025-06-01"),
      timeline: [
        { status: "protocolado", descricao: "Solicitação registrada pelo servidor", data: "2025-05-15T10:00:00Z", responsavel: "Ana Paula Ferreira Costa" },
        { status: "em_analise_chefia", descricao: "Em análise pela chefia imediata", data: "2025-05-16T09:00:00Z", responsavel: "João Diretor" },
        { status: "em_analise_rh", descricao: "Em análise pelo RH", data: "2025-05-20T14:00:00Z", responsavel: "RH SEMGOV" },
        { status: "aprovado", descricao: "Férias aprovadas pelo RH", data: "2025-06-01T11:00:00Z", responsavel: "Maria Gestão RH" },
      ],
    },
    {
      id: "sf-002",
      tenantId,
      servidorId: "srv-002",
      periodoAquisitivoId: "pa-002-3",
      protocolo: "FER-2025-000002",
      dataInicio: "2025-08-04",
      dataFim: "2025-09-02",
      dataRetorno: "2025-09-03",
      qtdDias: 30,
      parcelamento: 1,
      adiantamento13: true,
      abonoPecuniario: false,
      diasAbono: 0,
      status: "aguardando_chefia",
      timeline: [
        { status: "protocolado", descricao: "Solicitação registrada pelo servidor", data: "2026-03-20T08:30:00Z", responsavel: "Carlos Eduardo Mendes Silva" },
      ],
    },
    {
      id: "sf-003",
      tenantId,
      servidorId: "srv-003",
      periodoAquisitivoId: "pa-003-1",
      protocolo: "FER-2025-000003",
      dataInicio: "2025-06-02",
      dataFim: "2025-06-16",
      dataRetorno: "2025-06-17",
      qtdDias: 15,
      parcelamento: 1,
      adiantamento13: false,
      abonoPecuniario: false,
      diasAbono: 0,
      status: "rejeitado",
      motivoRejeicao: "Período solicitado conflita com calendário letivo. Solicitar período alternativo.",
      timeline: [
        { status: "protocolado", descricao: "Solicitação registrada pelo servidor", data: "2025-05-01T09:00:00Z", responsavel: "Fernanda Lima Rodrigues" },
        { status: "em_analise_chefia", descricao: "Em análise pela diretora escolar", data: "2025-05-02T10:00:00Z", responsavel: "Diretora Escola" },
        { status: "rejeitado", descricao: "Período conflita com calendário letivo", data: "2025-05-05T15:00:00Z", responsavel: "Diretora Escola" },
      ],
    },
  ];

  for (const s of solicitacoes) {
    await db.insert(solicitacoesFeriasTable).values(s).onConflictDoNothing();
  }
  console.log("  ✅ Solicitações de férias criadas");

  // ── Requerimentos ─────────────────────────────────────────────────────────
  const requerimentos = [
    {
      id: "req-001",
      tenantId,
      servidorId: "srv-001",
      protocolo: "REQ-2025-000001",
      tipo: "progressao-funcional",
      assunto: "Progressão Funcional por Mérito",
      justificativa: "Solicito progressão funcional por mérito conforme Art. 45 do Estatuto Municipal. Completei 3 anos no nível atual sem progressão, atendendo todos os requisitos legais, incluindo avaliação de desempenho positiva nos últimos dois biênios e ausência de punições disciplinares no período.",
      camposEspecificos: { nivelAtual: "III-B", nivelSolicitado: "III-C", anoAvaliacao: 2024 },
      documentos: [
        { nome: "Avaliacao_Desempenho_2024.pdf", url: "/docs/avaliacao.pdf", tamanho: 245000 },
        { nome: "Ficha_Funcional.pdf", url: "/docs/ficha.pdf", tamanho: 180000 },
      ],
      status: "deferido",
      parecerTecnico: "Servidor atende todos os requisitos legais para progressão funcional. Documentação completa e regular.",
      decisao: "Deferido",
      motivoDecisao: "Aprovado conforme análise da documentação e cumprimento dos requisitos estatutários.",
      decisorNome: "Chefe de RH - SEMGOV",
      decidoEm: new Date("2025-02-15"),
      prazoRecurso: null,
      recursoPresentado: false,
      timeline: [
        { status: "protocolado", descricao: "Requerimento protocolado", data: "2025-01-10T09:00:00Z", responsavel: "Ana Paula Ferreira Costa" },
        { status: "em_analise", descricao: "Em análise pelo RH", data: "2025-01-15T11:00:00Z", responsavel: "RH SEMGOV" },
        { status: "deferido", descricao: "Requerimento deferido", data: "2025-02-15T14:00:00Z", responsavel: "Chefe de RH - SEMGOV" },
      ],
    },
    {
      id: "req-002",
      tenantId,
      servidorId: "srv-002",
      protocolo: "REQ-2026-000001",
      tipo: "certidao-tempo-servico",
      assunto: "Certidão de Tempo de Serviço",
      justificativa: "Solicito emissão de certidão de tempo de serviço para fins de aposentadoria proporcional junto ao INSS. Necessito da certidão para instrução de processo administrativo no INSS referente à contagem de tempo de serviço no setor público municipal, conforme exigido pelo Decreto 3.048/99.",
      camposEspecificos: { finalidade: "aposentadoria", orgaoDestino: "INSS" },
      documentos: [],
      status: "em_analise",
      parecerTecnico: null,
      decisao: null,
      motivoDecisao: null,
      decisorNome: null,
      decidoEm: null,
      prazoRecurso: null,
      recursoPresentado: false,
      timeline: [
        { status: "protocolado", descricao: "Requerimento protocolado", data: "2026-03-18T10:30:00Z", responsavel: "Carlos Eduardo Mendes Silva" },
        { status: "em_analise", descricao: "Em análise pelo setor de RH", data: "2026-03-19T08:00:00Z", responsavel: "RH SEMFAZ" },
      ],
    },
    {
      id: "req-003",
      tenantId,
      servidorId: "srv-003",
      protocolo: "REQ-2025-000050",
      tipo: "licenca-saude",
      assunto: "Licença para Tratamento de Saúde",
      justificativa: "Solicito licença para tratamento de saúde conforme atestado médico em anexo. Estou em tratamento de saúde que requer repouso absoluto por 30 dias, conforme recomendação médica do Dr. Roberto Alves, CRM 12345-PA, especialista em ortopedia, em decorrência de procedimento cirúrgico realizado no joelho direito.",
      camposEspecificos: { cid: "M17.1", diasSolicitados: 30, medico: "Dr. Roberto Alves", crm: "12345-PA" },
      documentos: [
        { nome: "Atestado_Medico.pdf", url: "/docs/atestado.pdf", tamanho: 95000 },
        { nome: "Laudo_Cirurgico.pdf", url: "/docs/laudo.pdf", tamanho: 210000 },
      ],
      status: "indeferido",
      parecerTecnico: "Documentação incompleta. Necessário apresentar laudo de junta médica oficial do município.",
      decisao: "Indeferido",
      motivoDecisao: "Atestado médico particular não aceito. Obrigatória perícia pela junta médica municipal.",
      decisorNome: "Médico Perito Municipal",
      decidoEm: new Date("2025-11-20"),
      prazoRecurso: "2025-12-05",
      recursoPresentado: false,
      timeline: [
        { status: "protocolado", descricao: "Requerimento protocolado", data: "2025-11-01T08:00:00Z", responsavel: "Fernanda Lima Rodrigues" },
        { status: "em_analise", descricao: "Em análise pela perícia médica", data: "2025-11-05T10:00:00Z", responsavel: "Junta Médica Municipal" },
        { status: "indeferido", descricao: "Indeferido por documentação insuficiente", data: "2025-11-20T16:00:00Z", responsavel: "Médico Perito Municipal" },
      ],
    },
  ];

  for (const r of requerimentos) {
    await db.insert(requerimentosTable).values(r).onConflictDoNothing();
  }
  console.log("  ✅ Requerimentos criados");

  // ── Histórico Funcional ───────────────────────────────────────────────────
  const historicos = [
    // srv-001
    { id: randomUUID(), servidorId: "srv-001", data: "2019-03-01", tipo: "ingresso", descricao: "Ingresso no serviço público por concurso", portaria: "Portaria 001/2019", cargoApos: "Analista de Sistemas Nível I-A" },
    { id: randomUUID(), servidorId: "srv-001", data: "2021-03-01", tipo: "progressao", descricao: "Progressão por tempo de serviço — Nível I-B", portaria: "Portaria 045/2021", cargoApos: "Analista de Sistemas Nível I-B" },
    { id: randomUUID(), servidorId: "srv-001", data: "2022-08-10", tipo: "remocao", descricao: "Remoção a pedido para SEMGOV", portaria: "Portaria 120/2022", secretariaDestino: "SEMGOV - Secretaria Municipal de Gestão", cargoApos: "Analista de Sistemas Nível I-B" },
    { id: randomUUID(), servidorId: "srv-001", data: "2023-03-01", tipo: "progressao", descricao: "Progressão por tempo de serviço — Nível III-B", portaria: "Portaria 033/2023", cargoApos: "Analista de Sistemas Nível III-B" },
    // srv-002
    { id: randomUUID(), servidorId: "srv-002", data: "2015-06-15", tipo: "ingresso", descricao: "Ingresso no serviço público por concurso", portaria: "Portaria 087/2015", cargoApos: "Assistente Administrativo Nível I-A" },
    { id: randomUUID(), servidorId: "srv-002", data: "2017-06-15", tipo: "progressao", descricao: "Progressão por tempo de serviço — Nível I-B", portaria: "Portaria 112/2017", cargoApos: "Assistente Administrativo Nível I-B" },
    { id: randomUUID(), servidorId: "srv-002", data: "2019-06-15", tipo: "progressao", descricao: "Progressão por tempo de serviço — Nível II-A", portaria: "Portaria 098/2019", cargoApos: "Assistente Administrativo Nível II-A" },
    { id: randomUUID(), servidorId: "srv-002", data: "2021-06-15", tipo: "progressao", descricao: "Progressão por mérito — Nível II-B", portaria: "Portaria 077/2021", cargoApos: "Assistente Administrativo Nível II-B" },
    // srv-003
    { id: randomUUID(), servidorId: "srv-003", data: "2021-02-01", tipo: "ingresso", descricao: "Ingresso no serviço público por concurso — Professor", portaria: "Portaria 042/2021", cargoApos: "Professora Municipal Nível I-A" },
    { id: randomUUID(), servidorId: "srv-003", data: "2023-02-01", tipo: "progressao", descricao: "Progressão por tempo de serviço — Nível I-B", portaria: "Portaria 018/2023", cargoApos: "Professora Municipal Nível I-B" },
    { id: randomUUID(), servidorId: "srv-003", data: "2024-07-20", tipo: "afastamento", descricao: "Afastamento para capacitação — Especialização em Pedagogia", portaria: "Portaria 200/2024", cargoApos: "Professora Municipal Nível I-B" },
    { id: randomUUID(), servidorId: "srv-003", data: "2025-01-10", tipo: "retorno", descricao: "Retorno de afastamento para capacitação", portaria: "Portaria 005/2025", cargoApos: "Professora Municipal Nível I-C" },
  ];

  for (const h of historicos) {
    await db.insert(historicoFuncionalTable).values(h).onConflictDoNothing();
  }
  console.log("  ✅ Histórico funcional criado");

  // ── Usuários do Portal do Servidor (vinculados aos servidores) ────────────
  // Cada servidor recebe uma conta de usuário com servidorId preenchido,
  // permitindo que o JWT inclua servidorId para acesso às rotas /api/servidor/*
  const usuariosServidor = [
    {
      id: "usr-srv-001",
      tenantId,
      nome: "Ana Paula Ferreira Costa",
      email: "ana.costa@parauapebas.pa.gov.br",
      senhaHash: hashPassword("servidor123"),
      cargo: "Analista de Sistemas",
      modulosPermitidos: ["servidor"] as string[],
      isAdmin: false,
      isAtivo: true,
      servidorId: "srv-001",
    },
    {
      id: "usr-srv-002",
      tenantId,
      nome: "Carlos Eduardo Santos Lima",
      email: "carlos.lima@parauapebas.pa.gov.br",
      senhaHash: hashPassword("servidor123"),
      cargo: "Assistente Administrativo",
      modulosPermitidos: ["servidor"] as string[],
      isAdmin: false,
      isAtivo: true,
      servidorId: "srv-002",
    },
    {
      id: "usr-srv-003",
      tenantId,
      nome: "Maria Lucia Rodrigues Sousa",
      email: "maria.sousa@parauapebas.pa.gov.br",
      senhaHash: hashPassword("servidor123"),
      cargo: "Professora Municipal",
      modulosPermitidos: ["servidor"] as string[],
      isAdmin: false,
      isAtivo: true,
      servidorId: "srv-003",
    },
  ];

  for (const u of usuariosServidor) {
    await db.insert(usuariosTable).values(u).onConflictDoNothing();
  }
  console.log("  ✅ Usuários do Portal do Servidor criados (senha: servidor123)");

  console.log("\n🎉 Seed do Portal do Servidor concluído com sucesso!");
  console.log("   Credenciais de exemplo:");
  console.log("   - ana.costa@parauapebas.pa.gov.br / servidor123  (srv-001)");
  console.log("   - carlos.lima@parauapebas.pa.gov.br / servidor123  (srv-002)");
  console.log("   - maria.sousa@parauapebas.pa.gov.br / servidor123  (srv-003)");
}

main().catch(console.error).finally(() => process.exit(0));
