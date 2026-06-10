# Formulário financeiro — stepper, parcelamento e cupom

## Objetivo

Cadastro de despesa e receita em passos (stepper), com recorrência/parcelamento, garantia (despesa), fotos e visualização tipo cupom fiscal em drawer fullscreen.

## Escopo

- **Despesa:** 4 passos — Despesa, Recorrência, Garantia, Fotos
- **Receita:** 3 passos — Receita, Recorrência, Fotos (sem garantia)
- Drawer de comprovante (`FinancialReceiptDrawer`) nas listagens e últimos lançamentos
- Modais mensais de recorrência exibem badge de parcela infinita
- Item com valor R$ 0,00 permitido

## Fluxo

1. Usuário preenche passo 1 (dados obrigatórios)
2. Passos opcionais podem ser pulados (Recorrência, Garantia, Fotos)
3. Submit envia `recurrence` e garantia nos campos de cada item (`warrantyDuration` / `warrantyUnit`); fotos pendentes sobem após create
4. Em listagens, ação **Exibir** / ícone olho abre drawer com `GET /expense|revenue/:id/receipt`
5. Fotos no cupom: clique abre lightbox com zoom e download

## Contratos (front → API)

Mesmos DTOs de `recurrence` documentados na API (`parcelamento-e-receipt.md`). Garantia sempre em `items[]` — sem array `warranties`.

Serviços: `api.getExpenseReceipt`, `api.getRevenueReceipt`, `api.uploadExpensePhoto`, `api.deleteExpensePhoto` (e equivalentes revenue).

## Regras de UI

- Temas via `useVisualTheme()`
- Badge `InstallmentBadge` quando `installmentLabel` presente
- Parcelamento finito: todas as parcelas visíveis nos cadastros; últimos lançamentos só mês atual
- Parcelamento infinito: modal mensal na Home confirma próxima parcela

## Arquivos-chave

| Área | Arquivos |
|------|----------|
| Stepper | `components/form-stepper/ResourceFormStepper.tsx`, `useFormStepper.ts` |
| Passos | `components/financial-steps/RecurrenceStep.tsx`, `WarrantyStep.tsx`, `PhotosStep.tsx` |
| Formulários | `components/ExpensesForm.tsx`, `components/RevenueForm.tsx` |
| Cupom | `components/financial-receipt/FinancialReceiptDrawer.tsx`, `FinancialReceiptView.tsx`, `ImageLightboxModal.tsx` |
| Hooks | `hooks/useExpenseFormSubmit.ts`, `hooks/useRevenueFormSubmit.ts`, `hooks/useFinancialReceiptDrawer.ts` |
| Integração | `pages/NewResources/ResourcesView.tsx`, `pages/Home/index.tsx`, `components/LastRegistrationsList.tsx` |
| Modais | `components/modals/NewRecurringExpenseModal.tsx`, `NewRecurringIncomeModal.tsx` |

## Testes

```bash
npm run lint
npm run build
```

Validação manual: criar despesa parcelada finita, infinita (modal Home), editar com fotos, abrir cupom nas listagens.
