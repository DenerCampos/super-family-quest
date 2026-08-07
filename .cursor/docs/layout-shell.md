# Layout shell (header + nav fixos)

## Objetivo

Padronizar telas autenticadas com **Header** e **NavigationBar** sempre visíveis; apenas o miolo da página rola. Toasts aparecem acima da barra inferior.

## Componentes

| Arquivo | Uso |
|---------|-----|
| `components/FixedAppShell.tsx` | Header + filhos flex + NavigationBar (`h="100vh"`, `overflow="hidden"`) |
| `components/notifications/NotificationBell.tsx` | Sino + badge no Header (SP-101); ver `notificacoes.md` |
| `components/PageScaffold.tsx` | Shell + barra de título (voltar + título) + área scroll |
| `components/ResourceCrudScaffold.tsx` | CRUD em recursos: `singleCard` + `contentPt={4}` (Nova tarefa) |
| `components/PageTitleBar.tsx` | Barra fixa com `BackButton` e título |
| `components/BackButton.tsx` | Botão circular com borda (padrão dos relatórios) |
| `theme/theme.ts` | `TOAST_BOTTOM_OFFSET` + default `position: bottom` |

## Padrões por tipo de tela

### Sub-tela com voltar (cadastros, família, compras, receitas, settings, quests filhas)

`PageScaffold` com `title`, `backTo` e `contentLayout` (`singleCard` | `plain` | `none`).

### Destino da bottom nav (home, dashboard, missões, perfil, hub arsenal)

`FixedAppShell` com título e subtítulo **centralizados** (como hub Recursos). Sem `PageTitleBar` em hubs e perfil.

### CRUD em recursos (cadastros no arsenal)

Usar `ResourceCrudScaffold` (cartão com borda + `contentPt={4}`), como Nova tarefa / livro de receitas (criar, editar, visualizar).

Exceções: modais, `/expense`, `/revenue`, perfil.

### Abas fixas + scroll no corpo

`FixedAppShell` + `PageTitleBar` + `Tabs` com `TabList` fixo e `TabPanel` com `overflow="auto"`.

Exemplos: **Perfil** (Editar / Temas), **Missões** (diárias / mensais / conquistas), **Grupo familiar**.

### Início

Fixos: stories, resumo financeiro e botões de lançamento. Scroll: apenas `LastRegistrationsList`.

### Relatórios (`/dashboard/:reportKey`)

Antes sem header/nav; agora usa `PageScaffold` como as demais sub-telas.

## Toast

Configurado globalmente em `main.tsx` via `toastOptions.defaultOptions.containerStyle.marginBottom` (`72px`), acima da NavigationBar.

## Fora do escopo

Formulários isolados `/expense` e `/revenue` mantêm layout próprio (sem header/nav do app).

## Testes manuais sugeridos

1. Abrir perfil → trocar tema → toast não cobre o menu.
2. Missões → trocar aba → título e tabs fixos; lista rola.
3. Relatório qualquer → header e menu visíveis; gráfico rola.
4. Cadastros / família / compras / receitas / settings → voltar com borda circular.

```bash
npm run lint
npm run build
```
