# Notificações internas (SP-101) — App

## Objetivo

Exibir o inbox de notificações do sistema no Header (sino + badge), com painel Popover e deep link para a tela relevante.

## Escopo

**Entra**

- Sino no Header (antes do `CoinDisplay`)
- Badge com contagem de não lidas (`9+` se > 9)
- Popover em largura total da tela (`100vw`); fundo claro (`background.familyStories.container`) e borda escura (`border.header`)
- Lista: não lidas acima das lidas; item com título, corpo, rodapé (`actorName` + data/hora) e link
- Erro de carga da lista: mensagem + botão “Tentar novamente” (`refetch`)
- `actionUrl`: só navega se for path interno seguro (`/` e não `//`); URLs externas/protocol-relative não exibem link
- Ao fechar o painel: marcar como lidas **apenas as IDs visíveis** (retornadas no `GET` da lista aberta)
- Deep link `?tab=invitations` em `/new-resources/family`
- Nome da família no Header trunca com reticências (`…`) para não quebrar o layout

**Fora**

- Push / email / WhatsApp no cliente
- WebSocket em tempo real (badge refetch on focus)

## Fluxo

1. Badge: `GET /notifications/unread-count` (React Query, refetch on window focus).
2. Abrir sino: `GET /notifications?limit=20`.
3. Fechar Popover: `PATCH /notifications/read` com IDs não lidas da lista visível.
4. Clicar no link: se `actionUrl` passar em `isSafeAppPath`, navega (ex.: `/new-resources/family?tab=invitations`) e fecha o painel (também marca as visíveis).

## Contratos

Ver API [notificacoes.md](../../../api/shop-smart/.cursor/docs/notificacoes.md) — ou espelho local via `api.notification*`.

## Arquivos-chave

| Área | Path |
|------|------|
| Header | `src/components/Header.tsx` |
| Sino / painel | `src/components/notifications/` |
| Path seguro | `src/utils/isSafeAppPath.ts` |
| Service | `src/services/notification.ts` |
| Hook | `src/hooks/useNotifications.ts` |
| Deep link | `src/pages/NewResources/FamilyGroupView.tsx` |

## Testes

- Manual: convidar usuário existente → login no convidado → badge no sino → abrir/fechar → badge zera; link abre aba Convites.
- `npm run lint` / `npm run build` conforme checklist do app.
