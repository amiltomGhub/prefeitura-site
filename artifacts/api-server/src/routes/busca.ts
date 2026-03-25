import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { noticiasTable, servicosTable, licitacoesTable, legislacaoTable, secretariasTable, tenantsTable } from "@workspace/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";

async function getTenantId(slug: string) {
  const t = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1);
  return t[0]?.id ?? null;
}

router.get("/busca", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const q = (req.query["q"] as string) ?? "";
    const tipo = req.query["tipo"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(50, parseInt((req.query["limit"] as string) ?? "20"));
    const offset = (page - 1) * limit;

    if (!q.trim()) {
      return res.json({ query: q, data: [], total: 0, page, limit, totalPages: 0 });
    }

    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return res.status(404).json({ error: "Tenant not found" });

    const results: Array<{ id: string; tipo: string; titulo: string; resumo: string | null; url: string; data: Date | string | null; relevancia: number }> = [];
    const term = `%${q}%`;

    if (!tipo || tipo === "noticia") {
      const noticias = await db.select().from(noticiasTable).where(
        and(eq(noticiasTable.tenantId, tenantId), eq(noticiasTable.publicado, true),
          or(ilike(noticiasTable.titulo, term), ilike(noticiasTable.resumo, term)))
      ).limit(10);
      noticias.forEach(n => results.push({ id: n.id, tipo: "noticia", titulo: n.titulo, resumo: n.resumo, url: `/noticias/${n.slug}`, data: n.dataPublicacao, relevancia: 1 }));
    }

    if (!tipo || tipo === "servico") {
      const servicos = await db.select().from(servicosTable).where(
        and(eq(servicosTable.tenantId, tenantId), eq(servicosTable.ativo, true),
          or(ilike(servicosTable.titulo, term), ilike(servicosTable.descricao, term)))
      ).limit(10);
      servicos.forEach(s => results.push({ id: s.id, tipo: "servico", titulo: s.titulo, resumo: s.descricao, url: `/servicos/${s.slug}`, data: s.createdAt, relevancia: 0.9 }));
    }

    if (!tipo || tipo === "licitacao") {
      const licitacoes = await db.select().from(licitacoesTable).where(
        and(eq(licitacoesTable.tenantId, tenantId), ilike(licitacoesTable.objeto, term))
      ).limit(5);
      licitacoes.forEach(l => results.push({ id: l.id, tipo: "licitacao", titulo: l.objeto, resumo: l.descricao ?? null, url: `/licitacoes/${l.id}`, data: l.dataAbertura, relevancia: 0.8 }));
    }

    if (!tipo || tipo === "legislacao") {
      const leis = await db.select().from(legislacaoTable).where(
        and(eq(legislacaoTable.tenantId, tenantId), or(ilike(legislacaoTable.ementa, term), ilike(legislacaoTable.numero, term)))
      ).limit(5);
      leis.forEach(l => results.push({ id: l.id, tipo: "legislacao", titulo: `${l.tipo} nº ${l.numero} - ${l.ementa}`, resumo: null, url: `/legislacao/${l.tipo}/${l.slug}`, data: l.dataPublicacao, relevancia: 0.7 }));
    }

    const sorted = results.sort((a, b) => b.relevancia - a.relevancia);
    const paginated = sorted.slice(offset, offset + limit);

    res.json({ query: q, data: paginated, total: sorted.length, page, limit, totalPages: Math.ceil(sorted.length / limit) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
