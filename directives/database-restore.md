# SOP: Database Restore & Application Startup

## Goal
Restaurar o dump PostgreSQL do Portal Municipal Inteligente no Supabase e iniciar a aplicação.

## Inputs
- `backup.sql` — pg_dump do banco Replit (PostgreSQL 16.10)
- Credenciais Supabase: `db.neosulmlxizmelnudnjb.supabase.co:5432`
- `.env.local` — variáveis de ambiente

## Pré-requisitos
- `psql` instalado e no PATH
- `pnpm` instalado
- Node.js 20+

## Procedimento

### 1. Limpar o backup.sql
O arquivo contém uma linha `\restrict ...` que é artefato do Replit e causa erro no psql externo.
Execute: `execution/restore-db.ps1`

### 2. Restaurar no Supabase
```powershell
$env:PGPASSWORD = "@Nexuscloud2025"
psql -h db.neosulmlxizmelnudnjb.supabase.co -p 5432 -U postgres -d postgres -f backup_clean.sql
```

### 3. Verificar tabelas
```sql
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Esperado: 30+
```

### 4. Configurar .env.local
Copiar `.env.local.example` para `.env.local` e preencher os valores.

### 5. Instalar dependências
```powershell
cd c:\Antigravity\prefeitura
pnpm install
```

### 6. Build e start
```powershell
# Terminal 1 - API
pnpm --filter @workspace/api-server run build
$env:PORT=8080; $env:DATABASE_URL="postgresql://postgres:...@db...supabase.co:5432/postgres"; node artifacts/api-server/dist/index.mjs

# Terminal 2 - Frontend
$env:PORT=21851; $env:BASE_PATH="/"; pnpm --filter @workspace/portal-municipal run dev
```

## Edge Cases
- Se psql reportar erro `role 'postgres' does not exist` → usar usuário `authenticator` ou `anon`
- Se senha com `@` causar problema na URL → usar URL-encode: `%40`
- BullMQ/Redis: sistema tem fallback in-memory, não é crítico para startup
- `OPENAI_API_KEY`: necessário apenas para o módulo "Fale Conosco" (chat AI)

## Logs de Aprendizado
- Servidor Replit usava `heliumdb` no host `helium` — migrado para Supabase
- Senha do banco tem `@` que precisa de tratamento especial em connection strings
