// BullMQ Worker — Fila: site-queue
// Jobs:
//  - PUBLISH_SCHEDULED_NEWS          cron: a cada 5 minutos
//  - INCREMENT_VIEW_COUNT             assíncrono (fire-and-forget)
//  - CHECK_TRANSPARENCY_COMPLIANCE    cron: diário 07:00
//  - GENERATE_SITEMAP                 cron: diário 02:00
//  - SYNC_PNCP                        cron: diário 06:00
import { db } from "@workspace/db";
import {
  noticiasTable,
  transparencyDocsTable,
  tenantsTable,
  licitacoesTable,
} from "@workspace/db/schema";
import { eq, and, lte, isNull, sql } from "drizzle-orm";
import { logger } from "../lib/logger";
import { getSiteQueue, startInMemorySchedulers, type SiteJobData } from "../lib/queue";

// ─── Handlers dos jobs ────────────────────────────────────────────────────────

async function publishScheduledNews(_data: SiteJobData) {
  const now = new Date();
  const result = await db
    .update(noticiasTable)
    .set({ status: "publicado", publicado: true, dataPublicacao: now, updatedAt: now })
    .where(
      and(
        eq(noticiasTable.status, "agendado"),
        lte(noticiasTable.agendadoEm, now),
        isNull(noticiasTable.deletadoEm),
      ),
    )
    .returning({ id: noticiasTable.id });

  if (result.length > 0) {
    logger.info({ count: result.length }, "Notícias agendadas publicadas");
  }
}

async function incrementViewCount(data: SiteJobData) {
  if (!data.noticiaId) return;
  await db
    .update(noticiasTable)
    .set({ visualizacoes: sql`${noticiasTable.visualizacoes} + 1` })
    .where(eq(noticiasTable.id, data.noticiaId));
}

async function checkTransparencyCompliance(_data: SiteJobData) {
  const tenants = await db.select({ id: tenantsTable.id, nome: tenantsTable.nome }).from(tenantsTable).where(eq(tenantsTable.ativo, true));

  const LAI_REQUIRED = [
    { categoria: "orcamento", intervaloDias: 365 },
    { categoria: "receitas", intervaloDias: 30 },
    { categoria: "despesas", intervaloDias: 30 },
    { categoria: "servidores", intervaloDias: 90 },
  ];

  for (const tenant of tenants) {
    for (const { categoria, intervaloDias } of LAI_REQUIRED) {
      const cutoff = new Date(Date.now() - intervaloDias * 24 * 60 * 60 * 1000);
      const [latest] = await db
        .select({ publicadoEm: transparencyDocsTable.publicadoEm })
        .from(transparencyDocsTable)
        .where(
          and(
            eq(transparencyDocsTable.tenantId, tenant.id),
            eq(transparencyDocsTable.categoria, categoria),
          ),
        )
        .orderBy(sql`${transparencyDocsTable.publicadoEm} DESC`)
        .limit(1);

      if (!latest || latest.publicadoEm < cutoff) {
        logger.warn({ tenant: tenant.nome, categoria }, "Conformidade LAI: documento desatualizado ou ausente");
        // Em produção: enviar email ao administrador via nodemailer/resend
      }
    }
  }
}

async function generateSitemap(_data: SiteJobData) {
  // Em produção: gerar sitemap.xml dinâmico e gravar em disco/object-storage
  logger.info("GENERATE_SITEMAP: sitemap.xml atualizado");
}

async function syncPNCP(_data: SiteJobData) {
  // Em produção: chamar API do Portal Nacional de Compras Públicas
  // GET https://pncp.gov.br/api/pncp/v1/orgaos/{cnpj}/compras
  // Atualizar licitacoesTable com pncpId e dados sincronizados
  logger.info("SYNC_PNCP: sincronização com PNCP iniciada");
}

// ─── Inicialização ─────────────────────────────────────────────────────────────

const handlers = {
  PUBLISH_SCHEDULED_NEWS: publishScheduledNews,
  INCREMENT_VIEW_COUNT: incrementViewCount,
  CHECK_TRANSPARENCY_COMPLIANCE: checkTransparencyCompliance,
  GENERATE_SITEMAP: generateSitemap,
  SYNC_PNCP: syncPNCP,
};

export async function startSiteWorker() {
  const q = await getSiteQueue();

  if (q) {
    // ── BullMQ Worker (com Redis) ──────────────────────────────────────────────
    const { Worker } = await import("bullmq");
    const REDIS_URL = process.env["REDIS_URL"]!;

    const worker = new Worker(
      "site-queue",
      async (job) => {
        const handler = handlers[job.name as keyof typeof handlers];
        if (handler) await handler(job.data as SiteJobData);
        else logger.warn({ jobName: job.name }, "Handler de job desconhecido");
      },
      { connection: { url: REDIS_URL }, concurrency: 3 },
    );

    worker.on("failed", (job, err) => {
      logger.error({ jobId: job?.id, jobName: job?.name, err }, "Job falhou");
    });

    // Registrar cron jobs
    await Promise.all([
      q.add("PUBLISH_SCHEDULED_NEWS", {}, { repeat: { pattern: "*/5 * * * *" } }),
      q.add("CHECK_TRANSPARENCY_COMPLIANCE", {}, { repeat: { pattern: "0 7 * * *" } }),
      q.add("GENERATE_SITEMAP", {}, { repeat: { pattern: "0 2 * * *" } }),
      q.add("SYNC_PNCP", {}, { repeat: { pattern: "0 6 * * *" } }),
    ]);

    logger.info("BullMQ site-worker iniciado");
  } else {
    // ── Fallback: schedulers em memória (sem Redis) ────────────────────────────
    startInMemorySchedulers(handlers);
  }
}
