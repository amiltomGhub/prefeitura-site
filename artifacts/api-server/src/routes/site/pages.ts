import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, pagesTable, pageBlocksTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/pages/:slug?tenant=slug
 * Página estática com blocos de conteúdo
 */
router.get("/site/pages/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const slug = req.params["slug"]!;
    const cacheKey = `site:pages:${tenantSlug}:${slug}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      const [page] = await db
        .select()
        .from(pagesTable)
        .where(
          and(
            eq(pagesTable.tenantId, tenant.id),
            eq(pagesTable.slug, slug),
            eq(pagesTable.status, "publicado"),
          ),
        )
        .limit(1);

      if (!page) return undefined;

      const blocos = await db
        .select()
        .from(pageBlocksTable)
        .where(eq(pageBlocksTable.pageId, page.id))
        .orderBy(asc(pageBlocksTable.sortOrder));

      return { ...page, blocos };
    });

    if (result === null) return res.status(404).json({ error: "Tenant não encontrado" });
    if (result === undefined) return res.status(404).json({ error: "Página não encontrada" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
