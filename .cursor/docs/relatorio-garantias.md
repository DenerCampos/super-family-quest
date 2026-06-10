# Relatório de Garantias (Dashboard)

## Objetivo

Tile **Garantias** no Painel com listagem de produtos/itens em garantia, priorizando os que vencem primeiro.

## Escopo

- Rota `/dashboard/warrantyItems`.
- Filtros: ano (compra), membro da família, busca por nome, incluir vencidas.
- Paginação 25 por página.
- Clique no item abre cupom (`FinancialReceiptDrawer`).

## Fluxo

1. `Dashboard` → tile Garantias.
2. `ReportView` com `yearOnly` + `WarrantyItemsPanel`.
3. Busca com debounce de 350 ms.
4. Toque na linha → receipt da despesa vinculada ao item.

## Integração API

`ReportsService.getWarrantyItems` → `GET /reports/warranty-items`.

## Arquivos-chave

- `src/pages/Dashboard/index.tsx` — tile
- `src/pages/Dashboard/ReportView.tsx` — rota do relatório
- `src/components/reports/WarrantyItemsPanel.tsx` — UI
- `src/hooks/useWarrantyItems.ts` — React Query
- `src/types/warrantyItems.ts` — tipos

## Testes

```bash
cd app/super-family-quest && npm run build
```

Validar manualmente: filtros, paginação, cupom ao tocar item.
