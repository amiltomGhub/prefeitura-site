import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bannersTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/banners
router.get("/cms/banners", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(bannersTable)
      .where(eq(bannersTable.tenantId, tenantId))
      .orderBy(asc(bannersTable.sortOrder));

    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/banners
router.post("/cms/banners", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.titulo || !b.imageDesktopUrl || !b.imageAlt) {
      return res.status(400).json({ error: "titulo, imageDesktopUrl e imageAlt são obrigatórios" });
    }

    const [banner] = await db.insert(bannersTable).values({
      id: randomUUID(),
      tenantId,
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

    res.status(201).json(banner);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/banners/:id
router.put("/cms/banners/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    const [updated] = await db.update(bannersTable)
      .set({ ...b, updatedAt: new Date() })
      .where(and(eq(bannersTable.tenantId, tenantId), eq(bannersTable.id, req.params["id"]!)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Banner não encontrado" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /cms/banners/reorder — reordenar array de IDs
router.patch("/cms/banners/reorder", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) return res.status(400).json({ error: "ids deve ser um array" });

    await Promise.all(ids.map((id, index) =>
      db.update(bannersTable)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(and(eq(bannersTable.tenantId, tenantId), eq(bannersTable.id, id)))
    ));

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/banners/:id
router.delete("/cms/banners/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(bannersTable).where(
      and(eq(bannersTable.tenantId, tenantId), eq(bannersTable.id, req.params["id"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
