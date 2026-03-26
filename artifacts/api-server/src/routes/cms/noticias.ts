import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { noticiasTable, newsVersionsTable, newsCategoriesTable } from "@workspace/db/schema";
import { eq, and, desc, ilike, count, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const r = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

// GET /cms/noticias — lista com filtros
router.get("/cms/noticias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt((req.query["limit"] as string) ?? "20")));
    const status = req.query["status"] as string | undefined;
    const categoria = req.query["categoria"] as string | undefined;
    const busca = req.query["q"] as string | undefined;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions: ReturnType<typeof eq>[] = [
      eq(noticiasTable.tenantId, tenantId),
      isNull(noticiasTable.deletadoEm),
    ];
    if (status) conditions.push(eq(noticiasTable.status, status));
    if (categoria) conditions.push(eq(noticiasTable.categoria, categoria));
    if (busca) conditions.push(ilike(noticiasTable.titulo, `%${busca}%`));

    const where = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(noticiasTable).where(where),
      db.select().from(noticiasTable).where(where)
        .orderBy(desc(noticiasTable.createdAt))
        .limit(limit).offset(offset),
    ]);

    res.json({ data, total: total[0]?.count ?? 0, page, limit, totalPages: Math.ceil((total[0]?.count ?? 0) / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/noticias/:id — detalhes
router.get("/cms/noticias/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const [noticia] = await db.select().from(noticiasTable).where(
      and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!))
    ).limit(1);

    if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

    const versions = await db.select().from(newsVersionsTable)
      .where(eq(newsVersionsTable.noticiaId, noticia.id))
      .orderBy(desc(newsVersionsTable.createdAt))
      .limit(10);

    res.json({ ...noticia, versions });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/noticias — criar
router.post("/cms/noticias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.titulo || !b.slug || !b.conteudo) {
      return res.status(400).json({ error: "titulo, slug e conteudo são obrigatórios" });
    }

    const id = randomUUID();
    const [noticia] = await db.insert(noticiasTable).values({
      id,
      tenantId,
      titulo: b.titulo,
      slug: b.slug,
      resumo: b.resumo ?? "",
      conteudo: b.conteudo,
      imagemCapa: b.imagemCapa ?? null,
      imagemCapaAlt: b.imagemCapaAlt ?? null,
      categoria: b.categoria ?? "geral",
      categoriaId: b.categoriaId ?? null,
      secretariaId: b.secretariaId ?? null,
      autor: b.autor ?? null,
      status: b.status ?? "rascunho",
      publicado: b.status === "publicado",
      destaque: b.destaque ?? false,
      tags: b.tags ?? [],
      metaTitle: b.metaTitle ?? null,
      metaDescription: b.metaDescription ?? null,
      ogImageUrl: b.ogImageUrl ?? null,
      dataPublicacao: b.dataPublicacao ? new Date(b.dataPublicacao) : new Date(),
      agendadoEm: b.agendadoEm ? new Date(b.agendadoEm) : null,
    }).returning();

    await db.insert(newsVersionsTable).values({
      id: randomUUID(),
      noticiaId: id,
      conteudo: b.conteudo,
      savedBy: b.autor ?? "admin",
    });

    res.status(201).json(noticia);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /cms/noticias/:id — atualizar
router.put("/cms/noticias/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (b.titulo !== undefined) updateData["titulo"] = b.titulo;
    if (b.slug !== undefined) updateData["slug"] = b.slug;
    if (b.resumo !== undefined) updateData["resumo"] = b.resumo;
    if (b.conteudo !== undefined) updateData["conteudo"] = b.conteudo;
    if (b.imagemCapa !== undefined) updateData["imagemCapa"] = b.imagemCapa;
    if (b.imagemCapaAlt !== undefined) updateData["imagemCapaAlt"] = b.imagemCapaAlt;
    if (b.categoria !== undefined) updateData["categoria"] = b.categoria;
    if (b.categoriaId !== undefined) updateData["categoriaId"] = b.categoriaId;
    if (b.secretariaId !== undefined) updateData["secretariaId"] = b.secretariaId;
    if (b.status !== undefined) {
      updateData["status"] = b.status;
      updateData["publicado"] = b.status === "publicado";
    }
    if (b.destaque !== undefined) updateData["destaque"] = b.destaque;
    if (b.tags !== undefined) updateData["tags"] = b.tags;
    if (b.metaTitle !== undefined) updateData["metaTitle"] = b.metaTitle;
    if (b.metaDescription !== undefined) updateData["metaDescription"] = b.metaDescription;
    if (b.ogImageUrl !== undefined) updateData["ogImageUrl"] = b.ogImageUrl;
    if (b.dataPublicacao !== undefined) updateData["dataPublicacao"] = new Date(b.dataPublicacao);
    if (b.agendadoEm !== undefined) updateData["agendadoEm"] = b.agendadoEm ? new Date(b.agendadoEm) : null;

    const [updated] = await db.update(noticiasTable).set(updateData)
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Notícia não encontrada" });

    if (b.conteudo) {
      await db.insert(newsVersionsTable).values({
        id: randomUUID(),
        noticiaId: updated.id,
        conteudo: b.conteudo,
        savedBy: b.autor ?? "admin",
      });
    }

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cms/noticias/:id — soft delete
router.delete("/cms/noticias/:id", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.update(noticiasTable)
      .set({ deletadoEm: new Date(), status: "arquivado", publicado: false, updatedAt: new Date() })
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.id, req.params["id"]!)));

    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /cms/categorias — categorias de notícias
router.get("/cms/categorias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const data = await db.select().from(newsCategoriesTable)
      .where(eq(newsCategoriesTable.tenantId, tenantId))
      .orderBy(newsCategoriesTable.name);

    res.json({ data });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cms/categorias
router.post("/cms/categorias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const b = req.body;
    if (!b.name || !b.slug) return res.status(400).json({ error: "name e slug são obrigatórios" });

    const [cat] = await db.insert(newsCategoriesTable).values({
      id: randomUUID(), tenantId, name: b.name, slug: b.slug, color: b.color ?? null,
    }).returning();

    res.status(201).json(cat);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
