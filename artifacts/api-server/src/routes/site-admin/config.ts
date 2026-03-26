import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, siteConfigTable, menuItemsTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { cacheDelPattern } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /site-admin/config
router.get("/site-admin/config", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    let [config] = await db.select().from(siteConfigTable).where(eq(siteConfigTable.tenantId, tenantId)).limit(1);

    // Auto-cria configuração padrão se não existir
    if (!config) {
      const id = randomUUID();
      [config] = await db.insert(siteConfigTable).values({ id, tenantId }).returning();
    }

    const menus = await db.select().from(menuItemsTable)
      .where(eq(menuItemsTable.tenantId, tenantId))
      .orderBy(asc(menuItemsTable.sortOrder));

    const menuBySlot = menus.reduce((acc, item) => {
      if (!acc[item.menuSlot]) acc[item.menuSlot] = [];
      acc[item.menuSlot]!.push(item);
      return acc;
    }, {} as Record<string, typeof menus>);

    res.json({ config, menus: menuBySlot });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /site-admin/config — salva configurações gerais
router.put("/site-admin/config", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    const fields = [
      "heroType", "heroVideoUrl", "heroSections", "siteTitle", "siteDescription",
      "googleAnalyticsId", "googleTagManagerId",
      "socialFacebook", "socialInstagram", "socialYoutube", "socialTwitter", "socialLinkedin",
      "floatingWidgetEnabled", "floatingWidgetPosition", "vlibrasEnabled",
      "rodapeTexto", "sicPrazoResposta", "sicEmail",
      "modoManutencao", "modoManutencaoMsg",
    ];
    for (const f of fields) if (b[f] !== undefined) update[f] = b[f];

    // Upsert
    const [existing] = await db.select({ id: siteConfigTable.id }).from(siteConfigTable)
      .where(eq(siteConfigTable.tenantId, tenantId)).limit(1);

    let config;
    if (existing) {
      [config] = await db.update(siteConfigTable).set(update)
        .where(eq(siteConfigTable.id, existing.id)).returning();
    } else {
      [config] = await db.insert(siteConfigTable).values({ id: randomUUID(), tenantId, ...update }).returning();
    }

    cacheDelPattern(`site:config:${tenantSlug}`);
    res.json(config);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /site-admin/config/menus — salva estrutura de menus
// Body: { menuSlot: string, items: { label, url, tipo, abreNovaAba, icone, parentId, sortOrder }[] }
router.put("/site-admin/config/menus", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const { menuSlot, items } = req.body;
    if (!menuSlot || !Array.isArray(items)) {
      return res.status(400).json({ error: "menuSlot e items são obrigatórios" });
    }

    // Deletar itens existentes do slot e reinserir
    await db.delete(menuItemsTable)
      .where(and(eq(menuItemsTable.tenantId, tenantId), eq(menuItemsTable.menuSlot, menuSlot)));

    if (items.length > 0) {
      await db.insert(menuItemsTable).values(
        items.map((item: Record<string, unknown>, idx: number) => ({
          id: randomUUID(),
          tenantId,
          menuSlot,
          label: item["label"] as string,
          url: (item["url"] as string) ?? null,
          tipo: (item["tipo"] as string) ?? "pagina",
          abreNovaAba: (item["abreNovaAba"] as boolean) ?? false,
          icone: (item["icone"] as string) ?? null,
          parentId: (item["parentId"] as string) ?? null,
          sortOrder: (item["sortOrder"] as number) ?? idx,
          isAtivo: (item["isAtivo"] as boolean) ?? true,
        })),
      );
    }

    cacheDelPattern(`site:config:${tenantSlug}`);
    const saved = await db.select().from(menuItemsTable)
      .where(and(eq(menuItemsTable.tenantId, tenantId), eq(menuItemsTable.menuSlot, menuSlot)))
      .orderBy(asc(menuItemsTable.sortOrder));

    res.json({ menuSlot, items: saved });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
