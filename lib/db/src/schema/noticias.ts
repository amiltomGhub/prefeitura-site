import { pgTable, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const noticiasTable = pgTable("noticias", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  slug: text("slug").notNull(),
  resumo: text("resumo").notNull(),
  conteudo: text("conteudo").notNull(),
  imagemCapa: text("imagem_capa"),
  categoria: text("categoria").notNull(),
  autor: text("autor"),
  dataPublicacao: timestamp("data_publicacao").notNull().defaultNow(),
  destaque: boolean("destaque").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  visualizacoes: integer("visualizacoes").notNull().default(0),
  publicado: boolean("publicado").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNoticiaSchema = createInsertSchema(noticiasTable).omit({ createdAt: true, updatedAt: true });
export type InsertNoticia = z.infer<typeof insertNoticiaSchema>;
export type Noticia = typeof noticiasTable.$inferSelect;
