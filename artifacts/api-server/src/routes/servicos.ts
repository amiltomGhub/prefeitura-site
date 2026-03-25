import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { servicosTable, tenantsTable } from "@workspace/db/schema";
import { eq, and, count } from "drizzle-orm";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const t = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return t[0]?.id ?? null;
}

router.get("/servicos", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const categoria = req.query["categoria"] as string | undefined;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(servicosTable.tenantId, tenantId), eq(servicosTable.ativo, true)];
    if (categoria) conditions.push(eq(servicosTable.categoria, categoria));
    const whereClause = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(servicosTable).where(whereClause),
      db.select().from(servicosTable).where(whereClause).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/servicos/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const servico = await db.select().from(servicosTable).where(
      and(eq(servicosTable.tenantId, tenantId), eq(servicosTable.slug, req.params["slug"]!), eq(servicosTable.ativo, true))
    ).limit(1);

    if (!servico.length) return res.status(404).json({ error: "Serviço não encontrado" });
    res.json(servico[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
