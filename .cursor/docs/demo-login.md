# Demo Login (SP-118)

## Objetivo

Permitir acesso rápido ao sistema via link direto para fins de demonstração em portfólio, sem expor credenciais do usuário demo.

## Escopo

**Entra:**
- Rota pública `/demo/:key` no frontend
- Endpoint `POST /auth/demo` na API
- Emissão de JWT com duração reduzida (2h) e flag `isDemo: true`

**Fica de fora:**
- Nenhuma restrição de escrita para o usuário demo (acesso completo ao sistema)
- Rotação automática da chave

## Fluxo

1. Visitante acessa `https://superfamilyquest.netlify.app/demo/<CHAVE>`
2. `DemoLogin` lê `:key` via `useParams`
3. Valida `key === VITE_DEMO_KEY` (ofuscação no frontend — **não é proteção real**)
4. Chama `POST /auth/demo` com `{ key }` — proteção real está na API
5. API valida `DEMO_ENABLED`, compara com `DEMO_SECRET` via `timingSafeEqual`
6. API busca usuário por `DEMO_USER_EMAIL` e emite JWT `expiresIn: '2h'`
7. Frontend salva `accessToken` no `localStorage` e redireciona para `/home`
8. Em qualquer erro (chave inválida, demo desabilitado, usuário não encontrado) redireciona para `/login`

## Contratos

### `POST /auth/demo`

**Request body:**
```json
{ "key": "string" }
```

**Response 200:**
```json
{ "accessToken": "string" }
```

**Response 401:** chave inválida  
**Response 403:** demo desabilitado (`DEMO_ENABLED=false`)  
**Response 404:** usuário demo não encontrado no banco  
**Response 429:** rate limit excedido (3 req/min por IP)

## Regras de negócio

- `DEMO_ENABLED=false` por padrão — habilitar explicitamente em produção
- JWT emitido com `expiresIn: '2h'` (mais restrito que tokens normais)
- `timingSafeEqual` (Node.js `crypto`) para comparação da chave — previne timing attack
- Rate limit: 3 requisições/min por IP no endpoint `/auth/demo`
- Tentativa com chave inválida gera log `warn` com `event: 'demo_login_failed'` → visível no Loki
- O usuário demo deve estar previamente cadastrado no banco com o e-mail definido em `DEMO_USER_EMAIL`

## Variáveis de ambiente

### API (`api/shop-smart`)

| Variável | Padrão | Descrição |
|---|---|---|
| `DEMO_ENABLED` | `false` | Habilita o endpoint demo |
| `DEMO_SECRET` | _(vazio)_ | Chave secreta — gere com `openssl rand -hex 32` |
| `DEMO_USER_EMAIL` | `demo@superfamilyquest.com` | E-mail do usuário demo no banco |

### App (`app/super-family-quest`)

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_DEMO_KEY` | _(vazio)_ | Deve ser igual a `DEMO_SECRET` da API |

## Arquivos-chave

### API
- [`src/common/app-config/app.config.ts`](../../api/shop-smart/src/common/app-config/app.config.ts) — métodos `isDemoEnabled()`, `getDemoSecret()`, `getDemoUserEmail()`
- [`src/auth/auth.service.ts`](../../api/shop-smart/src/auth/auth.service.ts) — método `demoLogin(key)`
- [`src/auth/auth.controller.ts`](../../api/shop-smart/src/auth/auth.controller.ts) — endpoint `POST /auth/demo`
- [`.env-default`](../../api/shop-smart/.env-default) — template de variáveis

### App
- [`src/pages/DemoLogin/index.tsx`](../src/pages/DemoLogin/index.tsx) — página de redirecionamento automático
- [`src/services/auth.ts`](../src/services/auth.ts) — método `AuthService.demoLogin(key)`
- [`src/services/index.ts`](../src/services/index.ts) — exportação `api.demoLogin`
- [`src/App.tsx`](../src/App.tsx) — rota `/demo/:key`

## Testes

### Manual
1. Habilitar: `DEMO_ENABLED=true`, `DEMO_SECRET=<chave>`, `DEMO_USER_EMAIL=<email>` na API; `VITE_DEMO_KEY=<mesma chave>` no app
2. Acessar `http://localhost:5173/demo/<chave>` — deve redirecionar para `/home` logado
3. Acessar `http://localhost:5173/demo/chave-errada` — deve redirecionar para `/login`
4. Setar `DEMO_ENABLED=false` e acessar novamente — deve redirecionar para `/login`

### Rate limit
Fazer 4 requisições seguidas para `POST /auth/demo` — a 4ª deve retornar HTTP 429.
