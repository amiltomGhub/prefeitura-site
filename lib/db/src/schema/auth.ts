import { pgTable, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenant";

export const usuariosTable = pgTable("usuarios", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  cargo: text("cargo"),
  avatar: text("avatar"),
  modulosPermitidos: text("modulos_permitidos").array().notNull().default(["site"]),
  permissoes: jsonb("permissoes").$type<Record<string, string[]>>().notNull().default({}),
  isAdmin: boolean("is_admin").notNull().default(false),
  isAtivo: boolean("is_ativo").notNull().default(true),
  ultimoAcesso: timestamp("ultimo_acesso"),
  // Vínculo opcional ao cadastro do servidor (Portal do Servidor)
  servidorId: text("servidor_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Usuario = typeof usuariosTable.$inferSelect;
export type InsertUsuario = typeof usuariosTable.$inferInsert;

export const refreshTokensTable = pgTable("refresh_tokens", {
  id: text("id").primaryKey(),
  usuarioId: text("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type RefreshToken = typeof refreshTokensTable.$inferSelect;
