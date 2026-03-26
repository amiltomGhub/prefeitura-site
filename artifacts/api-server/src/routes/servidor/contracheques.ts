import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  contrachequeTable,
  contrachequeLinhasTable,
  servidoresCadastroTable,
} from "@workspace/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../../middlewares/requireAuth";

const router: IRouter = Router();

// GET /api/servidor/contracheques?ano=2025&page=1&limit=12
router.get("/servidor/contracheques", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const ano = req.query["ano"] ? parseInt(req.query["ano"] as string) : undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) ?? "1"));
    const limit = Math.min(48, Math.max(1, parseInt((req.query["limit"] as string) ?? "24")));
    const offset = (page - 1) * limit;

    const conditions = [eq(contrachequeTable.servidorId, servidorId)];
    if (ano) conditions.push(eq(contrachequeTable.ano, ano));
    const where = and(...conditions);

    const [total, data] = await Promise.all([
      db.select({ count: count() }).from(contrachequeTable).where(where),
      db
        .select()
        .from(contrachequeTable)
        .where(where)
        .orderBy(desc(contrachequeTable.ano), desc(contrachequeTable.mes))
        .limit(limit)
        .offset(offset),
    ]);

    const totalCount = total[0]?.count ?? 0;
    res.json({
      data,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
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

    if (isNaN(mes) || mes < 1 || mes > 12) return res.status(400).json({ error: "Mês inválido" });
    if (isNaN(ano) || ano < 2000) return res.status(400).json({ error: "Ano inválido" });

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
      linhas: {
        vencimentos: linhas.filter((l) => l.tipo === "vencimento"),
        descontos: linhas.filter((l) => l.tipo === "desconto"),
        informativos: linhas.filter((l) => l.tipo === "informativo"),
      },
      servidor: servidor
        ? {
            nome: servidor.nome,
            cpf: servidor.cpf.replace(/(\d{3})\d{3}(\d{3})(\d{2})/, "$1.***.$2-$3"),
            matricula: servidor.matricula,
            cargo: servidor.cargo,
            nivel: servidor.nivel,
            secretaria: servidor.secretaria,
            localTrabalho: servidor.localTrabalho,
            dataIngresso: servidor.dataIngresso,
            vinculo: servidor.vinculo,
            banco: servidor.banco,
            agencia: servidor.agencia,
            conta: servidor.conta ? `****${servidor.conta.slice(-4)}` : null,
          }
        : null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/contracheques/:mes/:ano/pdf — Mocked PDF download
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

    const [servidor] = await db
      .select({ nome: servidoresCadastroTable.nome, matricula: servidoresCadastroTable.matricula })
      .from(servidoresCadastroTable)
      .where(eq(servidoresCadastroTable.id, servidorId))
      .limit(1);

    // Retorna um PDF mockado em texto (simulação enquanto gerador real não está integrado)
    const conteudo = `
PREFEITURA MUNICIPAL DE PARAUAPEBAS
CONTRACHEQUE — COMPETÊNCIA: ${contracheque.competencia}

Servidor: ${servidor?.nome ?? ""}
Matrícula: ${servidor?.matricula ?? ""}
Cargo: ${contracheque.cargoNaCompetencia ?? ""}
Lotação: ${contracheque.secretariaNaCompetencia ?? ""}

TOTAIS:
  Bruto:     R$ ${contracheque.totalBruto.toFixed(2)}
  Descontos: R$ ${contracheque.totalDescontos.toFixed(2)}
  Líquido:   R$ ${contracheque.totalLiquido.toFixed(2)}

Status: ${contracheque.status === "pago" ? "PAGO" : "PENDENTE"}
    `.trim();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="contracheque-${String(mes).padStart(2, "0")}-${ano}.pdf"`
    );
    // Mocked: envia texto como payload (frontend receberá e exibirá via blob URL)
    res.send(Buffer.from(conteudo, "utf-8"));
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
    if (isNaN(ano)) return res.status(400).json({ error: "Ano inválido" });

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
        ? {
            nome: servidor.nome,
            cpf: servidor.cpf.replace(/(\d{3})\d{3}(\d{3})(\d{2})/, "$1.***.$2-$3"),
            matricula: servidor.matricula,
            cargo: servidor.cargo,
          }
        : null,
      orgao: "Prefeitura Municipal de Parauapebas",
      cnpjFonte: "00.000.000/0001-00",
      totalBruto: Math.round(totalBruto * 100) / 100,
      totalDescontos: Math.round(totalDescontos * 100) / 100,
      totalLiquido: Math.round(totalLiquido * 100) / 100,
      meses: contracheques.map((c) => ({
        mes: c.mes,
        competencia: c.competencia,
        bruto: c.totalBruto,
        descontos: c.totalDescontos,
        liquido: c.totalLiquido,
        status: c.status,
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
