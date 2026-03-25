import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const servicosTable = pgTable("servicos", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  slug: text("slug").notNull(),
  descricao: text("descricao").notNull(),
  categoria: text("categoria").notNull(),
  orgao: text("orgao"),
  linkExterno: text("link_externo"),
  requisitos: text("requisitos").array().notNull().default([]),
  documentos: text("documentos").array().notNull().default([]),
  prazoAtendimento: text("prazo_atendimento"),
  gratuito: boolean("gratuito").notNull().default(true),
  online: boolean("online").notNull().default(false),
  icone: text("icone"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertServicoSchema = createInsertSchema(servicosTable).omit({ createdAt: true, updatedAt: true });
export type InsertServico = z.infer<typeof insertServicoSchema>;
export type Servico = typeof servicosTable.$inferSelect;
