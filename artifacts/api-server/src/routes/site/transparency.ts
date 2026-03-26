import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  tenantsTable,
  transparencyDocsTable,
  despesasTable,
  receitasTable,
  servidoresTable,
  orcamentosTable,
} from "@workspace/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

const VALID_CATEGORIES = [
  "orcamento", "receitas", "despesas", "servidores",
  "convenios", "atas", "dados-abertos",
];

/**
 * GET /api/site/transparency/:category?tenant=slug&year=&period=
 * Documentos da transparência por categoria (LAI)
 */
router.get("/site/transparency/:category", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const category = req.params["category"]!.toLowerCase();
    const year = req.query["year"] ? parseInt(req.query["year"] as string) : undefined;
    const period = req.query["period"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = 20;
    const offset = (page - 1) * limit;

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: "Categoria inválida",
        valid: VALID_CATEGORIES,
      });
    }

    const cacheKey = `site:transparency:${tenantSlug}:${category}:${year ?? ""}:${period ?? ""}:${page}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      // Para categorias com dados estruturados, retornar dados da tabela específica
      if (category === "despesas") {
        const conditions = [eq(despesasTable.tenantId, tenant.id)];
        if (year) conditions.push(eq(despesasTable.ano, year));
        if (period) conditions.push(eq(despesasTable.mes, parseInt(period)));
        const rows = await db.select().from(despesasTable).where(and(...conditions))
          .orderBy(desc(despesasTable.data)).limit(limit).offset(offset);
        return { type: "structured", category, data: rows, page };
      }

      if (category === "receitas") {
        const conditions = [eq(receitasTable.tenantId, tenant.id)];
        if (year) conditions.push(eq(receitasTable.ano, year));
        if (period) conditions.push(eq(receitasTable.mes, parseInt(period)));
        const rows = await db.select().from(receitasTable).where(and(...conditions))
          .orderBy(desc(receitasTable.data)).limit(limit).offset(offset);
        return { type: "structured", category, data: rows, page };
      }

      if (category === "servidores") {
        const rows = await db.select().from(servidoresTable)
          .where(eq(servidoresTable.tenantId, tenant.id))
          .orderBy(servidoresTable.nome).limit(limit).offset(offset);
        return { type: "structured", category, data: rows, page };
      }

      if (category === "orcamento") {
        const conditions = [eq(orcamentosTable.tenantId, tenant.id)];
        if (year) conditions.push(eq(orcamentosTable.ano, year));
        const rows = await db.select().from(orcamentosTable).where(and(...conditions));
        return { type: "structured", category, data: rows, page };
      }

      // Para outras categorias: buscar documentos LAI
      const docConditions = [
        eq(transparencyDocsTable.tenantId, tenant.id),
        eq(transparencyDocsTable.categoria, category),
      ];
      if (year) docConditions.push(eq(transparencyDocsTable.anoReferencia, year));
      if (period) docConditions.push(eq(transparencyDocsTable.periodoReferencia, period));

      const where = and(...docConditions);
      const [countResult, docs] = await Promise.all([
        db.select({ total: sql<number>`count(*)::int` }).from(transparencyDocsTable).where(where),
        db.select().from(transparencyDocsTable).where(where)
          .orderBy(desc(transparencyDocsTable.publicadoEm)).limit(limit).offset(offset),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { type: "documents", category, data: docs, total, page, totalPages: Math.ceil(total / limit) };
    });

    if (!result) return res.status(404).json({ error: "Tenant não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
