import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { faleConoscoConfigTable, chatSessionsTable, tenantsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

function getTenant(req: { query: Record<string, unknown> }): string {
  return String(req.query.tenant ?? "parauapebas");
}

async function resolveTenant(slug: string) {
  return db.query.tenantsTable.findFirst({ where: eq(tenantsTable.slug, slug) });
}

async function getConfig(tenantId: string) {
  const existing = await db.query.faleConoscoConfigTable.findFirst({
    where: eq(faleConoscoConfigTable.tenantId, tenantId),
  });
  if (existing) return existing;

  const id = randomUUID();
  await db.insert(faleConoscoConfigTable).values({ id, tenantId });
  return db.query.faleConoscoConfigTable.findFirst({ where: eq(faleConoscoConfigTable.id, id) });
}

router.get("/fale-conosco/config", async (req, res) => {
  try {
    const slug = getTenant(req);
    const tenant = await resolveTenant(slug);
    if (!tenant) return res.status(404).json({ error: "Tenant não encontrado." });

    const config = await getConfig(tenant.id);
    res.set("Cache-Control", "public, max-age=60");
    return res.json({
      habilitado: config?.habilitado ?? true,
      nomeAssistente: config?.nomeAssistente ?? "Assistente Municipal",
      saudacao: config?.saudacao ?? "Olá! Como posso ajudar você hoje?",
      avatarUrl: config?.avatarUrl ?? null,
      corBotao: config?.corBotao ?? "#1351B4",
      temaWidget: config?.temaWidget ?? "light",
      canaisAtivos: config?.canaisAtivos ?? { ouvidoria: true, sic: true },
      modeloIA: config?.modeloIA ?? "gpt-4o-mini",
    });
  } catch (err) {
    console.error("[FALE-CONOSCO] config error:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
});

router.post("/fale-conosco/chat", async (req, res) => {
  try {
    const slug = getTenant(req);
    const tenant = await resolveTenant(slug);
    if (!tenant) return res.status(404).json({ error: "Tenant não encontrado." });

    const body = req.body as {
      mensagem?: string;
      sessionId?: string;
      historico?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!body.mensagem || body.mensagem.trim().length === 0) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const config = await getConfig(tenant.id);

    if (!config?.habilitado) {
      return res.json({
        resposta: config?.mensagemOffline ?? "Atendimento temporariamente indisponível.",
        sessionId: body.sessionId ?? randomUUID(),
      });
    }

    let sessionId = body.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();
      await db.insert(chatSessionsTable).values({
        id: randomUUID(),
        tenantId: tenant.id,
        sessionToken: sessionId,
      });
    } else {
      await db.update(chatSessionsTable)
        .set({ lastActivityAt: new Date(), totalMensagens: 1 })
        .where(and(eq(chatSessionsTable.tenantId, tenant.id), eq(chatSessionsTable.sessionToken, sessionId)));
    }

    const historico = (body.historico ?? []).slice(-8).map(h => ({
      role: h.role,
      content: h.content,
    }));

    const systemPrompt = config?.systemPrompt ?? `Você é um assistente virtual da Prefeitura de ${tenant.nome}. Responda de forma objetiva, cordial e em português brasileiro. Ajude os cidadãos com informações sobre serviços, transparência, ouvidoria e demais assuntos municipais.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...historico,
      { role: "user", content: body.mensagem.trim() },
    ];

    const completion = await openai.chat.completions.create({
      model: config?.modeloIA ?? "gpt-4o-mini",
      messages,
      max_tokens: config?.maxTokens ?? 500,
    });

    const resposta = completion.choices[0]?.message?.content ?? "Não consegui processar sua mensagem. Tente novamente.";

    return res.json({ resposta, sessionId });
  } catch (err) {
    console.error("[FALE-CONOSCO] chat error:", err);
    return res.status(500).json({ error: "Erro ao processar mensagem. Tente novamente." });
  }
});

export default router;
