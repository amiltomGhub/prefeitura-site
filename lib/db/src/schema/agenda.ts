import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";
import { secretariasTable } from "./secretarias";

// ─── Agenda de Eventos ────────────────────────────────────────────────────────
// tipo: reuniao | evento | audiencia_publica | licitacao | sessao | visita | outro

export const agendaTable = pgTable("agenda", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipo: text("tipo").notNull().default("evento"),
  local: text("local"),
  endereco: text("endereco"),
  isOnline: boolean("is_online").notNull().default(false),
  onlineUrl: text("online_url"),
  dataInicio: timestamp("data_inicio").notNull(),
  dataFim: timestamp("data_fim"),
  diaInteiro: boolean("dia_inteiro").notNull().default(false),
  secretariaId: text("secretaria_id").references(() => secretariasTable.id),
  categoria: text("categoria"),
  publicoAlvo: text("publico_alvo"),
  isPublico: boolean("is_publico").notNull().default(true),
  gratuito: boolean("gratuito").notNull().default(true),
  linkInscricao: text("link_inscricao"),
  anexoUrl: text("anexo_url"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEventoSchema = createInsertSchema(agendaTable).omit({ createdAt: true, updatedAt: true });
export type InsertEvento = z.infer<typeof insertEventoSchema>;
export type Evento = typeof agendaTable.$inferSelect;
