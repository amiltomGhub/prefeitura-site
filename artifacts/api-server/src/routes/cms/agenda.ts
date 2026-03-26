import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { agendaTable } from "@workspace/db/schema";
import { eq, and, desc, count, gte } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/agenda
router.get("/cms/agenda", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const tipo = req.query["tipo"] as string | undefined;
    const upcoming = req.query["upcoming"] === "true";
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions: ReturnType<typeof eq>[] = [eq(agendaTable.tenantId, tenantId)];
    if (tipo) conditions.push(eq(agendaTable.tipo, tipo));
    if (upcoming) conditions.push(gte(agendaTable.dataInicio, new Date()));

    const where = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(agendaTable).where(where),
      db.select().from(agendaTable).where(where)
        .orderBy(desc(agendaTable.dataInicio))
        .limit(limit).offset(offset),
    ]);

    res.json({ data, total: total[0]?.count ?? 0, page, limit });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/agenda
router.post("/cms/agenda", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.titulo || !b.dataInicio) return res.status(400).json({ error: "titulo e dataInicio são obrigatórios" });

    const [evento] = await db.insert(agendaTable).values({
      id: randomUUID(), tenantId,
      titulo: b.titulo, descricao: b.descricao ?? null,
      tipo: b.tipo ?? "evento",
      local: b.local ?? null, endereco: b.endereco ?? null,
      isOnline: b.isOnline ?? false, onlineUrl: b.onlineUrl ?? null,
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

    res.status(201).json(evento);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/agenda/:id
router.put("/cms/agenda/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (b.dataInicio) b.dataInicio = new Date(b.dataInicio);
    if (b.dataFim) b.dataFim = new Date(b.dataFim);

    const [updated] = await db.update(agendaTable)
      .set({ ...b, updatedAt: new Date() })
      .where(and(eq(agendaTable.tenantId, tenantId), eq(agendaTable.id, req.params["id"]!)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Evento não encontrado" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/agenda/:id
router.delete("/cms/agenda/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(agendaTable).where(
      and(eq(agendaTable.tenantId, tenantId), eq(agendaTable.id, req.params["id"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
