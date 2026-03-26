import { pgTable, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenant";
import { secretariasTable } from "./secretarias";

export const manifestacoesTable = pgTable("manifestacoes", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  protocolo: text("protocolo").notNull().unique(),
  tipo: text("tipo").notNull().default("reclamacao"),
  status: text("status").notNull().default("aberta"),
  prioridade: text("prioridade").notNull().default("normal"),
  nomeCidadao: text("nome_cidadao"),
  emailCidadao: text("email_cidadao"),
  telefoneCidadao: text("telefone_cidadao"),
  cpfCidadao: text("cpf_cidadao"),
  isAnonimo: boolean("is_anonimo").notNull().default(false),
  assunto: text("assunto").notNull(),
  descricao: text("descricao").notNull(),
  secretariaId: text("secretaria_id").references(() => secretariasTable.id),
  categoriaId: text("categoria_id"),
  prazo: timestamp("prazo"),
  resolvidaEm: timestamp("resolvida_em"),
  atribuidaAEm: timestamp("atribuida_a_em"),
  lgpdConsent: boolean("lgpd_consent").notNull().default(false),
  origem: text("origem").notNull().default("portal"),
  noticiasRelacionadas: text("noticias_relacionadas").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Manifestacao = typeof manifestacoesTable.$inferSelect;
export type InsertManifestacao = typeof manifestacoesTable.$inferInsert;

export const sicPedidosTable = pgTable("sic_pedidos", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  protocolo: text("protocolo").notNull().unique(),
  nome: text("nome").notNull(),
  cpf: text("cpf").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone"),
  tipoSolicitacao: text("tipo_solicitacao").notNull(),
  orgao: text("orgao").notNull(),
  descricao: text("descricao").notNull(),
  formataResposta: text("formata_resposta").notNull().default("email"),
  status: text("status").notNull().default("aberto"),
  resposta: text("resposta"),
  prazo: timestamp("prazo").notNull(),
  respondidoEm: timestamp("respondido_em"),
  lgpdConsent: boolean("lgpd_consent").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SicPedido = typeof sicPedidosTable.$inferSelect;
export type InsertSicPedido = typeof sicPedidosTable.$inferInsert;

export const ouvidoriaEstatisticasTable = pgTable("ouvidoria_estatisticas", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  periodo: text("periodo").notNull(),
  totalManifestacoes: integer("total_manifestacoes").notNull().default(0),
  resolvidas: integer("resolvidas").notNull().default(0),
  emAndamento: integer("em_andamento").notNull().default(0),
  noPrazo: integer("no_prazo").notNull().default(0),
  foraPrazo: integer("fora_prazo").notNull().default(0),
  porTipo: jsonb("por_tipo").$type<Record<string, number>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
