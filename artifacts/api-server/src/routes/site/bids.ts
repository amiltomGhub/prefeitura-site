import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, licitacoesTable, bidEventsTable, contractsTable } from "@workspace/db/schema";
import { eq, and, desc, ilike, sql } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/bids?tenant=slug&status=&modalidade=&search=&page=1
 * Licitações com filtros completos
 */
router.get("/site/bids", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const status = req.query["status"] as string | undefined;
    const modalidade = req.query["modalidade"] as string | undefined;
    const search = req.query["search"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;
    const cacheKey = `site:bids:${tenantSlug}:${status ?? ""}:${modalidade ?? ""}:${search ?? ""}:${page}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      const conditions = [eq(licitacoesTable.tenantId, tenant.id)];
      if (status) conditions.push(eq(licitacoesTable.situacao, status));
      if (modalidade) conditions.push(eq(licitacoesTable.modalidade, modalidade));
      if (search) {
        conditions.push(
          sql`to_tsvector('portuguese', ${licitacoesTable.numero} || ' ' || ${licitacoesTable.objeto}) @@ plainto_tsquery('portuguese', ${search})`,
        );
      }

      const where = and(...conditions);
      const [countResult, rows] = await Promise.all([
        db.select({ total: sql<number>`count(*)::int` }).from(licitacoesTable).where(where),
        db.select().from(licitacoesTable).where(where).orderBy(desc(licitacoesTable.createdAt)).limit(limit).offset(offset),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
    });

    if (!result) return res.status(404).json({ error: "Tenant não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/site/bids/:id?tenant=slug
 * Detalhe da licitação + eventos + contrato vinculado
 */
router.get("/site/bids/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const id = req.params["id"]!;
    const cacheKey = `site:bids:detail:${tenantSlug}:${id}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      const [licitacao] = await db
        .select()
        .from(licitacoesTable)
        .where(and(eq(licitacoesTable.id, id), eq(licitacoesTable.tenantId, tenant.id)))
        .limit(1);
      if (!licitacao) return undefined;

      const [eventos, contratos] = await Promise.all([
        db.select().from(bidEventsTable).where(eq(bidEventsTable.licitacaoId, id)).orderBy(desc(bidEventsTable.ocorridoEm)),
        db.select().from(contractsTable).where(eq(contractsTable.licitacaoId, id)),
      ]);

      return { ...licitacao, eventos, contratos };
    });

    if (result === null) return res.status(404).json({ error: "Tenant não encontrado" });
    if (result === undefined) return res.status(404).json({ error: "Licitação não encontrada" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
