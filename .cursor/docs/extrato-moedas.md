# Extrato de Moedas (App)

## Objetivo

Permitir visualizar ganhos e gastos de moedas em formato de extrato bancário, acessível pelo saldo no header e pelo Painel de relatórios.

## Escopo

- Relatório `coinStatement` em `/dashboard/coinStatement`.
- Filtros iguais aos demais relatórios (família, mês/ano, período personalizado).
- Card de totais (ganhos / gastos) + lista paginada.
- Clique no componente de moedas no header redireciona para o mesmo relatório.
- Animação de moedas de tarefas aprovadas ao abrir `/new-resources/quests`.

## Fluxo

1. Usuário toca no saldo de moedas ou no card "Extrato de Moedas" no Painel.
2. Ajusta filtros; a lista recarrega via React Query.
3. Admin da família pode ver "Família Inteira" ou um membro; demais usuários veem só o próprio extrato.
4. Assignee de tarefa aprovada abre o hub de quests → animação `playReward` + atualização de saldo.

## Contratos

- `GET /coin/statement` via `CoinService.getStatement`.
- `GET/POST .../chores/coin-rewards/*` via `ChoreService`.

## Regras de negócio

- Valores positivos (verde): `earn`, `bonus`, `refund`.
- Valores negativos (vermelho): `spend`, `penalty`.
- Nome do membro exibido na lista quando admin visualiza família inteira.

## Arquivos-chave

- `src/pages/Dashboard/ReportView.tsx` — rota `coinStatement`
- `src/components/reports/CoinStatementPanel.tsx` — UI do extrato
- `src/components/CoinDisplay.tsx` — link para o relatório
- `src/hooks/useChoreCoinCelebration.ts` — animação no hub de quests
- `src/services/coin.ts` — cliente HTTP

## Testes

```bash
cd app/super-family-quest
npm run lint
npm run build
```
