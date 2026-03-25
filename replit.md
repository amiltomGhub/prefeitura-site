# Portal Municipal Inteligente — Módulo 2

## Overview

SaaS multi-tenant "Portal Municipal Inteligente" — Módulo 2: Site Institucional da Prefeitura.
Portal público principal do município, integrado ao Módulo 1 (Ouvidoria) via API compartilhada e mesmo tenant system.

## Implementação — Status Atual

### ✅ Parte I — Backend + Geração de API (COMPLETO)
- 25+ endpoints Express 5, 10 tabelas Drizzle, seed Parauapebas

### ✅ Parte II — Layout aprimorado (COMPLETO)
- SiteHeader 3 camadas, MegaMenu, SearchModal, CookieBanner LGPD, SiteFooter LAI, Breadcrumb automático

### ✅ Parte III — Homepage com 10 seções (COMPLETO)
- `HeroCarousel` — 4 slides, autoplay com pausa (WCAG 2.2.2), dots, busca inline
- `QuickServicesSection` — 8 serviços populares com ícones animados ao scroll
- `NewsSection` — 1 notícia principal + 3 secundárias, carregamento de API real
- `AgendaSection` — Lista de eventos + MiniCalendar interativo
- `MunicipioNumbers` — Contadores animados (habitantes, área, orçamento, servidores)
- `TransparenciaHighlight` — Seção LAI obrigatória, widget orçamento, 8 atalhos da LAI
- `GaleriaSection` — Grid masonry + lightbox acessível com teclado
- `SecretariasSection` — Grid com busca inline, dados reais da API
- `CanaisSection` — CTA WhatsApp, Ouvidoria, SIC, Tel. 156, redes sociais
- `FloatingContact` — FAB flutuante "Fale Conosco" com menu expansível

## Compliance & Normas

- **e-MAG 3.1** — Modelo de Acessibilidade em Governo Eletrônico
- **WCAG 2.1 nível AA** — obrigatório por Decreto 5.296/2004
- **LAI — Lei 12.527/2011** — seções obrigatórias de transparência
- **LGPD — Lei 13.709/2018** — consentimento, privacidade, cookies
- **Decreto 5.296/2004** — acessibilidade obrigatória em portais públicos

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Animações**: Framer Motion (respeita prefers-reduced-motion)
- **Data fetching**: React Query v5
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Tenant Demo

- **Município**: Parauapebas — PA
- **Slug**: `parauapebas`
- **Tenant ID**: `tenant-parauapebas-001`

## Structure

```text
portal-municipal-monorepo/
├── artifacts/
│   ├── api-server/              # Express API server (porta 8080)
│   │   └── src/routes/          # Todas as rotas do portal
│   │       ├── health.ts
│   │       ├── tenant.ts        # Config tenant, municipio, gestores
│   │       ├── noticias.ts      # CRUD notícias
│   │       ├── servicos.ts      # Serviços ao cidadão
│   │       ├── secretarias.ts   # Secretarias municipais
│   │       ├── transparencia.ts # Orçamento, despesas, receitas, servidores
│   │       ├── licitacoes.ts    # Licitações e contratos
│   │       ├── legislacao.ts    # Leis, decretos, portarias
│   │       ├── agenda.ts        # Agenda de eventos
│   │       ├── galeria.ts       # Galeria de fotos e vídeos
│   │       ├── concursos.ts     # Concursos públicos
│   │       └── busca.ts         # Busca global
│   ├── portal-municipal/        # Frontend React+Vite (porta 21851)
│   │   └── src/
│   │       ├── contexts/
│   │       │   └── AccessibilityContext.tsx  # Estado global acessibilidade
│   │       ├── components/layout/
│   │       │   ├── AccessibilityBar.tsx      # e-MAG OBRIGATÓRIO
│   │       │   ├── SiteHeader.tsx
│   │       │   ├── SiteFooter.tsx
│   │       │   ├── CookieBanner.tsx          # LGPD
│   │       │   └── Layout.tsx
│   │       └── pages/
│   │           ├── Home.tsx
│   │           ├── Noticias.tsx
│   │           ├── Servicos.tsx
│   │           ├── TransparenciaHub.tsx
│   │           └── Municipio.tsx
│   └── mockup-sandbox/          # Design prototyping
├── lib/
│   ├── api-spec/                # OpenAPI spec (openapi.yaml) + Orval config
│   ├── api-client-react/        # React Query hooks gerados
│   ├── api-zod/                 # Zod schemas gerados
│   └── db/                      # Drizzle ORM
│       └── src/schema/
│           ├── tenant.ts        # tenants, municipio_info, gestores
│           ├── noticias.ts
│           ├── servicos.ts
│           ├── secretarias.ts
│           ├── transparencia.ts # despesas, receitas, servidores, orcamentos
│           ├── licitacoes.ts
│           ├── legislacao.ts
│           ├── agenda.ts
│           ├── galeria.ts
│           └── concursos.ts
└── scripts/
    └── src/
        └── seed-portal.ts       # Seed de dados demo (Parauapebas)
```

## Root Scripts

- `pnpm run build` — typecheck + build all
- `pnpm run typecheck` — tsc --build
- `pnpm --filter @workspace/api-spec run codegen` — gerar hooks e schemas do OpenAPI
- `pnpm --filter @workspace/db run push` — push schema ao banco
- `pnpm --filter @workspace/scripts run seed-portal` — seed dados demo

## API Routes

Todas as rotas prefixadas com `/api`:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/healthz | Health check |
| GET | /api/tenant/config | Configuração do tenant |
| GET | /api/municipio/info | Informações do município |
| GET | /api/governo/prefeito | Dados do prefeito |
| GET | /api/governo/vice-prefeito | Dados do vice-prefeito |
| GET | /api/noticias | Listar notícias (paginado) |
| GET | /api/noticias/:slug | Detalhe da notícia |
| POST | /api/noticias | Criar notícia |
| PUT | /api/noticias/:slug | Atualizar notícia |
| DELETE | /api/noticias/:slug | Remover notícia |
| GET | /api/servicos | Listar serviços |
| GET | /api/servicos/:slug | Detalhe do serviço |
| GET | /api/secretarias | Listar secretarias |
| GET | /api/secretarias/:slug | Detalhe da secretaria |
| GET | /api/transparencia/orcamento | Dados de orçamento |
| GET | /api/transparencia/despesas | Listar despesas |
| GET | /api/transparencia/receitas | Listar receitas |
| GET | /api/transparencia/servidores | Listar servidores |
| GET | /api/licitacoes | Listar licitações |
| GET | /api/licitacoes/:id | Detalhe da licitação |
| GET | /api/legislacao | Listar legislação |
| GET | /api/legislacao/:tipo/:slug | Detalhe da legislação |
| GET | /api/agenda | Listar eventos |
| GET | /api/galeria | Listar álbuns |
| GET | /api/concursos | Listar concursos |
| GET | /api/busca | Busca global |

## Frontend Routes

| Rota | Página |
|------|--------|
| / | Homepage |
| /noticias | Listagem de notícias |
| /noticias/:slug | Detalhe da notícia |
| /o-municipio | Informações do município |
| /governo | Governo |
| /governo/secretarias | Secretarias |
| /transparencia | Portal da Transparência |
| /servicos | Serviços ao cidadão |
| /legislacao | Legislação |
| /agenda | Agenda |
| /licitacoes | Licitações |
| /concursos | Concursos |
| /galeria | Galeria |
| /busca | Busca global |
| /acessibilidade | Recursos de acessibilidade |
| /mapa-do-site | Sitemap HTML |
| /privacidade | Política de privacidade LGPD |
| /contato | Contato |

## Accessibility Features (e-MAG)

- Barra de acessibilidade fixa acima do header
- Controles de tamanho de fonte (T- / A / T+)
- Toggle de alto contraste (fundo preto, texto amarelo/branco)
- Atalhos de teclado: Alt+1 (conteúdo), Alt+2 (menu), Alt+3 (busca), Alt+4 (rodapé)
- Skip links visíveis no foco
- Data e hora em tempo real
- Links para Mapa do Site e página de Acessibilidade
- Estado persistido em localStorage

## Multi-tenant

Cada tenant é identificado pelo parâmetro `?tenant=<slug>` nas chamadas da API.
O padrão é `parauapebas` como demonstração.
Design token system via CSS Custom Properties permite personalização por tenant.
