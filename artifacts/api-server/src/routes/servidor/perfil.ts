import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  servidoresCadastroTable,
  historicoFuncionalTable,
} from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../../middlewares/requireAuth";

const router: IRouter = Router();

// GET /api/servidor/perfil
router.get("/servidor/perfil", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const [servidor] = await db
      .select()
      .from(servidoresCadastroTable)
      .where(eq(servidoresCadastroTable.id, servidorId))
      .limit(1);

    if (!servidor) return res.status(404).json({ error: "Servidor não encontrado" });

    // Mascarar dados sensíveis
    const perfil = {
      ...servidor,
      cpf: servidor.cpf.replace(/(\d{3})\d{3}(\d{3})(\d{2})/, "$1.***.$2-$3"),
      conta: servidor.conta ? `****${servidor.conta.slice(-4)}` : null,
      agencia: servidor.agencia,
      banco: servidor.banco,
    };

    res.json(perfil);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// PUT /api/servidor/perfil — apenas campos pessoais editáveis
router.put("/servidor/perfil", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;
    const b = req.body;

    const camposPermitidos: Partial<typeof servidoresCadastroTable.$inferInsert> = {};
    if (b.emailPessoal !== undefined) camposPermitidos.emailPessoal = b.emailPessoal;
    if (b.telefone !== undefined) camposPermitidos.telefone = b.telefone;
    if (b.endereco !== undefined) camposPermitidos.endereco = b.endereco;
    if (b.numero !== undefined) camposPermitidos.numero = b.numero;
    if (b.complemento !== undefined) camposPermitidos.complemento = b.complemento;
    if (b.bairro !== undefined) camposPermitidos.bairro = b.bairro;
    if (b.cidade !== undefined) camposPermitidos.cidade = b.cidade;
    if (b.estado !== undefined) camposPermitidos.estado = b.estado;
    if (b.cep !== undefined) camposPermitidos.cep = b.cep;

    if (Object.keys(camposPermitidos).length === 0) {
      return res.status(400).json({ error: "Nenhum campo editável fornecido" });
    }

    camposPermitidos.updatedAt = new Date();

    await db
      .update(servidoresCadastroTable)
      .set(camposPermitidos)
      .where(eq(servidoresCadastroTable.id, servidorId));

    const [updated] = await db
      .select()
      .from(servidoresCadastroTable)
      .where(eq(servidoresCadastroTable.id, servidorId))
      .limit(1);

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/historico-funcional
router.get("/servidor/historico-funcional", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const historico = await db
      .select()
      .from(historicoFuncionalTable)
      .where(eq(historicoFuncionalTable.servidorId, servidorId))
      .orderBy(asc(historicoFuncionalTable.data));

    res.json({ data: historico });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/servidor/tempo-servico
router.get("/servidor/tempo-servico", requireAuth, async (req: AuthRequest, res) => {
  try {
    const servidorId = req.user!.id;

    const [servidor] = await db
      .select()
      .from(servidoresCadastroTable)
      .where(eq(servidoresCadastroTable.id, servidorId))
      .limit(1);

    if (!servidor) return res.status(404).json({ error: "Servidor não encontrado" });

    const hoje = new Date();
    const ingresso = new Date(servidor.dataIngresso);
    const diffMs = hoje.getTime() - ingresso.getTime();
    const totalDias = Math.floor(diffMs / 86400000);
    const anos = Math.floor(totalDias / 365);
    const meses = Math.floor((totalDias % 365) / 30);
    const dias = totalDias % 30;

    // Projeção de aposentadoria estimativa (regra geral: 35 anos homem / 30 anos mulher)
    const ANOS_PARA_APOSENTADORIA = 35;
    const anosRestantes = Math.max(0, ANOS_PARA_APOSENTADORIA - anos);
    const dataProjecao = new Date(ingresso);
    dataProjecao.setFullYear(dataProjecao.getFullYear() + ANOS_PARA_APOSENTADORIA);

    res.json({
      dataIngresso: servidor.dataIngresso,
      totalDias,
      anos,
      meses,
      dias,
      descricao: `${anos} anos, ${meses} meses e ${dias} dias`,
      projecaoAposentadoria: {
        dataEstimada: dataProjecao.toISOString().split("T")[0],
        anosRestantes,
        regra: `${ANOS_PARA_APOSENTADORIA} anos de contribuição (estimativa)`,
      },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
