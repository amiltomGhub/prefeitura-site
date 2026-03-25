import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

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
