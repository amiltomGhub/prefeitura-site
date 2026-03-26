import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { transparencyDocsTable } from "@workspace/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/documentos-lai
router.get("/cms/documentos-lai", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const categoria = req.query["categoria"] as string | undefined;
    const ano = req.query["ano"] as string | undefined;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions: ReturnType<typeof eq>[] = [eq(transparencyDocsTable.tenantId, tenantId)];
    if (categoria) conditions.push(eq(transparencyDocsTable.categoria, categoria));
    if (ano) conditions.push(eq(transparencyDocsTable.anoReferencia, parseInt(ano)));

    const where = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(transparencyDocsTable).where(where),
      db.select().from(transparencyDocsTable).where(where)
        .orderBy(desc(transparencyDocsTable.publicadoEm))
        .limit(limit).offset(offset),
    ]);

    res.json({ data, total: total[0]?.count ?? 0, page, limit });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/documentos-lai
router.post("/cms/documentos-lai", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.categoria || !b.titulo || !b.fileUrl || !b.nomeArquivo || !b.anoReferencia) {
      return res.status(400).json({ error: "categoria, titulo, fileUrl, nomeArquivo e anoReferencia são obrigatórios" });
    }

    const [doc] = await db.insert(transparencyDocsTable).values({
      id: randomUUID(),
      tenantId,
      categoria: b.categoria,
      subcategoria: b.subcategoria ?? null,
      titulo: b.titulo,
      descricao: b.descricao ?? null,
      anoReferencia: b.anoReferencia,
      periodoReferencia: b.periodoReferencia ?? null,
      fileUrl: b.fileUrl,
      nomeArquivo: b.nomeArquivo,
      tamanhoBytes: b.tamanhoBytes ?? 0,
      publicadoPor: b.publicadoPor ?? "admin",
      publicadoEm: b.publicadoEm ? new Date(b.publicadoEm) : new Date(),
      expiraEm: b.expiraEm ? new Date(b.expiraEm) : null,
    }).returning();

    res.status(201).json(doc);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/documentos-lai/:id
router.delete("/cms/documentos-lai/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(transparencyDocsTable).where(
      and(eq(transparencyDocsTable.tenantId, tenantId), eq(transparencyDocsTable.id, req.params["id"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
