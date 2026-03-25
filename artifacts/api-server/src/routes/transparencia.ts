import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { despesasTable, receitasTable, servidoresTable, orcamentosTable, tenantsTable } from "@workspace/db/schema";
import { eq, and, count, ilike } from "drizzle-orm";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const t = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return t[0]?.id ?? null;
}

router.get("/transparencia/orcamento", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const ano = parseInt((req.query["ano"] as string) ?? String(new Date().getFullYear()));
    const orcamento = await db.select().from(orcamentosTable).where(
      and(eq(orcamentosTable.tenantId, tenantId), eq(orcamentosTable.ano, ano))
    ).limit(1);

    if (!orcamento.length) {
      return res.json({
        ano,
        receitaPrevista: 0,
        receitaRealizada: 0,
        despesaPrevista: 0,
        despesaRealizada: 0,
        saldoAtual: 0,
        categorias: [],
      });
    }

    const orc = orcamento[0]!;
    const categorias = typeof orc.categorias === "string" ? JSON.parse(orc.categorias) : orc.categorias;
    res.json({ ...orc, categorias });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transparencia/despesas", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(despesasTable.tenantId, tenantId)];
    if (req.query["ano"]) conditions.push(eq(despesasTable.ano, parseInt(req.query["ano"] as string)));
    if (req.query["mes"]) conditions.push(eq(despesasTable.mes, parseInt(req.query["mes"] as string)));
    if (req.query["secretaria"]) conditions.push(eq(despesasTable.secretaria, req.query["secretaria"] as string));
    const whereClause = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(despesasTable).where(whereClause),
      db.select().from(despesasTable).where(whereClause).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transparencia/receitas", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(receitasTable.tenantId, tenantId)];
    if (req.query["ano"]) conditions.push(eq(receitasTable.ano, parseInt(req.query["ano"] as string)));
    const whereClause = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(receitasTable).where(whereClause),
      db.select().from(receitasTable).where(whereClause).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transparencia/servidores", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(servidoresTable.tenantId, tenantId)];
    if (req.query["secretaria"]) conditions.push(eq(servidoresTable.secretaria, req.query["secretaria"] as string));
    const whereClause = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(servidoresTable).where(whereClause),
      db.select().from(servidoresTable).where(whereClause).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
