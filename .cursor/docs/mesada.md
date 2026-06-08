# Mesada e liquidações (SP-113)

## Objetivo

Permitir fechamento da mesada com impacto financeiro e consulta do histórico de liquidações pelo admin no hub de Quests.

## Escopo

- Tela **Mesada** (`/new-resources/quests/allowance`): filtro mês/ano; botão liquidar só com pendente no período filtrado.
- Tela **Liquidações** (`/new-resources/quests/settlements`): somente admin; filtro padrão = mês anterior.
- Tile admin no hub de Quests.

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

## Arquivos-chave

| Arquivo | Papel |
|---------|--------|
| `pages/NewChallenge/AllowanceView.tsx` | Mesada e liquidação |
| `pages/NewChallenge/SettlementsView.tsx` | Histórico admin |
| `pages/NewChallenge/index.tsx` | Tile admin |
| `services/chore.ts` | HTTP |
| `hooks/choreQueryKeys.ts` | Cache React Query |

## Testes

```bash
npm run lint
npm run build
```

Validação manual: liquidar mês com tarefas aprovadas; conferir despesa/receita no financeiro; aprovar nova tarefa após fechamento e verificar período seguinte nos pendentes.
