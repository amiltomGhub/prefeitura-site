import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, agendaTable } from "@workspace/db/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/agenda?tenant=slug&month=3&year=2026
 * Eventos do mês filtrado (ou próximos eventos se não especificado)
 */
router.get("/site/agenda", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const now = new Date();
    const month = parseInt((req.query["month"] as string) ?? String(now.getMonth() + 1));
    const year = parseInt((req.query["year"] as string) ?? String(now.getFullYear()));
    const cacheKey = `site:agenda:${tenantSlug}:${year}:${month}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      const eventos = await db
        .select()
        .from(agendaTable)
        .where(
          and(
            eq(agendaTable.tenantId, tenant.id),
            eq(agendaTable.isPublico, true),
            eq(agendaTable.ativo, true),
            gte(agendaTable.dataInicio, startOfMonth),
            lte(agendaTable.dataInicio, endOfMonth),
          ),
        )
        .orderBy(asc(agendaTable.dataInicio));

      return { data: eventos, month, year };
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
