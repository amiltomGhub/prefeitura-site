import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface SicPayload {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  tipoSolicitacao?: string;
  orgao?: string;
  descricao?: string;
  formataResposta?: string;
  lgpdConsent?: boolean;
}

function validate(body: SicPayload): string | null {
  if (!body.nome || body.nome.trim().length < 3) return "Nome é obrigatório (mínimo 3 caracteres).";
  if (!body.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(body.cpf)) return "CPF inválido.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "E-mail inválido.";
  const tiposValidos = ["informacao", "recurso", "outros"];
  if (!body.tipoSolicitacao || !tiposValidos.includes(body.tipoSolicitacao)) return "Tipo de solicitação inválido.";
  if (!body.orgao || body.orgao.trim().length < 3) return "Órgão/Secretaria é obrigatório.";
  if (!body.descricao || body.descricao.trim().length < 20) return "Descrição deve ter no mínimo 20 caracteres.";
  if (!body.lgpdConsent) return "Você precisa aceitar o tratamento de dados pessoais (LGPD).";
  return null;
}

function generateProtocolo(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  return `SIC-${year}-${seq}`;
}

function getPrazo(): string {
  const date = new Date();
  date.setDate(date.getDate() + 20);
  return date.toISOString();
}

router.post("/sic", async (req, res) => {
  try {
    const body = req.body as SicPayload;
    const error = validate(body);
    if (error) {
      return res.status(400).json({ error });
    }

    const protocolo = generateProtocolo();
    const prazo = getPrazo();

    console.log(`[SIC] Pedido registrado: ${protocolo} | Órgão: ${body.orgao} | Tipo: ${body.tipoSolicitacao}`);

    return res.status(201).json({
      protocolo,
      prazo,
      mensagem: "Pedido de acesso à informação registrado com sucesso.",
      laiRef: "Lei 12.527/2011, Art. 11 — prazo de 20 dias corridos.",
    });
  } catch (err) {
    console.error("[SIC] Erro ao registrar pedido:", err);
    return res.status(500).json({ error: "Erro interno ao processar pedido." });
  }
});

router.get("/sic/estatisticas", async (_req, res) => {
  return res.json({
    totalPedidos: 127,
    respondidosNoPrazo: 94,
    taxaResposta: 94,
    tempoMedioDias: 8,
    recursosAbertos: 12,
    porResultado: {
      acessoConcedido: 68,
      acessoParcial: 15,
      acessoNegado: 8,
      emAndamento: 9,
    },
  });
});

export default router;
