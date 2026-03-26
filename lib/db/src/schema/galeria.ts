import { pgTable, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

// ─── Galeria (tabela legada — mantida para compatibilidade) ───────────────────

export const galeriaTable = pgTable("galeria", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipo: text("tipo").notNull().default("foto"),
  thumbnail: text("thumbnail"),
  urlVideo: text("url_video"),
  fotos: jsonb("fotos").notNull().default([]),
  dataPublicacao: timestamp("data_publicacao").notNull().defaultNow(),
  categoria: text("categoria"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAlbumSchema = createInsertSchema(galeriaTable).omit({ createdAt: true });
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Album = typeof galeriaTable.$inferSelect;

// ─── Álbuns de Galeria ────────────────────────────────────────────────────────

export const galleryAlbumsTable = pgTable("gallery_albums", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  coverUrl: text("cover_url"),
  isPublico: boolean("is_publico").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGalleryAlbumSchema = createInsertSchema(galleryAlbumsTable).omit({ createdAt: true, updatedAt: true });
export type InsertGalleryAlbum = z.infer<typeof insertGalleryAlbumSchema>;
export type GalleryAlbum = typeof galleryAlbumsTable.$inferSelect;

// ─── Itens de Galeria ─────────────────────────────────────────────────────────

export const galleryItemsTable = pgTable("gallery_items", {
  id: text("id").primaryKey(),
  albumId: text("album_id").notNull().references(() => galleryAlbumsTable.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull().default("image"),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url"),
  altText: text("alt_text").notNull(),
  legenda: text("legenda"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItemsTable).omit({ createdAt: true });
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItemsTable.$inferSelect;
