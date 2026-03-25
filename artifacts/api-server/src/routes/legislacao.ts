import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { legislacaoTable, tenantsTable } from "@workspace/db/schema";
import { eq, and, count, desc, ilike } from "drizzle-orm";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const t = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return t[0]?.id ?? null;
}

router.get("/legislacao", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(legislacaoTable.tenantId, tenantId)];
    if (req.query["tipo"]) conditions.push(eq(legislacaoTable.tipo, req.query["tipo"] as string));
    if (req.query["ano"]) conditions.push(eq(legislacaoTable.ano, parseInt(req.query["ano"] as string)));
    const whereClause = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(legislacaoTable).where(whereClause),
      db.select().from(legislacaoTable).where(whereClause).orderBy(desc(legislacaoTable.dataPublicacao)).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/legislacao/:tipo/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const lei = await db.select().from(legislacaoTable).where(
      and(
        eq(legislacaoTable.tenantId, tenantId),
        eq(legislacaoTable.tipo, req.params["tipo"]!),
        eq(legislacaoTable.slug, req.params["slug"]!)
      )
    ).limit(1);

    if (!lei.length) return res.status(404).json({ error: "Legislação não encontrada" });
    res.json(lei[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
