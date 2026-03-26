import { pgTable, text, boolean, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

// ─── Páginas Estáticas ────────────────────────────────────────────────────────
// status: rascunho | publicado | arquivado

export const pagesTable = pgTable("pages", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  slug: text("slug").notNull(),
  status: text("status").notNull().default("rascunho"),
  isProtegida: boolean("is_protegida").notNull().default(false),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  autor: text("autor"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageSchema = createInsertSchema(pagesTable).omit({ createdAt: true, updatedAt: true });
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pagesTable.$inferSelect;

// ─── Blocos de Página ─────────────────────────────────────────────────────────
// tipo: texto | imagem | galeria | tabela | iframe | destaque | accordion | contato

export const pageBlocksTable = pgTable("page_blocks", {
  id: text("id").primaryKey(),
  pageId: text("page_id").notNull().references(() => pagesTable.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
  conteudo: jsonb("conteudo").notNull().default({}),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageBlockSchema = createInsertSchema(pageBlocksTable).omit({ createdAt: true, updatedAt: true });
export type InsertPageBlock = z.infer<typeof insertPageBlockSchema>;
export type PageBlock = typeof pageBlocksTable.$inferSelect;

// ─── Banners / Carrossel ──────────────────────────────────────────────────────

export const bannersTable = pgTable("banners", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  subtitulo: text("subtitulo"),
  imageDesktopUrl: text("image_desktop_url").notNull(),
  imageMobileUrl: text("image_mobile_url"),
  imageAlt: text("image_alt").notNull(),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  ctaAbreNovaAba: boolean("cta_abre_nova_aba").notNull().default(false),
  overlayColor: text("overlay_color"),
  overlayOpacity: real("overlay_opacity").notNull().default(0.4),
  isAtivo: boolean("is_ativo").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  iniciaEm: timestamp("inicia_em"),
  expiraEm: timestamp("expira_em"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBannerSchema = createInsertSchema(bannersTable).omit({ createdAt: true, updatedAt: true });
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof bannersTable.$inferSelect;

// ─── Documentos de Transparência (LAI) ───────────────────────────────────────

export const transparencyDocsTable = pgTable("transparency_docs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  categoria: text("categoria").notNull(),
  subcategoria: text("subcategoria"),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  anoReferencia: integer("ano_referencia").notNull(),
  periodoReferencia: text("periodo_referencia"),
  fileUrl: text("file_url").notNull(),
  nomeArquivo: text("nome_arquivo").notNull(),
  tamanhoBytes: integer("tamanho_bytes").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  publicadoPor: text("publicado_por").notNull(),
  publicadoEm: timestamp("publicado_em").notNull(),
  expiraEm: timestamp("expira_em"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransparencyDocSchema = createInsertSchema(transparencyDocsTable).omit({ createdAt: true });
export type InsertTransparencyDoc = z.infer<typeof insertTransparencyDocSchema>;
export type TransparencyDoc = typeof transparencyDocsTable.$inferSelect;

// ─── Itens de Menu ────────────────────────────────────────────────────────────
// menuSlot: header | footer_col1 | footer_col2 | footer_col3 | mobile
// tipo: pagina | url | secao | dropdown

export const menuItemsTable = pgTable("menu_items", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  menuSlot: text("menu_slot").notNull(),
  label: text("label").notNull(),
  url: text("url"),
  tipo: text("tipo").notNull().default("pagina"),
  abreNovaAba: boolean("abre_nova_aba").notNull().default(false),
  icone: text("icone"),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  isAtivo: boolean("is_ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ createdAt: true, updatedAt: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItemsTable.$inferSelect;

// ─── Configuração do Site ─────────────────────────────────────────────────────

export const siteConfigTable = pgTable("site_config", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().unique().references(() => tenantsTable.id),
  heroType: text("hero_type").notNull().default("carousel"),
  heroVideoUrl: text("hero_video_url"),
  heroSections: jsonb("hero_sections").notNull().default([]),
  siteTitle: text("site_title"),
  siteDescription: text("site_description"),
  googleAnalyticsId: text("google_analytics_id"),
  googleTagManagerId: text("google_tag_manager_id"),
  socialFacebook: text("social_facebook"),
  socialInstagram: text("social_instagram"),
  socialYoutube: text("social_youtube"),
  socialTwitter: text("social_twitter"),
  socialLinkedin: text("social_linkedin"),
  floatingWidgetEnabled: boolean("floating_widget_enabled").notNull().default(true),
  floatingWidgetPosition: text("floating_widget_position").notNull().default("right"),
  vlibrasEnabled: boolean("vlibras_enabled").notNull().default(true),
  rodapeTexto: text("rodape_texto"),
  sicPrazoResposta: integer("sic_prazo_resposta").notNull().default(20),
  sicEmail: text("sic_email"),
  modoManutencao: boolean("modo_manutencao").notNull().default(false),
  modoManutencaoMsg: text("modo_manutencao_msg"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfigTable).omit({ updatedAt: true });
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type SiteConfig = typeof siteConfigTable.$inferSelect;
