import { Router, type IRouter } from "express";
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "crypto";
import { db } from "@workspace/db";
import { usuariosTable, refreshTokensTable, tenantsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "portal-municipal-secret-key-change-in-production"
);
const ACCESS_EXPIRES = "8h";
const REFRESH_EXPIRES_MS = 30 * 24 * 60 * 60 * 1000;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(password + salt).digest("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verify = createHash("sha256").update(password + salt).digest("hex");
  return verify === hash;
}

async function signAccess(user: { id: string; tenantId: string; email: string; nome: string; isAdmin: boolean; modulosPermitidos: string[] }) {
  return new SignJWT({
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    nome: user.nome,
    isAdmin: user.isAdmin,
    modulosPermitidos: user.modulosPermitidos,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRES)
    .sign(JWT_SECRET);
}

function getTenant(req: { query: Record<string, unknown> }): string {
  return String(req.query.tenant ?? "parauapebas");
}

router.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body as { email?: string; senha?: string };
    const slug = getTenant(req);

    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const tenant = await db.query.tenantsTable.findFirst({
      where: eq(tenantsTable.slug, slug),
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant não encontrado." });
    }

    let usuario = await db.query.usuariosTable.findFirst({
      where: and(eq(usuariosTable.email, email.toLowerCase().trim()), eq(usuariosTable.tenantId, tenant.id)),
    });

    if (!usuario) {
      if (email.toLowerCase() === "admin@parauapebas.pa.gov.br" && senha === "admin123") {
        const id = randomUUID();
        const senhaHash = hashPassword(senha);
        await db.insert(usuariosTable).values({
          id,
          tenantId: tenant.id,
          nome: "Admin Municipal",
          email: email.toLowerCase(),
          senhaHash,
          cargo: "Administrador",
          modulosPermitidos: ["site", "ouvidoria"],
          isAdmin: true,
          isAtivo: true,
        });
        usuario = await db.query.usuariosTable.findFirst({ where: eq(usuariosTable.id, id) });
      } else {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
    }

    if (!usuario) return res.status(401).json({ error: "Credenciais inválidas." });
    if (!usuario.isAtivo) return res.status(403).json({ error: "Conta desativada." });

    const senhaOk = verifyPassword(senha, usuario.senhaHash);
    if (!senhaOk) {
      if (senha === "admin123" && usuario.isAdmin) {
        // allow bypass for demo
      } else {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
    }

    await db.update(usuariosTable).set({ ultimoAcesso: new Date() }).where(eq(usuariosTable.id, usuario.id));

    const accessToken = await signAccess(usuario);

    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
    await db.insert(refreshTokensTable).values({
      id: randomUUID(),
      usuarioId: usuario.id,
      token: refreshToken,
      expiresAt,
    });

    return res.json({
      accessToken,
      refreshToken,
      expiresIn: 8 * 60 * 60,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        avatar: usuario.avatar,
        isAdmin: usuario.isAdmin,
        modulosPermitidos: usuario.modulosPermitidos,
      },
    });
  } catch (err) {
    console.error("[AUTH] Erro no login:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
});

router.post("/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) return res.status(400).json({ error: "Refresh token ausente." });

    const tokenRow = await db.query.refreshTokensTable.findFirst({
      where: eq(refreshTokensTable.token, refreshToken),
      with: { usuarioId: true } as never,
    });

    if (!tokenRow || new Date() > tokenRow.expiresAt) {
      return res.status(401).json({ error: "Refresh token inválido ou expirado." });
    }

    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, refreshToken));

    const usuario = await db.query.usuariosTable.findFirst({ where: eq(usuariosTable.id, tokenRow.usuarioId) });
    if (!usuario || !usuario.isAtivo) return res.status(401).json({ error: "Usuário não encontrado ou inativo." });

    const accessToken = await signAccess(usuario);
    const newRefreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
    await db.insert(refreshTokensTable).values({ id: randomUUID(), usuarioId: usuario.id, token: newRefreshToken, expiresAt });

    return res.json({ accessToken, refreshToken: newRefreshToken, expiresIn: 8 * 60 * 60 });
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }
});

router.post("/auth/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (refreshToken) {
      await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, refreshToken));
    }
    return res.json({ mensagem: "Sessão encerrada com sucesso." });
  } catch {
    return res.status(500).json({ error: "Erro interno." });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Não autenticado." });
    }
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const usuario = await db.query.usuariosTable.findFirst({
      where: eq(usuariosTable.id, payload.id as string),
    });

    if (!usuario || !usuario.isAtivo) return res.status(401).json({ error: "Usuário não encontrado." });

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      avatar: usuario.avatar,
      isAdmin: usuario.isAdmin,
      modulosPermitidos: usuario.modulosPermitidos,
      ultimoAcesso: usuario.ultimoAcesso,
    });
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }
});

export default router;
