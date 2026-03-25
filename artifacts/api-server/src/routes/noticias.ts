import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { noticiasTable } from "@workspace/db/schema";
import { eq, and, desc, ilike, count } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const DEFAULT_TENANT = "parauapebas";

async function getTenantId(tenantSlug: string): Promise<string | null> {
  const { tenantsTable } = await import("@workspace/db/schema");
  const tenant = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
  return tenant[0]?.id ?? null;
}

router.get("/noticias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) ?? "10")));
    const categoria = req.query["categoria"] as string | undefined;
    const destaque = req.query["destaque"] as string | undefined;
    const offset = (page - 1) * limit;

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const conditions = [eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.publicado, true)];
    if (categoria) conditions.push(eq(noticiasTable.categoria, categoria));
    if (destaque === "true") conditions.push(eq(noticiasTable.destaque, true));

    const whereClause = and(...conditions);
    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(noticiasTable).where(whereClause),
      db.select().from(noticiasTable).where(whereClause).orderBy(desc(noticiasTable.dataPublicacao)).limit(limit).offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({ data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/noticias/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const noticia = await db.select().from(noticiasTable).where(
      and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.slug, req.params["slug"]!), eq(noticiasTable.publicado, true))
    ).limit(1);

    if (!noticia.length) return res.status(404).json({ error: "Notícia não encontrada" });
    res.json(noticia[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/noticias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const body = req.body;
    const noticia = await db.insert(noticiasTable).values({
      id: randomUUID(),
      tenantId,
      titulo: body.titulo,
      slug: body.slug,
      resumo: body.resumo,
      conteudo: body.conteudo,
      imagemCapa: body.imagemCapa ?? null,
      categoria: body.categoria,
      autor: body.autor ?? null,
      dataPublicacao: body.dataPublicacao ? new Date(body.dataPublicacao) : new Date(),
      destaque: body.destaque ?? false,
      tags: body.tags ?? [],
    }).returning();

    res.status(201).json(noticia[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/noticias/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const body = req.body;
    const updated = await db.update(noticiasTable)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.slug, req.params["slug"]!)))
      .returning();

    if (!updated.length) return res.status(404).json({ error: "Notícia não encontrada" });
    res.json(updated[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/noticias/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    await db.delete(noticiasTable).where(
      and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.slug, req.params["slug"]!))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
