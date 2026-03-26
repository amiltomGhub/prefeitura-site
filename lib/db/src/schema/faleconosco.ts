import { pgTable, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenant";

export const faleConoscoConfigTable = pgTable("fale_conosco_config", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }).unique(),
  habilitado: boolean("habilitado").notNull().default(true),
  nomeAssistente: text("nome_assistente").notNull().default("Assistente Municipal"),
  saudacao: text("saudacao").notNull().default("Olá! Como posso ajudar você hoje?"),
  systemPrompt: text("system_prompt").notNull().default("Você é um assistente virtual da Prefeitura Municipal. Responda de forma objetiva, cordial e em português brasileiro. Ajude os cidadãos com informações sobre serviços, transparência, ouvidoria e demais assuntos municipais. Não forneça informações que não sejam de sua competência."),
  modeloIA: text("modelo_ia").notNull().default("gpt-4o-mini"),
  temperatura: text("temperatura").notNull().default("0.7"),
  maxTokens: integer("max_tokens").notNull().default(500),
  avatarUrl: text("avatar_url"),
  corBotao: text("cor_botao").notNull().default("#1351B4"),
  temaWidget: text("tema_widget").notNull().default("light"),
  canaisAtivos: jsonb("canais_ativos").$type<{
    whatsapp?: string;
    telefone?: string;
    email?: string;
    ouvidoria?: boolean;
    sic?: boolean;
  }>().notNull().default({ ouvidoria: true, sic: true }),
  topicosProibidos: text("topicos_proibidos").array().notNull().default(["política partidária", "candidatos", "eleições"]),
  mensagemOffline: text("mensagem_offline").notNull().default("Nosso atendimento está temporariamente indisponível. Por favor, tente novamente mais tarde."),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type FaleConoscoConfig = typeof faleConoscoConfigTable.$inferSelect;
export type InsertFaleConoscoConfig = typeof faleConoscoConfigTable.$inferInsert;

export const chatSessionsTable = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  totalMensagens: integer("total_mensagens").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivityAt: timestamp("last_activity_at").notNull().defaultNow(),
});
