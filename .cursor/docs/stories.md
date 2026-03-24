# Family Stories - Fluxo de Dados

## Fonte de dados dos Stories/Avatars

Os avatars de membros exibidos no `FamilyStories` (Home e NewResources) vêm do **endpoint de summary** (`GET /family-group/:id/summary`), via `summary.members` no hook `useFamilyGroup`.

**NÃO** usar `familyGroup.members` (do `GET /family-group`) para montar a lista de stories. Esse dado é usado para permissões e gerenciamento.

## Uso da rota `GET /family-group`

A rota `GET /family-group` (via `api.familyGroupList()`) é usada para:

1. **Verificar se o usuário tem grupo familiar** — `useFamilyGroup` chama `familyGroupList()` no `loadGroup` e guarda o primeiro grupo em `familyGroup`. O `hasGroup` (boolean) deriva disso.
2. **Obter o ID do grupo** — `familyGroup.id` é usado para chamar as outras rotas: `familyGroupGetSummary`, `familyGroupGetMemberData`, etc.
3. **Exibir o nome do grupo** — `familyGroup.name` é usado como fallback em NewResources quando o summary ainda não carregou.
4. **Verificar permissões de admin** — `isAdmin(familyGroup, currentUserId)` usa `familyGroup.members` para checar a role do usuário logado e decidir se mostra a aba de "Gerenciamento" (convidar, remover membros, etc).
5. **Passar o grupo completo para o FamilyManagement** — `<FamilyManagement group={familyGroup} />` recebe o objeto completo para gerenciar membros (listar, alterar roles, remover).

## Regra de visibilidade (backend)

A filtragem de membros é feita pelo **backend** no endpoint `GET /family-group/:id/members`:

- **Admin logado**: vê todos os membros (admins + members)
- **Member logado**: vê apenas membros com role `member` (admins não aparecem)

O frontend **não deve** filtrar membros por role — basta renderizar o array que vier da API.
