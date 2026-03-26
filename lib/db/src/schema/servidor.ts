import { pgTable, text, integer, real, boolean, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

// ─── Cadastro Completo do Servidor ───────────────────────────────────────────
// vinculo: estatutario | clt | comissionado | temporario
// status: ativo | afastado | inativo | aposentado

export const servidoresCadastroTable = pgTable("servidores_cadastro", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),

  // Identificação
  nome: text("nome").notNull(),
  cpf: text("cpf").notNull(),
  matricula: text("matricula").notNull(),
  email: text("email").notNull(),
  emailPessoal: text("email_pessoal"),
  telefone: text("telefone"),
  dataNascimento: date("data_nascimento"),

  // Dados Funcionais
  cargo: text("cargo").notNull(),
  codigoCargo: text("codigo_cargo"),
  nivel: text("nivel"),
  referencia: text("referencia"),
  vinculo: text("vinculo").notNull().default("estatutario"),
  status: text("status").notNull().default("ativo"),
  dataIngresso: date("data_ingresso").notNull(),
  dataConcurso: date("data_concurso"),
  concursoOrigem: text("concurso_origem"),

  // Lotação
  secretaria: text("secretaria").notNull(),
  localTrabalho: text("local_trabalho"),

  // Dados Bancários
  banco: text("banco"),
  agencia: text("agencia"),
  conta: text("conta"),
  tipoConta: text("tipo_conta").default("corrente"),

  // Endereço
  endereco: text("endereco"),
  numero: text("numero"),
  complemento: text("complemento"),
  bairro: text("bairro"),
  cidade: text("cidade"),
  estado: text("estado"),
  cep: text("cep"),

  // Remuneração base
  salarioBase: real("salario_base").notNull().default(0),

  // Dependentes para IRRF (JSON array)
  dependentes: jsonb("dependentes").notNull().default([]),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertServidorCadastroSchema = createInsertSchema(servidoresCadastroTable).omit({ createdAt: true, updatedAt: true });
export type InsertServidorCadastro = z.infer<typeof insertServidorCadastroSchema>;
export type ServidorCadastro = typeof servidoresCadastroTable.$inferSelect;

// ─── Contracheques ────────────────────────────────────────────────────────────
// status: pago | pendente | processando

export const contrachequeTable = pgTable("contracheques", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  servidorId: text("servidor_id").notNull().references(() => servidoresCadastroTable.id),

  mes: integer("mes").notNull(),
  ano: integer("ano").notNull(),
  competencia: text("competencia").notNull(),

  // Totais
  totalBruto: real("total_bruto").notNull().default(0),
  totalDescontos: real("total_descontos").notNull().default(0),
  totalLiquido: real("total_liquido").notNull().default(0),

  status: text("status").notNull().default("pago"),

  // Snapshot dos dados do servidor na competência
  cargoNaCompetencia: text("cargo_na_competencia"),
  secretariaNaCompetencia: text("secretaria_na_competencia"),
  nivelNaCompetencia: text("nivel_na_competencia"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContrachequeSchema = createInsertSchema(contrachequeTable).omit({ createdAt: true });
export type InsertContracheque = z.infer<typeof insertContrachequeSchema>;
export type Contracheque = typeof contrachequeTable.$inferSelect;

// ─── Linhas do Contracheque ───────────────────────────────────────────────────
// tipo: vencimento | desconto | informativo

export const contrachequeLinhasTable = pgTable("contracheque_linhas", {
  id: text("id").primaryKey(),
  contrachequeId: text("contracheque_id").notNull().references(() => contrachequeTable.id, { onDelete: "cascade" }),

  tipo: text("tipo").notNull(),
  codigo: text("codigo").notNull(),
  descricao: text("descricao").notNull(),
  referencia: text("referencia"),
  valor: real("valor").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertContrachequeLinhaSchema = createInsertSchema(contrachequeLinhasTable);
export type InsertContrachequeLinha = z.infer<typeof insertContrachequeLinhaSchema>;
export type ContrachequeLinha = typeof contrachequeLinhasTable.$inferSelect;

// ─── Períodos Aquisitivos de Férias ─────────────────────────────────────────

export const periodosAquisitivosTable = pgTable("periodos_aquisitivos", {
  id: text("id").primaryKey(),
  servidorId: text("servidor_id").notNull().references(() => servidoresCadastroTable.id),

  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  diasDireito: integer("dias_direito").notNull().default(30),
  diasGozados: integer("dias_gozados").notNull().default(0),
  diasVendidos: integer("dias_vendidos").notNull().default(0),
  diasSaldo: integer("dias_saldo").notNull().default(30),

  prazoLimite: date("prazo_limite"),
  status: text("status").notNull().default("disponivel"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPeriodoAquisitivoSchema = createInsertSchema(periodosAquisitivosTable).omit({ createdAt: true });
export type InsertPeriodoAquisitivo = z.infer<typeof insertPeriodoAquisitivoSchema>;
export type PeriodoAquisitivo = typeof periodosAquisitivosTable.$inferSelect;

// ─── Solicitações de Férias ───────────────────────────────────────────────────
// status: aguardando_chefia | em_analise_rh | aprovado | rejeitado | cancelado
// parcelamento: 1 | 2 | 3

export const solicitacoesFeriasTable = pgTable("solicitacoes_ferias", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  servidorId: text("servidor_id").notNull().references(() => servidoresCadastroTable.id),
  periodoAquisitivoId: text("periodo_aquisitivo_id").notNull().references(() => periodosAquisitivosTable.id),

  protocolo: text("protocolo").notNull(),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  dataRetorno: date("data_retorno").notNull(),
  qtdDias: integer("qtd_dias").notNull(),
  parcelamento: integer("parcelamento").notNull().default(1),
  adiantamento13: boolean("adiantamento_13").notNull().default(false),
  abonoPecuniario: boolean("abono_pecuniario").notNull().default(false),
  diasAbono: integer("dias_abono").notNull().default(0),

  status: text("status").notNull().default("aguardando_chefia"),

  // Workflow de aprovação (JSON array de eventos)
  timeline: jsonb("timeline").notNull().default([]),

  // Aprovação / Rejeição
  aprovadoPor: text("aprovado_por"),
  aprovadoEm: timestamp("aprovado_em"),
  motivoRejeicao: text("motivo_rejeicao"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSolicitacaoFeriasSchema = createInsertSchema(solicitacoesFeriasTable).omit({ createdAt: true, updatedAt: true });
export type InsertSolicitacaoFerias = z.infer<typeof insertSolicitacaoFeriasSchema>;
export type SolicitacaoFerias = typeof solicitacoesFeriasTable.$inferSelect;

// ─── Requerimentos ───────────────────────────────────────────────────────────
// status: rascunho | protocolado | em_analise | deferido | indeferido | arquivado
// tipo: ver lista de tipos no enum

export const requerimentosTable = pgTable("requerimentos", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  servidorId: text("servidor_id").notNull().references(() => servidoresCadastroTable.id),

  protocolo: text("protocolo").notNull(),
  tipo: text("tipo").notNull(),
  assunto: text("assunto").notNull(),
  justificativa: text("justificativa").notNull(),

  // Campos extras específicos por tipo (JSON)
  camposEspecificos: jsonb("campos_especificos").notNull().default({}),

  // Documentos anexados (JSON array: { nome, url, tamanho })
  documentos: jsonb("documentos").notNull().default([]),

  status: text("status").notNull().default("protocolado"),

  // Timeline de tramitação (JSON array de eventos)
  timeline: jsonb("timeline").notNull().default([]),

  // Parecer e decisão
  parecerTecnico: text("parecer_tecnico"),
  decisao: text("decisao"),
  motivoDecisao: text("motivo_decisao"),
  decisorNome: text("decisor_nome"),
  decidoEm: timestamp("decidido_em"),

  // Prazo para recurso (se indeferido)
  prazoRecurso: date("prazo_recurso"),
  recursoPresentado: boolean("recurso_apresentado").notNull().default(false),

  // Despacho formal gerado pelo decisor (texto estruturado)
  despacho: text("despacho"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRequerimentoSchema = createInsertSchema(requerimentosTable).omit({ createdAt: true, updatedAt: true });
export type InsertRequerimento = z.infer<typeof insertRequerimentoSchema>;
export type Requerimento = typeof requerimentosTable.$inferSelect;

// ─── Histórico Funcional ──────────────────────────────────────────────────────
// tipo: ingresso | progressao | remocao | afastamento | retorno | licenca |
//       adicional | comissao | exoneracao | aposentadoria | averbacao

export const historicoFuncionalTable = pgTable("historico_funcional", {
  id: text("id").primaryKey(),
  servidorId: text("servidor_id").notNull().references(() => servidoresCadastroTable.id),

  data: date("data").notNull(),
  tipo: text("tipo").notNull(),
  descricao: text("descricao").notNull(),
  portaria: text("portaria"),
  portariaUrl: text("portaria_url"),
  despacho: text("despacho"),
  secretariaDestino: text("secretaria_destino"),
  cargoApos: text("cargo_apos"),
  observacoes: text("observacoes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHistoricoFuncionalSchema = createInsertSchema(historicoFuncionalTable).omit({ createdAt: true });
export type InsertHistoricoFuncional = z.infer<typeof insertHistoricoFuncionalSchema>;
export type HistoricoFuncional = typeof historicoFuncionalTable.$inferSelect;
