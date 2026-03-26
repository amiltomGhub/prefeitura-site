import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 30_000;

/**
 * GET /api/site/search?tenant=slug&q=termo&page=1
 * Busca fulltext em: notícias, legislação, licitações, páginas
 * Retorna resultados agrupados por tipo com highlight do termo
 */
router.get("/site/search", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const q = ((req.query["q"] as string) ?? "").trim();

    if (!q || q.length < 2) {
      return res.status(400).json({ error: "Parâmetro q deve ter ao menos 2 caracteres" });
    }

    const cacheKey = `site:search:${tenantSlug}:${q}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db
        .select({ id: tenantsTable.id })
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, tenantSlug))
        .limit(1);
      if (!tenant) return null;

      const tenantId = tenant.id;

      // ── Notícias ─────────────────────────────────────────────────────────────
      const noticias = await db.execute(sql`
        SELECT
          id, titulo, slug, resumo, imagem_capa AS "imagemCapa",
          data_publicacao AS "dataPublicacao",
          ts_rank(
            to_tsvector('portuguese', titulo || ' ' || COALESCE(resumo, '')),
            plainto_tsquery('portuguese', ${q})
          ) AS rank
        FROM noticias
        WHERE
          tenant_id = ${tenantId}
          AND status = 'publicado'
          AND deletado_em IS NULL
          AND to_tsvector('portuguese', titulo || ' ' || COALESCE(resumo, ''))
              @@ plainto_tsquery('portuguese', ${q})
        ORDER BY rank DESC, data_publicacao DESC
        LIMIT 10
      `);

      // ── Legislação ────────────────────────────────────────────────────────────
      const legislacao = await db.execute(sql`
        SELECT
          id, tipo || ' nº ' || numero AS titulo, slug, ementa AS resumo,
          data_publicacao AS "dataPublicacao",
          ts_rank(
            to_tsvector('portuguese', numero || ' ' || ementa),
            plainto_tsquery('portuguese', ${q})
          ) AS rank
        FROM legislacao
        WHERE
          tenant_id = ${tenantId}
          AND status = 'publicado'
          AND to_tsvector('portuguese', numero || ' ' || ementa)
              @@ plainto_tsquery('portuguese', ${q})
        ORDER BY rank DESC, data_publicacao DESC
        LIMIT 10
      `);

      // ── Licitações ────────────────────────────────────────────────────────────
      const licitacoes = await db.execute(sql`
        SELECT
          id, numero AS titulo, objeto AS resumo,
          modalidade, situacao, created_at AS "createdAt",
          ts_rank(
            to_tsvector('portuguese', numero || ' ' || objeto),
            plainto_tsquery('portuguese', ${q})
          ) AS rank
        FROM licitacoes
        WHERE
          tenant_id = ${tenantId}
          AND to_tsvector('portuguese', numero || ' ' || objeto)
              @@ plainto_tsquery('portuguese', ${q})
        ORDER BY rank DESC, created_at DESC
        LIMIT 10
      `);

      // ── Páginas ───────────────────────────────────────────────────────────────
      const paginas = await db.execute(sql`
        SELECT
          id, titulo, slug,
          meta_description AS resumo,
          ts_rank(
            to_tsvector('portuguese', titulo || ' ' || COALESCE(meta_description, '')),
            plainto_tsquery('portuguese', ${q})
          ) AS rank
        FROM pages
        WHERE
          tenant_id = ${tenantId}
          AND status = 'publicado'
          AND to_tsvector('portuguese', titulo || ' ' || COALESCE(meta_description, ''))
              @@ plainto_tsquery('portuguese', ${q})
        ORDER BY rank DESC
        LIMIT 5
      `);

      const noticiasRows = noticias.rows as Record<string, unknown>[];
      const legislacaoRows = legislacao.rows as Record<string, unknown>[];
      const licitacoesRows = licitacoes.rows as Record<string, unknown>[];
      const paginasRows = paginas.rows as Record<string, unknown>[];

      const total = noticiasRows.length + legislacaoRows.length + licitacoesRows.length + paginasRows.length;

      return {
        q,
        total,
        results: {
          noticias: noticiasRows.map((n) => ({ ...n, tipo: "noticia" })),
          legislacao: legislacaoRows.map((l) => ({ ...l, tipo: "legislacao" })),
          licitacoes: licitacoesRows.map((l) => ({ ...l, tipo: "licitacao" })),
          paginas: paginasRows.map((p) => ({ ...p, tipo: "pagina" })),
        },
      };
    });

    if (!result) return res.status(404).json({ error: "Tenant não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=30");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
