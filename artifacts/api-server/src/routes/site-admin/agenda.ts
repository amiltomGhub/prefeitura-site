import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, agendaTable } from "@workspace/db/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { cacheDelPattern } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /site-admin/agenda?month=&year=
router.get("/site-admin/agenda", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const now = new Date();
    const month = parseInt((req.query["month"] as string) ?? String(now.getMonth() + 1));
    const year = parseInt((req.query["year"] as string) ?? String(now.getFullYear()));

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const data = await db.select().from(agendaTable)
      .where(and(
        eq(agendaTable.tenantId, tenantId),
        gte(agendaTable.dataInicio, startOfMonth),
        lte(agendaTable.dataInicio, endOfMonth),
      ))
      .orderBy(asc(agendaTable.dataInicio));

    res.json({ data, month, year });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/agenda
router.post("/site-admin/agenda", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.titulo || !b.dataInicio) return res.status(400).json({ error: "titulo e dataInicio são obrigatórios" });

    const [evento] = await db.insert(agendaTable).values({
      id: randomUUID(), tenantId,
      titulo: b.titulo,
      descricao: b.descricao ?? null,
      tipo: b.tipo ?? "evento",
      local: b.local ?? null,
      endereco: b.endereco ?? null,
      isOnline: b.isOnline ?? false,
      onlineUrl: b.onlineUrl ?? null,
      dataInicio: new Date(b.dataInicio),
      dataFim: b.dataFim ? new Date(b.dataFim) : null,
      diaInteiro: b.diaInteiro ?? false,
      secretariaId: b.secretariaId ?? null,
      categoria: b.categoria ?? null,
      publicoAlvo: b.publicoAlvo ?? null,
      isPublico: b.isPublico ?? true,
      gratuito: b.gratuito ?? true,
      linkInscricao: b.linkInscricao ?? null,
      anexoUrl: b.anexoUrl ?? null,
      ativo: b.ativo ?? true,
    }).returning();

    cacheDelPattern(`site:agenda:`);
    res.status(201).json(evento);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /site-admin/agenda/:id
router.put("/site-admin/agenda/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ["titulo", "descricao", "tipo", "local", "endereco", "isOnline",
      "onlineUrl", "diaInteiro", "secretariaId", "categoria", "publicoAlvo",
      "isPublico", "gratuito", "linkInscricao", "anexoUrl", "ativo"];
    for (const f of fields) if (b[f] !== undefined) update[f] = b[f];
    if (b.dataInicio) update["dataInicio"] = new Date(b.dataInicio);
    if (b.dataFim !== undefined) update["dataFim"] = b.dataFim ? new Date(b.dataFim) : null;

    const [updated] = await db.update(agendaTable).set(update)
      .where(and(eq(agendaTable.id, req.params["id"]!), eq(agendaTable.tenantId, tenantId)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Evento não encontrado" });

    cacheDelPattern(`site:agenda:`);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /site-admin/agenda/:id
router.delete("/site-admin/agenda/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    await db.delete(agendaTable).where(and(eq(agendaTable.id, req.params["id"]!), eq(agendaTable.tenantId, tenantId)));

    cacheDelPattern(`site:agenda:`);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
