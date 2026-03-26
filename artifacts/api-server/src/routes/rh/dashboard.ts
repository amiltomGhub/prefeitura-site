import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  servidoresCadastroTable,
  solicitacoesFeriasTable,
  requerimentosTable,
  periodosAquisitivosTable,
  contrachequeTable,
} from "@workspace/db/schema";
import { eq, and, sql, lt } from "drizzle-orm";
import { requireAuth, requireRH, type AuthRequest } from "../../middlewares/requireAuth";

const router: IRouter = Router();

// GET /api/rh/dashboard — Painel RH (admin ou módulo "rh" obrigatório)
router.get("/rh/dashboard", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const hoje = new Date().toISOString().split("T")[0]!;

    const [servidoresAtivos, feriasVencidas, reqPendentes] = await Promise.all([
      // Servidores ativos agrupados por secretaria
      db
        .select({
          secretaria: servidoresCadastroTable.secretaria,
          total: sql<number>`count(*)::int`,
        })
        .from(servidoresCadastroTable)
        .where(
          and(
            eq(servidoresCadastroTable.tenantId, tenantId),
            eq(servidoresCadastroTable.status, "ativo")
          )
        )
        .groupBy(servidoresCadastroTable.secretaria),

      // Férias vencidas (prazo_limite < hoje e ainda disponível)
      db
        .select({
          periodo: periodosAquisitivosTable,
          servidor: {
            id: servidoresCadastroTable.id,
            nome: servidoresCadastroTable.nome,
            matricula: servidoresCadastroTable.matricula,
            secretaria: servidoresCadastroTable.secretaria,
          },
        })
        .from(periodosAquisitivosTable)
        .innerJoin(
          servidoresCadastroTable,
          eq(periodosAquisitivosTable.servidorId, servidoresCadastroTable.id)
        )
        .where(
          and(
            eq(servidoresCadastroTable.tenantId, tenantId),
            eq(periodosAquisitivosTable.status, "disponivel"),
            lt(periodosAquisitivosTable.prazoLimite, hoje)
          )
        ),

      // Requerimentos pendentes
      db
        .select()
        .from(requerimentosTable)
        .where(
          and(
            eq(requerimentosTable.tenantId, tenantId),
            eq(requerimentosTable.status, "em_analise")
          )
        )
        .limit(50),
    ]);

    // Aniversariantes do mês
    const mesAtual = new Date().getMonth() + 1;
    const aniversariantes = await db
      .select({
        id: servidoresCadastroTable.id,
        nome: servidoresCadastroTable.nome,
        dataNascimento: servidoresCadastroTable.dataNascimento,
        secretaria: servidoresCadastroTable.secretaria,
        cargo: servidoresCadastroTable.cargo,
      })
      .from(servidoresCadastroTable)
      .where(
        and(
          eq(servidoresCadastroTable.tenantId, tenantId),
          eq(servidoresCadastroTable.status, "ativo"),
          sql`EXTRACT(MONTH FROM data_nascimento) = ${mesAtual}`
        )
      );

    // Férias aguardando aprovação
    const feriasPendentes = await db
      .select()
      .from(solicitacoesFeriasTable)
      .where(
        and(
          eq(solicitacoesFeriasTable.tenantId, tenantId),
          eq(solicitacoesFeriasTable.status, "aguardando_chefia")
        )
      )
      .limit(20);

    // Resumo da folha do mês atual
    const mesHoje = new Date().getMonth() + 1;
    const anoHoje = new Date().getFullYear();
    const folhaDoMes = await db
      .select({
        totalBruto: sql<number>`COALESCE(sum(${contrachequeTable.totalBruto}), 0)::numeric`,
        totalLiquido: sql<number>`COALESCE(sum(${contrachequeTable.totalLiquido}), 0)::numeric`,
        totalDescontos: sql<number>`COALESCE(sum(${contrachequeTable.totalDescontos}), 0)::numeric`,
        qtdServidores: sql<number>`count(*)::int`,
      })
      .from(contrachequeTable)
      .innerJoin(
        servidoresCadastroTable,
        eq(contrachequeTable.servidorId, servidoresCadastroTable.id)
      )
      .where(
        and(
          eq(servidoresCadastroTable.tenantId, tenantId),
          eq(contrachequeTable.mes, mesHoje),
          eq(contrachequeTable.ano, anoHoje)
        )
      );

    res.json({
      servidoresPorSecretaria: servidoresAtivos,
      feriasVencidas,
      requerimentosPendentes: reqPendentes,
      aniversariantes,
      feriasPendentesAprovacao: feriasPendentes,
      folhaDoMes: folhaDoMes[0] ?? { totalBruto: 0, totalLiquido: 0, totalDescontos: 0, qtdServidores: 0 },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/rh/ferias/pendentes
router.get("/rh/ferias/pendentes", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;

    const pendentes = await db
      .select({
        solicitacao: solicitacoesFeriasTable,
        servidor: {
          id: servidoresCadastroTable.id,
          nome: servidoresCadastroTable.nome,
          matricula: servidoresCadastroTable.matricula,
          cargo: servidoresCadastroTable.cargo,
          secretaria: servidoresCadastroTable.secretaria,
        },
      })
      .from(solicitacoesFeriasTable)
      .innerJoin(
        servidoresCadastroTable,
        eq(solicitacoesFeriasTable.servidorId, servidoresCadastroTable.id)
      )
      .where(
        and(
          eq(solicitacoesFeriasTable.tenantId, tenantId),
          eq(solicitacoesFeriasTable.status, "aguardando_chefia")
        )
      );

    res.json({ data: pendentes });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// PATCH /api/rh/ferias/:id/aprovar
router.patch("/rh/ferias/:id/aprovar", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;

    const [sol] = await db
      .select()
      .from(solicitacoesFeriasTable)
      .where(
        and(
          eq(solicitacoesFeriasTable.id, req.params["id"]!),
          eq(solicitacoesFeriasTable.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!sol) return res.status(404).json({ error: "Solicitação não encontrada" });

    const ESTADOS_FINAIS_FERIAS = ["aprovado", "rejeitado", "cancelado"];
    if (ESTADOS_FINAIS_FERIAS.includes(sol.status)) {
      return res.status(400).json({ error: `Não é possível aprovar uma solicitação com status '${sol.status}'.` });
    }

    const novaTimeline = Array.isArray(sol.timeline) ? [...(sol.timeline as object[])] : [];
    novaTimeline.push({
      status: "aprovado",
      descricao: "Férias aprovadas pelo RH",
      data: new Date().toISOString(),
      responsavel: req.user!.nome,
    });

    await db
      .update(solicitacoesFeriasTable)
      .set({
        status: "aprovado",
        aprovadoPor: req.user!.nome,
        aprovadoEm: new Date(),
        timeline: novaTimeline,
        updatedAt: new Date(),
      })
      .where(eq(solicitacoesFeriasTable.id, sol.id));

    res.json({ message: "Férias aprovadas", id: sol.id });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// PATCH /api/rh/ferias/:id/rejeitar
router.patch("/rh/ferias/:id/rejeitar", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const { motivo } = req.body as { motivo?: string };
    if (!motivo) return res.status(400).json({ error: "motivo é obrigatório" });

    const [sol] = await db
      .select()
      .from(solicitacoesFeriasTable)
      .where(
        and(
          eq(solicitacoesFeriasTable.id, req.params["id"]!),
          eq(solicitacoesFeriasTable.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!sol) return res.status(404).json({ error: "Solicitação não encontrada" });

    const ESTADOS_FINAIS_FERIAS = ["aprovado", "rejeitado", "cancelado"];
    if (ESTADOS_FINAIS_FERIAS.includes(sol.status)) {
      return res.status(400).json({ error: `Não é possível rejeitar uma solicitação com status '${sol.status}'.` });
    }

    const novaTimeline = Array.isArray(sol.timeline) ? [...(sol.timeline as object[])] : [];
    novaTimeline.push({
      status: "rejeitado",
      descricao: `Férias rejeitadas: ${motivo}`,
      data: new Date().toISOString(),
      responsavel: req.user!.nome,
    });

    await db
      .update(solicitacoesFeriasTable)
      .set({
        status: "rejeitado",
        motivoRejeicao: motivo,
        timeline: novaTimeline,
        updatedAt: new Date(),
      })
      .where(eq(solicitacoesFeriasTable.id, sol.id));

    res.json({ message: "Férias rejeitadas", id: sol.id });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/rh/requerimentos/pendentes
router.get("/rh/requerimentos/pendentes", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;

    const pendentes = await db
      .select({
        requerimento: requerimentosTable,
        servidor: {
          id: servidoresCadastroTable.id,
          nome: servidoresCadastroTable.nome,
          matricula: servidoresCadastroTable.matricula,
          cargo: servidoresCadastroTable.cargo,
          secretaria: servidoresCadastroTable.secretaria,
        },
      })
      .from(requerimentosTable)
      .innerJoin(
        servidoresCadastroTable,
        eq(requerimentosTable.servidorId, servidoresCadastroTable.id)
      )
      .where(
        and(
          eq(requerimentosTable.tenantId, tenantId),
          eq(requerimentosTable.status, "em_analise")
        )
      );

    res.json({ data: pendentes });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// PATCH /api/rh/requerimentos/:id/deferir
router.patch("/rh/requerimentos/:id/deferir", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const { parecer, decisao } = req.body as { parecer?: string; decisao?: string };

    const [req_] = await db
      .select()
      .from(requerimentosTable)
      .where(
        and(
          eq(requerimentosTable.id, req.params["id"]!),
          eq(requerimentosTable.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!req_) return res.status(404).json({ error: "Requerimento não encontrado" });

    const ESTADOS_FINAIS_REQ = ["deferido", "indeferido", "arquivado"];
    if (ESTADOS_FINAIS_REQ.includes(req_.status)) {
      return res.status(400).json({ error: `Não é possível deferir um requerimento com status '${req_.status}'.` });
    }

    const novaTimeline = Array.isArray(req_.timeline) ? [...(req_.timeline as object[])] : [];
    novaTimeline.push({
      status: "deferido",
      descricao: "Requerimento deferido pelo RH",
      data: new Date().toISOString(),
      responsavel: req.user!.nome,
    });

    // Gerar despacho formal estruturado
    const agora = new Date();
    const despacho = [
      `DESPACHO — ${agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`,
      ``,
      `Requerimento: ${req_.protocolo}`,
      `Tipo: ${req_.tipo}`,
      `Servidor: (ver cadastro ID ${req_.servidorId})`,
      ``,
      `DECISÃO: ${decisao ?? "DEFERIDO"}`,
      ``,
      parecer ? `PARECER TÉCNICO:\n${parecer}` : "Analisado e julgado procedente.",
      ``,
      `Decisor: ${req.user!.nome}`,
      `Data: ${agora.toISOString()}`,
    ].join("\n");

    await db
      .update(requerimentosTable)
      .set({
        status: "deferido",
        parecerTecnico: parecer,
        decisao: decisao ?? "Deferido",
        despacho,
        decisorNome: req.user!.nome,
        decidoEm: new Date(),
        timeline: novaTimeline,
        updatedAt: new Date(),
      })
      .where(eq(requerimentosTable.id, req_.id));

    res.json({ message: "Requerimento deferido", id: req_.id, despacho });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// PATCH /api/rh/requerimentos/:id/indeferir
router.patch("/rh/requerimentos/:id/indeferir", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const { parecer, motivo } = req.body as { parecer?: string; motivo?: string };
    if (!motivo) return res.status(400).json({ error: "motivo é obrigatório" });

    const [req_] = await db
      .select()
      .from(requerimentosTable)
      .where(
        and(
          eq(requerimentosTable.id, req.params["id"]!),
          eq(requerimentosTable.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!req_) return res.status(404).json({ error: "Requerimento não encontrado" });

    const ESTADOS_FINAIS_REQ = ["deferido", "indeferido", "arquivado"];
    if (ESTADOS_FINAIS_REQ.includes(req_.status)) {
      return res.status(400).json({ error: `Não é possível indeferir um requerimento com status '${req_.status}'.` });
    }

    const prazoRecurso = new Date();
    prazoRecurso.setDate(prazoRecurso.getDate() + 15);

    const novaTimeline = Array.isArray(req_.timeline) ? [...(req_.timeline as object[])] : [];
    novaTimeline.push({
      status: "indeferido",
      descricao: `Requerimento indeferido: ${motivo}`,
      data: new Date().toISOString(),
      responsavel: req.user!.nome,
    });

    // Gerar despacho formal estruturado de indeferimento
    const agora = new Date();
    const despacho = [
      `DESPACHO DE INDEFERIMENTO — ${agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`,
      ``,
      `Requerimento: ${req_.protocolo}`,
      `Tipo: ${req_.tipo}`,
      `Servidor: (ver cadastro ID ${req_.servidorId})`,
      ``,
      `DECISÃO: INDEFERIDO`,
      ``,
      `MOTIVO:\n${motivo}`,
      ``,
      parecer ? `PARECER TÉCNICO:\n${parecer}` : "",
      ``,
      `Prazo para recurso: ${prazoRecurso.toISOString().split("T")[0]}`,
      ``,
      `Decisor: ${req.user!.nome}`,
      `Data: ${agora.toISOString()}`,
    ].filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n");

    await db
      .update(requerimentosTable)
      .set({
        status: "indeferido",
        parecerTecnico: parecer,
        decisao: "Indeferido",
        motivoDecisao: motivo,
        despacho,
        decisorNome: req.user!.nome,
        decidoEm: new Date(),
        prazoRecurso: prazoRecurso.toISOString().split("T")[0]!,
        timeline: novaTimeline,
        updatedAt: new Date(),
      })
      .where(eq(requerimentosTable.id, req_.id));

    res.json({
      message: "Requerimento indeferido",
      id: req_.id,
      prazoRecurso: prazoRecurso.toISOString().split("T")[0],
      despacho,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/rh/folha-resumo?mes=&ano=
router.get("/rh/folha-resumo", requireAuth, requireRH, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const mes = req.query["mes"] ? parseInt(req.query["mes"] as string) : new Date().getMonth() + 1;
    const ano = req.query["ano"] ? parseInt(req.query["ano"] as string) : new Date().getFullYear();

    const resumo = await db
      .select({
        totalBruto: sql<number>`COALESCE(sum(${contrachequeTable.totalBruto}), 0)::numeric`,
        totalLiquido: sql<number>`COALESCE(sum(${contrachequeTable.totalLiquido}), 0)::numeric`,
        totalDescontos: sql<number>`COALESCE(sum(${contrachequeTable.totalDescontos}), 0)::numeric`,
        qtdServidores: sql<number>`count(*)::int`,
      })
      .from(contrachequeTable)
      .innerJoin(
        servidoresCadastroTable,
        eq(contrachequeTable.servidorId, servidoresCadastroTable.id)
      )
      .where(
        and(
          eq(servidoresCadastroTable.tenantId, tenantId),
          eq(contrachequeTable.mes, mes),
          eq(contrachequeTable.ano, ano)
        )
      );

    res.json({
      mes,
      ano,
      ...resumo[0],
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
