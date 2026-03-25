import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const secretariasTable = pgTable("secretarias", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  nome: text("nome").notNull(),
  slug: text("slug").notNull(),
  sigla: text("sigla").notNull(),
  descricao: text("descricao").notNull(),
  secretario: text("secretario"),
  fotoSecretario: text("foto_secretario"),
  telefone: text("telefone"),
  email: text("email"),
  endereco: text("endereco"),
  horario: text("horario"),
  competencias: text("competencias").array().notNull().default([]),
  ativa: boolean("ativa").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSecretariaSchema = createInsertSchema(secretariasTable).omit({ createdAt: true, updatedAt: true });
export type InsertSecretaria = z.infer<typeof insertSecretariaSchema>;
export type Secretaria = typeof secretariasTable.$inferSelect;
