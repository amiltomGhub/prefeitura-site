import { pgTable, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";
import { secretariasTable } from "./secretarias";

// ─── Categorias de Notícias ───────────────────────────────────────────────────

export const newsCategoriesTable = pgTable("news_categories", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsCategorySchema = createInsertSchema(newsCategoriesTable).omit({ createdAt: true });
export type InsertNewsCategory = z.infer<typeof insertNewsCategorySchema>;
export type NewsCategory = typeof newsCategoriesTable.$inferSelect;

// ─── Notícias ─────────────────────────────────────────────────────────────────
// status: rascunho | agendado | publicado | arquivado

export const noticiasTable = pgTable("noticias", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  slug: text("slug").notNull(),
  resumo: text("resumo").notNull(),
  conteudo: text("conteudo").notNull(),
  imagemCapa: text("imagem_capa"),
  imagemCapaAlt: text("imagem_capa_alt"),
  categoria: text("categoria").notNull(),
  categoriaId: text("categoria_id").references(() => newsCategoriesTable.id),
  secretariaId: text("secretaria_id").references(() => secretariasTable.id),
  autor: text("autor"),
  status: text("status").notNull().default("rascunho"),
  publicado: boolean("publicado").notNull().default(true),
  destaque: boolean("destaque").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  visualizacoes: integer("visualizacoes").notNull().default(0),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImageUrl: text("og_image_url"),
  dataPublicacao: timestamp("data_publicacao").notNull().defaultNow(),
  agendadoEm: timestamp("agendado_em"),
  deletadoEm: timestamp("deletado_em"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNoticiaSchema = createInsertSchema(noticiasTable).omit({ createdAt: true, updatedAt: true });
export type InsertNoticia = z.infer<typeof insertNoticiaSchema>;
export type Noticia = typeof noticiasTable.$inferSelect;

// ─── Versões de Notícias ──────────────────────────────────────────────────────

export const newsVersionsTable = pgTable("news_versions", {
  id: text("id").primaryKey(),
  noticiaId: text("noticia_id").notNull().references(() => noticiasTable.id, { onDelete: "cascade" }),
  conteudo: text("conteudo").notNull(),
  savedBy: text("saved_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsVersionSchema = createInsertSchema(newsVersionsTable).omit({ createdAt: true });
export type InsertNewsVersion = z.infer<typeof insertNewsVersionSchema>;
export type NewsVersion = typeof newsVersionsTable.$inferSelect;
