import { useState, useCallback } from "react";

export interface NewsItem {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  data: string;
  color: string;
  autor?: string;
}

export interface ServicoItem {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  icone: string;
  categoria: string;
  secretaria: string;
  prazo?: string;
  documentos?: string[];
  disponivel: boolean;
}

export interface AgendaItem {
  id: string;
  titulo: string;
  dia: string;
  mes: string;
  hora: string;
  local: string;
  catLabel: string;
  catColor: string;
}

const MOCK_NEWS: NewsItem[] = [
  { id: "1", slug: "novo-posto-saude", titulo: "Novo Posto de Saúde é inaugurado no Bairro Centro", resumo: "A Prefeitura inaugura mais um equipamento de saúde para atender a população.", conteudo: "A Prefeitura Municipal inaugurou nesta terça-feira o novo Posto de Saúde do Bairro Centro, ampliando o atendimento à população. O equipamento conta com consultas de clínica geral, pediatria e odontologia, além de serviços de vacinação e coleta de exames.\n\nO prefeito destacou que a obra é resultado de investimentos municipais em saúde pública, garantindo acesso a serviços essenciais para mais de 5 mil moradores da região.\n\nO atendimento funcionará de segunda a sexta-feira, das 7h às 17h, sem necessidade de agendamento prévio.", categoria: "Saúde", data: "25 mar 2026", color: "#1B5E20", autor: "Assessoria de Comunicação" },
  { id: "2", slug: "obras-avenida-principal", titulo: "Obras de pavimentação da Av. Principal começam na próxima semana", resumo: "Investimento de R$ 3,2 milhões vai recuperar 4 km de vias urbanas.", conteudo: "As obras de pavimentação da Avenida Principal têm início na próxima semana. O investimento de R$ 3,2 milhões contempla a recuperação de 4 km de vias urbanas, incluindo sinalização, drenagem e acessibilidade.\n\nDurante as obras, haverá desvio de tráfego e orientação ao motorista por agentes de trânsito.", categoria: "Obras", data: "24 mar 2026", color: "#E65100", autor: "Secretaria de Obras" },
  { id: "3", slug: "iptu-2026", titulo: "IPTU 2026: Prazo para pagamento com desconto termina em abril", resumo: "Proprietários têm até o dia 30 de abril para obter 10% de desconto no pagamento à vista.", conteudo: "A Prefeitura lembra que o prazo para pagamento do IPTU 2026 com desconto de 10% termina no dia 30 de abril. Os contribuintes podem emitir o boleto pelo site da Prefeitura ou pessoalmente na Secretaria de Fazenda.", categoria: "Tributação", data: "23 mar 2026", color: "#F57F17", autor: "Secretaria de Fazenda" },
  { id: "4", slug: "vacinas-gripe", titulo: "Campanha de vacinação contra gripe começa segunda-feira", resumo: "Idosos, crianças e gestantes têm prioridade na primeira semana.", conteudo: "A Campanha Nacional de Vacinação contra a Influenza começa na segunda-feira em todas as Unidades de Saúde do município. Idosos acima de 60 anos, crianças de 6 meses a 5 anos e gestantes têm prioridade na primeira semana.", categoria: "Saúde", data: "22 mar 2026", color: "#880E4F", autor: "Secretaria de Saúde" },
  { id: "5", slug: "bolsa-estudo", titulo: "Programa de Bolsas para Estudantes abre inscrições", resumo: "200 vagas disponíveis para alunos da rede pública com renda per capita de até 1,5 SM.", conteudo: "O Programa Municipal de Bolsas para Estudantes abre inscrições para 200 vagas destinadas a alunos da rede pública com renda per capita familiar de até 1,5 salário mínimo. As inscrições podem ser feitas pelo site da Prefeitura até o dia 15 de abril.", categoria: "Educação", data: "21 mar 2026", color: "#1A237E", autor: "Secretaria de Educação" },
];

const MOCK_SERVICOS: ServicoItem[] = [
  { id: "1", slug: "certidao-residencia", titulo: "Declaração de Residência", descricao: "Emissão de declaração de residência no município.", icone: "home-outline", categoria: "Documentos", secretaria: "Secretaria de Administração", prazo: "5 dias úteis", documentos: ["RG ou CNH", "Comprovante de endereço (conta de luz/água)"], disponivel: true },
  { id: "2", slug: "alvara-funcionamento", titulo: "Alvará de Funcionamento", descricao: "Licença para funcionamento de estabelecimento comercial ou industrial.", icone: "business-outline", categoria: "Licenças", secretaria: "Secretaria de Planejamento", prazo: "15 dias úteis", documentos: ["Contrato Social", "CPF/CNPJ", "Comprovante do imóvel"], disponivel: true },
  { id: "3", slug: "iptu-2a-via", titulo: "IPTU — 2ª Via do Boleto", descricao: "Emissão de segunda via do boleto do IPTU.", icone: "receipt-outline", categoria: "Tributação", secretaria: "Secretaria de Fazenda", prazo: "Imediato (online)", disponivel: true },
  { id: "4", slug: "sic-esic", titulo: "Pedido de Acesso à Informação (SIC)", descricao: "Solicitação de informações públicas via e-SIC (LAI 12.527/2011).", icone: "document-text-outline", categoria: "Transparência", secretaria: "Ouvidoria", prazo: "20 dias úteis", disponivel: true },
  { id: "5", slug: "agendamento-saude", titulo: "Agendamento de Consulta", descricao: "Agendamento de consultas médicas nas Unidades de Saúde.", icone: "medical-outline", categoria: "Saúde", secretaria: "Secretaria de Saúde", prazo: "Imediato", disponivel: true },
  { id: "6", slug: "matricula-escolar", titulo: "Matrícula Escolar", descricao: "Solicitação de matrícula na rede pública municipal de ensino.", icone: "school-outline", categoria: "Educação", secretaria: "Secretaria de Educação", prazo: "3 dias úteis", documentos: ["Certidão de nascimento", "Histórico escolar", "Comprovante de residência"], disponivel: true },
  { id: "7", slug: "poda-arvores", titulo: "Poda / Remoção de Árvores", descricao: "Solicitação de poda ou remoção de árvores em vias públicas.", icone: "leaf-outline", categoria: "Meio Ambiente", secretaria: "Secretaria de Meio Ambiente", prazo: "15 dias úteis", disponivel: true },
  { id: "8", slug: "iluminacao-publica", titulo: "Iluminação Pública — Reparo", descricao: "Comunicado de falha ou solicitação de reparo em poste de iluminação.", icone: "bulb-outline", categoria: "Infraestrutura", secretaria: "Secretaria de Obras", prazo: "5 dias úteis", disponivel: true },
];

const MOCK_AGENDA: AgendaItem[] = [
  { id: "1", titulo: "Audiência Pública — PPA 2026-2029", dia: "28", mes: "MAR", hora: "14h00", local: "Câmara Municipal", catLabel: "Audiência", catColor: "#1565C0" },
  { id: "2", titulo: "Vacinação Contra Gripe — Idosos", dia: "30", mes: "MAR", hora: "08h00", local: "UBS Centro", catLabel: "Saúde", catColor: "#2E7D32" },
  { id: "3", titulo: "Festa do Trabalhador — Praça Central", dia: "01", mes: "ABR", hora: "18h00", local: "Praça Central", catLabel: "Cultura", catColor: "#E65100" },
  { id: "4", titulo: "Reunião do Conselho de Educação", dia: "05", mes: "ABR", hora: "09h00", local: "Sec. de Educação", catLabel: "Educação", catColor: "#6A1B9A" },
  { id: "5", titulo: "Licitação — Pavimentação Bairro Norte", dia: "10", mes: "ABR", hora: "10h00", local: "Prefeitura Municipal", catLabel: "Licitação", catColor: "#F57C00" },
];

export function useMockNews() {
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  }, []);
  return { news: MOCK_NEWS, isLoading, refetch };
}

export function useMockServicos() {
  return { servicos: MOCK_SERVICOS };
}

export function useMockAgenda() {
  return { agenda: MOCK_AGENDA };
}
