import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, galleryAlbumsTable, galleryItemsTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/gallery?tenant=slug&albumId=&page=1
 * Álbuns públicos ou itens de um álbum específico
 */
router.get("/site/gallery", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const albumId = req.query["albumId"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = 20;
    const offset = (page - 1) * limit;
    const cacheKey = `site:gallery:${tenantSlug}:${albumId ?? "albums"}:${page}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      if (albumId) {
        // Verificar se álbum pertence ao tenant e é público
        const [album] = await db
          .select()
          .from(galleryAlbumsTable)
          .where(and(eq(galleryAlbumsTable.id, albumId), eq(galleryAlbumsTable.tenantId, tenant.id), eq(galleryAlbumsTable.isPublico, true)))
          .limit(1);
        if (!album) return { type: "not_found" as const };

        const items = await db
          .select()
          .from(galleryItemsTable)
          .where(eq(galleryItemsTable.albumId, albumId))
          .orderBy(asc(galleryItemsTable.sortOrder))
          .limit(limit)
          .offset(offset);

        return { type: "items" as const, album, data: items, page };
      }

      // Lista de álbuns
      const albums = await db
        .select()
        .from(galleryAlbumsTable)
        .where(and(eq(galleryAlbumsTable.tenantId, tenant.id), eq(galleryAlbumsTable.isPublico, true)))
        .orderBy(asc(galleryAlbumsTable.sortOrder))
        .limit(limit)
        .offset(offset);

      return { type: "albums" as const, data: albums, page };
    });

    if (!result) return res.status(404).json({ error: "Tenant não encontrado" });
    if (result.type === "not_found") return res.status(404).json({ error: "Álbum não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
