import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  tenantsTable,
  noticiasTable,
  newsCategoriesTable,
  secretariasTable,
  newsVersionsTable,
} from "@workspace/db/schema";
import { eq, and, desc, ilike, isNull, sql } from "drizzle-orm";
import { withCache, cacheDelPattern } from "../../lib/cache";
import { addJob } from "../../lib/queue";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

async function getTenantId(slug: string) {
  const r = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return r[0]?.id ?? null;
}

/**
 * GET /api/site/news?tenant=slug&page=1&limit=10&category=&featured=false&search=
 * Lista de notícias publicadas com paginação
 */
router.get("/site/news", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) ?? "10")));
    const category = req.query["category"] as string | undefined;
    const featured = req.query["featured"] === "true";
    const search = req.query["search"] as string | undefined;
    const offset = (page - 1) * limit;

    const cacheKey = `site:news:${tenantSlug}:${page}:${limit}:${category ?? ""}:${featured}:${search ?? ""}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const tenantId = await getTenantId(tenantSlug);
      if (!tenantId) return null;

      const conditions = [
        eq(noticiasTable.tenantId, tenantId),
        eq(noticiasTable.status, "publicado"),
        eq(noticiasTable.publicado, true),
        isNull(noticiasTable.deletadoEm),
      ];

      if (category) conditions.push(eq(noticiasTable.categoria, category));
      if (featured) conditions.push(eq(noticiasTable.destaque, true));
      if (search) conditions.push(ilike(noticiasTable.titulo, `%${search}%`));

      const where = and(...conditions);

      const [countResult, rows] = await Promise.all([
        db.select({ total: sql<number>`count(*)::int` }).from(noticiasTable).where(where),
        db
          .select({
            id: noticiasTable.id,
            titulo: noticiasTable.titulo,
            slug: noticiasTable.slug,
            resumo: noticiasTable.resumo,
            imagemCapa: noticiasTable.imagemCapa,
            imagemCapaAlt: noticiasTable.imagemCapaAlt,
            categoria: noticiasTable.categoria,
            destaque: noticiasTable.destaque,
            tags: noticiasTable.tags,
            visualizacoes: noticiasTable.visualizacoes,
            dataPublicacao: noticiasTable.dataPublicacao,
          })
          .from(noticiasTable)
          .where(where)
          .orderBy(desc(noticiasTable.dataPublicacao))
          .limit(limit)
          .offset(offset),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
    });

    if (!result) return res.status(404).json({ error: "Tenant não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/site/news/:slug?tenant=slug
 * Notícia completa + incrementa viewCount via job assíncrono
 */
router.get("/site/news/:slug", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const slug = req.params["slug"]!;
    const cacheKey = `site:news:detail:${tenantSlug}:${slug}`;

    const noticia = await withCache(cacheKey, TTL, async () => {
      const tenantId = await getTenantId(tenantSlug);
      if (!tenantId) return null;

      const [row] = await db
        .select()
        .from(noticiasTable)
        .where(
          and(
            eq(noticiasTable.tenantId, tenantId),
            eq(noticiasTable.slug, slug),
            eq(noticiasTable.status, "publicado"),
            isNull(noticiasTable.deletadoEm),
          ),
        )
        .limit(1);

      if (!row) return undefined;

      // Notícias relacionadas (mesma categoria, últimas 3)
      const relacionadas = await db
        .select({
          id: noticiasTable.id,
          titulo: noticiasTable.titulo,
          slug: noticiasTable.slug,
          resumo: noticiasTable.resumo,
          imagemCapa: noticiasTable.imagemCapa,
          dataPublicacao: noticiasTable.dataPublicacao,
        })
        .from(noticiasTable)
        .where(
          and(
            eq(noticiasTable.tenantId, tenantId),
            eq(noticiasTable.categoria, row.categoria),
            eq(noticiasTable.status, "publicado"),
            isNull(noticiasTable.deletadoEm),
          ),
        )
        .orderBy(desc(noticiasTable.dataPublicacao))
        .limit(4);

      return {
        ...row,
        relacionadas: relacionadas.filter((r) => r.id !== row.id).slice(0, 3),
      };
    });

    if (noticia === null) return res.status(404).json({ error: "Tenant não encontrado" });
    if (noticia === undefined) return res.status(404).json({ error: "Notícia não encontrada" });

    // Incrementar view count assincronamente — não bloqueia response
    void addJob("INCREMENT_VIEW_COUNT", { noticiaId: noticia.id });
    // Fallback inline se sem Redis
    if (!process.env["REDIS_URL"]) {
      db.update(noticiasTable)
        .set({ visualizacoes: sql`${noticiasTable.visualizacoes} + 1` })
        .where(eq(noticiasTable.id, noticia.id))
        .execute()
        .catch(() => {});
    }

    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(noticia);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
