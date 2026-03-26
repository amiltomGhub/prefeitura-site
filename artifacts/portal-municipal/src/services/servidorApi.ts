import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServidor } from "@/contexts/ServidorContext";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

async function apiFetch<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function useContracheques(ano?: string) {
  const { servidor } = useServidor();
  const params = ano && ano !== "todos" ? `?ano=${ano}` : "";
  return useQuery({
    queryKey: ["contracheques", servidor.tenantId, ano],
    queryFn: () => apiFetch<ContrachequeListItem[]>(`/servidor/contracheques${params}`, servidor.token),
  });
}

export function useContrachequeDetalhe(mes: number, ano: number) {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["contracheque", servidor.tenantId, mes, ano],
    queryFn: () => apiFetch<ContrachequeDetalhe>(`/servidor/contracheques/${mes}/${ano}`, servidor.token),
    enabled: Boolean(mes && ano),
  });
}

export function useFeriasSaldo() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["ferias-saldo", servidor.tenantId, servidor.id],
    queryFn: () => apiFetch<FeriasSaldo>("/servidor/ferias/saldo", servidor.token),
  });
}

export function useFeriasHistorico() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["ferias-historico", servidor.tenantId, servidor.id],
    queryFn: () => apiFetch<FeriasHistoricoItem[]>("/servidor/ferias/historico", servidor.token),
  });
}

export function useSolicitarFerias() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SolicitarFeriasInput) =>
      apiFetch<{ id: string; protocolo: string }>("/servidor/ferias/solicitar", servidor.token, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ferias-saldo"] });
      qc.invalidateQueries({ queryKey: ["ferias-historico"] });
    },
  });
}

export function useRequerimentos(filters?: { status?: string; tipo?: string }) {
  const { servidor } = useServidor();
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== "todos") params.set("status", filters.status);
  if (filters?.tipo && filters.tipo !== "todos") params.set("tipo", filters.tipo);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return useQuery({
    queryKey: ["requerimentos", servidor.tenantId, servidor.id, filters],
    queryFn: () => apiFetch<RequerimentoListItem[]>(`/servidor/requerimentos${qs}`, servidor.token),
  });
}

export function useRequerimentoDetalhe(id: string) {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["requerimento", servidor.tenantId, id],
    queryFn: () => apiFetch<RequerimentoDetalhe>(`/servidor/requerimentos/${id}`, servidor.token),
    enabled: Boolean(id),
  });
}

export function useCriarRequerimento() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CriarRequerimentoInput) =>
      apiFetch<{ id: string; protocolo: string }>("/servidor/requerimentos", servidor.token, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requerimentos"] });
    },
  });
}

export function useRecursoRequerimento() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, justificativa }: { id: string; justificativa: string }) =>
      apiFetch<void>(`/servidor/requerimentos/${id}/recurso`, servidor.token, {
        method: "POST",
        body: JSON.stringify({ justificativa }),
      }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["requerimento", vars.id] });
      qc.invalidateQueries({ queryKey: ["requerimentos"] });
    },
  });
}

export function usePerfilServidor() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["perfil", servidor.tenantId, servidor.id],
    queryFn: () => apiFetch<PerfilServidor>("/servidor/perfil", servidor.token),
  });
}

export function useAtualizarPerfil() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<PerfilServidor>) =>
      apiFetch<PerfilServidor>("/servidor/perfil", servidor.token, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["perfil"] });
    },
  });
}

export function useHistoricoFuncional() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["historico-funcional", servidor.tenantId, servidor.id],
    queryFn: () => apiFetch<HistoricoFuncionalItem[]>("/servidor/historico-funcional", servidor.token),
  });
}

export function useTempoServico() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["tempo-servico", servidor.tenantId, servidor.id],
    queryFn: () => apiFetch<TempoServico>("/servidor/tempo-servico", servidor.token),
  });
}

export function useRhDashboard() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["rh-dashboard", servidor.tenantId],
    queryFn: () => apiFetch<RhDashboardData>("/rh/dashboard", servidor.token),
    enabled: servidor.isRH || servidor.isAdmin,
  });
}

export function useRhFeriasPendentes() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["rh-ferias-pendentes", servidor.tenantId],
    queryFn: () => apiFetch<RhFeriasPendenteItem[]>("/rh/ferias/pendentes", servidor.token),
    enabled: servidor.isRH || servidor.isAdmin,
  });
}

export function useRhAprovarFerias() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiFetch<void>(`/rh/ferias/${id}/aprovar`, servidor.token, { method: "PATCH" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rh-ferias-pendentes"] });
      qc.invalidateQueries({ queryKey: ["rh-dashboard"] });
    },
  });
}

export function useRhRejeitarFerias() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) =>
      apiFetch<void>(`/rh/ferias/${id}/rejeitar`, servidor.token, {
        method: "PATCH",
        body: JSON.stringify({ motivo }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rh-ferias-pendentes"] });
      qc.invalidateQueries({ queryKey: ["rh-dashboard"] });
    },
  });
}

export function useRhRequerimentosPendentes() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["rh-reqs-pendentes", servidor.tenantId],
    queryFn: () => apiFetch<RhRequerimentoPendente[]>("/rh/requerimentos/pendentes", servidor.token),
    enabled: servidor.isRH || servidor.isAdmin,
  });
}

export function useRhRequerimentos() {
  const { servidor } = useServidor();
  return useQuery({
    queryKey: ["rh-reqs", servidor.tenantId],
    queryFn: () => apiFetch<RhRequerimentoPendente[]>("/rh/requerimentos", servidor.token),
    enabled: servidor.isRH || servidor.isAdmin,
  });
}

export function useRhDeferirRequerimento() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parecer, decisao }: { id: string; parecer: string; decisao?: string }) =>
      apiFetch<void>(`/rh/requerimentos/${id}/deferir`, servidor.token, {
        method: "PATCH",
        body: JSON.stringify({ parecer, decisao }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rh-reqs-pendentes"] });
      qc.invalidateQueries({ queryKey: ["rh-reqs"] });
      qc.invalidateQueries({ queryKey: ["rh-dashboard"] });
    },
  });
}

export function useRhIndeferirRequerimento() {
  const { servidor } = useServidor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parecer, motivo }: { id: string; parecer: string; motivo?: string }) =>
      apiFetch<void>(`/rh/requerimentos/${id}/indeferir`, servidor.token, {
        method: "PATCH",
        body: JSON.stringify({ parecer, motivo }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rh-reqs-pendentes"] });
      qc.invalidateQueries({ queryKey: ["rh-reqs"] });
      qc.invalidateQueries({ queryKey: ["rh-dashboard"] });
    },
  });
}

export interface ContrachequeListItem {
  mes: number;
  ano: number;
  totalBruto: number;
  totalLiquido: number;
  totalDescontos: number;
  status: string;
}

export interface ContrachequeDetalhe extends ContrachequeListItem {
  linhas: Array<{ codigo: string; descricao: string; referencia: string; valor: number; tipo: "vencimento" | "desconto" | "informativo" }>;
  servidor: { nome: string; matricula: string; cargo: string; secretaria: string; regime: string; banco: string; agencia: string; conta: string };
}

export interface PeriodoAquisitivo {
  id: string;
  dataInicio: string;
  dataFim: string;
  diasTotal: number;
  diasUsados: number;
  diasDisponiveis: number;
  vencimento: string;
  vencida: boolean;
}

export interface FeriasSaldo {
  periodoAtual: PeriodoAquisitivo | null;
  periodos: PeriodoAquisitivo[];
}

export interface FeriasHistoricoItem {
  id: string;
  periodoAquisitivoId: string;
  periodoAquisitivo: string;
  dataInicio: string;
  dataFim: string;
  qtdDias: number;
  status: string;
  protocolo: string;
  timeline: Array<{ status: string; descricao: string; data: string }>;
}

export interface SolicitarFeriasInput {
  periodoAquisitivoId: string;
  dataInicio: string;
  qtdDias: number;
  adiantamento13?: boolean;
  abonoPecuniario?: boolean;
}

export interface RequerimentoListItem {
  id: string;
  protocolo: string;
  tipo: string;
  tipoLabel: string;
  status: string;
  dataSolicitacao: string;
  prazo: string;
  despacho?: string | null;
}

export interface RequerimentoDetalhe extends RequerimentoListItem {
  justificativa: string;
  documentos: Array<{ nome: string; tamanho: string }>;
  timeline: Array<{ status: string; descricao: string; data: string }>;
}

export interface CriarRequerimentoInput {
  tipo: string;
  justificativa: string;
  documentos?: string[];
}

export interface PerfilServidor {
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  estadoCivil: string;
  nomeMae: string;
  email: string;
  telefone: string;
  endereco: string;
  municipio: string;
  cep: string;
  banco: string;
  agencia: string;
  conta: string;
  matricula: string;
  cargo: string;
  classe: string;
  regime: string;
  lotacao: string;
  vinculo: string;
  dataPosse: string;
  dataExercicio: string;
  escala: string;
  portariaAdmissao: string;
}

export interface HistoricoFuncionalItem {
  data: string;
  evento: string;
  detalhe: string;
  tipo: string;
}

export interface TempoServico {
  anos: number;
  meses: number;
  diasAdicionais: number;
  dataAdmissao: string;
  projecaoAposentadoria?: string;
  percentualProgresso?: number;
}

export interface RhDashboardData {
  totalServidoresAtivos: number;
  feriasPendentesAprovacao: number;
  feriasVencidas: number;
  requerimentosPendentes: number;
  folhaLiquidoMes: number;
  folhaMesReferencia: string;
  servidoresPorSecretaria: Array<{ secretaria: string; total: number }>;
  feriasVencidasLista: Array<{ nome: string; matricula: string; secretaria: string; periodo: string; venceu: string }>;
  requerimentosPendentesList: Array<{ id: string; nome: string; matricula: string; tipo: string; protocolado: string; prazo: string }>;
}

export interface RhFeriasPendenteItem {
  id: string;
  nome: string;
  matricula: string;
  secretaria: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  qtdDias: number;
  periodoAquisitivo: string;
  protocolado: string;
  protocolo: string;
  adiantamento13: boolean;
  abonoPecuniario: boolean;
  status: string;
}

export interface RhRequerimentoPendente {
  id: string;
  protocolo: string;
  nome: string;
  matricula: string;
  secretaria: string;
  cargo: string;
  tipo: string;
  protocolado: string;
  prazo: string;
  justificativa: string;
  documentos: Array<{ nome: string; tamanho: string }>;
  status: string;
}
