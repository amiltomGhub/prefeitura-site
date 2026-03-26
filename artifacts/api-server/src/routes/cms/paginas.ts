import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { pagesTable, pageBlocksTable } from "@workspace/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/paginas
router.get("/cms/paginas", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(pagesTable)
      .where(eq(pagesTable.tenantId, tenantId))
      .orderBy(desc(pagesTable.updatedAt));

    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/paginas/:id
router.get("/cms/paginas/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [page] = await db.select().from(pagesTable).where(
      and(eq(pagesTable.tenantId, tenantId), eq(pagesTable.id, req.params["id"]!))
    ).limit(1);

    if (!page) return res.status(404).json({ error: "Página não encontrada" });

    const blocks = await db.select().from(pageBlocksTable)
      .where(eq(pageBlocksTable.pageId, page.id))
      .orderBy(asc(pageBlocksTable.sortOrder));

    res.json({ ...page, blocks });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/paginas
router.post("/cms/paginas", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.titulo || !b.slug) return res.status(400).json({ error: "titulo e slug são obrigatórios" });

    const [page] = await db.insert(pagesTable).values({
      id: randomUUID(), tenantId, titulo: b.titulo, slug: b.slug,
      status: b.status ?? "rascunho", isProtegida: b.isProtegida ?? false,
      metaTitle: b.metaTitle ?? null, metaDescription: b.metaDescription ?? null,
      autor: b.autor ?? null,
    }).returning();

    res.status(201).json(page);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/paginas/:id
router.put("/cms/paginas/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    const [page] = await db.select().from(pagesTable).where(
      and(eq(pagesTable.tenantId, tenantId), eq(pagesTable.id, req.params["id"]!))
    ).limit(1);
    if (!page) return res.status(404).json({ error: "Página não encontrada" });
    if (page.isProtegida && b.slug) return res.status(400).json({ error: "Páginas protegidas não podem ter o slug alterado" });

    const [updated] = await db.update(pagesTable)
      .set({ ...b, updatedAt: new Date() })
      .where(and(eq(pagesTable.tenantId, tenantId), eq(pagesTable.id, req.params["id"]!)))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/paginas/:id
router.delete("/cms/paginas/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [page] = await db.select().from(pagesTable).where(
      and(eq(pagesTable.tenantId, tenantId), eq(pagesTable.id, req.params["id"]!))
    ).limit(1);
    if (!page) return res.status(404).json({ error: "Página não encontrada" });
    if (page.isProtegida) return res.status(403).json({ error: "Páginas protegidas não podem ser excluídas" });

    await db.delete(pagesTable).where(eq(pagesTable.id, req.params["id"]!));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/paginas/:id/blocos
router.post("/cms/paginas/:id/blocos", async (req, res) => {
  try {
    const b = req.body;
    if (!b.tipo) return res.status(400).json({ error: "tipo é obrigatório" });

    const [block] = await db.insert(pageBlocksTable).values({
      id: randomUUID(), pageId: req.params["id"]!,
      tipo: b.tipo, conteudo: b.conteudo ?? {}, sortOrder: b.sortOrder ?? 0,
    }).returning();

    res.status(201).json(block);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/blocos/:id
router.put("/cms/blocos/:id", async (req, res) => {
  try {
    const b = req.body;
    const [updated] = await db.update(pageBlocksTable)
      .set({ ...b, updatedAt: new Date() })
      .where(eq(pageBlocksTable.id, req.params["id"]!))
      .returning();

    if (!updated) return res.status(404).json({ error: "Bloco não encontrado" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/blocos/:id
router.delete("/cms/blocos/:id", async (req, res) => {
  try {
    await db.delete(pageBlocksTable).where(eq(pageBlocksTable.id, req.params["id"]!));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
