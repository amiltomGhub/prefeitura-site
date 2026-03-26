import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, bannersTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { cacheDelPattern } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /site-admin/banners
router.get("/site-admin/banners", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const data = await db.select().from(bannersTable)
      .where(eq(bannersTable.tenantId, tenantId))
      .orderBy(asc(bannersTable.sortOrder));
    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/banners
router.post("/site-admin/banners", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.titulo || !b.imageDesktopUrl || !b.imageAlt) {
      return res.status(400).json({ error: "titulo, imageDesktopUrl e imageAlt são obrigatórios" });
    }

    const [banner] = await db.insert(bannersTable).values({
      id: randomUUID(), tenantId,
      titulo: b.titulo,
      subtitulo: b.subtitulo ?? null,
      imageDesktopUrl: b.imageDesktopUrl,
      imageMobileUrl: b.imageMobileUrl ?? null,
      imageAlt: b.imageAlt,
      ctaLabel: b.ctaLabel ?? null,
      ctaUrl: b.ctaUrl ?? null,
      ctaAbreNovaAba: b.ctaAbreNovaAba ?? false,
      overlayColor: b.overlayColor ?? null,
      overlayOpacity: b.overlayOpacity ?? 0.4,
      isAtivo: b.isAtivo ?? true,
      sortOrder: b.sortOrder ?? 0,
      iniciaEm: b.iniciaEm ? new Date(b.iniciaEm) : null,
      expiraEm: b.expiraEm ? new Date(b.expiraEm) : null,
    }).returning();

    cacheDelPattern(`site:banners:${tenantSlug}`);
    res.status(201).json(banner);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /site-admin/banners/:id
router.put("/site-admin/banners/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ["titulo", "subtitulo", "imageDesktopUrl", "imageMobileUrl", "imageAlt",
      "ctaLabel", "ctaUrl", "ctaAbreNovaAba", "overlayColor", "overlayOpacity", "isAtivo", "sortOrder"];
    for (const f of fields) if (b[f] !== undefined) update[f] = b[f];
    if (b.iniciaEm !== undefined) update["iniciaEm"] = b.iniciaEm ? new Date(b.iniciaEm) : null;
    if (b.expiraEm !== undefined) update["expiraEm"] = b.expiraEm ? new Date(b.expiraEm) : null;

    const [updated] = await db.update(bannersTable).set(update)
      .where(and(eq(bannersTable.id, req.params["id"]!), eq(bannersTable.tenantId, tenantId)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Banner não encontrado" });

    cacheDelPattern(`site:banners:${tenantSlug}`);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /site-admin/banners/reorder — { orderedIds: string[] }
router.patch("/site-admin/banners/reorder", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: "orderedIds deve ser um array" });

    await Promise.all(
      orderedIds.map((id: string, idx: number) =>
        db.update(bannersTable).set({ sortOrder: idx, updatedAt: new Date() })
          .where(and(eq(bannersTable.id, id), eq(bannersTable.tenantId, tenantId))),
      ),
    );

    cacheDelPattern(`site:banners:${tenantSlug}`);
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /site-admin/banners/:id
router.delete("/site-admin/banners/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    await db.delete(bannersTable).where(and(eq(bannersTable.id, req.params["id"]!), eq(bannersTable.tenantId, tenantId)));

    cacheDelPattern(`site:banners:${tenantSlug}`);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
