import { pgTable, text, integer, real, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenant";

export const despesasTable = pgTable("despesas", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  data: date("data").notNull(),
  descricao: text("descricao").notNull(),
  secretaria: text("secretaria").notNull(),
  categoria: text("categoria").notNull(),
  valor: real("valor").notNull(),
  beneficiario: text("beneficiario"),
  empenho: text("empenho"),
  modalidade: text("modalidade"),
  ano: integer("ano").notNull(),
  mes: integer("mes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDespesaSchema = createInsertSchema(despesasTable).omit({ createdAt: true });
export type InsertDespesa = z.infer<typeof insertDespesaSchema>;
export type Despesa = typeof despesasTable.$inferSelect;

export const receitasTable = pgTable("receitas", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  data: date("data").notNull(),
  descricao: text("descricao").notNull(),
  fonte: text("fonte").notNull(),
  categoria: text("categoria").notNull(),
  valor: real("valor").notNull(),
  ano: integer("ano").notNull(),
  mes: integer("mes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReceitaSchema = createInsertSchema(receitasTable).omit({ createdAt: true });
export type InsertReceita = z.infer<typeof insertReceitaSchema>;
export type Receita = typeof receitasTable.$inferSelect;

export const servidoresTable = pgTable("servidores", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  nome: text("nome").notNull(),
  cargo: text("cargo").notNull(),
  secretaria: text("secretaria").notNull(),
  vinculo: text("vinculo").notNull(),
  remuneracao: real("remuneracao"),
  admissao: date("admissao"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertServidorSchema = createInsertSchema(servidoresTable).omit({ createdAt: true });
export type InsertServidor = z.infer<typeof insertServidorSchema>;
export type Servidor = typeof servidoresTable.$inferSelect;

export const orcamentosTable = pgTable("orcamentos", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  ano: integer("ano").notNull(),
  receitaPrevista: real("receita_prevista").notNull().default(0),
  receitaRealizada: real("receita_realizada").notNull().default(0),
  despesaPrevista: real("despesa_prevista").notNull().default(0),
  despesaRealizada: real("despesa_realizada").notNull().default(0),
  saldoAtual: real("saldo_atual").notNull().default(0),
  categorias: text("categorias").notNull().default("[]"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrcamentoSchema = createInsertSchema(orcamentosTable).omit({ updatedAt: true });
export type InsertOrcamento = z.infer<typeof insertOrcamentoSchema>;
export type Orcamento = typeof orcamentosTable.$inferSelect;
