# Portal do Servidor — Frontend (5 Módulos)

## What & Why
Implementar a interface completa do Portal do Servidor dentro do `portal-municipal`, adicionando as rotas `/servidor/*` para o servidor público acessar seus dados funcionais, e `/rh/*` para gestores de RH gerenciarem a equipe. Todos os módulos consomem as APIs criadas na tarefa anterior.

## Done looks like
- Rota `/servidor` com layout próprio (sidebar, header com dados do servidor logado)
- Módulo Contracheque: grid de 24 meses, visualização detalhada com layout de contracheque impresso, filtro por ano, botão de download
- Módulo Férias: painel de saldo com barra de progresso, formulário multi-step (3 etapas) de solicitação, acompanhamento com timeline
- Módulo Requerimentos: tabela filtrável, formulário dinâmico por tipo com upload de documentos, visualização de tramitação com timeline
- Módulo Vida Funcional: dados cadastrais editáveis, histórico funcional em timeline, cálculo de tempo de serviço com projeção
- Painel RH (`/rh`): dashboard com gráficos de barras (Recharts), filas de aprovação de férias e requerimentos, editor de parecer com TipTap
- Responsivo em mobile em todos os módulos

## Out of scope
- Autenticação/login real (componentes assumem usuário já autenticado com dados mockados)
- Geração de arquivo .dec para Receita Federal
- Integração real com sistemas de folha de pagamento externos
- Link de compartilhamento temporário de contracheque (apenas placeholder)

## Tasks

1. **Layout e estrutura de rotas do Portal do Servidor** — Criar o layout base `/servidor` com sidebar de navegação (Contracheque, Férias, Requerimentos, Vida Funcional), header com nome e matrícula do servidor, e contexto React com dados do servidor autenticado (mockados). Registrar todas as rotas no App.tsx.

2. **Módulo Contracheque — Listagem** — Grid responsivo de cards com 24 meses de competências. Cada card exibe mês, ano, valor bruto, líquido, status (pago/pendente) e badge "Atual" para o mais recente. Filtro por ano via select. Botão de download em cada card.

3. **Módulo Contracheque — Visualização detalhada** — Página `/servidor/contracheque/:mes/:ano` com layout fiel ao contracheque impresso: cabeçalho com dados do servidor/órgão, seções Vencimentos | Descontos | Informações Complementares, totais destacados (Bruto, Descontos, Líquido), detalhamento linha a linha. Botões Imprimir e Download. Responsivo com scroll horizontal em mobile.

4. **Módulo Férias — Painel e histórico** — Painel com saldo de dias disponíveis, barra de progresso do período aquisitivo atual, alerta de prazo limite em vermelho quando ultrapassado, e tabela de histórico de períodos (gozado, programado, vendido).

5. **Módulo Férias — Formulário de solicitação multi-step** — Formulário em 3 etapas em `/servidor/ferias/solicitar`: Step 1 (seleção de período aquisitivo, DatePicker bloqueando fins de semana, parcelamento, adiantamento 13°, abono pecuniário); Step 2 (resumo e confirmação com checkbox); Step 3 (protocolo gerado e timeline de status). Validações de elegibilidade em cada campo.

6. **Módulo Requerimentos — Lista e formulário** — DataTable filtrável (tipo + status) com badges coloridos por status. Formulário em `/servidor/requerimentos/novo` com select de tipo que carrega campos dinâmicos específicos, área de upload de documentos, campo de justificativa (mínimo 100 chars), e preview antes de protocolar.

7. **Módulo Requerimentos — Detalhe e tramitação** — Página `/servidor/requerimentos/:id` com dados completos, documentos anexados, timeline vertical de tramitação (Protocolado → Em análise RH → Deferido/Indeferido), parecer técnico, botão de recurso (se indeferido e no prazo).

8. **Módulo Vida Funcional** — Página com 3 abas: "Dados Cadastrais" (cargo, regime, lotação, dados bancários mascarados, dados pessoais editáveis inline), "Histórico Funcional" (timeline de eventos com portaria), "Tempo de Serviço" (contador total, projeção de aposentadoria em anos/meses).

9. **Painel RH — Dashboard e aprovações** — Layout separado em `/rh` (acessível apenas para role admin/rh). Dashboard com gráfico de barras de servidores por secretaria (Recharts), listas de férias vencidas urgentes, requerimentos pendentes com prazo. Filas de aprovação de férias (com calendário visual da secretaria) e requerimentos (com editor TipTap para parecer técnico e botões Deferir/Indeferir). Aprovação de férias em lote.

## Relevant files
- `artifacts/portal-municipal/src/App.tsx`
- `artifacts/portal-municipal/src/components/layout/`
- `artifacts/portal-municipal/src/pages/`
- `artifacts/portal-municipal/src/components/ui/`
- `artifacts/portal-municipal/src/components/cms/`
- `artifacts/portal-municipal/src/contexts/AccessibilityContext.tsx`
- `artifacts/portal-municipal/package.json`
