import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, siteConfigTable, menuItemsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

async function getTenantId(slug: string) {
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0] ?? null;
}

/**
 * GET /api/site/config?tenant=slug
 * Configurações visuais + menus + redes sociais do tenant
 */
router.get("/site/config", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const cacheKey = `site:config:${tenantSlug}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const tenant = await getTenantId(tenantSlug);
      if (!tenant) return null;

      const [config] = await db
        .select()
        .from(siteConfigTable)
        .where(eq(siteConfigTable.tenantId, tenant.id))
        .limit(1);

      const menus = await db
        .select()
        .from(menuItemsTable)
        .where(and(eq(menuItemsTable.tenantId, tenant.id), eq(menuItemsTable.isAtivo, true)))
        .orderBy(menuItemsTable.sortOrder);

      const menuBySlot = menus.reduce(
        (acc, item) => {
          const slot = item.menuSlot;
          if (!acc[slot]) acc[slot] = [];
          acc[slot]!.push(item);
          return acc;
        },
        {} as Record<string, typeof menus>,
      );

      return {
        tenant: {
          id: tenant.id,
          slug: tenant.slug,
          nome: tenant.nome,
          estado: tenant.estado,
          brasao: tenant.brasao,
          tema: tenant.tema,
        },
        config: config ?? null,
        menus: menuBySlot,
        social: config
          ? {
              facebook: config.socialFacebook,
              instagram: config.socialInstagram,
              youtube: config.socialYoutube,
              twitter: config.socialTwitter,
              linkedin: config.socialLinkedin,
            }
          : {},
      };
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
