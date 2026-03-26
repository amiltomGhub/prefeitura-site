import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  manifestacoesTable, sicPedidosTable, tenantsTable
} from "@workspace/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

function getTenant(req: { query: Record<string, unknown> }): string {
  return String(req.query.tenant ?? "parauapebas");
}

async function resolveTenant(slug: string) {
  return db.query.tenantsTable.findFirst({ where: eq(tenantsTable.slug, slug) });
}

router.get("/ouvidoria/stats", async (req, res) => {
  try {
    const slug = getTenant(req);
    const tenant = await resolveTenant(slug);
    if (!tenant) return res.status(404).json({ error: "Tenant não encontrado." });

    const [totalRow] = await db.select({ total: count() }).from(manifestacoesTable)
      .where(eq(manifestacoesTable.tenantId, tenant.id));

    const [abertas] = await db.select({ total: count() }).from(manifestacoesTable)
      .where(and(eq(manifestacoesTable.tenantId, tenant.id), eq(manifestacoesTable.status, "aberta")));

    const [resolvidas] = await db.select({ total: count() }).from(manifestacoesTable)
      .where(and(eq(manifestacoesTable.tenantId, tenant.id), eq(manifestacoesTable.status, "resolvida")));

    const [sicTotal] = await db.select({ total: count() }).from(sicPedidosTable)
      .where(eq(sicPedidosTable.tenantId, tenant.id));

    const [sicAbertos] = await db.select({ total: count() }).from(sicPedidosTable)
      .where(and(eq(sicPedidosTable.tenantId, tenant.id), eq(sicPedidosTable.status, "aberto")));

    const total = Number(totalRow?.total ?? 0);
    const resolvidasCount = Number(resolvidas?.total ?? 0);
    const taxaResolucao = total > 0 ? Math.round((resolvidasCount / total) * 100) : 0;

    res.set("Cache-Control", "public, max-age=60");
    return res.json({
      manifestacoes: {
        total,
        abertas: Number(abertas?.total ?? 0),
        resolvidas: resolvidasCount,
        taxaResolucao,
      },
      sic: {
        total: Number(sicTotal?.total ?? 0),
        abertos: Number(sicAbertos?.total ?? 0),
      },
    });
  } catch (err) {
    console.error("[OUVIDORIA] stats error:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
});

router.get("/ouvidoria/manifestacoes", async (req, res) => {
  try {
    const slug = getTenant(req);
    const tenant = await resolveTenant(slug);
    if (!tenant) return res.status(404).json({ error: "Tenant não encontrado." });

    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
    const offset = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    const where = status
      ? and(eq(manifestacoesTable.tenantId, tenant.id), eq(manifestacoesTable.status, status))
      : eq(manifestacoesTable.tenantId, tenant.id);

    const [{ total }] = await db.select({ total: count() }).from(manifestacoesTable).where(where);

    const data = await db.select().from(manifestacoesTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${manifestacoesTable.createdAt} DESC`);

    return res.json({ data, total: Number(total), page, limit });
  } catch (err) {
    console.error("[OUVIDORIA] list error:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
});

router.post("/ouvidoria/manifestacoes", async (req, res) => {
  try {
    const slug = getTenant(req);
    const tenant = await resolveTenant(slug);
    if (!tenant) return res.status(404).json({ error: "Tenant não encontrado." });

    const body = req.body as {
      tipo?: string;
      assunto?: string;
      descricao?: string;
      nomeCidadao?: string;
      emailCidadao?: string;
      telefoneCidadao?: string;
      cpfCidadao?: string;
      isAnonimo?: boolean;
      secretariaId?: string;
      lgpdConsent?: boolean;
      origem?: string;
    };

    if (!body.assunto || body.assunto.trim().length < 5) {
      return res.status(400).json({ error: "Assunto é obrigatório (mín. 5 caracteres)." });
    }
    if (!body.descricao || body.descricao.trim().length < 20) {
      return res.status(400).json({ error: "Descrição deve ter ao menos 20 caracteres." });
    }
    if (!body.isAnonimo && !body.nomeCidadao) {
      return res.status(400).json({ error: "Nome é obrigatório para manifestações não anônimas." });
    }
    if (!body.lgpdConsent) {
      return res.status(400).json({ error: "Consentimento LGPD obrigatório." });
    }

    const ano = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
    const protocolo = `OUV-${ano}-${seq}`;

    const prazo = new Date();
    prazo.setDate(prazo.getDate() + 30);

    const id = randomUUID();
    await db.insert(manifestacoesTable).values({
      id,
      tenantId: tenant.id,
      protocolo,
      tipo: body.tipo ?? "reclamacao",
      status: "aberta",
      prioridade: "normal",
      nomeCidadao: body.nomeCidadao,
      emailCidadao: body.emailCidadao,
      telefoneCidadao: body.telefoneCidadao,
      cpfCidadao: body.cpfCidadao,
      isAnonimo: body.isAnonimo ?? false,
      assunto: body.assunto.trim(),
      descricao: body.descricao.trim(),
      secretariaId: body.secretariaId,
      prazo,
      lgpdConsent: body.lgpdConsent ?? false,
      origem: body.origem ?? "portal",
    });

    return res.status(201).json({ protocolo, prazo, mensagem: "Manifestação registrada com sucesso." });
  } catch (err) {
    console.error("[OUVIDORIA] create error:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
});

router.get("/ouvidoria/acompanhar/:protocolo", async (req, res) => {
  try {
    const slug = getTenant(req);
    const tenant = await resolveTenant(slug);
    if (!tenant) return res.status(404).json({ error: "Tenant não encontrado." });

    const manifestacao = await db.query.manifestacoesTable.findFirst({
      where: and(
        eq(manifestacoesTable.tenantId, tenant.id),
        eq(manifestacoesTable.protocolo, req.params.protocolo)
      ),
    });

    if (!manifestacao) return res.status(404).json({ error: "Protocolo não encontrado." });

    return res.json({
      protocolo: manifestacao.protocolo,
      tipo: manifestacao.tipo,
      assunto: manifestacao.assunto,
      status: manifestacao.status,
      prazo: manifestacao.prazo,
      resolvidaEm: manifestacao.resolvidaEm,
      createdAt: manifestacao.createdAt,
    });
  } catch {
    return res.status(500).json({ error: "Erro interno." });
  }
});

export default router;
