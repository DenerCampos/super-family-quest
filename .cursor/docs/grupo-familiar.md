# Grupo familiar (multi-família) — App

## Objetivo

Permitir que o usuário participe de **0..N** grupos familiares na UI, com família selecionada nos stories/resumo, gerenciamento por grupo, convite com autocomplete de e-mail e listagens agregadas com contexto de família.

## Escopo

**Entra**

- Seleção de família ativa/selecionada (`useFamilyGroup` + `localStorage` `sfq.activeFamilyGroupId`)
- Stories multi-família (Home + resumo do grupo)
- Aba Gerenciamento com collapse por família + criar outro grupo
- Autocomplete de convite (`GET /user/search?email=`)
- Filtro de relatórios: “Família Inteira — {nome}” (admin) e “Somente Eu — {nome}” (membro) para trocar de família
- Listas de compras e receitas agrupadas por família (accordion; seção “Pessoal” se sem `familyGroup`)
- Quests/challenges: agregação de ocorrências/definições/aprovações/histórico de todos os grupos + badge com nome da família
- Criar definição: disponível se admin em **qualquer** grupo; `familyGroupId` vai no `location.state` (preferência = família selecionada se admin nela)
- Saúde: seletor de membro com união dos membros accepted de grupos onde o usuário é admin/owner
- Convite: autocomplete via hook `useUserEmailSearch` (`GET /user/search?email=`)

**Fora**

- Payroll/mesada/settlements ainda operam na família selecionada (não agregam multi-família na mesma tela)

## Fluxo

1. `GET /family-group` carrega memberships; app ordena owner → admin → member (`familyGroupPriority`).
2. Família selecionada: valor persistido se ainda for membership; senão prioridade primária (`activeFamilyGroupId`).
3. Stories: 1º círculo = família selecionada (label “Família”/tema só se owner); depois outras onde é admin; depois membros da selecionada.
4. Trocar família limpa seleção de membro e recarrega summary/members.
5. Gerenciamento: accordion por grupo + formulário “criar outro grupo”.
6. Convite: digitar ≥3 chars dispara busca de usuários e preenche o e-mail.
7. Listas/receitas: `FamilyGroupedList` agrupa por `familyGroup` (ordem = prioridade das memberships + pessoal).
8. Quests: `useQueries` por grupo; cards exibem `FamilyGroupBadge`; mutações usam o `familyGroupId` do item.
9. Saúde (admin): `collectAdminFamilyMembers` une membros de todos os grupos admin/owner.
10. Home — últimos registros: `GET /profile/latest-registrations?familyGroupId=` da família selecionada (sem isso a API só retorna os do próprio usuário).

## Contratos

| Uso | Endpoint |
|-----|----------|
| Listar grupos | `GET /family-group` |
| Resumo | `GET /family-group/:id/summary` |
| Dados do membro | `GET /family-group/:id/members/:memberId/data` |
| Criar / convidar / roles | endpoints existentes de family-group |
| Autocomplete convite | `GET /user/search?email=` (mín. 3) |
| Relatórios | query `familyGroupId` (+ `userId` opcional) |
| Listas / receitas | já retornam `familyGroup` (null = pessoal) |
| Chores | por `familyGroupId` na URL; app agrega no cliente |

## Regras de negócio

- Prioridade: owner → admin → member (desempate `joinedAt`, nome).
- Label “Família” (ou “O Clã” no tema RPG) **somente** se o usuário for owner do grupo selecionado.
- Círculos secundários nos stories: apenas famílias onde o viewer é admin/owner (exceto a selecionada).
- Membros exibidos nos stories: sempre da família **selecionada**.
- Criar grupo não é mais bloqueado por já pertencer a outro (copy de conflito genérico / “já membro **deste** grupo” no accept).
- Saúde “agir por outro”: opções = união de membros accepted dos grupos em que o usuário é admin/owner.
- Hub de quests: tiles de admin se o usuário for admin/owner em **qualquer** grupo.
- Criar definição / aprovações: escopo por grupo do item; criar usa `pickAdminFamilyGroupId`.
- Relatórios (membro multi-família): opções `me:{groupId}` para trocar família; estado força `userId` = eu quando não-admin.

## Arquivos-chave

- `src/utils/familyGroupPriority.ts`
- `src/utils/adminFamilyMembers.ts` / `src/hooks/useAdminFamilyMembers.ts`
- `src/utils/groupByFamilyGroup.ts`
- `src/components/family/FamilyGroupedList.tsx` / `FamilyGroupBadge.tsx`
- `src/hooks/useFamilyGroup.ts` / `useChoreQuestLists.ts` / `useUserEmailSearch.ts` / `usePendingApprovals.ts`
- `src/components/FamilyStories.tsx`
- `src/pages/Home/index.tsx`
- `src/pages/NewResources/FamilyGroupView.tsx` / `ShoppingListsView.tsx` / `RecipesView.tsx`
- `src/pages/NewChallenge/*` (listagens agregadas + badge; `PendingApprovalCard`, `RejectOccurrenceModal`)
- `src/pages/NewHealth/*` (seletores de membro)
- `src/components/family/*` (Create, Invite, Management, Summary)
- `src/components/reports/UserFamilyFilter.tsx` + `ReportView`
- `src/services/user.ts` (`searchByEmail`)

## Testes

```bash
cd app/super-family-quest
npm run lint
npm run build
```

Manual: login com user em 2+ famílias; trocar stories; listas/receitas colapsadas por família; quests com badge; saúde com membros de todas as famílias admin; relatório filtrando por família.
