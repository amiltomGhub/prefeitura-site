import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, legislacaoTable } from "@workspace/db/schema";
import { eq, and, desc, ilike, sql } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/legislation?tenant=slug&type=&year=&search=&page=1
 * Atos normativos publicados com filtros
 */
router.get("/site/legislation", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const type = req.query["type"] as string | undefined;
    const year = req.query["year"] ? parseInt(req.query["year"] as string) : undefined;
    const search = req.query["search"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;
    const cacheKey = `site:legislation:${tenantSlug}:${type ?? ""}:${year ?? ""}:${search ?? ""}:${page}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      const conditions = [
        eq(legislacaoTable.tenantId, tenant.id),
        eq(legislacaoTable.status, "publicado"),
      ];
      if (type) conditions.push(eq(legislacaoTable.tipo, type));
      if (year) conditions.push(eq(legislacaoTable.ano, year));
      if (search) {
        conditions.push(
          sql`to_tsvector('portuguese', ${legislacaoTable.numero} || ' ' || ${legislacaoTable.ementa}) @@ plainto_tsquery('portuguese', ${search})`,
        );
      }

      const where = and(...conditions);
      const [countResult, rows] = await Promise.all([
        db.select({ total: sql<number>`count(*)::int` }).from(legislacaoTable).where(where),
        db.select().from(legislacaoTable).where(where).orderBy(desc(legislacaoTable.dataPublicacao)).limit(limit).offset(offset),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
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
