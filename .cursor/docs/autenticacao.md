# Autenticação e cadastro (SP-39, SP-91)

## Objetivo

Validar e-mail, senha e nome nas telas de login e cadastro, tratar códigos de erro da API, reativar conta soft-deleted via modal com senha e permitir recuperação de senha por e-mail (forgot + reset).

## Escopo

- Entra: `/login`, `/register` (incl. `?email=` de convite), `/forgot-password`, `/reset-password`, `PasswordInput`, modal de reativação, alinhamento do perfil (senha 8–64).
- Fora: OAuth/Alexa, CompleteProfile.

## Regras (espelham a API)

| Campo | Login | Cadastro | Forgot | Reset | Perfil (nova senha) |
|-------|-------|----------|--------|-------|---------------------|
| name | — | 3–255, obrigatório | — | — | — |
| email | formato válido, trim + lowercase no envio | igual | igual | — | — |
| password | obrigatória, máx. 64 | 8–64 + confirmação | — | 8–64 + confirmação | 8–64 se informada |

Formulários: React Hook Form + Yup (`pages/Login/schema.ts`, `pages/Register/schema.ts`, `pages/ForgotPassword/schema.ts`, `pages/ResetPassword/schema.ts`, `modals/reactivateAccountSchema.ts`).

Erros de API: mapear só `code` conhecido; toast genérico i18n — não exibir `message` cru nem `Error.message` do Axios.

## Fluxo de UI — cadastro e login

1. Cadastro com sucesso → toast → login automático.
2. `EMAIL_ALREADY_EXISTS` → toast de e-mail já cadastrado.
3. `USER_LIMIT_REACHED` → toast informativo (licenças).
4. `ACCOUNT_DELETED_REACTIVATION_REQUIRED` (no cadastro, não no login) → abre `ReactivateAccountModal`.
5. Modal: senha (Yup, máx. 64) → `POST /auth/reactivate` → `establishSession(accessToken)` → `/home`.
   - 401 → senha inválida; `USER_LIMIT_REACHED` → toast de limite.

Login de conta soft-deleted continua 401 genérico (anti-oráculo da API). Reativação começa ao tentar cadastrar o mesmo e-mail.

### Convite sem conta (`/register?email=`)

O e-mail de convite para quem **ainda não tem conta** aponta para `/register?email=` (API: `actionUrl` no listener de `family_group.member_invited`). A tela de cadastro lê o query param, faz trim + lowercase e usa como `defaultValues.email` (campo editável).

O endereço fica na barra e no histórico do navegador de propósito, para pré-preencher o formulário a partir do link do e-mail. Não logar o query param. Convite a usuário já cadastrado continua no deep link `/new-resources/family?tab=invitations` (ver [notificacoes.md](./notificacoes.md) e [grupo-familiar.md](./grupo-familiar.md)).

## Fluxo de UI — recuperação de senha (SP-91)

1. Login → “Esqueci minha senha” → `/forgot-password`.
2. Usuário informa o e-mail → `POST /auth/forgot-password`.
3. A tela de “enviado” é a mesma exista ou não a conta (anti-oráculo). 4xx da API **exceto 429** também mostram essa tela, para um regresso no backend não virar enumeração. 429, 5xx e erro de rede → toast genérico e o formulário permanece.
4. O e-mail da API traz o link `/reset-password?token=`. Token de uso único, TTL padrão **30 minutos** (`PASSWORD_RESET_TOKEN_TTL_MINUTES` na API).
5. Ao montar `/reset-password`, o token é copiado (trim) e a query é removida com `navigate('/reset-password', { replace: true, state: { token } })`, para não ficar em histórico/referrer. O valor segue em `location.state` (sobrevive a remount). Sem token → estado “link inválido”.
6. Nova senha (8–64 + confirmação) → `POST /auth/reset-password` `{ token, password }` no body. **Não** há auto-login (evita session fixation se o link vazar).
7. `INVALID_OR_EXPIRED_RESET_TOKEN` (token inválido, expirado, já usado ou conta inativa) → tela de link inválido com atalho para `/forgot-password`. Demais erros (validação 400 sem esse `code`, 5xx, rede) → toast genérico.

Conta soft-deleted **não** recebe e-mail de reset (`findByEmail` ignora deletados); o caminho continua sendo reativar no cadastro.

## Contratos usados

- `POST /user` — `{ name, email, password }`
- `POST /auth/login` — `{ email, password }` → `{ accessToken }`
- `POST /auth/reactivate` — `{ email, password }` → `{ accessToken }`
- `POST /auth/forgot-password` — `{ email }` → `{ message }` idêntico em todos os casos (200). Throttle 3/min.
- `POST /auth/reset-password` — `{ token, password }` → `{ message }`. 400 com `code: INVALID_OR_EXPIRED_RESET_TOKEN` quando o token não é utilizável. Throttle 5/min.

Erros 409: ler `error.response.data.code` via `utils/apiError.ts` (não mapear só pelo status). Reset: mapear só `INVALID_OR_EXPIRED_RESET_TOKEN`, não qualquer 400.

## Arquivos-chave

- `src/pages/Login/index.tsx`, `schema.ts`
- `src/pages/Register/index.tsx`, `schema.ts`
- `src/pages/ForgotPassword/index.tsx`, `schema.ts`
- `src/pages/ResetPassword/index.tsx`, `schema.ts`
- `src/pages/Profile/index.tsx` (senha 8–64)
- `src/components/PasswordInput.tsx` (toggle focável; aria-label em `common.showPassword` / `common.hidePassword`)
- `src/components/modals/ReactivateAccountModal.tsx`, `reactivateAccountSchema.ts`
- `src/services/auth.ts` (`reactivateAccount`, `forgotPassword`, `resetPassword`)
- `src/utils/apiError.ts`
- i18n: `login.*`, `register.*`, `passwordReset.*`, `reactivateAccount.*`, `profile.newPasswordOptional` em `default/pt.json` e `rpg/pt.json`

## Verificação

```bash
npm run lint
npm run build
```
