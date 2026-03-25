import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { secretariasTable, tenantsTable } from "@workspace/db/schema";
import { eq, and, count } from "drizzle-orm";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const t = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return t[0]?.id ?? null;
}

router.get("/secretarias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(secretariasTable).where(
      and(eq(secretariasTable.tenantId, tenantId), eq(secretariasTable.ativa, true))
    );

    res.json({ data, total: data.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/secretarias/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const secretaria = await db.select().from(secretariasTable).where(
      and(eq(secretariasTable.tenantId, tenantId), eq(secretariasTable.slug, req.params["slug"]!))
    ).limit(1);

    if (!secretaria.length) return res.status(404).json({ error: "Secretaria não encontrada" });
    res.json(secretaria[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
