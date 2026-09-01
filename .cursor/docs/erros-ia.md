# Erros do modelo de IA (UI) — SP-142

## Objetivo

Em qualquer fluxo que chama IA (texto, imagem, áudio, chat), se a API responder falha do modelo, o app mostra um **toast** com *“Falha no modelo de IA, tente mais tarde”*.

## Escopo

**Entra**
- Toast global via interceptor Axios + `AiErrorToastListener`
- Telas de captura (imagem/áudio de despesa e receita), QR de cupom, lista de compras (item e lote), receituário, visão geral de saúde, chat
- Processamento assíncrono de exames: toast quando um item da fila passa para `FAILED`

**Fora**
- Quota 429: toast de limite diário (`common.aiQuotaError`), não a mensagem de falha do modelo
- Erros de validação local (arquivo grande, tipo inválido, câmera)

## Fluxo

1. Request Axios falha **ou** item da fila de exames transita para `FAILED`
2. `emitAiErrorEvents` (interceptor) ou `emitAiProviderError` (fila) dispara `sfq:ai-provider-error` / `sfq:ai-quota-error`
3. `AiErrorToastListener` (montado no `ChakraProvider`) exibe o toast (id estável para não duplicar)
4. Handlers locais (`onError` / `catch`) **não** repetem toast genérico quando o erro já é de IA
5. Telas de captura (imagem/áudio/QR) usam `resolveAiErrorMessage` no `setError`: mensagem de IA/quota inline **e** toast

Chat: o painel continua com a mensagem inline; o toast também aparece.

## Contratos

API: ver `api/shop-smart/.cursor/docs/erros-ia.md`.

Códigos tratados no front:

| HTTP | `error` | i18n |
|------|---------|------|
| 502 | `AI_PROVIDER_ERROR` | `common.aiProviderError` |
| 502 | `CHAT_AI_PROVIDER_ERROR` | `common.aiProviderError` (toast) + `chatAssistant.errorProvider` (painel) |
| 429 | `API Quota Exceeded` | `common.aiQuotaError` |

## Arquivos-chave

| Arquivo | Papel |
|---------|--------|
| `src/utils/aiProviderError.ts` | Detecção, `emitAiProviderError` / `emitAiErrorEvents`, `resolveAiErrorMessage` |
| `src/services/api.ts` | Interceptor |
| `src/components/AiErrorToastListener.tsx` | Toast global |
| `src/i18n/locales/*/pt.json` | `common.aiProviderError` / `common.aiQuotaError` |
| `src/pages/NewHealth/HealthProcessingList.tsx` | `emitAiProviderError` na transição para `FAILED` |

## Testes

Verificar no browser: captura de despesa com imagem, adição de item na lista, receituário, visão geral, chat — forçar 502 e confirmar um toast só.
