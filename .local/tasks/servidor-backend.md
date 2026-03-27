# Portal do Servidor — Backend (DB + API)

## What & Why
Criar toda a camada de dados e APIs REST necessárias para os módulos do Portal do Servidor: Contracheque, Férias, Requerimentos, Vida Funcional e Painel RH. Esta tarefa cobre exclusivamente o backend — schemas Drizzle, migrations e rotas Express — servindo de base para a tarefa de frontend.

## Done looks like
- Schemas Drizzle criados e migrados: contracheques, períodos de férias, solicitações de férias, requerimentos, eventos funcionais, dados cadastrais do servidor
- Rotas REST funcionais em `/api/servidor/*` com autenticação por middleware (requireAuth)
- Rotas REST para Painel RH em `/api/rh/*` com guarda de role (admin/rh)
- Dados mock/seed realistas para ao menos 3 servidores de exemplo
- Endpoints documentados no OpenAPI spec existente

## Out of scope
- Interface de usuário (coberta pela tarefa de frontend)
- Integração com sistemas externos de folha de pagamento
- Geração real de PDF (mocked com dados estáticos por ora)

## Tasks

1. **Schemas de banco de dados** — Criar tabelas Drizzle para: `servidores_cadastro` (dados funcionais completos), `contracheques` (por mês/ano com linhas de vencimentos e descontos), `periodos_aquisitivos`, `solicitacoes_ferias` (com status de workflow), `requerimentos` (com tramitação em JSON), `historico_funcional` (eventos com portaria/despacho).

2. **Seed de dados realistas** — Criar script de seed com 3 servidores de exemplo, 24 meses de contracheques para cada, períodos aquisitivos, solicitações de férias em diferentes status, e requerimentos em diferentes estágios de tramitação.

3. **Rotas de Contracheque** — `GET /api/servidor/contracheques` (lista paginada por ano), `GET /api/servidor/contracheques/:mes/:ano` (detalhe completo com linhas), `GET /api/servidor/contracheques/:mes/:ano/pdf` (download — retorna PDF mockado), `GET /api/servidor/rendimentos/:ano` (declaração anual IRRF).

4. **Rotas de Férias** — `GET /api/servidor/ferias/saldo` (saldo atual + períodos aquisitivos), `GET /api/servidor/ferias/historico` (lista completa), `POST /api/servidor/ferias/solicitar` (nova solicitação com validações de elegibilidade), `GET /api/servidor/ferias/:id` (detalhe + timeline de aprovação).

5. **Rotas de Requerimentos** — `GET /api/servidor/requerimentos` (lista com filtros), `POST /api/servidor/requerimentos` (novo requerimento com upload de documentos), `GET /api/servidor/requerimentos/:id` (detalhe + tramitação), `POST /api/servidor/requerimentos/:id/recurso` (recurso após indeferimento).

6. **Rotas de Vida Funcional** — `GET /api/servidor/perfil` (dados cadastrais + cargo + lotação), `PUT /api/servidor/perfil` (atualizar dados pessoais editáveis: endereço, email, telefone), `GET /api/servidor/historico-funcional` (timeline de eventos), `GET /api/servidor/tempo-servico` (cálculo de tempo com projeção de aposentadoria).

7. **Rotas do Painel RH** — `GET /api/rh/dashboard` (estatísticas: servidores por secretaria, férias vencidas, requerimentos pendentes, aniversariantes), `GET /api/rh/ferias/pendentes` + `PATCH /api/rh/ferias/:id/aprovar|rejeitar`, `GET /api/rh/requerimentos/pendentes` + `PATCH /api/rh/requerimentos/:id/deferir|indeferir` (com geração de despacho), `GET /api/rh/folha-resumo`.

## Relevant files
- `lib/db/src/schema/transparencia.ts`
- `lib/db/src/schema/site.ts`
- `lib/db/src/index.ts`
- `artifacts/api-server/src/routes/index.ts`
- `artifacts/api-server/src/middlewares/requireAuth.ts`
- `artifacts/api-server/src/app.ts`
- `lib/api-spec/openapi.yaml`
