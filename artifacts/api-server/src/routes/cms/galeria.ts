import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { galleryAlbumsTable, galleryItemsTable } from "@workspace/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/albums
router.get("/cms/albums", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(galleryAlbumsTable)
      .where(eq(galleryAlbumsTable.tenantId, tenantId))
      .orderBy(desc(galleryAlbumsTable.createdAt));

    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/albums/:id
router.get("/cms/albums/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [album] = await db.select().from(galleryAlbumsTable).where(
      and(eq(galleryAlbumsTable.tenantId, tenantId), eq(galleryAlbumsTable.id, req.params["id"]!))
    ).limit(1);
    if (!album) return res.status(404).json({ error: "Álbum não encontrado" });

    const items = await db.select().from(galleryItemsTable)
      .where(eq(galleryItemsTable.albumId, album.id))
      .orderBy(asc(galleryItemsTable.sortOrder));

    res.json({ ...album, items });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/albums
router.post("/cms/albums", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.titulo) return res.status(400).json({ error: "titulo é obrigatório" });

    const [album] = await db.insert(galleryAlbumsTable).values({
      id: randomUUID(), tenantId, titulo: b.titulo,
      descricao: b.descricao ?? null, coverUrl: b.coverUrl ?? null,
      isPublico: b.isPublico ?? true, sortOrder: b.sortOrder ?? 0,
    }).returning();

    res.status(201).json(album);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/albums/:id
router.put("/cms/albums/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [updated] = await db.update(galleryAlbumsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(and(eq(galleryAlbumsTable.tenantId, tenantId), eq(galleryAlbumsTable.id, req.params["id"]!)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Álbum não encontrado" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/albums/:id
router.delete("/cms/albums/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(galleryAlbumsTable).where(
      and(eq(galleryAlbumsTable.tenantId, tenantId), eq(galleryAlbumsTable.id, req.params["id"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/albums/:id/itens
router.post("/cms/albums/:id/itens", async (req, res) => {
  try {
    const b = req.body;
    if (!b.url || !b.altText) return res.status(400).json({ error: "url e altText são obrigatórios" });

    const [item] = await db.insert(galleryItemsTable).values({
      id: randomUUID(), albumId: req.params["id"]!,
      tipo: b.tipo ?? "image", url: b.url, thumbUrl: b.thumbUrl ?? null,
      altText: b.altText, legenda: b.legenda ?? null, sortOrder: b.sortOrder ?? 0,
    }).returning();

    res.status(201).json(item);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/itens/:id
router.delete("/cms/itens/:id", async (req, res) => {
  try {
    await db.delete(galleryItemsTable).where(eq(galleryItemsTable.id, req.params["id"]!));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /cms/albums/:id/reorder
router.patch("/cms/albums/:id/reorder", async (req, res) => {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) return res.status(400).json({ error: "ids deve ser um array" });

    await Promise.all(ids.map((id, index) =>
      db.update(galleryItemsTable).set({ sortOrder: index }).where(eq(galleryItemsTable.id, id))
    ));

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
