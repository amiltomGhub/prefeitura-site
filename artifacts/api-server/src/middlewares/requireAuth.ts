import { type Request, type Response, type NextFunction } from "express";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "portal-municipal-secret-key-change-in-production"
);

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  nome: string;
  isAdmin: boolean;
  modulosPermitidos: string[];
  /** ID do cadastro em servidores_cadastro — presente apenas para usuários do Portal do Servidor */
  servidorId?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token de autenticação ausente." });
    }
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, JWT_SECRET);
    req.user = payload as unknown as AuthUser;
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

export async function requireModule(modulo: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado." });
    }
    if (!req.user.isAdmin && !req.user.modulosPermitidos.includes(modulo)) {
      return res.status(403).json({ error: `Sem permissão para o módulo: ${modulo}` });
    }
    return next();
  };
}

/**
 * Guarda para rotas do Portal do Servidor.
 * Requer que o JWT contenha servidorId (usuário vinculado a um cadastro de servidor).
 */
export function requireServidor(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  if (!req.user.servidorId) {
    return res.status(403).json({ error: "Acesso restrito ao Portal do Servidor. Usuário não vinculado a nenhum cadastro funcional." });
  }
  return next();
}

/**
 * Guarda para rotas do Painel RH.
 * Requer que o usuário autenticado seja admin ou possua o módulo "rh".
 */
export function requireRH(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  if (!req.user.isAdmin && !req.user.modulosPermitidos.includes("rh")) {
    return res.status(403).json({ error: "Acesso restrito ao Painel RH." });
  }
  return next();
}
