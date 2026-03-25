import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, municipioInfoTable, gestoresTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/tenant/config", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? "default";
    const tenant = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
    if (!tenant.length) {
      const all = await db.select().from(tenantsTable).limit(1);
      if (!all.length) {
        return res.status(404).json({ error: "Tenant not found" });
      }
      return res.json(all[0]);
    }
    res.json(tenant[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/municipio/info", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? "default";
    const tenant = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
    const tenantId = tenant[0]?.id ?? "";
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });
    const info = await db.select().from(municipioInfoTable).where(eq(municipioInfoTable.tenantId, tenantId)).limit(1);
    if (!info.length) return res.status(404).json({ error: "Municipio info not found" });
    res.json(info[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/governo/prefeito", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? "default";
    const tenant = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
    const tenantId = tenant[0]?.id ?? "";
    const gestor = await db.select().from(gestoresTable).where(
      and(eq(gestoresTable.tenantId, tenantId), eq(gestoresTable.cargo, "Prefeito"), eq(gestoresTable.ativo, true))
    ).limit(1);
    if (!gestor.length) return res.status(404).json({ error: "Prefeito not found" });
    res.json(gestor[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/governo/vice-prefeito", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? "default";
    const tenant = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
    const tenantId = tenant[0]?.id ?? "";
    const gestor = await db.select().from(gestoresTable).where(
      and(eq(gestoresTable.tenantId, tenantId), eq(gestoresTable.cargo, "Vice-Prefeito"), eq(gestoresTable.ativo, true))
    ).limit(1);
    if (!gestor.length) return res.status(404).json({ error: "Vice-Prefeito not found" });
    res.json(gestor[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
