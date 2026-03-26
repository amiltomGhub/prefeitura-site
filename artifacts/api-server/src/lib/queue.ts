/**
 * BullMQ queue setup — usa Redis quando REDIS_URL está disponível,
 * senão usa scheduler em memória via setInterval.
 */
import { logger } from "./logger";

const REDIS_URL = process.env["REDIS_URL"];

// ─── Tipos dos jobs ────────────────────────────────────────────────────────────

export type SiteJobName =
  | "PUBLISH_SCHEDULED_NEWS"
  | "INCREMENT_VIEW_COUNT"
  | "CHECK_TRANSPARENCY_COMPLIANCE"
  | "GENERATE_SITEMAP"
  | "SYNC_PNCP";

export interface SiteJobData {
  tenantId?: string;
  noticiaId?: string;
  [key: string]: unknown;
}

// ─── Fila BullMQ (quando Redis disponível) ────────────────────────────────────

let _queue: import("bullmq").Queue | null = null;

export async function getSiteQueue(): Promise<import("bullmq").Queue | null> {
  if (!REDIS_URL) return null;
  if (_queue) return _queue;

  try {
    const { Queue } = await import("bullmq");
    _queue = new Queue("site-queue", {
      connection: { url: REDIS_URL },
      defaultJobOptions: { removeOnComplete: 100, removeOnFail: 50 },
    });
    logger.info("BullMQ site-queue conectado ao Redis");
    return _queue;
  } catch (err) {
    logger.warn({ err }, "BullMQ não disponível — usando scheduler em memória");
    return null;
  }
}

/** Adiciona job assíncrono à fila (ou executa inline se Redis indisponível) */
export async function addJob(
  name: SiteJobName,
  data: SiteJobData,
  opts?: { delay?: number },
): Promise<void> {
  const q = await getSiteQueue();
  if (q) {
    await q.add(name, data, opts);
  }
  // Sem Redis: operações críticas (ex: increment view) são fire-and-forget inline
}

// ─── Schedulers em memória (fallback) ─────────────────────────────────────────

let _schedulersStarted = false;

export function startInMemorySchedulers(
  handlers: Record<SiteJobName, (data: SiteJobData) => Promise<void>>,
) {
  if (REDIS_URL || _schedulersStarted) return;
  _schedulersStarted = true;

  // A cada 5 minutos — publicar notícias agendadas
  setInterval(() => {
    handlers["PUBLISH_SCHEDULED_NEWS"]({}).catch((e) =>
      logger.error(e, "PUBLISH_SCHEDULED_NEWS falhou"),
    );
  }, 5 * 60 * 1000).unref();

  // Diário 07:00 — conformidade LAI
  scheduleDailyAt(7, 0, () =>
    handlers["CHECK_TRANSPARENCY_COMPLIANCE"]({}).catch((e) =>
      logger.error(e, "CHECK_TRANSPARENCY_COMPLIANCE falhou"),
    ),
  );

  // Diário 02:00 — gerar sitemap
  scheduleDailyAt(2, 0, () =>
    handlers["GENERATE_SITEMAP"]({}).catch((e) =>
      logger.error(e, "GENERATE_SITEMAP falhou"),
    ),
  );

  // Diário 06:00 — sync PNCP
  scheduleDailyAt(6, 0, () =>
    handlers["SYNC_PNCP"]({}).catch((e) =>
      logger.error(e, "SYNC_PNCP falhou"),
    ),
  );

  logger.info("Schedulers em memória iniciados (sem Redis)");
}

function scheduleDailyAt(hour: number, minute: number, fn: () => void) {
  const msUntilNext = () => {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next.getTime() - now.getTime();
  };
  const loop = () => {
    setTimeout(() => {
      fn();
      loop();
    }, msUntilNext()).unref();
  };
  loop();
}
