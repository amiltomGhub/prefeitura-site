import { db } from "@workspace/db";
import {
  tenantsTable, municipioInfoTable, gestoresTable,
  noticiasTable, servicosTable, secretariasTable,
  despesasTable, receitasTable, servidoresTable, orcamentosTable,
  licitacoesTable, legislacaoTable, agendaTable, galeriaTable, concursosTable
} from "@workspace/db/schema";
import { randomUUID } from "crypto";

const TENANT_ID = "tenant-parauapebas-001";
const TENANT_SLUG = "parauapebas";

async function seed() {
  console.log("🌱 Seeding Portal Municipal — Parauapebas...");

  // Tenant
  await db.insert(tenantsTable).values({
    id: TENANT_ID,
    nome: "Prefeitura Municipal de Parauapebas",
    slug: TENANT_SLUG,
    brasao: "/images/brasao.png",
    corPrimaria: "#1351B4",
    corSecundaria: "#168821",
    corTerciaria: "#FFCD07",
    estado: "Pará",
    populacao: 230000,
    area: 6960.7,
    fundacao: "1988-01-01",
    lema: "Trabalhar para o povo, crescer com o cidadão",
    siteUrl: "https://www.parauapebas.pa.gov.br",
    modulosAtivos: ["site", "ouvidoria", "transparencia"],
  }).onConflictDoNothing();

  // Municipio Info
  await db.insert(municipioInfoTable).values({
    id: randomUUID(),
    tenantId: TENANT_ID,
    nome: "Parauapebas",
    estado: "Pará",
    regiao: "Norte",
    populacao: 230000,
    area: 6960.7,
    altitude: 200,
    idh: 0.715,
    pib: 18500000000,
    historia: "Parauapebas foi criada em 1988, emancipada de Marabá. Está localizada no sudeste do Pará e é conhecida pela mineração de ferro da Serra dos Carajás, operada pela Vale S.A. A cidade se tornou um dos maiores municípios em arrecadação do Pará, com investimentos em infraestrutura, saúde e educação.",
    simbolos: { bandeira: "/images/bandeira.png", brasao: "/images/brasao.png", hino: null },
    localizacao: { latitude: -6.0688, longitude: -49.8759, mapa: null },
  }).onConflictDoNothing();

  // Gestores
  await db.insert(gestoresTable).values([
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      nome: "Dr. Darci Lermen",
      cargo: "Prefeito",
      partido: "Solidariedade",
      mandato: "2021-2024",
      foto: "/images/prefeito.png",
      bio: "Médico e gestor público com mais de 20 anos de experiência. Comprometido com o desenvolvimento sustentável de Parauapebas e a melhoria da qualidade de vida dos cidadãos.",
      email: "prefeito@parauapebas.pa.gov.br",
      redesSociais: { facebook: "https://facebook.com/prefeituraparauapebas", instagram: "https://instagram.com/prefeituraparauapebas" },
      ativo: true,
    },
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      nome: "Ana Paula Rodrigues",
      cargo: "Vice-Prefeito",
      partido: "Solidariedade",
      mandato: "2021-2024",
      foto: null,
      bio: "Administradora pública com vasta experiência em gestão municipal.",
      email: "vice@parauapebas.pa.gov.br",
      redesSociais: null,
      ativo: true,
    },
  ]).onConflictDoNothing();

  // Secretarias
  const secretarias = [
    { sigla: "SEMSUR", nome: "Secretaria Municipal de Saúde", descricao: "Responsável pela saúde pública municipal.", secretario: "Dr. Carlos Mendes", competencias: ["Atenção Básica", "Vigilância Sanitária", "Saúde Mental"] },
    { sigla: "SEMED", nome: "Secretaria Municipal de Educação", descricao: "Gestão da rede pública de ensino.", secretario: "Maria Aparecida Lima", competencias: ["Ensino Fundamental", "Educação Infantil", "EJA"] },
    { sigla: "SEMID", nome: "Secretaria Municipal de Infraestrutura", descricao: "Obras e serviços urbanos.", secretario: "Eng. João Santos", competencias: ["Obras Públicas", "Pavimentação", "Iluminação Pública"] },
    { sigla: "SEMAF", nome: "Secretaria Municipal de Finanças", descricao: "Gestão das finanças municipais.", secretario: "Cláudio Ferreira", competencias: ["Orçamento Municipal", "Contabilidade", "Receita"] },
    { sigla: "SEMAST", nome: "Secretaria Municipal de Assistência Social", descricao: "Políticas de assistência social.", secretario: "Maria José Costa", competencias: ["CRAS", "CREAS", "Programas Sociais"] },
    { sigla: "SEMMA", nome: "Secretaria Municipal de Meio Ambiente", descricao: "Gestão ambiental do município.", secretario: "Dr. Paulo Amazônia", competencias: ["Licenciamento Ambiental", "Áreas Verdes", "Saneamento"] },
  ];

  for (const s of secretarias) {
    await db.insert(secretariasTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      nome: s.nome,
      slug: s.nome.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      sigla: s.sigla,
      descricao: s.descricao,
      secretario: s.secretario,
      telefone: "(94) 3346-" + Math.floor(1000 + Math.random() * 9000),
      email: `${s.sigla.toLowerCase()}@parauapebas.pa.gov.br`,
      endereco: "Av. Presidente Médici, 1246 - Centro, Parauapebas - PA",
      horario: "Segunda a Sexta: 08:00 às 14:00",
      competencias: s.competencias,
      ativa: true,
    }).onConflictDoNothing();
  }

  // Notícias
  const noticias = [
    { titulo: "Prefeitura entrega novo centro de saúde no bairro Rio Verde", categoria: "saude", destaque: true, resumo: "Nova unidade de saúde vai atender mais de 15 mil moradores com consultas, exames e medicamentos gratuitos." },
    { titulo: "Obras de pavimentação avançam em 12 ruas do centro da cidade", categoria: "obras", destaque: true, resumo: "Investimento de R$ 4,2 milhões melhora mobilidade urbana e qualidade de vida dos moradores." },
    { titulo: "Inscrições abertas para cursos profissionalizantes gratuitos", categoria: "educacao", destaque: true, resumo: "SEMDE oferece 400 vagas em cursos de informática, gastronomia e construção civil para jovens e adultos." },
    { titulo: "Parauapebas recebe certificação de cidade sustentável do IBGE", categoria: "meio-ambiente", destaque: false, resumo: "Município é reconhecido por práticas de gestão ambiental e redução de resíduos sólidos." },
    { titulo: "Programa Bolsa Família beneficia mais de 8 mil famílias em Parauapebas", categoria: "social", destaque: false, resumo: "Repasses mensais garantem renda mínima e acesso a serviços de saúde e educação para famílias vulneráveis." },
    { titulo: "Concurso público para 150 vagas tem edital publicado no Diário Oficial", categoria: "concursos", destaque: false, resumo: "Vagas para diversas áreas com salários de R$ 1.800 a R$ 8.500. Inscrições até 30 de abril." },
  ];

  for (const n of noticias) {
    const slug = n.titulo.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, "").substring(0, 80);
    await db.insert(noticiasTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      titulo: n.titulo,
      slug,
      resumo: n.resumo,
      conteudo: `<p>${n.resumo}</p><p>A Prefeitura Municipal de Parauapebas, por meio da secretaria competente, informa que as ações estão em pleno andamento. O prefeito destacou a importância do investimento para a melhoria da qualidade de vida dos cidadãos.</p><p>Mais informações podem ser obtidas diretamente nas secretarias municipais ou pelo site oficial da prefeitura.</p>`,
      categoria: n.categoria,
      autor: "Assessoria de Comunicação",
      dataPublicacao: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      destaque: n.destaque,
      tags: [n.categoria, "prefeitura", "parauapebas"],
      publicado: true,
    }).onConflictDoNothing();
  }

  // Serviços
  const servicos = [
    { titulo: "Certidão de IPTU", categoria: "tributos", descricao: "Emissão de certidão de débitos do IPTU para o imóvel.", online: true, gratuito: true, icone: "FileText" },
    { titulo: "Alvará de Funcionamento", categoria: "licencas", descricao: "Solicitação de alvará para abertura e funcionamento de estabelecimentos comerciais.", online: false, gratuito: false, icone: "Building" },
    { titulo: "Atendimento na UBS", categoria: "saude", descricao: "Agendamento de consultas médicas nas Unidades Básicas de Saúde.", online: true, gratuito: true, icone: "Heart" },
    { titulo: "Matrícula Escolar", categoria: "educacao", descricao: "Solicitação de matrícula para alunos da rede pública municipal de ensino.", online: true, gratuito: true, icone: "BookOpen" },
    { titulo: "Nota Fiscal Eletrônica", categoria: "tributos", descricao: "Emissão de NFS-e para prestadores de serviço.", online: true, gratuito: true, icone: "Receipt" },
    { titulo: "Habite-se", categoria: "obras", descricao: "Solicitação de habite-se para construções e reformas.", online: false, gratuito: false, icone: "Home" },
    { titulo: "Ouvidoria Municipal", categoria: "cidadania", descricao: "Registre reclamações, denúncias, sugestões e elogios sobre serviços municipais.", online: true, gratuito: true, icone: "MessageSquare" },
    { titulo: "BPC — Benefício de Prestação Continuada", categoria: "social", descricao: "Orientação e encaminhamento para o benefício federal BPC/LOAS.", online: false, gratuito: true, icone: "Users" },
  ];

  for (const s of servicos) {
    const slug = s.titulo.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, "");
    await db.insert(servicosTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      titulo: s.titulo,
      slug,
      descricao: s.descricao,
      categoria: s.categoria,
      requisitos: ["Documento de identidade", "CPF", "Comprovante de residência"],
      documentos: ["RG ou CNH", "CPF"],
      prazoAtendimento: "3 a 5 dias úteis",
      gratuito: s.gratuito,
      online: s.online,
      icone: s.icone,
      ativo: true,
    }).onConflictDoNothing();
  }

  // Orçamento
  await db.insert(orcamentosTable).values({
    id: randomUUID(),
    tenantId: TENANT_ID,
    ano: 2025,
    receitaPrevista: 1850000000,
    receitaRealizada: 1423000000,
    despesaPrevista: 1820000000,
    despesaRealizada: 1380000000,
    saldoAtual: 43000000,
    categorias: JSON.stringify([
      { nome: "Educação", valor: 480000000, percentual: 34.8 },
      { nome: "Saúde", valor: 370000000, percentual: 26.8 },
      { nome: "Infraestrutura", valor: 220000000, percentual: 15.9 },
      { nome: "Assistência Social", valor: 150000000, percentual: 10.9 },
      { nome: "Administração", valor: 100000000, percentual: 7.2 },
      { nome: "Outros", valor: 60000000, percentual: 4.4 },
    ]),
  }).onConflictDoNothing();

  // Despesas (alguns registros)
  const secretariasNomes = ["SEMSUR", "SEMED", "SEMID", "SEMAF", "SEMAST"];
  const categoriasDespesa = ["Pessoal", "Custeio", "Investimentos", "Transferências"];
  for (let i = 0; i < 20; i++) {
    const mes = (i % 12) + 1;
    await db.insert(despesasTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      data: `2025-${String(mes).padStart(2, "0")}-15`,
      descricao: `Pagamento de ${categoriasDespesa[i % 4]} - ${secretariasNomes[i % 5]}`,
      secretaria: secretariasNomes[i % 5]!,
      categoria: categoriasDespesa[i % 4]!,
      valor: Math.round((50000 + Math.random() * 500000) * 100) / 100,
      beneficiario: i % 3 === 0 ? "Fornecedor Genérico LTDA" : null,
      empenho: `EMP-2025-${String(1000 + i).padStart(5, "0")}`,
      modalidade: i % 2 === 0 ? "Pregão Eletrônico" : "Dispensa",
      ano: 2025,
      mes,
    }).onConflictDoNothing();
  }

  // Receitas
  for (let i = 0; i < 12; i++) {
    const mes = i + 1;
    await db.insert(receitasTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      data: `2025-${String(mes).padStart(2, "0")}-10`,
      descricao: `CFEM - Compensação Financeira pela Exploração Mineral - ${mes}/2025`,
      fonte: "CFEM/DNPM",
      categoria: "Transferências Correntes",
      valor: Math.round((80000000 + Math.random() * 20000000) * 100) / 100,
      ano: 2025,
      mes,
    }).onConflictDoNothing();
  }

  // Servidores
  const cargos = ["Agente Comunitário de Saúde", "Professor", "Engenheiro", "Assistente Social", "Médico", "Auditor Fiscal"];
  for (let i = 0; i < 15; i++) {
    await db.insert(servidoresTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      nome: `Servidor ${String.fromCharCode(65 + i)}. Silva`,
      cargo: cargos[i % cargos.length]!,
      secretaria: secretariasNomes[i % secretariasNomes.length]!,
      vinculo: i % 3 === 0 ? "Contratado" : "Efetivo",
      remuneracao: Math.round((2000 + Math.random() * 10000) * 100) / 100,
      admissao: "2015-03-01",
    }).onConflictDoNothing();
  }

  // Licitações
  const modalidades = ["Pregão Eletrônico", "Tomada de Preços", "Concorrência Pública", "Dispensa de Licitação"];
  const situacoes = ["aberto", "em-andamento", "encerrado", "homologado"];
  const objetos = [
    "Aquisição de medicamentos para a Rede Municipal de Saúde",
    "Contratação de serviços de manutenção de vias públicas",
    "Fornecimento de material de construção para obras",
    "Contratação de empresa de TI para sistemas de gestão",
    "Aquisição de equipamentos escolares e didáticos",
    "Serviços de coleta e tratamento de resíduos sólidos",
  ];

  for (let i = 0; i < 6; i++) {
    await db.insert(licitacoesTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      numero: `${String(i + 1).padStart(3, "0")}/2025`,
      objeto: objetos[i]!,
      modalidade: modalidades[i % 4]!,
      situacao: situacoes[i % 4]!,
      dataAbertura: new Date(2025, i, 15),
      dataEncerramento: i < 2 ? null : new Date(2025, i + 1, 15),
      valorEstimado: Math.round((100000 + Math.random() * 2000000) * 100) / 100,
      valorHomologado: i >= 3 ? Math.round((100000 + Math.random() * 1800000) * 100) / 100 : null,
      secretaria: secretariasNomes[i % 5]!,
      descricao: `Processo licitatório para ${objetos[i]}. Edital disponível no Portal da Transparência.`,
    }).onConflictDoNothing();
  }

  // Legislação
  const tiposLei = ["lei", "decreto", "portaria"];
  const ementas = [
    "Dispõe sobre o Plano Plurianual do Município para o quadriênio 2022-2025",
    "Institui o Código Tributário Municipal e dá outras providências",
    "Cria o Fundo Municipal de Saúde e regulamenta seu funcionamento",
    "Dispõe sobre o estatuto dos servidores públicos municipais",
    "Institui a Política Municipal de Meio Ambiente",
    "Aprova o Plano Diretor de Desenvolvimento Urbano do Município",
  ];

  for (let i = 0; i < 6; i++) {
    const tipo = tiposLei[i % 3]!;
    const numero = String(1000 + i * 100);
    const ano = 2024 - (i % 3);
    await db.insert(legislacaoTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      numero,
      tipo,
      ementa: ementas[i]!,
      slug: `${tipo}-${numero}-${ano}`,
      dataPublicacao: `${ano}-${String((i % 12) + 1).padStart(2, "0")}-01`,
      ano,
      conteudo: `<p>${ementas[i]}</p><p>O Prefeito Municipal de Parauapebas, no uso das atribuições que lhe são conferidas pela Lei Orgânica Municipal, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:</p><p>Art. 1º - ${ementas[i]}.</p><p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>`,
      tags: [tipo, "legislação municipal", ano.toString()],
    }).onConflictDoNothing();
  }

  // Agenda
  const eventos = [
    { titulo: "Audiência Pública — Prestação de Contas 1º Quadrimestre", local: "Câmara Municipal", categoria: "audiencia-publica" },
    { titulo: "Fórum Municipal de Saúde — Atenção Básica em Debate", local: "Teatro Municipal", categoria: "saude" },
    { titulo: "Semana de Orientação do IPTU 2025", local: "Prefeitura Municipal", categoria: "tributos" },
    { titulo: "Festa Junina Municipal — Quadrilha das Secretarias", local: "Praça Central", categoria: "cultura" },
  ];

  for (let i = 0; i < eventos.length; i++) {
    const evento = eventos[i]!;
    await db.insert(agendaTable).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      titulo: evento.titulo,
      descricao: `Evento oficial da Prefeitura Municipal de Parauapebas. Participação aberta ao público.`,
      dataInicio: new Date(2025, 3 + i, 10 + i * 5),
      dataFim: new Date(2025, 3 + i, 10 + i * 5 + 1),
      local: evento.local,
      categoria: evento.categoria,
      publicoAlvo: "População em geral",
      gratuito: true,
      ativo: true,
    }).onConflictDoNothing();
  }

  // Concursos
  await db.insert(concursosTable).values([
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      titulo: "Concurso Público nº 001/2025 — Área de Saúde e Educação",
      descricao: "Concurso para provimento de 150 cargos efetivos nas áreas de saúde e educação.",
      tipo: "concurso-publico",
      situacao: "aberto",
      numeroVagas: 150,
      dataPublicacao: "2025-03-01",
      dataInscricaoInicio: "2025-03-10",
      dataInscricaoFim: "2025-04-30",
      linkEdital: "/transparencia/concursos/edital-001-2025.pdf",
      linkInscricao: "https://concursos.parauapebas.pa.gov.br",
      organizadora: "Instituto de Concursos do Pará - ICPA",
      remuneracao: 3500,
    },
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      titulo: "Processo Seletivo nº 002/2025 — Assistentes Sociais",
      descricao: "Processo seletivo para contratação temporária de assistentes sociais.",
      tipo: "processo-seletivo",
      situacao: "encerrado",
      numeroVagas: 10,
      dataPublicacao: "2024-12-01",
      dataInscricaoInicio: "2024-12-10",
      dataInscricaoFim: "2025-01-15",
      linkEdital: null,
      linkInscricao: null,
      organizadora: null,
      remuneracao: 2800,
    },
  ]).onConflictDoNothing();

  console.log("✅ Seed concluído com sucesso!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
