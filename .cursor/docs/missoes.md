# Missões do Clã (front)

## Objetivo

Exibir missões diárias, mensais e conquistas únicas; permitir resgate de moedas quando concluídas.

## Escopo

- Tela `/new-challenge` (Missões do Clã).
- Consumo de `GET /missions` e `POST /missions/:progressId/claim`.
- Invalidação de cache após cadastrar despesa ou receita.

## Fluxo

1. Usuário abre aba Diárias / Mensais / Feitos Épicos.
2. `useMissions` busca lista da API e filtra por `frequency`.
3. `MissionCard` mostra progresso e botão "Coletar Recompensa".
4. Após criar despesa ou receita, mutations invalidam `missionQueryKeys` para refletir progresso.

## Contratos

- `GET /missions` — lista com `mission` + `progress`.
- `POST /missions/:progressId/claim` — resgate; animação de moedas no sucesso.

## Regras de negócio (UI)

- Botão resgate habilitado: `progress.isCompleted && !progress.isClaimed && progress.id`.
- Títulos/descrições vêm da API (sem hardcode de "Scanner do Dia", etc.).

## Arquivos-chave

| Arquivo | Papel |
|---------|-------|
| `src/pages/Missions/MissionsView.tsx` | Abas e listagem |
| `src/pages/Missions/MissionCard.tsx` | Card + resgate |
| `src/hooks/useMissions.ts` | Query + filtro daily/monthly/once |
| `src/hooks/useMissionClaimReward.ts` | Mutation claim |
| `src/hooks/missionQueryKeys.ts` | Cache keys |
| `src/hooks/useExpensesMutations.ts` | Invalida missões após despesa |
| `src/hooks/useRevenueMutations.ts` | Invalida missões após receita |
| `src/hooks/useExpenseFormSubmit.ts` | Preserva `uri` do cupom no submit |

## Testes

Validação manual em `/new-challenge` após cadastrar despesa/receita. Backend: ver `api/shop-smart/.cursor/docs/missoes.md`.
