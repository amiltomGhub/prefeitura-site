import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requerimentosTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { requireAuth, type AuthRequest } from "../../middlewares/requireAuth";

const router: IRouter = Router();

const TIPOS_REQUERIMENTO = [
  "licenca-interesses-particulares",
  "licenca-acompanhar-conjuge",
  "licenca-maternidade",
  "licenca-paternidade",
  "licenca-doenca-familiar",
  "licenca-saude",
  "averbacao-tempo-servico",
  "certidao-tempo-servico",
  "revisao-enquadramento",
  "progressao-funcional",
  "remocao-lotacao",
  "insalubridade-periculosidade",
  "afastamento-capacitacao",
  "outros",
] as const;

// GET /api/servidor/requerimentos?tipo=&status=&page=1&limit=20
router.get("/servidor/requerimentos", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const conditions = [eq(requerimentosTable.servidorId, servidorId)];
    if (req.query["tipo"]) conditions.push(eq(requerimentosTable.tipo, req.query["tipo"] as string));
    if (req.query["status"]) conditions.push(eq(requerimentosTable.status, req.query["status"] as string));

    const reqs = await db
      .select()
      .from(requerimentosTable)
      .where(and(...conditions))
      .orderBy(desc(requerimentosTable.createdAt))
      .limit(100);

    res.json({ data: reqs, tipos: TIPOS_REQUERIMENTO });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// POST /api/servidor/requerimentos
// Body (JSON): { tipo, assunto?, justificativa (min 100 chars), camposEspecificos?, documentos? }
// documentos: array de { nome, url, tamanho } — arquivos já enviados via upload prévio (multipart)
// ou enviados como base64 em { nome, conteudoBase64, mimeType } para integração futura.
// O upload real de arquivos deve ser feito antes desta chamada usando uma rota de upload dedicada
// (e.g. POST /api/upload), que retorna a URL pública do arquivo para compor o array documentos.
router.post("/servidor/requerimentos", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const tenantId = req.user!.tenantId;
    const b = req.body;

    if (!b.tipo) return res.status(400).json({ error: "tipo é obrigatório" });
    if (!TIPOS_REQUERIMENTO.includes(b.tipo)) return res.status(400).json({ error: "Tipo de requerimento inválido" });
    if (!b.justificativa || (b.justificativa as string).length < 100) {
      return res.status(400).json({ error: "justificativa deve ter no mínimo 100 caracteres" });
    }

    // Validar estrutura dos documentos (se fornecidos)
    const documentos: Array<{ nome: string; url: string; tamanho: number }> = [];
    if (Array.isArray(b.documentos)) {
      for (const doc of b.documentos as unknown[]) {
        if (typeof doc !== "object" || doc === null) continue;
        const d = doc as Record<string, unknown>;
        if (!d["nome"] || !d["url"]) continue;
        documentos.push({
          nome: String(d["nome"]),
          url: String(d["url"]),
          tamanho: Number(d["tamanho"] ?? 0),
        });
      }
    }

    const protocolo = `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const id = randomUUID();

    const timeline = [
      {
        status: "protocolado",
        descricao: "Requerimento protocolado pelo servidor",
        data: new Date().toISOString(),
        responsavel: req.user!.nome,
      },
    ];

    const novo = {
      id,
      tenantId,
      servidorId,
      protocolo,
      tipo: b.tipo as string,
      assunto: (b.assunto as string) || (b.tipo as string),
      justificativa: b.justificativa as string,
      camposEspecificos: (b.camposEspecificos as object) ?? {},
      documentos,
      status: "protocolado",
      timeline,
    };

    await db.insert(requerimentosTable).values(novo);

    res.status(201).json({ protocolo, id, status: "protocolado", documentosAnexados: documentos.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/requerimentos/:id
router.get("/servidor/requerimentos/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const [req_] = await db
      .select()
      .from(requerimentosTable)
      .where(
        and(
          eq(requerimentosTable.id, req.params["id"]!),
          eq(requerimentosTable.servidorId, servidorId)
        )
      )
      .limit(1);

    if (!req_) return res.status(404).json({ error: "Requerimento não encontrado" });

    res.json(req_);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// POST /api/servidor/requerimentos/:id/recurso
router.post("/servidor/requerimentos/:id/recurso", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const [req_] = await db
      .select()
      .from(requerimentosTable)
      .where(
        and(
          eq(requerimentosTable.id, req.params["id"]!),
          eq(requerimentosTable.servidorId, servidorId)
        )
      )
      .limit(1);

    if (!req_) return res.status(404).json({ error: "Requerimento não encontrado" });
    if (req_.status !== "indeferido") {
      return res.status(400).json({ error: "Recurso só pode ser apresentado para requerimentos indeferidos" });
    }
    if (req_.recursoPresentado) {
      return res.status(400).json({ error: "Recurso já foi apresentado para este requerimento" });
    }
    if (req_.prazoRecurso && new Date(req_.prazoRecurso) < new Date()) {
      return res.status(400).json({ error: "Prazo para recurso encerrado" });
    }

    const novaTimeline = Array.isArray(req_.timeline) ? [...(req_.timeline as object[])] : [];
    novaTimeline.push({
      status: "recurso_apresentado",
      descricao: "Recurso apresentado pelo servidor",
      data: new Date().toISOString(),
      responsavel: req.user!.nome,
    });

    await db
      .update(requerimentosTable)
      .set({
        recursoPresentado: true,
        status: "em_analise",
        timeline: novaTimeline,
        updatedAt: new Date(),
      })
      .where(eq(requerimentosTable.id, req_.id));

    res.json({ message: "Recurso apresentado com sucesso", status: "em_analise" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
