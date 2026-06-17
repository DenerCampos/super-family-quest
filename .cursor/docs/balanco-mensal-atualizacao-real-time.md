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

## Arquivos-chave

| Arquivo | Papel |
|---|---|
| `src/hooks/useInvalidateFinancialSummary.ts` | Hook centralizado (novo) |
| `src/hooks/useExpensesMutations.ts` | Mutations de despesa (alterado) |
| `src/hooks/useRevenueMutations.ts` | Mutations de receita (alterado) |
| `src/pages/Home/index.tsx` | Delete handler (alterado) |
| `src/components/home/MonthlyBalanceCard.tsx` | Componente presentacional (não alterado) |
| `src/hooks/useFamilyGroup.ts` | Query de summary do grupo (não alterado) |
| `src/contexts/AuthContext.tsx` | `loadProfile` (não alterado) |

## Testes

### Manual
1. Criar uma despesa → voltar à Home → verificar que "Despesas" no card aumentou
2. Criar uma receita → voltar à Home → verificar que "Receitas" no card aumentou
3. Editar valor de despesa existente → voltar à Home → verificar que o card reflete o novo valor
4. Excluir uma despesa/receita pela lista na Home → verificar que o card atualiza imediatamente
5. Repetir cenários 1-4 com usuário membro de grupo familiar

### Build / Lint
```bash
npm run build
```
