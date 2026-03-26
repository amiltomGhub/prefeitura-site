import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  solicitacoesFeriasTable,
  periodosAquisitivosTable,
} from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { requireAuth, type AuthRequest } from "../../middlewares/requireAuth";

const router: IRouter = Router();

// GET /api/servidor/ferias/saldo
router.get("/servidor/ferias/saldo", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const periodos = await db
      .select()
      .from(periodosAquisitivosTable)
      .where(eq(periodosAquisitivosTable.servidorId, servidorId))
      .orderBy(desc(periodosAquisitivosTable.dataInicio));

    const periodoAtual = periodos.find((p) => p.status === "disponivel") ?? periodos[0] ?? null;
    const saldoTotal = periodos
      .filter((p) => p.status === "disponivel")
      .reduce((s, p) => s + p.diasSaldo, 0);

    const hoje = new Date();
    let progressoAquisitivo = 0;
    let diasTrabalhados = 0;

    if (periodoAtual) {
      const inicio = new Date(periodoAtual.dataInicio);
      const fim = new Date(periodoAtual.dataFim);
      const totalDias = Math.ceil((fim.getTime() - inicio.getTime()) / 86400000);
      diasTrabalhados = Math.max(0, Math.min(totalDias, Math.ceil((hoje.getTime() - inicio.getTime()) / 86400000)));
      progressoAquisitivo = totalDias > 0 ? Math.round((diasTrabalhados / totalDias) * 100) : 0;
    }

    const prazoVencido = periodoAtual?.prazoLimite
      ? new Date(periodoAtual.prazoLimite) < hoje
      : false;

    res.json({
      saldoTotal,
      periodoAtual,
      progressoAquisitivo,
      diasTrabalhados,
      prazoVencido,
      periodos,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/ferias/historico
router.get("/servidor/ferias/historico", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const solicitacoes = await db
      .select()
      .from(solicitacoesFeriasTable)
      .where(eq(solicitacoesFeriasTable.servidorId, servidorId))
      .orderBy(desc(solicitacoesFeriasTable.createdAt));

    res.json({ data: solicitacoes });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// POST /api/servidor/ferias/solicitar
router.post("/servidor/ferias/solicitar", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const tenantId = req.user!.tenantId;
    const b = req.body;

    if (!b.periodoAquisitivoId) return res.status(400).json({ error: "periodoAquisitivoId é obrigatório" });
    if (!b.dataInicio) return res.status(400).json({ error: "dataInicio é obrigatório" });
    if (!b.qtdDias || b.qtdDias < 5) return res.status(400).json({ error: "qtdDias mínimo é 5" });

    const [periodo] = await db
      .select()
      .from(periodosAquisitivosTable)
      .where(
        and(
          eq(periodosAquisitivosTable.id, b.periodoAquisitivoId),
          eq(periodosAquisitivosTable.servidorId, servidorId)
        )
      )
      .limit(1);

    if (!periodo) return res.status(404).json({ error: "Período aquisitivo não encontrado" });
    if (periodo.diasSaldo < b.qtdDias) {
      return res.status(400).json({ error: "Saldo insuficiente de dias de férias" });
    }

    const inicio = new Date(b.dataInicio);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + (b.qtdDias as number) - 1);
    const retorno = new Date(fim);
    retorno.setDate(retorno.getDate() + 1);

    const protocolo = `FER-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const id = randomUUID();

    const timeline = [
      {
        status: "protocolado",
        descricao: "Solicitação registrada pelo servidor",
        data: new Date().toISOString(),
        responsavel: req.user!.nome,
      },
    ];

    const nova = {
      id,
      tenantId,
      servidorId,
      periodoAquisitivoId: b.periodoAquisitivoId,
      protocolo,
      dataInicio: b.dataInicio,
      dataFim: fim.toISOString().split("T")[0]!,
      dataRetorno: retorno.toISOString().split("T")[0]!,
      qtdDias: b.qtdDias as number,
      parcelamento: (b.parcelamento as number) ?? 1,
      adiantamento13: b.adiantamento13 ?? false,
      abonoPecuniario: b.abonoPecuniario ?? false,
      diasAbono: (b.diasAbono as number) ?? 0,
      status: "aguardando_chefia",
      timeline,
    };

    await db.insert(solicitacoesFeriasTable).values(nova);

    res.status(201).json({ protocolo, id, status: "aguardando_chefia" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/ferias/:id
router.get("/servidor/ferias/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const [sol] = await db
      .select()
      .from(solicitacoesFeriasTable)
      .where(
        and(
          eq(solicitacoesFeriasTable.id, req.params["id"]!),
          eq(solicitacoesFeriasTable.servidorId, servidorId)
        )
      )
      .limit(1);

    if (!sol) return res.status(404).json({ error: "Solicitação não encontrada" });

    const [periodo] = await db
      .select()
      .from(periodosAquisitivosTable)
      .where(eq(periodosAquisitivosTable.id, sol.periodoAquisitivoId))
      .limit(1);

    res.json({ solicitacao: sol, periodo });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
