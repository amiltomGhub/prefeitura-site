import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, transparencyDocsTable } from "@workspace/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// Categorias obrigatórias LAI — necessitam atualização anual
const LAI_REQUIRED_CATEGORIES = [
  { categoria: "orcamento", intervalo: 365 },
  { categoria: "receitas", intervalo: 30 },
  { categoria: "despesas", intervalo: 30 },
  { categoria: "servidores", intervalo: 90 },
  { categoria: "convenios", intervalo: 90 },
  { categoria: "atas", intervalo: 30 },
];

// GET /site-admin/transparency
router.get("/site-admin/transparency", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const categoria = req.query["categoria"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = 50;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const conditions = [eq(transparencyDocsTable.tenantId, tenantId)];
    if (categoria) conditions.push(eq(transparencyDocsTable.categoria, categoria));

    const docs = await db.select().from(transparencyDocsTable)
      .where(and(...conditions))
      .orderBy(desc(transparencyDocsTable.publicadoEm))
      .limit(limit).offset(offset);

    res.json({ data: docs, page });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/transparency — upload de documento
router.post("/site-admin/transparency", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.categoria || !b.titulo || !b.fileUrl || !b.nomeArquivo || !b.anoReferencia) {
      return res.status(400).json({ error: "categoria, titulo, fileUrl, nomeArquivo e anoReferencia são obrigatórios" });
    }

    const [doc] = await db.insert(transparencyDocsTable).values({
      id: randomUUID(), tenantId,
      categoria: b.categoria,
      subcategoria: b.subcategoria ?? null,
      titulo: b.titulo,
      descricao: b.descricao ?? null,
      anoReferencia: parseInt(b.anoReferencia),
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

// DELETE /site-admin/transparency/:id
router.delete("/site-admin/transparency/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    await db.delete(transparencyDocsTable)
      .where(and(eq(transparencyDocsTable.id, req.params["id"]!), eq(transparencyDocsTable.tenantId, tenantId)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /site-admin/transparency/compliance — relatório de conformidade LAI
router.get("/site-admin/transparency/compliance", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const now = new Date();
    const report = await Promise.all(
      LAI_REQUIRED_CATEGORIES.map(async ({ categoria, intervalo }) => {
        const cutoff = new Date(now.getTime() - intervalo * 24 * 60 * 60 * 1000);
        const [latest] = await db
          .select({ publicadoEm: transparencyDocsTable.publicadoEm, titulo: transparencyDocsTable.titulo })
          .from(transparencyDocsTable)
          .where(and(eq(transparencyDocsTable.tenantId, tenantId), eq(transparencyDocsTable.categoria, categoria)))
          .orderBy(desc(transparencyDocsTable.publicadoEm))
          .limit(1);

        const conforme = latest ? latest.publicadoEm >= cutoff : false;
        const diasDesdePublicacao = latest
          ? Math.floor((now.getTime() - latest.publicadoEm.getTime()) / (24 * 60 * 60 * 1000))
          : null;

        return {
          categoria,
          conforme,
          ultimaPublicacao: latest?.publicadoEm ?? null,
          diasDesdePublicacao,
          prazoMaximoDias: intervalo,
          alerta: !conforme,
        };
      }),
    );

    const totalConforme = report.filter((r) => r.conforme).length;
    const percentual = Math.round((totalConforme / report.length) * 100);

    res.json({
      percentualConformidade: percentual,
      totalCategorias: report.length,
      totalConforme,
      totalPendente: report.length - totalConforme,
      categorias: report,
      geradoEm: now,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
