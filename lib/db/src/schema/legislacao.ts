import { pgTable, text, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

// ─── Legislação ───────────────────────────────────────────────────────────────
// tipo: lei | decreto | portaria | resolucao | instrucao_normativa |
//       comunicado | edital | ata
// status: rascunho | publicado | arquivado

export const legislacaoTable = pgTable("legislacao", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  numero: text("numero").notNull(),
  tipo: text("tipo").notNull(),
  ementa: text("ementa").notNull(),
  slug: text("slug").notNull(),
  dataPublicacao: date("data_publicacao").notNull(),
  ano: integer("ano").notNull(),
  conteudo: text("conteudo"),
  arquivoPdf: text("arquivo_pdf"),
  nomeArquivo: text("nome_arquivo"),
  status: text("status").notNull().default("publicado"),
  tags: text("tags").array().notNull().default([]),
  visualizacoes: integer("visualizacoes").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  assinadoEm: date("assinado_em"),
  revogadoEm: date("revogado_em"),
  revogadoPorId: text("revogado_por_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLegislacaoSchema = createInsertSchema(legislacaoTable).omit({ createdAt: true, updatedAt: true });
export type InsertLegislacao = z.infer<typeof insertLegislacaoSchema>;
export type Legislacao = typeof legislacaoTable.$inferSelect;
