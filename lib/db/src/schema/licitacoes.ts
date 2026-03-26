import { pgTable, text, real, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";
import { secretariasTable } from "./secretarias";

// ─── Licitações ───────────────────────────────────────────────────────────────
// modalidade: pregao_eletronico | pregao_presencial | tomada_de_precos |
//             concorrencia | convite | dispensa | inexigibilidade | leilao
// situacao: aberta | em_andamento | suspensa | homologada | anulada | revogada | encerrada

export const licitacoesTable = pgTable("licitacoes", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  numero: text("numero").notNull(),
  objeto: text("objeto").notNull(),
  modalidade: text("modalidade").notNull(),
  situacao: text("situacao").notNull().default("aberta"),
  dataAbertura: timestamp("data_abertura"),
  dataEncerramento: timestamp("data_encerramento"),
  valorEstimado: real("valor_estimado"),
  valorHomologado: real("valor_homologado"),
  secretaria: text("secretaria"),
  secretariaId: text("secretaria_id").references(() => secretariasTable.id),
  edital: text("edital"),
  editalUrl: text("edital_url"),
  resultUrl: text("result_url"),
  ata: text("ata"),
  descricao: text("descricao"),
  vencedor: text("vencedor"),
  vencedorCnpj: text("vencedor_cnpj"),
  pncpId: text("pncp_id"),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLicitacaoSchema = createInsertSchema(licitacoesTable).omit({ createdAt: true, updatedAt: true });
export type InsertLicitacao = z.infer<typeof insertLicitacaoSchema>;
export type Licitacao = typeof licitacoesTable.$inferSelect;

// ─── Eventos de Licitação ─────────────────────────────────────────────────────

export const bidEventsTable = pgTable("bid_events", {
  id: text("id").primaryKey(),
  licitacaoId: text("licitacao_id").notNull().references(() => licitacoesTable.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  fileUrl: text("file_url"),
  ocorridoEm: timestamp("ocorrido_em").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBidEventSchema = createInsertSchema(bidEventsTable).omit({ createdAt: true });
export type InsertBidEvent = z.infer<typeof insertBidEventSchema>;
export type BidEvent = typeof bidEventsTable.$inferSelect;

// ─── Contratos ────────────────────────────────────────────────────────────────

export const contractsTable = pgTable("contracts", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  licitacaoId: text("licitacao_id").references(() => licitacoesTable.id),
  numero: text("numero").notNull(),
  objeto: text("objeto").notNull(),
  contratado: text("contratado").notNull(),
  cnpjContratado: text("cnpj_contratado").notNull(),
  valor: real("valor").notNull(),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  fileUrl: text("file_url"),
  ativo: boolean("ativo").notNull().default(true),
  fiscalNome: text("fiscal_nome"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertContractSchema = createInsertSchema(contractsTable).omit({ createdAt: true, updatedAt: true });
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contractsTable.$inferSelect;
