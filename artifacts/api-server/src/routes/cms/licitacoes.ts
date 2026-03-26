import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { licitacoesTable, bidEventsTable, contractsTable } from "@workspace/db/schema";
import { eq, and, desc, count, asc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/licitacoes
router.get("/cms/licitacoes", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const situacao = req.query["situacao"] as string | undefined;
    const modalidade = req.query["modalidade"] as string | undefined;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions: ReturnType<typeof eq>[] = [eq(licitacoesTable.tenantId, tenantId)];
    if (situacao) conditions.push(eq(licitacoesTable.situacao, situacao));
    if (modalidade) conditions.push(eq(licitacoesTable.modalidade, modalidade));

    const where = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(licitacoesTable).where(where),
      db.select().from(licitacoesTable).where(where)
        .orderBy(desc(licitacoesTable.createdAt))
        .limit(limit).offset(offset),
    ]);

    res.json({ data, total: total[0]?.count ?? 0, page, limit });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/licitacoes/:id — com eventos e contratos
router.get("/cms/licitacoes/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [lic] = await db.select().from(licitacoesTable).where(
      and(eq(licitacoesTable.tenantId, tenantId), eq(licitacoesTable.id, req.params["id"]!))
    ).limit(1);
    if (!lic) return res.status(404).json({ error: "Licitação não encontrada" });

    const [events, contracts] = await Promise.all([
      db.select().from(bidEventsTable).where(eq(bidEventsTable.licitacaoId, lic.id)).orderBy(desc(bidEventsTable.ocorridoEm)),
      db.select().from(contractsTable).where(eq(contractsTable.licitacaoId, lic.id)).orderBy(asc(contractsTable.dataInicio)),
    ]);

    res.json({ ...lic, events, contracts });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/licitacoes
router.post("/cms/licitacoes", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.numero || !b.objeto || !b.modalidade) {
      return res.status(400).json({ error: "numero, objeto e modalidade são obrigatórios" });
    }

    const [lic] = await db.insert(licitacoesTable).values({
      id: randomUUID(), tenantId,
      numero: b.numero, objeto: b.objeto, modalidade: b.modalidade,
      situacao: b.situacao ?? "aberta",
      dataAbertura: b.dataAbertura ? new Date(b.dataAbertura) : null,
      dataEncerramento: b.dataEncerramento ? new Date(b.dataEncerramento) : null,
      valorEstimado: b.valorEstimado ?? null, valorHomologado: b.valorHomologado ?? null,
      secretaria: b.secretaria ?? null, secretariaId: b.secretariaId ?? null,
      edital: b.edital ?? null, editalUrl: b.editalUrl ?? null,
      resultUrl: b.resultUrl ?? null, ata: b.ata ?? null, descricao: b.descricao ?? null,
      vencedor: b.vencedor ?? null, vencedorCnpj: b.vencedorCnpj ?? null,
      pncpId: b.pncpId ?? null,
    }).returning();

    res.status(201).json(lic);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/licitacoes/:id
router.put("/cms/licitacoes/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [updated] = await db.update(licitacoesTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(and(eq(licitacoesTable.tenantId, tenantId), eq(licitacoesTable.id, req.params["id"]!)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Licitação não encontrada" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/licitacoes/:id
router.delete("/cms/licitacoes/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(licitacoesTable).where(
      and(eq(licitacoesTable.tenantId, tenantId), eq(licitacoesTable.id, req.params["id"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/licitacoes/:id/eventos
router.post("/cms/licitacoes/:id/eventos", async (req, res) => {
  try {
    const b = req.body;
    if (!b.titulo || !b.ocorridoEm) return res.status(400).json({ error: "titulo e ocorridoEm são obrigatórios" });

    const [event] = await db.insert(bidEventsTable).values({
      id: randomUUID(), licitacaoId: req.params["id"]!,
      titulo: b.titulo, descricao: b.descricao ?? null,
      fileUrl: b.fileUrl ?? null, ocorridoEm: new Date(b.ocorridoEm),
    }).returning();

    res.status(201).json(event);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/contratos
router.post("/cms/contratos", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.numero || !b.objeto || !b.contratado || !b.cnpjContratado || !b.valor || !b.dataInicio || !b.dataFim) {
      return res.status(400).json({ error: "Campos obrigatórios: numero, objeto, contratado, cnpjContratado, valor, dataInicio, dataFim" });
    }

    const [contract] = await db.insert(contractsTable).values({
      id: randomUUID(), tenantId,
      licitacaoId: b.licitacaoId ?? null,
      numero: b.numero, objeto: b.objeto, contratado: b.contratado,
      cnpjContratado: b.cnpjContratado, valor: b.valor,
      dataInicio: b.dataInicio, dataFim: b.dataFim,
      fileUrl: b.fileUrl ?? null, ativo: b.ativo ?? true,
      fiscalNome: b.fiscalNome ?? null,
    }).returning();

    res.status(201).json(contract);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/contratos
router.get("/cms/contratos", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(contractsTable)
      .where(eq(contractsTable.tenantId, tenantId))
      .orderBy(desc(contractsTable.createdAt));

    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
