import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/menus — retorna todos os menus agrupados por slot
router.get("/cms/menus", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const items = await db.select().from(menuItemsTable)
      .where(eq(menuItemsTable.tenantId, tenantId))
      .orderBy(asc(menuItemsTable.sortOrder));

    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      if (!grouped[item.menuSlot]) grouped[item.menuSlot] = [];
      grouped[item.menuSlot]!.push(item);
    }

    res.json({ data: grouped });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/menus/:slot — itens de um slot específico
router.get("/cms/menus/:slot", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(menuItemsTable)
      .where(and(eq(menuItemsTable.tenantId, tenantId), eq(menuItemsTable.menuSlot, req.params["slot"]!)))
      .orderBy(asc(menuItemsTable.sortOrder));

    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/menus
router.post("/cms/menus", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.menuSlot || !b.label) return res.status(400).json({ error: "menuSlot e label são obrigatórios" });

    const [item] = await db.insert(menuItemsTable).values({
      id: randomUUID(), tenantId,
      menuSlot: b.menuSlot, label: b.label, url: b.url ?? null,
      tipo: b.tipo ?? "pagina", abreNovaAba: b.abreNovaAba ?? false,
      icone: b.icone ?? null, parentId: b.parentId ?? null,
      sortOrder: b.sortOrder ?? 0, isAtivo: b.isAtivo ?? true,
    }).returning();

    res.status(201).json(item);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/menus/:id
router.put("/cms/menus/:id", async (req, res) => {
  try {
    const b = req.body;
    const [updated] = await db.update(menuItemsTable)
      .set({ ...b, updatedAt: new Date() })
      .where(eq(menuItemsTable.id, req.params["id"]!))
      .returning();

    if (!updated) return res.status(404).json({ error: "Item de menu não encontrado" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /cms/menus/:slot/reorder
router.patch("/cms/menus/:slot/reorder", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) return res.status(400).json({ error: "ids deve ser um array" });

    await Promise.all(ids.map((id, index) =>
      db.update(menuItemsTable)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(and(eq(menuItemsTable.tenantId, tenantId), eq(menuItemsTable.id, id)))
    ));

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/menus/:id
router.delete("/cms/menus/:id", async (req, res) => {
  try {
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, req.params["id"]!));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
