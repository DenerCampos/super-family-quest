# Compartilhar texto (Web Share API)

## Objetivo

Permitir enviar, pelo sheet nativo do sistema (WhatsApp, SMS, e-mail, etc.), um resumo em **texto** da lista de compras, do cupom de despesa/receita, de uma receita culinária ou do relatório de saúde (visão geral / detalhe). Se `navigator.share` existir (celular e também Chrome/Edge no desktop), abre o sheet. Se a API não existir ou falhar, copia o texto e avisa com toast.

## Escopo

- **Entra:** botão de compartilhar no detalhe da lista (`/new-resources/shopping/:id`), no drawer do cupom (`FinancialReceiptDrawer`), no detalhe da receita (`/new-resources/recipes/:id`), na última consulta oracular (`/new-resources/health/overview`) e no detalhe do relatório (`/dashboard/health-report/:overviewId`).
- **Entra:** texto formatado (itens da lista com quantidade/unidade e marca `[x]` / `[ ]`; cupom com loja/nome, data, pagamento, itens e totais; receita com título, descrição, ingredientes e modo de preparo; relatório de saúde com paciente, data, markdown e disclaimer).
- **Fica de fora:** fotos (cupom e receita), imagem/PDF da tela, agrupamento por categoria na lista, Capacitor/app nativo, compartilhar o livro inteiro de receitas, histórico de contexto do paciente.

## Fluxo

1. Usuário toca o ícone de compartilhar.
2. Se `navigator.share` estiver disponível (Android Chrome/PWA, iOS Safari/PWA, Chrome/Edge no desktop), abre o sheet do sistema com `title` + `text`.
3. Se o usuário cancelar o sheet, nada acontece (sem toast de erro).
4. Se a API não existir ou falhar (ex.: Firefox no desktop, alguns browsers), o texto vai para a área de transferência e um toast de sucesso aparece.
5. Se copiar também falhar, toast de erro.

Requisito: contexto seguro (HTTPS ou localhost) e clique do usuário.

## Contratos

Não há endpoint novo. O texto é montado no cliente com os dados já carregados:

- Lista: `ShoppingListDetailResponse` (`itemsByCategory` achatado, ordem das categorias/itens da API).
- Cupom: `ExpenseReceipt` / `RevenueReceipt` de `GET /expense|revenue/:id/receipt` (dono ou admin da família; SP-138).
- Receita: `RecipeResponse` já carregado em `/new-resources/recipes/:id`.
- Relatório de saúde: `HealthAiOverviewDto` já carregado (`GET /health/ai-overview/latest` ou `GET /health/ai-overview/:id`; SP-141).

Payload do share: `{ title: string, text: string }` via Web Share API. Sem `url` e sem `files`.

## Regras de negócio

- Lista: todos os itens (pendentes e no carrinho), **sem** agrupamento por categoria. `[x]` = no carrinho; `[ ]` = pendente.
- Cupom: texto alinhado ao view (loja/nome, data, parcela, pagamento, itens, garantia se houver, totais). **Sem fotos.**
- Receita: uma receita por vez (título, descrição se houver, ingredientes, modo de preparo). **Sem fotos**, sem autor e sem grupo familiar.
- Relatório de saúde: título, paciente, data de geração, `reportContent` (markdown como veio da API) e disclaimer. Sem IDs, sem histórico de contexto do paciente.
- Dados saem do app; não incluir IDs internos nem URLs de imagem.
- Temas default e RPG têm textos próprios (`share.*`).

## Arquivos-chave

| Área | Arquivos |
|------|----------|
| Share nativo | `utils/nativeShare.ts`, `hooks/useShareText.ts`, `components/ShareTextButton.tsx` |
| Texto lista | `utils/formatShoppingListShare.ts`, `utils/formatShoppingListUnit.ts` |
| Texto cupom | `utils/formatFinancialReceiptShare.ts` |
| Texto receita | `utils/formatRecipeShare.ts` |
| Texto saúde | `utils/formatHealthOverviewShare.ts` |
| UI | `pages/NewResources/ShoppingListDetailView.tsx`, `components/financial-receipt/FinancialReceiptDrawer.tsx`, `pages/NewResources/RecipeDetailView.tsx`, `pages/NewHealth/HealthOverviewView.tsx`, `pages/Dashboard/HealthReportDetailView.tsx` |
| i18n | `i18n/locales/default/pt.json`, `i18n/locales/rpg/pt.json` (`share.*`) |

## Testes

```bash
npm run lint
npm run build
```

Validação manual:

1. Celular (PWA ou Chrome/Safari): detalhe da lista → compartilhar → WhatsApp recebe itens com `[ ]`/`[x]` e quantidades, sem categorias.
2. Abrir cupom de despesa e de receita → compartilhar → texto com totais, sem fotos.
3. Abrir uma receita em `/new-resources/recipes/:id` → compartilhar → texto com ingredientes e modo de preparo, sem fotos.
4. Visão geral de saúde (`/new-resources/health/overview`) com último relatório → ícone no card "Última consulta oracular" → texto com paciente, data, markdown e disclaimer.
5. Detalhe `/dashboard/health-report/:overviewId` → ícone no header → mesmo formato de texto.
6. Desktop **sem** Web Share (ex.: Firefox): o botão copia o texto e mostra toast "Texto copiado". Desktop **com** Web Share (Chrome/Edge): abre o sheet nativo.
7. Cancelar o sheet (celular ou desktop) não mostra toast de erro.
