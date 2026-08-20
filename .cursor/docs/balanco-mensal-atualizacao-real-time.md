# Atualização em Tempo Real do Card Balanço Mensal

## Objetivo

Garantir que o card **Balanço Mensal** na página Home sempre exiba os valores corretos imediatamente após qualquer mutação financeira (criar, editar ou excluir despesa/receita), sem necessidade de recarregar a página.

## Escopo

**Entra:**
- Atualização do card após criar despesa
- Atualização do card após editar despesa
- Atualização do card após criar receita
- Atualização do card após editar receita
- Atualização do card após excluir despesa/receita pela lista na Home
- Atualização do card e da lista de últimos registros após confirmar os modais de recorrência na Home (SP-137)

**Fica de fora:**
- Atualização em tempo real via WebSocket (não implementado)
- Sincronização entre sessões de múltiplos usuários

## Causa Raiz (problema pré-SP-119)

O card `MonthlyBalanceCard` lê dados de duas fontes:

| Cenário | Fonte | Problema anterior |
|---|---|---|
| Usuário **sem** grupo familiar | `profile.income` / `profile.expenses` do `AuthContext` | `loadProfile()` nunca era chamado após mutações |
| Usuário **com** grupo familiar | `useFamilyGroup().summary` via React Query | A query key `familyGroupQueryKeys.summary` nunca era invalidada após mutações; `staleTime: 30s` servia o cache desatualizado |

## Solução

### Hook centralizado: `useInvalidateFinancialSummary`

**Arquivo:** `src/hooks/useInvalidateFinancialSummary.ts`

Retorna uma função async que executa em paralelo:
1. `loadProfile()` — refaz o `GET /profile`, atualizando `income`, `expenses` e moedas no `AuthContext`
2. `queryClient.invalidateQueries({ queryKey: [...familyGroupQueryKeys.all, 'summary'] })` — invalida todas as queries de summary do grupo (qualquer `groupId`, `month`, `year`)

### Pontos de chamada

O hook é invocado com `void invalidateFinancialSummary()` no `onSuccess` de:

| Hook | Mutação |
|---|---|
| `useCreateExpense` | Criação de despesa |
| `useUpdateExpense` | Edição de despesa |
| `useCreateRevenue` | Criação de receita |
| `useUpdateRevenue` | Edição de receita |
| `handleDeleteRegistration` (Home) | Exclusão de despesa/receita pela lista |
| `handleCloseRecurringExpensesModal` / `handleCloseRecurringRevenuesModal` (Home) | Confirmação dos modais de recorrência (SP-137) — também invalida `GET_LAST_REGISTRATION_QUERY_KEY` |

## Fluxo após a correção

```
Usuário salva/exclui transação
        ↓
  onSuccess / try block
        ↓
  invalidateFinancialSummary()
    ├── loadProfile()       → AuthContext.profile atualizado
    └── invalidateQueries() → React Query refetch summary
        ↓
  navigate(-1) → Home
        ↓
  MonthlyBalanceCard renderiza valores atualizados
```

### Modais de recorrência (SP-137)

Antes da correção, confirmar despesa/receita recorrente na Home só chamava `loadProfile()`. Isso atualizava as flags `hasRecurringExpenses` / `hasRecurringRevenues` (para o modal não reabrir), mas **não** invalidava:

- o summary do grupo familiar (`staleTime: 30s`) — card de balanço desatualizado para quem tem família
- a query `get-last-registration` — lista de últimos registros sem os novos lançamentos

Após confirmar, `refreshHomeAfterRecurringConfirm()` na Home executa em paralelo:

1. invalida `GET_LAST_REGISTRATION_QUERY_KEY`
2. chama `invalidateFinancialSummary()` (já inclui `loadProfile()`)

## UI do card (SP-120)

O `MonthlyBalanceCard` é presentacional: recebe valores já calculados pela Home (`profile` ou `useFamilyGroup().summary`) e não dispara fetch próprio.

| Elemento | Comportamento |
|---|---|
| Título | `{title} · {mês atual}` via `common.months.*` (i18n default + rpg) |
| Gráfico | `HomePieChart` em modo `compact` (coluna ~30% da linha) |
| Valores | Três mini-cards (`BalanceValueCard`): saldo (com rótulo), receita e despesa |
| Bordas | Saldo: `border.summaryCard.balance`; receita/despesa: tokens `lastRegistrations` |
| Visibilidade | Toggle olho reutiliza `showValues` / `masked` do `AuthContext` |

Tokens novos em `themes.ts` (default + rpg): `border.summaryCard.balance`.

## Arquivos-chave

| Arquivo | Papel |
|---|---|
| `src/hooks/useInvalidateFinancialSummary.ts` | Hook centralizado (SP-119) |
| `src/hooks/useExpensesMutations.ts` | Mutations de despesa (SP-119) |
| `src/hooks/useRevenueMutations.ts` | Mutations de receita (SP-119) |
| `src/pages/Home/index.tsx` | Delete handler + composição do card |
| `src/components/home/MonthlyBalanceCard.tsx` | Layout do card, `BalanceValueCard`, mês no título (SP-120) |
| `src/components/HomePieChart.tsx` | Donut compacto usado pelo card (SP-120) |
| `src/hooks/useFamilyGroup.ts` | Query de summary do grupo |
| `src/contexts/AuthContext.tsx` | `loadProfile`, `showValues` |

## Testes

### Manual
1. Criar uma despesa → voltar à Home → verificar que "Despesas" no card aumentou
2. Criar uma receita → voltar à Home → verificar que "Receitas" no card aumentou
3. Editar valor de despesa existente → voltar à Home → verificar que o card reflete o novo valor
4. Excluir uma despesa/receita pela lista na Home → verificar que o card atualiza imediatamente
5. Confirmar o modal de recorrência de despesa/receita na Home → verificar que o card e a lista de últimos registros atualizam imediatamente
6. Repetir cenários 1-5 com usuário membro de grupo familiar

### Build / Lint
```bash
npm run build
```
