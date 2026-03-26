import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { siteConfigTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/site-config
router.get("/cms/site-config", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    let [config] = await db.select().from(siteConfigTable)
      .where(eq(siteConfigTable.tenantId, tenantId)).limit(1);

    if (!config) {
      [config] = await db.insert(siteConfigTable).values({
        id: randomUUID(), tenantId,
      }).returning();
    }

    res.json(config);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/site-config
router.put("/cms/site-config", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    const [existing] = await db.select().from(siteConfigTable)
      .where(eq(siteConfigTable.tenantId, tenantId)).limit(1);

    if (existing) {
      const [updated] = await db.update(siteConfigTable)
        .set({ ...b, updatedAt: new Date() })
        .where(eq(siteConfigTable.tenantId, tenantId))
        .returning();
      return res.json(updated);
    }

    const [created] = await db.insert(siteConfigTable).values({
      id: randomUUID(), tenantId, ...b,
    }).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
