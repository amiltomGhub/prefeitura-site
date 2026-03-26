/**
 * Rotas Admin — Notícias
 * POST/PUT/PATCH com publish, schedule, archive, soft-delete, versioning
 */
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { noticiasTable, newsVersionsTable, newsCategoriesTable } from "@workspace/db/schema";
import { eq, and, desc, ilike, isNull, count, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { tenantsTable } from "@workspace/db/schema";
import { cacheDelPattern } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /site-admin/news
router.get("/site-admin/news", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const status = req.query["status"] as string | undefined;
    const search = req.query["search"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const conditions = [eq(noticiasTable.tenantId, tenantId), isNull(noticiasTable.deletadoEm)];
    if (status) conditions.push(eq(noticiasTable.status, status));
    if (search) conditions.push(ilike(noticiasTable.titulo, `%${search}%`));

    const where = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(noticiasTable).where(where),
      db.select().from(noticiasTable).where(where).orderBy(desc(noticiasTable.createdAt)).limit(limit).offset(offset),
    ]);

    res.json({ data, total: total[0]?.count ?? 0, page, limit, totalPages: Math.ceil((total[0]?.count ?? 0) / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /site-admin/news/:id
router.get("/site-admin/news/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const [noticia] = await db.select().from(noticiasTable)
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)))
      .limit(1);
    if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

    res.json(noticia);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /site-admin/news — criar rascunho
router.post("/site-admin/news", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    if (!b.titulo) return res.status(400).json({ error: "titulo é obrigatório" });

    const id = randomUUID();
    const slug = b.slug ?? `${b.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${id.slice(0, 8)}`;

    const [noticia] = await db.insert(noticiasTable).values({
      id, tenantId,
      titulo: b.titulo, slug,
      resumo: b.resumo ?? "",
      conteudo: b.conteudo ?? "",
      imagemCapa: b.imagemCapa ?? null,
      imagemCapaAlt: b.imagemCapaAlt ?? null,
      categoria: b.categoria ?? "geral",
      categoriaId: b.categoriaId ?? null,
      secretariaId: b.secretariaId ?? null,
      autor: b.autor ?? null,
      status: "rascunho",
      publicado: false,
      destaque: b.destaque ?? false,
      tags: b.tags ?? [],
      metaTitle: b.metaTitle ?? null,
      metaDescription: b.metaDescription ?? null,
    }).returning();

    if (b.conteudo) {
      await db.insert(newsVersionsTable).values({ id: randomUUID(), noticiaId: id, conteudo: b.conteudo, savedBy: b.autor ?? "admin" });
    }

    cacheDelPattern(`site:news:${tenantSlug}`);
    res.status(201).json(noticia);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /site-admin/news/:id — salvar (auto-save)
router.put("/site-admin/news/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const b = req.body;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ["titulo", "slug", "resumo", "conteudo", "imagemCapa", "imagemCapaAlt",
      "categoria", "categoriaId", "secretariaId", "autor", "destaque", "tags",
      "metaTitle", "metaDescription", "ogImageUrl"];
    for (const f of fields) if (b[f] !== undefined) update[f] = b[f];
    if (b.dataPublicacao) update["dataPublicacao"] = new Date(b.dataPublicacao);
    if (b.agendadoEm !== undefined) update["agendadoEm"] = b.agendadoEm ? new Date(b.agendadoEm) : null;

    const [updated] = await db.update(noticiasTable).set(update)
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Notícia não encontrada" });

    if (b.conteudo) {
      await db.insert(newsVersionsTable).values({ id: randomUUID(), noticiaId: updated.id, conteudo: b.conteudo, savedBy: b.autor ?? "admin" });
    }

    cacheDelPattern(`site:news:${tenantSlug}`);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /site-admin/news/:id/publish
router.patch("/site-admin/news/:id/publish", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const [updated] = await db.update(noticiasTable)
      .set({ status: "publicado", publicado: true, dataPublicacao: new Date(), updatedAt: new Date() })
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Notícia não encontrada" });

    cacheDelPattern(`site:news:${tenantSlug}`);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /site-admin/news/:id/schedule — agendar publicação
router.patch("/site-admin/news/:id/schedule", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const { scheduledAt } = req.body;
    if (!scheduledAt) return res.status(400).json({ error: "scheduledAt é obrigatório" });

    const [updated] = await db.update(noticiasTable)
      .set({ status: "agendado", publicado: false, agendadoEm: new Date(scheduledAt), updatedAt: new Date() })
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Notícia não encontrada" });

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /site-admin/news/:id/archive
router.patch("/site-admin/news/:id/archive", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const [updated] = await db.update(noticiasTable)
      .set({ status: "arquivado", publicado: false, updatedAt: new Date() })
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Notícia não encontrada" });

    cacheDelPattern(`site:news:${tenantSlug}`);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /site-admin/news/:id — soft delete
router.delete("/site-admin/news/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    await db.update(noticiasTable)
      .set({ deletadoEm: new Date(), status: "arquivado", publicado: false, updatedAt: new Date() })
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)));

    cacheDelPattern(`site:news:${tenantSlug}`);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /site-admin/news/:id/versions — histórico
router.get("/site-admin/news/:id/versions", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant não encontrado" });

    const versions = await db.select().from(newsVersionsTable)
      .where(eq(newsVersionsTable.noticiaId, req.params["id"]!))
      .orderBy(desc(newsVersionsTable.createdAt))
      .limit(50);

    res.json({ data: versions });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
