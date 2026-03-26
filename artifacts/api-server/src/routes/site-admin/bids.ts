import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, licitacoesTable, bidEventsTable, contractsTable } from "@workspace/db/schema";
import { eq, and, desc, ilike } from "drizzle-orm";
import { randomUUID } from "crypto";
import { cacheDelPattern } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /site-admin/bids
router.get("/site-admin/bids", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const search = req.query["search"] as string | undefined;
    const status = req.query["status"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(licitacoesTable.tenantId, tenantId)];
    if (status) conditions.push(eq(licitacoesTable.situacao, status));
    if (search) conditions.push(ilike(licitacoesTable.objeto, `%${search}%`));

    const data = await db.select().from(licitacoesTable).where(and(...conditions))
      .orderBy(desc(licitacoesTable.createdAt)).limit(limit).offset(offset);

    res.json({ data, page });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/bids
router.post("/site-admin/bids", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.numero || !b.objeto || !b.modalidade) {
      return res.status(400).json({ error: "numero, objeto e modalidade são obrigatórios" });
    }

    const [licitacao] = await db.insert(licitacoesTable).values({
      id: randomUUID(), tenantId,
      numero: b.numero,
      objeto: b.objeto,
      modalidade: b.modalidade,
      situacao: b.situacao ?? "aberta",
      dataAbertura: b.dataAbertura ? new Date(b.dataAbertura) : null,
      dataEncerramento: b.dataEncerramento ? new Date(b.dataEncerramento) : null,
      valorEstimado: b.valorEstimado ?? null,
      valorHomologado: b.valorHomologado ?? null,
      secretaria: b.secretaria ?? null,
      secretariaId: b.secretariaId ?? null,
      edital: b.edital ?? null,
      editalUrl: b.editalUrl ?? null,
      resultUrl: b.resultUrl ?? null,
      descricao: b.descricao ?? null,
      vencedor: b.vencedor ?? null,
      vencedorCnpj: b.vencedorCnpj ?? null,
      pncpId: b.pncpId ?? null,
    }).returning();

    cacheDelPattern(`site:bids:`);
    res.status(201).json(licitacao);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /site-admin/bids/:id
router.put("/site-admin/bids/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ["numero", "objeto", "modalidade", "situacao", "valorEstimado", "valorHomologado",
      "secretaria", "secretariaId", "edital", "editalUrl", "resultUrl", "ata", "descricao",
      "vencedor", "vencedorCnpj", "pncpId"];
    for (const f of fields) if (b[f] !== undefined) update[f] = b[f];
    if (b.dataAbertura !== undefined) update["dataAbertura"] = b.dataAbertura ? new Date(b.dataAbertura) : null;
    if (b.dataEncerramento !== undefined) update["dataEncerramento"] = b.dataEncerramento ? new Date(b.dataEncerramento) : null;

    const [updated] = await db.update(licitacoesTable).set(update)
      .where(and(eq(licitacoesTable.id, req.params["id"]!), eq(licitacoesTable.tenantId, tenantId)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Licitação não encontrada" });

    cacheDelPattern(`site:bids:`);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/bids/:id/events — adicionar evento
router.post("/site-admin/bids/:id/events", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.titulo || !b.ocorridoEm) {
      return res.status(400).json({ error: "titulo e ocorridoEm são obrigatórios" });
    }

    // Verificar que licitação pertence ao tenant
    const [lic] = await db.select({ id: licitacoesTable.id }).from(licitacoesTable)
      .where(and(eq(licitacoesTable.id, req.params["id"]!), eq(licitacoesTable.tenantId, tenantId))).limit(1);
    if (!lic) return res.status(404).json({ error: "Licitação não encontrada" });

    const [evento] = await db.insert(bidEventsTable).values({
      id: randomUUID(),
      licitacaoId: req.params["id"]!,
      titulo: b.titulo,
      descricao: b.descricao ?? null,
      fileUrl: b.fileUrl ?? null,
      ocorridoEm: new Date(b.ocorridoEm),
    }).returning();

    cacheDelPattern(`site:bids:detail:`);
    res.status(201).json(evento);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/bids/:id/contracts — vincular contrato
router.post("/site-admin/bids/:id/contracts", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.numero || !b.objeto || !b.contratado || !b.cnpjContratado || !b.valor || !b.dataInicio || !b.dataFim) {
      return res.status(400).json({ error: "numero, objeto, contratado, cnpjContratado, valor, dataInicio e dataFim são obrigatórios" });
    }

    const [lic] = await db.select({ id: licitacoesTable.id }).from(licitacoesTable)
      .where(and(eq(licitacoesTable.id, req.params["id"]!), eq(licitacoesTable.tenantId, tenantId))).limit(1);
    if (!lic) return res.status(404).json({ error: "Licitação não encontrada" });

    const [contrato] = await db.insert(contractsTable).values({
      id: randomUUID(), tenantId,
      licitacaoId: req.params["id"]!,
      numero: b.numero,
      objeto: b.objeto,
      contratado: b.contratado,
      cnpjContratado: b.cnpjContratado,
      valor: parseFloat(b.valor),
      dataInicio: b.dataInicio,
      dataFim: b.dataFim,
      fileUrl: b.fileUrl ?? null,
      ativo: b.ativo ?? true,
      fiscalNome: b.fiscalNome ?? null,
    }).returning();

    cacheDelPattern(`site:bids:detail:`);
    res.status(201).json(contrato);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
