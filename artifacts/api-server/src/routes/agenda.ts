import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { agendaTable, tenantsTable } from "@workspace/db/schema";
import { eq, and, count, asc } from "drizzle-orm";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const t = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return t[0]?.id ?? null;
}

router.get("/agenda", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(agendaTable.tenantId, tenantId), eq(agendaTable.ativo, true)];
    const whereClause = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(agendaTable).where(whereClause),
      db.select().from(agendaTable).where(whereClause).orderBy(asc(agendaTable.dataInicio)).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
