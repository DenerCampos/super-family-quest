# Assistente Familiar (UI) — SP-117

## Objetivo

Widget flutuante autenticado para perguntas em linguagem natural (somente leitura) ao Assistente Familiar da API.

## Escopo

**Entra**
- Balão no canto inferior direito em todas as rotas dentro de `RequireAuth`
- Arrastar o balão (posição **não** persistida; ao reload volta ao inferior direito)
- Painel de chat com histórico da sessão mais recente retomada do backend (`listSessions` ordenado por `updatedAt DESC`)
- `screenContext` derivado do `pathname` (texto descritivo PT para o prompt da API)
- Rótulo de tela e chips de exemplos via i18n (`chatAssistant.contexts.*` / `examples.*`)
- Mensagem do usuário otimista enquanto a IA responde
- Estados de erro de IA (quota 429, `CHAT_AI_PROVIDER_ERROR` 502) e rede

**Fora**
- Atalho de teclado
- Seletor de membro
- Escrita / ações
- Rotas públicas (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/alexa-login`, `/demo/:key`)

## Fluxo

1. Usuário autenticado vê o FAB (acima da NavigationBar, com offset à direita para não cobrir FABs de scanner)
2. Clique abre o painel; drag move o FAB só na sessão de tela
3. Ao abrir, o front lista sessões e retoma a mais recente; se não houver, cria na primeira mensagem
4. Front envia `POST /chat-agent/sessions/:id/messages` com `screenContext`
5. Mensagem do usuário aparece de imediato; resposta do assistente ao concluir; erros mapeados para i18n
6. Em erro de envio: `resetQueries` do histórico (mensagem persistida em 502 reaparece; evita páginas infinitas com offset desatualizado / keys duplicadas). Lista faz dedupe por `id`

## Contratos

Ver API: `api/shop-smart/.cursor/docs/assistente-familiar.md`.

Service: `src/services/chatAgent.ts`  
Query keys: `src/hooks/chatAgentQueryKeys.ts`  
Hook de dados: `src/hooks/useChatAgent.ts` (sessões via `useQuery`, mensagens via `useInfiniteQuery`, envio)  
Drag FAB: `src/hooks/useChatFabDrag.ts` · scroll lista: `src/hooks/useChatMessageScroll.ts` · cores: `useChatPanelColors.ts`  
Contexto de rota: `src/utils/chatScreenContext.ts`  
UI: `ChatAssistantWidget` → `ChatFab` + `ChatPanel` + `ChatMessageList` + `ChatComposer` (montado em `RequireAuth`)

Histórico: `GET /chat-agent/sessions/:id/messages?page&limit` → `{ data, meta, links }` (20/página; página 1 = mais recentes). No painel, rolar para cima carrega a próxima página (`useInfiniteQuery`). Sessões: `useQuery(chatAgentQueryKeys.sessions())` ao abrir o painel; retoma `data[0]`.

### Mapa pathname → contexto

| Path | `screenContext` (API) | `examplesKey` / rótulo i18n |
|---|---|---|
| `/expense` | despesas | expenses |
| `/revenue` | receitas financeiras | revenues |
| `/dashboard` | relatórios | reports |
| `/new-resources/shopping` | lista de compras | shopping |
| `/new-resources/family` | grupo familiar | family |
| `/new-resources/recipes` | receitas culinárias | recipes |
| `/new-resources/quests` | tarefas e mesada | chores |
| `/new-resources/health/prescriptions` | receituário médico | prescriptions |
| `/new-resources/health` | saúde | health |
| `/new-challenge` | missões | missions |
| `/profile`, `/settings` | perfil | profile |
| `/`, `/home` | início | home |
| demais | geral | home |

## Layout / z-index

- Overlay do widget: `position: fixed` centrado no shell `maxW=480px`
- FAB `zIndex` ~35; painel ~40 (abaixo de LoadingOverlay / FlyingCoin)
- `bottom` inicial = `TOAST_BOTTOM_OFFSET` + 20px (acima da NavigationBar)
- `right` inicial = 12px (perto da borda, acima do Grimório/perfil)
- Painel: fundo branco / superfície clara (`dashboard.tile` + `home`), texto escuro (`text.lastRegistrations`)

## i18n

Chaves em `chatAssistant.*` nos locales `default` e `rpg` (inclui `subtitle`, `contexts.*`, `examples.*`).

## Testes manuais

1. Login → FAB no inferior direito
2. Arrastar FAB → soltar; reload → volta à posição default
3. Abrir em `/expense` → exemplos de despesas; em `/new-resources/health` → saúde; em `/new-resources/quests` → chores; em `/new-challenge` → missões
4. Enviar pergunta → bolha do usuário aparece na hora; spinner até a resposta
5. Fechar, reload, reabrir → histórico da última sessão
6. Simular 429 → erro de quota, mensagem do usuário **não** fica no histórico
7. Simular 502 → erro de provedor, mensagem do usuário permanece no histórico após o erro
8. Rolar para cima com >20 msgs → sem warning de key duplicada no console
9. Logout / rota pública → FAB ausente
