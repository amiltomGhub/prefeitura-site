import { pgTable, text, integer, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tenantsTable = pgTable("tenants", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  brasao: text("brasao"),
  corPrimaria: text("cor_primaria").notNull().default("#1351B4"),
  corSecundaria: text("cor_secundaria").notNull().default("#168821"),
  corTerciaria: text("cor_terciaria").notNull().default("#FFCD07"),
  estado: text("estado").notNull(),
  populacao: integer("populacao").notNull().default(0),
  area: real("area").notNull().default(0),
  fundacao: text("fundacao").notNull().default(""),
  lema: text("lema"),
  siteUrl: text("site_url").notNull().default(""),
  modulosAtivos: text("modulos_ativos").array().notNull().default(["site", "ouvidoria"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTenantSchema = createInsertSchema(tenantsTable).omit({ createdAt: true, updatedAt: true });
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenantsTable.$inferSelect;

export const municipioInfoTable = pgTable("municipio_info", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  nome: text("nome").notNull(),
  estado: text("estado").notNull(),
  regiao: text("regiao").notNull(),
  populacao: integer("populacao").notNull().default(0),
  area: real("area").notNull().default(0),
  altitude: real("altitude"),
  idh: real("idh"),
  pib: real("pib"),
  historia: text("historia"),
  simbolos: jsonb("simbolos"),
  localizacao: jsonb("localizacao"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMunicipioInfoSchema = createInsertSchema(municipioInfoTable).omit({ updatedAt: true });
export type InsertMunicipioInfo = z.infer<typeof insertMunicipioInfoSchema>;
export type MunicipioInfo = typeof municipioInfoTable.$inferSelect;

export const gestoresTable = pgTable("gestores", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  nome: text("nome").notNull(),
  cargo: text("cargo").notNull(),
  partido: text("partido"),
  mandato: text("mandato"),
  foto: text("foto"),
  bio: text("bio"),
  email: text("email"),
  redesSociais: jsonb("redes_sociais"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGestorSchema = createInsertSchema(gestoresTable).omit({ createdAt: true });
export type InsertGestor = z.infer<typeof insertGestorSchema>;
export type Gestor = typeof gestoresTable.$inferSelect;
