import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  contrachequeTable,
  contrachequeLinhasTable,
  servidoresCadastroTable,
} from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../../middlewares/requireAuth";

const router: IRouter = Router();

// GET /api/servidor/contracheques?ano=2025
router.get("/servidor/contracheques", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const ano = req.query["ano"] ? parseInt(req.query["ano"] as string) : undefined;

    const conditions = [eq(contrachequeTable.servidorId, servidorId)];
    if (ano) conditions.push(eq(contrachequeTable.ano, ano));

    const contracheques = await db
      .select()
      .from(contrachequeTable)
      .where(and(...conditions))
      .orderBy(desc(contrachequeTable.ano), desc(contrachequeTable.mes))
      .limit(24);

    res.json({ data: contracheques });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/contracheques/:mes/:ano
router.get("/servidor/contracheques/:mes/:ano", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const mes = parseInt(req.params["mes"]!);
    const ano = parseInt(req.params["ano"]!);

    const [contracheque] = await db
      .select()
      .from(contrachequeTable)
      .where(
        and(
          eq(contrachequeTable.servidorId, servidorId),
          eq(contrachequeTable.mes, mes),
          eq(contrachequeTable.ano, ano)
        )
      )
      .limit(1);

    if (!contracheque) return res.status(404).json({ error: "Contracheque não encontrado" });

    const linhas = await db
      .select()
      .from(contrachequeLinhasTable)
      .where(eq(contrachequeLinhasTable.contrachequeId, contracheque.id))
      .orderBy(contrachequeLinhasTable.sortOrder);

    const [servidor] = await db
      .select()
      .from(servidoresCadastroTable)
      .where(eq(servidoresCadastroTable.id, servidorId))
      .limit(1);

    res.json({
      contracheque,
      linhas,
      servidor: servidor
        ? {
            nome: servidor.nome,
            cpf: servidor.cpf,
            matricula: servidor.matricula,
            cargo: servidor.cargo,
            nivel: servidor.nivel,
            secretaria: servidor.secretaria,
            localTrabalho: servidor.localTrabalho,
            dataIngresso: servidor.dataIngresso,
            vinculo: servidor.vinculo,
          }
        : null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/contracheques/:mes/:ano/pdf
router.get("/servidor/contracheques/:mes/:ano/pdf", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const mes = parseInt(req.params["mes"]!);
    const ano = parseInt(req.params["ano"]!);

    const [contracheque] = await db
      .select()
      .from(contrachequeTable)
      .where(
        and(
          eq(contrachequeTable.servidorId, servidorId),
          eq(contrachequeTable.mes, mes),
          eq(contrachequeTable.ano, ano)
        )
      )
      .limit(1);

    if (!contracheque) return res.status(404).json({ error: "Contracheque não encontrado" });

    res.json({
      message: "PDF mockado — integração com gerador de PDF será implementada no frontend",
      contrachequeId: contracheque.id,
      competencia: contracheque.competencia,
      downloadUrl: `/api/servidor/contracheques/${mes}/${ano}/pdf/download`,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/rendimentos/:ano  — Declaração IRRF anual
router.get("/servidor/rendimentos/:ano", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const ano = parseInt(req.params["ano"]!);

    const contracheques = await db
      .select()
      .from(contrachequeTable)
      .where(
        and(
          eq(contrachequeTable.servidorId, servidorId),
          eq(contrachequeTable.ano, ano)
        )
      )
      .orderBy(contrachequeTable.mes);

    const [servidor] = await db
      .select()
      .from(servidoresCadastroTable)
      .where(eq(servidoresCadastroTable.id, servidorId))
      .limit(1);

    const totalBruto = contracheques.reduce((s, c) => s + c.totalBruto, 0);
    const totalDescontos = contracheques.reduce((s, c) => s + c.totalDescontos, 0);
    const totalLiquido = contracheques.reduce((s, c) => s + c.totalLiquido, 0);

    res.json({
      ano,
      servidor: servidor
        ? { nome: servidor.nome, cpf: servidor.cpf, matricula: servidor.matricula }
        : null,
      totalBruto,
      totalDescontos,
      totalLiquido,
      meses: contracheques.map((c) => ({
        mes: c.mes,
        competencia: c.competencia,
        bruto: c.totalBruto,
        descontos: c.totalDescontos,
        liquido: c.totalLiquido,
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
