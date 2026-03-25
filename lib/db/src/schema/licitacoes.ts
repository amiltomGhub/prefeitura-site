import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const licitacoesTable = pgTable("licitacoes", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  numero: text("numero").notNull(),
  objeto: text("objeto").notNull(),
  modalidade: text("modalidade").notNull(),
  situacao: text("situacao").notNull().default("aberto"),
  dataAbertura: timestamp("data_abertura"),
  dataEncerramento: timestamp("data_encerramento"),
  valorEstimado: real("valor_estimado"),
  valorHomologado: real("valor_homologado"),
  secretaria: text("secretaria"),
  edital: text("edital"),
  ata: text("ata"),
  descricao: text("descricao"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLicitacaoSchema = createInsertSchema(licitacoesTable).omit({ createdAt: true, updatedAt: true });
export type InsertLicitacao = z.infer<typeof insertLicitacaoSchema>;
export type Licitacao = typeof licitacoesTable.$inferSelect;
