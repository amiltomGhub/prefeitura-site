import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, secretariasTable } from "@workspace/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { withCache } from "../../lib/cache";

const router: IRouter = Router();
const DEFAULT_TENANT = "parauapebas";
const TTL = 60_000;

/**
 * GET /api/site/secretarias?tenant=slug
 * Lista de secretarias ativas com: nome, responsável, telefone, email, horário
 */
router.get("/site/secretarias", async (req, res) => {
  try {
    const tenantSlug = (req.query["tenant"] as string) ?? DEFAULT_TENANT;
    const cacheKey = `site:secretarias:${tenantSlug}`;

    const result = await withCache(cacheKey, TTL, async () => {
      const [tenant] = await db.select({ id: tenantsTable.id }).from(tenantsTable).where(eq(tenantsTable.slug, tenantSlug)).limit(1);
      if (!tenant) return null;

      const rows = await db
        .select({
          id: secretariasTable.id,
          nome: secretariasTable.nome,
          slug: secretariasTable.slug,
          sigla: secretariasTable.sigla,
          descricao: secretariasTable.descricao,
          secretario: secretariasTable.secretario,
          fotoSecretario: secretariasTable.fotoSecretario,
          telefone: secretariasTable.telefone,
          email: secretariasTable.email,
          endereco: secretariasTable.endereco,
          horario: secretariasTable.horario,
        })
        .from(secretariasTable)
        .where(and(eq(secretariasTable.tenantId, tenant.id), eq(secretariasTable.ativa, true)))
        .orderBy(asc(secretariasTable.nome));

      return { data: rows };
    });

    if (!result) return res.status(404).json({ error: "Tenant não encontrado" });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
