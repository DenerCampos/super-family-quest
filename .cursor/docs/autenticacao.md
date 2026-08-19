# Autenticação e cadastro (SP-39)

## Objetivo

Validar e-mail, senha e nome nas telas de login e cadastro, tratar códigos de erro da API e permitir reativar conta soft-deleted via modal com senha.

## Escopo

- Entra: `/login`, `/register`, `PasswordInput`, modal de reativação, alinhamento do perfil (senha 8–64).
- Fora: reset de senha, OAuth/Alexa, CompleteProfile.

## Regras (espelham a API)

| Campo | Login | Cadastro | Perfil (nova senha) |
|-------|-------|----------|---------------------|
| name | — | 3–255, obrigatório | — |
| email | formato válido, trim + lowercase no envio | igual | — |
| password | obrigatória, máx. 64 | 8–64 + confirmação | 8–64 se informada |

Formulários: React Hook Form + Yup (`pages/Login/schema.ts`, `pages/Register/schema.ts`, `modals/reactivateAccountSchema.ts`).

Erros de API no cadastro: mapear só `code` conhecido; toast genérico i18n — não exibir `message` cru nem `Error.message` do Axios.

## Fluxo de UI

1. Cadastro com sucesso → toast → login automático.
2. `EMAIL_ALREADY_EXISTS` → toast de e-mail já cadastrado.
3. `USER_LIMIT_REACHED` → toast informativo (licenças).
4. `ACCOUNT_DELETED_REACTIVATION_REQUIRED` (no cadastro, não no login) → abre `ReactivateAccountModal`.
5. Modal: senha (Yup, máx. 64) → `POST /auth/reactivate` → `establishSession(accessToken)` → `/home`.
   - 401 → senha inválida; `USER_LIMIT_REACHED` → toast de limite.

Login de conta soft-deleted continua 401 genérico (anti-oráculo da API). Reativação começa ao tentar cadastrar o mesmo e-mail.

## Contratos usados

- `POST /user` — `{ name, email, password }`
- `POST /auth/login` — `{ email, password }` → `{ accessToken }`
- `POST /auth/reactivate` — `{ email, password }` → `{ accessToken }`

Erros 409: ler `error.response.data.code` via `utils/apiError.ts` (não mapear só pelo status).

## Arquivos-chave

- `src/pages/Login/index.tsx`, `schema.ts`
- `src/pages/Register/index.tsx`, `schema.ts`
- `src/pages/Profile/index.tsx` (senha 8–64)
- `src/components/PasswordInput.tsx` (toggle focável; aria-label em `common.showPassword` / `common.hidePassword`)
- `src/components/modals/ReactivateAccountModal.tsx`, `reactivateAccountSchema.ts`
- `src/services/auth.ts` (`reactivateAccount`)
- `src/utils/apiError.ts`
- i18n: `login.*`, `register.*`, `reactivateAccount.*`, `profile.newPasswordOptional` em `default/pt.json` e `rpg/pt.json`

## Limitação

Sem recuperação de senha, conta deletada com senha esquecida não pode ser reativada pelo produto. Documentado na API; tratar na tarefa de reset.

## Verificação

```bash
npm run lint
npm run build
```
