import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { legislacaoTable } from "@workspace/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/legislacao
router.get("/cms/legislacao", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const tipo = req.query["tipo"] as string | undefined;
    const ano = req.query["ano"] as string | undefined;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions: ReturnType<typeof eq>[] = [eq(legislacaoTable.tenantId, tenantId)];
    if (tipo) conditions.push(eq(legislacaoTable.tipo, tipo));
    if (ano) conditions.push(eq(legislacaoTable.ano, parseInt(ano)));

    const where = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(legislacaoTable).where(where),
      db.select().from(legislacaoTable).where(where)
        .orderBy(desc(legislacaoTable.dataPublicacao))
        .limit(limit).offset(offset),
    ]);

    res.json({ data, total: total[0]?.count ?? 0, page, limit });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/legislacao
router.post("/cms/legislacao", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.numero || !b.tipo || !b.ementa || !b.dataPublicacao || !b.ano) {
      return res.status(400).json({ error: "numero, tipo, ementa, dataPublicacao e ano são obrigatórios" });
    }

    const slug = `${b.tipo}-${b.numero}-${b.ano}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const [leg] = await db.insert(legislacaoTable).values({
      id: randomUUID(), tenantId,
      numero: b.numero, tipo: b.tipo, ementa: b.ementa,
      slug: b.slug ?? slug, dataPublicacao: b.dataPublicacao, ano: b.ano,
      conteudo: b.conteudo ?? null, arquivoPdf: b.arquivoPdf ?? null,
      nomeArquivo: b.nomeArquivo ?? null, status: b.status ?? "publicado",
      tags: b.tags ?? [],
      assinadoEm: b.assinadoEm ?? null,
      revogadoEm: b.revogadoEm ?? null, revogadoPorId: b.revogadoPorId ?? null,
    }).returning();

    res.status(201).json(leg);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/legislacao/:id
router.put("/cms/legislacao/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [updated] = await db.update(legislacaoTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(and(eq(legislacaoTable.tenantId, tenantId), eq(legislacaoTable.id, req.params["id"]!)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Legislação não encontrada" });
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/legislacao/:id
router.delete("/cms/legislacao/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(legislacaoTable).where(
      and(eq(legislacaoTable.tenantId, tenantId), eq(legislacaoTable.id, req.params["id"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
