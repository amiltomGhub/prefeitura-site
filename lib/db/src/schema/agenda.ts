import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const agendaTable = pgTable("agenda", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  dataInicio: timestamp("data_inicio").notNull(),
  dataFim: timestamp("data_fim"),
  local: text("local"),
  categoria: text("categoria"),
  publicoAlvo: text("publico_alvo"),
  gratuito: boolean("gratuito").notNull().default(true),
  linkInscricao: text("link_inscricao"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventoSchema = createInsertSchema(agendaTable).omit({ createdAt: true });
export type InsertEvento = z.infer<typeof insertEventoSchema>;
export type Evento = typeof agendaTable.$inferSelect;
