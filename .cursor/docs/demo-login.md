# Demo Login (SP-118 / SP-130)

## Objetivo

Permitir acesso rápido ao sistema via link direto para fins de demonstração em portfólio, sem expor credenciais do usuário demo. Em sessão demo, o **perfil do usuário** fica somente leitura (SP-130).

## Escopo

**Entra:**
- Rota pública `/demo/:key` no frontend
- Endpoint `POST /auth/demo` na API
- Emissão de JWT com duração reduzida (2h) e flag `isDemo: true`
- UX e API: bloqueio de edição de dados do perfil na sessão demo

**Fica de fora:**
- Demo somente leitura do restante do sistema (listas, despesas, temas, etc.)
- Rotação automática da chave

## Fluxo

1. Visitante acessa `https://superfamilyquest.netlify.app/demo/<CHAVE>`
2. `DemoLogin` lê `:key` via `useParams`
3. Valida `key === VITE_DEMO_KEY` (ofuscação no frontend — **não é proteção real**)
4. Chama `POST /auth/demo` com `{ key }` — proteção real está na API
5. API valida `DEMO_ENABLED`, compara com `DEMO_SECRET` via `timingSafeEqual`
6. API busca usuário por `DEMO_USER_EMAIL` e emite JWT `expiresIn: '2h'` com `isDemo: true`
7. Frontend chama `AuthContext.establishSession(accessToken)` — persiste JWT, deriva `isDemo` (`utils/demoSession.ts`) e carrega o perfil **antes** de navegar
8. Redireciona para `/home` com `profile` e `isDemo` já no contexto (evita cold start preso em `RequireAuth`)
9. Em `/profile` e unlink Alexa em Settings, a UI oculta/desabilita ações de edição
10. Em qualquer erro (chave inválida, demo desabilitado, usuário não encontrado, falha ao carregar perfil) redireciona para `/login`

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

### Mutações de perfil bloqueadas (API 403 com JWT `isDemo`)

- `PATCH /user/:id`, `DELETE /user/:id`
- `POST /profile/complete-profile`
- `POST /profile/upload-image`
- `POST /profile/integrations/alexa/unlink`

## Regras de negócio

- `DEMO_ENABLED=false` por padrão — habilitar explicitamente em produção
- JWT emitido com `expiresIn: '2h'` (mais restrito que tokens normais)
- `timingSafeEqual` (Node.js `crypto`) para comparação da chave — previne timing attack
- Rate limit: 3 requisições/min por IP no endpoint `/auth/demo`
- Tentativa com chave inválida gera log `warn` com `event: 'demo_login_failed'` → visível no Loki
- O usuário demo deve estar previamente cadastrado no banco com o e-mail definido em `DEMO_USER_EMAIL`
- Sessão demo: perfil somente leitura (front + API); demais domínios do app permanecem editáveis
- Modal de complete-profile não abre em sessão demo

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
- [`src/auth/auth.guard.ts`](../../api/shop-smart/src/auth/auth.guard.ts) — propaga `isDemo`
- [`src/auth/deny-demo.guard.ts`](../../api/shop-smart/src/auth/deny-demo.guard.ts) — `DenyDemoGuard`
- [`.env-default`](../../api/shop-smart/.env-default) — template de variáveis

### App
- [`src/utils/demoSession.ts`](../src/utils/demoSession.ts) — lê `isDemo` do JWT
- [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx) — expõe `isDemo` e `establishSession` (DemoLogin / login)
- [`src/pages/DemoLogin/index.tsx`](../src/pages/DemoLogin/index.tsx) — chama `establishSession` antes de navegar para `/home`
- [`src/pages/Profile/index.tsx`](../src/pages/Profile/index.tsx) — UI somente leitura em demo
- [`src/pages/Settings/index.tsx`](../src/pages/Settings/index.tsx) — bloqueia unlink Alexa em demo
- [`src/services/auth.ts`](../src/services/auth.ts) — método `AuthService.demoLogin(key)`
- [`src/App.tsx`](../src/App.tsx) — rota `/demo/:key`

## Testes

### Manual
1. Habilitar: `DEMO_ENABLED=true`, `DEMO_SECRET=<chave>`, `DEMO_USER_EMAIL=<email>` na API; `VITE_DEMO_KEY=<mesma chave>` no app
2. Acessar `http://localhost:5173/demo/<chave>` — deve redirecionar para `/home` logado **sem F5** (perfil/`isDemo` já no contexto)
3. Em `/profile`, não deve haver botões de editar/foto/brasão; campos desabilitados
4. Logout → acessar `/demo/<chave>` de novo — deve entrar sem ficar preso no loading
5. Tentar `PATCH /user/:id` com o token demo — API deve retornar 403
6. Acessar `http://localhost:5173/demo/chave-errada` — deve redirecionar para `/login`
7. Setar `DEMO_ENABLED=false` e acessar novamente — deve redirecionar para `/login`

### Rate limit
Fazer 4 requisições seguidas para `POST /auth/demo` — a 4ª deve retornar HTTP 429.
