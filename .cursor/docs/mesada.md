# Mesada e liquidações (SP-113)

## Objetivo

Permitir fechamento da mesada com impacto financeiro e consulta do histórico de liquidações pelo admin no hub de Quests.

## Escopo

- Tela **Mesada** (`/new-resources/quests/allowance`): filtro mês/ano; botão liquidar só com pendente no período filtrado.
- Tela **Liquidações** (`/new-resources/quests/settlements`): somente admin; filtro padrão = mês anterior.
- Tile admin no hub de Quests.
- Tela **Aprovações** (`/new-resources/quests/approvals`): botão **Voltar para ajuste** devolve tarefa ao executor em `IN_PROGRESS` (SP-115).

## Fluxo — Aprovações (devolver para ajuste)

1. Admin vê tarefa aguardando aprovação.
2. Clica **Voltar para ajuste** quando a execução precisa de correção (sem recusar).
3. API `POST .../return-for-adjustment` → status `IN_PROGRESS`, mesmo executor.
4. Executor vê a tarefa em **Minhas tarefas** / **Em andamento** e pode ajustar fotos e reenviar.

## Fluxo — Mesada

1. Admin escolhe mês/ano no filtro.
2. API retorna pendentes do período (`GET payroll/pending`).
3. Se `totalPending > 0`, exibe botão **Liquidar período MM/AAAA** (período do filtro).
4. Confirmação → `POST payroll/settle` → invalida queries de chores.

## Fluxo — Liquidações

1. Admin abre tile **Liquidações**.
2. Filtro inicia no mês anterior.
3. `GET payroll/settlements?year&month` → detalhe ou estado vazio.

## Contratos (API)

Ver `api/shop-smart/.cursor/docs/mesada.md`.

| Service | Método |
|---------|--------|
| `choreGetPayrollPending` | Pendentes |
| `choreSettlePayroll` | Liquidar |
| `choreGetPayrollSettlement` | Detalhe da liquidação |
| `choreReturnOccurrenceForAdjustment` | Devolver para ajuste (SP-115) |

## Arquivos-chave

| Arquivo | Papel |
|---------|--------|
| `pages/NewChallenge/AllowanceView.tsx` | Mesada e liquidação |
| `pages/NewChallenge/SettlementsView.tsx` | Histórico admin |
| `pages/NewChallenge/ApprovalsView.tsx` | Aprovações admin (SP-115: voltar para ajuste) |
| `pages/NewChallenge/index.tsx` | Tile admin |
| `services/chore.ts` | HTTP |
| `hooks/choreQueryKeys.ts` | Cache React Query |

## Testes

```bash
npm run lint
npm run build
```

Validação manual: liquidar mês com tarefas aprovadas; conferir despesa/receita no financeiro; aprovar nova tarefa após fechamento e verificar período seguinte nos pendentes.
