import { pgTable, text, integer, real, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const concursosTable = pgTable("concursos", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipo: text("tipo").notNull().default("concurso-publico"),
  situacao: text("situacao").notNull().default("previsto"),
  numeroVagas: integer("numero_vagas"),
  dataPublicacao: date("data_publicacao").notNull(),
  dataInscricaoInicio: date("data_inscricao_inicio"),
  dataInscricaoFim: date("data_inscricao_fim"),
  linkEdital: text("link_edital"),
  linkInscricao: text("link_inscricao"),
  organizadora: text("organizadora"),
  remuneracao: real("remuneracao"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertConcursoSchema = createInsertSchema(concursosTable).omit({ createdAt: true, updatedAt: true });
export type InsertConcurso = z.infer<typeof insertConcursoSchema>;
export type Concurso = typeof concursosTable.$inferSelect;
