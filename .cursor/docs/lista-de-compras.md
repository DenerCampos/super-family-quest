# Lista de Compras (Shopping List) - Documentacao da Feature

## Visao Geral

A funcionalidade de Lista de Compras permite que membros de um grupo familiar gerenciem listas de compras compartilhadas em tempo real. Todos os membros veem as mudancas instantaneamente via WebSocket (Socket.IO), sem necessidade de refresh.

**Fluxo principal:**
1. Criar uma lista de compras (pessoal ou familiar)
2. Adicionar itens (texto, formato rapido "2x Leite")
3. No mercado, marcar itens como "no carrinho" (checkbox)
4. Todos os membros online veem as mudancas em tempo real
5. Finalizar a lista quando a compra estiver completa

---

## Estrutura de Rotas

```
/new-resources              -> Landing page com tiles (Cadastros, Grupo Familiar, Lista de Compras)
/new-resources/resources    -> Pagina de cadastros (lojas, pagamentos, categorias, etc.)
/new-resources/family       -> Pagina de grupo familiar (com abas internas)
/new-resources/shopping     -> Dashboard de listas de compras
/new-resources/shopping/:id -> Detalhe da lista (Lista Viva com WebSocket)
```

**Arquivo de rotas:** `src/App.tsx`

---

## Endpoints REST (Backend)

Base URL: `VITE_API_URL` (configurado em `.env`)

### Shopping Lists

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/shopping-lists?page=1&limit=10&status=active` | Listar listas |
| POST | `/shopping-lists` | Criar lista |
| GET | `/shopping-lists/:id` | Detalhe com itens agrupados por categoria |
| PATCH | `/shopping-lists/:id` | Atualizar lista (nome, status) |
| DELETE | `/shopping-lists/:id` | Deletar lista |
| PATCH | `/shopping-lists/:id/complete` | Finalizar lista |

### Items

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/shopping-lists/:listId/items` | Adicionar item |
| PATCH | `/shopping-lists/items/:itemId` | Editar item |
| PATCH | `/shopping-lists/items/:itemId/toggle` | Toggle status (pending <-> in_cart) |
| DELETE | `/shopping-lists/items/:itemId` | Remover item |

### Sugestoes

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/shopping-lists/suggestions?search=arro` | Autocomplete baseado em historico |

---

## WebSocket (Socket.IO)

### Conexao

- **Namespace:** `/shopping-list`
- **Auth:** Token JWT no handshake (`auth: { token }`)
- **Biblioteca:** `socket.io-client`

### Eventos emitidos pelo Frontend (Client -> Server)

| Evento | Payload | Quando |
|--------|---------|--------|
| `joinList` | `{ listId: string }` | Ao abrir a tela de detalhe da lista |
| `leaveList` | `{ listId: string }` | Ao sair da tela (unmount) |

### Eventos recebidos pelo Frontend (Server -> Client)

| Evento | Payload | Acao no Frontend |
|--------|---------|------------------|
| `item_added` | `ShoppingListItemResponse` | Adicionar item no estado local |
| `item_updated` | `ShoppingListItemResponse` | Substituir item no estado local |
| `item_toggled` | `ShoppingListItemResponse` | Atualizar status (riscar se in_cart) |
| `item_removed` | `{ itemId: string }` | Remover item do estado local |
| `list_completed` | `{ listId: string }` | Marcar todos como in_cart |
| `user_joined` | `{ userId, userName }` | Mostrar usuario online |
| `user_left` | `{ userId, userName }` | Remover do indicador online |

---

## Tipos TypeScript

**Arquivo:** `src/types/shoppingList.ts`

### Enums/Unions
- `ShoppingListStatus`: `'active' | 'completed' | 'archived'`
- `ShoppingListItemStatus`: `'pending' | 'in_cart'`
- `ShoppingListItemUnit`: `'un' | 'kg' | 'g' | 'l' | 'ml' | 'pack' | 'dz'`

### Interfaces principais
- `ShoppingListResponse` - Card da lista no dashboard
- `ShoppingListItemResponse` - Item individual (com addedBy, checkedBy)
- `ShoppingListDetailResponse` - Detalhe com `itemsByCategory: Record<string, Item[]>`
- `ItemSuggestionResponse` - Sugestao do autocomplete
- `PaginatedResponse<T>` - Resposta paginada generica

### Payloads
- `CreateShoppingListPayload` - `{ name, familyGroupId? }`
- `UpdateShoppingListPayload` - `{ name?, status? }`
- `CreateShoppingListItemPayload` - `{ name, quantity?, unit?, groupId? }`
- `UpdateShoppingListItemPayload` - `{ name?, quantity?, unit?, status?, groupId? }`

### Constantes
- `UNIT_OPTIONS` - Array de opcoes de unidade para selects/dropdowns

---

## Camada de Servicos

**Arquivo:** `src/services/shoppingList.ts`

`ShoppingListService` expoe metodos async que mapeiam 1:1 com os endpoints REST:
- `getShoppingLists(params)`, `createShoppingList(payload)`, `getShoppingListDetail(id)`
- `updateShoppingList(id, payload)`, `deleteShoppingList(id)`, `completeShoppingList(id)`
- `addItem(listId, payload)`, `updateItem(itemId, payload)`, `toggleItem(itemId)`, `removeItem(itemId)`
- `getSuggestions(search)`

Todos registrados no facade `src/services/index.ts` com prefixo `shoppingList*`.

---

## Hooks

### `useShoppingListSocket` (`src/hooks/useShoppingListSocket.ts`)
Hook de WebSocket que:
- Conecta ao namespace `/shopping-list` com JWT
- Emite `joinList`/`leaveList` no mount/unmount
- Escuta todos os eventos do servidor
- Gerencia lista de `onlineUsers`
- Recebe callbacks (`onItemAdded`, `onItemToggled`, etc.) via refs para evitar re-renders

**Retorna:** `{ socket, onlineUsers, isConnected, emitEvent }`

### `useShoppingLists` (`src/hooks/useShoppingLists.ts`)
Gerenciamento do dashboard de listas:
- Fetch com paginacao e filtro por status
- Operacoes de criar e deletar lista
- Controle de estado de loading/error

**Retorna:** `{ lists, meta, status, page, isLoading, error, setPage, changeStatus, createList, deleteList, refresh }`

### `useShoppingListDetail` (`src/hooks/useShoppingListDetail.ts`)
Gerenciamento do detalhe de uma lista:
- Fetch do detalhe (itens agrupados por categoria)
- Operacoes CRUD nos itens
- Handlers para eventos WebSocket que atualizam estado local em real-time
- Funcao `parseQuickAddInput("2x Leite")` -> `{ name: "Leite", quantity: 2 }`

**Retorna:** `{ detail, isLoading, error, refresh, addItem, updateItem, toggleItem, removeItem, completeList, handleItemAdded, handleItemUpdated, handleItemToggled, handleItemRemoved, handleListCompleted }`

---

## Componentes

### `src/components/shoppingList/`

| Componente | Descricao |
|------------|-----------|
| `ShoppingListCard` | Card clicavel no dashboard. Mostra nome, grupo familiar, contadores pending/inCart, criador |
| `ShoppingListItemRow` | Linha de item com checkbox, nome (riscado se in_cart), quantidade, unidade, addedBy/checkedBy, botoes edit/delete |
| `AddItemInput` | Input com autocomplete (debounced, min 2 chars). Suporta formato "2x Leite". Botao de adicionar |
| `OnlineUsersIndicator` | Bolinha verde + nomes dos usuarios online na lista |

### `src/components/modals/`

| Componente | Descricao |
|------------|-----------|
| `CreateShoppingListModal` | Modal com campo nome + select de grupo familiar |
| `EditShoppingListItemModal` | Modal para editar nome, quantidade e unidade de um item |

---

## Paginas

### `src/pages/NewResources/index.tsx` (Landing)
Grid de tiles com 3 opcoes: Cadastros, Grupo Familiar, Lista de Compras. Segue o mesmo padrao visual do Dashboard (`ReportTile`).

### `src/pages/NewResources/ResourcesView.tsx`
Conteudo extraido da antiga aba 1 (Accordion com lojas, pagamentos, categorias, despesas, receitas, recorrentes). Header com botao voltar + NavigationBar.

### `src/pages/NewResources/FamilyGroupView.tsx`
Conteudo extraido das antigas abas 2-4 (Grupo Familiar, Convites, Gerenciamento como abas internas). Header com botao voltar + NavigationBar.

### `src/pages/NewResources/ShoppingListsView.tsx`
Dashboard de listas de compras:
- Filtro por status (Ativas/Finalizadas/Arquivadas)
- Lista de `ShoppingListCard`
- Botao para criar nova lista
- Empty state com CTA

### `src/pages/NewResources/ShoppingListDetailView.tsx`
Pagina da "Lista Viva":
- Indicador de usuarios online
- Input de adicao rapida com autocomplete
- Itens agrupados por categoria
- Checkbox para toggle de status (pending <-> in_cart)
- Botoes de editar e excluir por item
- Botao "Finalizar Lista"
- Atualizacao em tempo real via WebSocket

---

## Tokens de Tema

Adicionados em `src/theme/themes.ts` e `src/theme/types.ts`:

### `background.shoppingList`
`primary`, `card`, `cardHover`, `itemPending`, `itemInCart`, `categoryHeader`, `onlineIndicator`, `addInput`

### `text.shoppingList`
`title`, `primary`, `secondary`, `itemName`, `itemNameChecked`, `itemMeta`, `categoryTitle`, `onlineDot`, `onlineName`, `badge.pending`, `badge.inCart`

### `border.shoppingList`
`card`, `item`, `categoryHeader`, `checkbox.pending`, `checkbox.inCart`

---

## Traducoes

Adicionadas em `src/i18n/locales/default/pt.json` e `src/i18n/locales/rpg/pt.json`.

### Namespaces
- `newResources.tiles.*` - Titulos e subtitulos dos tiles na landing
- `shoppingList.*` - Todas as traducoes da feature

### Exemplos RPG
| Default | RPG |
|---------|-----|
| Lista de Compras | Pergaminho de Suprimentos |
| Adicionar item | Adicionar provisao |
| No carrinho | Na sacola |
| Finalizar Lista | Concluir Missao de Suprimentos |

---

## Parsing do Input Rapido

A funcao `parseQuickAddInput()` em `useShoppingListDetail.ts` suporta:

| Input | Resultado |
|-------|-----------|
| `"Leite"` | `{ name: "Leite", quantity: 1 }` |
| `"2x Leite"` | `{ name: "Leite", quantity: 2 }` |
| `"3X Arroz integral"` | `{ name: "Arroz integral", quantity: 3 }` |
| `"1.5x Carne"` | `{ name: "Carne", quantity: 1.5 }` |

Regex: `/^(\d+(?:[.,]\d+)?)\s*[xX]\s+(.+)$/`

---

## Dependencia

- `socket.io-client` - Adicionada via `npm install socket.io-client`

---

## Unidades de Medida

| Valor | Label |
|-------|-------|
| `un` | Unidade(s) |
| `kg` | Kg |
| `g` | Gramas |
| `l` | Litro(s) |
| `ml` | mL |
| `pack` | Pacote(s) |
| `dz` | Duzia(s) |
