# Autenticação e cadastro (SP-39, SP-91, SP-136)

## Objetivo

Validar e-mail, senha e nome nas telas de login e cadastro, tratar códigos de erro da API, excluir a conta no perfil (com senha) e recuperar conta soft-deleted por e-mail. Reset de senha e recuperação autenticam o usuário ao concluir.

## Escopo

- Entra: `/login`, `/register` (incl. `?email=` de convite), `/forgot-password`, `/recover-account`, `/reset-password`, `PasswordInput`, exclusão no perfil, alinhamento do perfil (senha 8–64).
- Fora: OAuth/Alexa, CompleteProfile.

## Regras (espelham a API)

| Campo | Login | Cadastro | Forgot | Recover | Reset | Perfil (nova senha) | Exclusão |
|-------|-------|----------|--------|---------|-------|---------------------|----------|
| name | — | 3–255, obrigatório | — | — | — | — | — |
| email | formato válido, trim + lowercase no envio | igual | igual | exibido (não editável) | — | — | — |
| password | obrigatória, máx. 64 | 8–64 + confirmação | — | — | 8–64 + confirmação | 8–64 se informada | obrigatória, máx. 64 |

Formulários: React Hook Form + Yup (`pages/Login/schema.ts`, `pages/Register/schema.ts`, `pages/ForgotPassword/schema.ts`, `pages/ResetPassword/schema.ts`, `modals/DeleteAccountModal.tsx`).

Erros de API: mapear só `code` conhecido; toast genérico i18n — não exibir `message` cru nem `Error.message` do Axios.

## Fluxo de UI — cadastro e login

1. Cadastro com sucesso → toast → login automático.
2. `EMAIL_ALREADY_EXISTS` → toast de e-mail já cadastrado.
3. `USER_LIMIT_REACHED` → toast informativo (licenças).
4. `ACCOUNT_DELETED_REACTIVATION_REQUIRED` (login com senha correta **ou** cadastro do mesmo e-mail) → navega para `/recover-account` com o e-mail **somente** em `location.state` (sem query string). Refresh da tela perde o e-mail → mensagem para voltar ao login.
5. Tela de recuperação: mostra o e-mail → `POST /auth/recover-account` → tela de “enviado”.
6. Link do e-mail abre `/reset-password?token=` → nova senha → `POST /auth/reset-password` → `establishSession(accessToken)` → `/home`. Se a senha já foi trocada e a sessão falhar, toast + `/login`.

Login de conta soft-deleted com senha errada continua 401 genérico (anti-oráculo da API).

### Convite sem conta (`/register?email=`)

O e-mail de convite para quem **ainda não tem conta** aponta para `/register?email=` (API: `actionUrl` no listener de `family_group.member_invited`). A tela de cadastro lê o query param, faz trim + lowercase e usa como `defaultValues.email` (campo editável).

O endereço fica na barra e no histórico do navegador de propósito, para pré-preencher o formulário a partir do link do e-mail. Não logar o query param. Convite a usuário já cadastrado continua no deep link `/new-resources/family?tab=invitations` (ver [notificacoes.md](./notificacoes.md) e [grupo-familiar.md](./grupo-familiar.md)).

## Fluxo de UI — exclusão de conta (SP-136)

1. Aba Perfil → “Excluir conta” (`DeleteAccountSection`; oculto na sessão demo — o modal também não monta).
2. Modal pede a **senha** atual.
3. `DELETE /user/:id` `{ password }`.
4. Sucesso → toast → `logout()` (volta ao login).
5. `INVALID_PASSWORD` (400) → senha incorreta (não é 401, para o interceptor de sessão não deslogar).
6. `LAST_FAMILY_GROUP_ADMIN` → toast: a pessoa é a única admin de um grupo familiar e precisa adicionar outro admin ou fechar o grupo.

## Fluxo de UI — recuperação de senha (SP-91)

1. Login → “Esqueci minha senha” → `/forgot-password`.
2. Usuário informa o e-mail → `POST /auth/forgot-password`.
3. A tela de “enviado” é a mesma exista ou não a conta (anti-oráculo). 4xx da API **exceto 429** também mostram essa tela, para um regresso no backend não virar enumeração. 429, 5xx e erro de rede → toast genérico e o formulário permanece.
4. O e-mail da API traz o link `/reset-password?token=`. Token de uso único, TTL padrão **30 minutos** (`PASSWORD_RESET_TOKEN_TTL_MINUTES` na API).
5. Ao montar `/reset-password`, o token é copiado (trim) e a query é removida com `navigate('/reset-password', { replace: true, state: { token } })`, para não ficar em histórico/referrer. O valor segue em `location.state` (sobrevive a remount). Sem token → estado “link inválido”.
6. Nova senha (8–64 + confirmação) → `POST /auth/reset-password` `{ token, password }` no body. A API devolve `{ accessToken }` e o app autentica na hora.
7. Se `establishSession` falhar **depois** do reset (token de e-mail já consumido) → toast `passwordReset.successDescription` e `navigate('/login')`.
8. `INVALID_OR_EXPIRED_RESET_TOKEN` (token inválido, expirado ou já usado) → tela de link inválido com atalho para `/forgot-password`. `USER_LIMIT_REACHED` (reativação) → toast de limite. Demais erros (validação 400 sem esse `code`, 5xx, rede) → toast genérico.

Conta soft-deleted **não** recebe e-mail de reset (`findByEmail` ignora deletados); o caminho é `/recover-account`.

## Contratos usados

- `POST /user` — `{ name, email, password }`
- `DELETE /user/:id` — `{ password }` → `{ deleted }`. 400 `INVALID_PASSWORD`; 409 `LAST_FAMILY_GROUP_ADMIN`.
- `POST /auth/login` — `{ email, password }` → `{ accessToken }` ou 409 `ACCOUNT_DELETED_REACTIVATION_REQUIRED`
- `POST /auth/recover-account` — `{ email }` → `{ message }` idêntico em todos os casos (200). Throttle 3/min.
- `POST /auth/forgot-password` — `{ email }` → `{ message }` idêntico em todos os casos (200). Throttle 3/min.
- `POST /auth/reset-password` — `{ token, password }` → `{ accessToken }`. 400 com `code: INVALID_OR_EXPIRED_RESET_TOKEN` quando o token não é utilizável. Throttle 5/min.

Erros com `code`: ler `error.response.data.code` via `utils/apiError.ts` (não mapear só pelo status). Exclusão: `INVALID_PASSWORD`, `LAST_FAMILY_GROUP_ADMIN`. Reset: `INVALID_OR_EXPIRED_RESET_TOKEN`, `USER_LIMIT_REACHED`.

## Arquivos-chave

- `src/pages/Login/index.tsx`, `schema.ts`
- `src/pages/Register/index.tsx`, `schema.ts`
- `src/pages/ForgotPassword/index.tsx`, `schema.ts`
- `src/pages/RecoverAccount/index.tsx`
- `src/pages/ResetPassword/index.tsx`, `schema.ts`
- `src/pages/Profile/index.tsx` (senha 8–64)
- `src/components/profile/DeleteAccountSection.tsx`, `src/components/modals/DeleteAccountModal.tsx`
- `src/components/PasswordInput.tsx` (toggle focável; aria-label em `common.showPassword` / `common.hidePassword`)
- `src/services/auth.ts` (`recoverAccount`, `forgotPassword`, `resetPassword`)
- `src/services/user.ts` (`deleteAccount`)
- `src/utils/apiError.ts`
- i18n: `login.*`, `register.*`, `passwordReset.*`, `recoverAccount.*`, `profile.deleteAccount.*` em `default/pt.json` e `rpg/pt.json`

## Verificação

```bash
npm run lint
npm run build
```
