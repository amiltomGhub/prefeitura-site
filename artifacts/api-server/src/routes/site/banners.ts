import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, bannersTable } from "@workspace/db/schema";
import { eq, and, lte, gte, or, isNull } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/banners?tenant=slug
 * Banners ativos ordenados por sortOrder, filtrando por período ativo
 */
router.get("/site/banners", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const cacheKey = `site:banners:${tenantSlug}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db
        .select({ id: tenantsTable.id })
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, tenantSlug))
        .limit(1);
      if (!tenant) return null;

      const now = new Date();

      const banners = await db
        .select()
        .from(bannersTable)
        .where(
          and(
            eq(bannersTable.tenantId, tenant.id),
            eq(bannersTable.isAtivo, true),
            or(isNull(bannersTable.iniciaEm), lte(bannersTable.iniciaEm, now)),
            or(isNull(bannersTable.expiraEm), gte(bannersTable.expiraEm, now)),
          ),
        )
        .orderBy(bannersTable.sortOrder);

      return banners;
    });

    if (result === null) return res.status(404).json({ error: "Tenant não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ data: result });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
