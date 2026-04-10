# Integracao Alexa (OAuth2) - Frontend

## Objetivo

Documentar o fluxo de vinculacao da Alexa no frontend React, incluindo:

- Tela de login OAuth exclusiva para Account Linking (`/alexa-login`)
- Central de Integracoes na rota `/settings` (apenas status + instrucoes)
- Fluxo de Account Linking via OAuth2 iniciado pelo App da Alexa
- Atualizacao imediata de status sem refresh manual

---

## Arquitetura do Fluxo

O Account Linking da Alexa funciona de forma INVERSA ao login comum.
O frontend NAO inicia o OAuth — quem inicia e o App da Alexa.

```
VINCULACAO (feita uma vez pelo App da Alexa):

App Alexa (webview)
  → GET backend/auth/oauth/authorize?client_id=...&redirect_uri=...&state=...
  → Backend gera session_code, redireciona para:
     frontend/alexa-login?session_code=UUID
  → Usuario faz login com credenciais do app
  → Frontend POST backend/auth/oauth/login { email, password, session_code }
  → Backend valida, gera auth_code, retorna { redirectUrl }
  → Frontend faz window.location.href = redirectUrl (URL da Amazon)
  → Account Linking concluido

COMANDO DE VOZ (toda vez que usuario fala):

Usuario fala → Alexa processa intent → POST backend/alexa/intent
  { context.System.user.accessToken: "token_salvo_no_account_linking" }
  → Backend valida token, identifica usuario, executa acao
  → Retorna resposta de voz no formato Alexa
```

---

## Rotas do Frontend

### `/settings` (protegida com RequireAuth)
- Exibe status da integracao Alexa (conectado/desconectado)
- Quando desconectada: mostra card com instrucoes de como vincular pelo App da Alexa
- Quando conectada: exibe botao "Desvincular"
- NAO possui mais botao de "Conectar" que chama OAuth da Amazon diretamente

### `/alexa-login` (PUBLICA - sem RequireAuth)
- Tela de login especifica para o Account Linking
- Sem Header e sem NavigationBar (e aberta em webview da Alexa)
- Recebe `?session_code=UUID` na URL
- Apos login bem-sucedido, redireciona para URL da Amazon (NAO para /home)
- Componente: `src/pages/AlexaLogin/index.tsx`

---

## Endpoints usados pelo frontend

### 1) Consultar status de integracoes

- Metodo: `GET`
- Endpoint: `/profile/integrations`
- Retorno esperado:

```json
{
  "alexa": {
    "connected": true,
    "linkedAt": "2026-04-09T10:00:00Z"
  }
}
```

### 2) Login OAuth (tela /alexa-login)

- Metodo: `POST`
- Endpoint: `/auth/oauth/login`
- Body:

```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "session_code": "uuid-gerado-pelo-authorize"
}
```

- Resposta:

```json
{
  "redirectUrl": "https://layla.amazon.com/api/skill/link/XXXXX?code=uuid-do-code&state=valor-original"
}
```

- O frontend faz `window.location.href = redirectUrl` para concluir o Account Linking.

### 3) Desvincular Alexa

- Metodo: `POST`
- Endpoint: `/profile/integrations/alexa/unlink`
- Objetivo: remover o vinculo e refletir status inativo na UI

---

## Endpoints do Backend (para referencia)

### GET /auth/oauth/authorize
- Chamado pelo App da Alexa (webview), NAO pelo frontend React
- Recebe: `client_id`, `redirect_uri`, `state`, `response_type`, `scope` (opcional)
- Gera `session_code` (UUID), salva em memoria/banco com TTL de 10 min
- Redireciona para: `{FRONTEND_URL}/alexa-login?session_code=UUID`
- IMPORTANTE: `scope` deve ser opcional no DTO (Alexa nao envia esse campo)

### POST /auth/oauth/token
- Chamado pela Alexa (nao pelo frontend) para trocar o auth_code por access_token
- Body (x-www-form-urlencoded): `{ code, grant_type, client_id, client_secret }`
- Retorna: `{ access_token, token_type, expires_in }`

### POST /alexa/intent
- Chamado pela Alexa a cada comando de voz
- Rota PUBLICA no header (sem JWT do app)
- O token do usuario vem em: `body.context.System.user.accessToken`
- DEVE retornar HTTP 200 (nao 201) — NestJS exige `@HttpCode(200)`
- NUNCA lancar excecoes — sempre retornar resposta no formato Alexa (HTTP 500 = "invalid response")

---

## Formato de Resposta da Alexa

```typescript
{
  version: '1.0',
  response: {
    outputSpeech: { type: 'PlainText', text: 'mensagem de voz' },
    shouldEndSession: true,   // false para manter sessao aberta
    reprompt: {               // opcional, so quando shouldEndSession: false
      outputSpeech: { type: 'PlainText', text: 'pergunta de reprompt' }
    }
  }
}
```

---

## Interaction Model da Skill (Alexa Developer Console)

### Intents implementados

| Intent | Slots | Exemplo de fala |
|---|---|---|
| `AddItemIntent` | `quantidade` (AMAZON.NUMBER), `item` (ITEM_NAME), `lista` (LIST_NAME) | "adiciona 3 leite na lista mercado" |
| `RemoveItemIntent` | `item` (ITEM_NAME), `lista` (LIST_NAME) | "remove leite da lista mercado" |
| `ListItemsIntent` | - | "o que tem na minha lista" |

### Tipos customizados

- `ITEM_NAME`: lista de exemplos de itens de mercado (leite, pao, arroz, etc.)
- `LIST_NAME`: lista de exemplos de nomes de lista (mercado, farmacia, feira, etc.)

### Por que tipos customizados e nao AMAZON.SearchQuery

`AMAZON.SearchQuery` nao pode ser combinado com outros slots na mesma utterance.
Tipos customizados com exemplos permitem multiplos slots na mesma frase.

---

## Configuracao no Alexa Developer Console

Acesse: https://developer.amazon.com/alexa/console/ask

---

### Passo 1: Criar a Skill

1. Clique em **Create Skill**
2. **Skill name**: `Super Family Quest`
3. **Primary locale**: `Portuguese (BR)`
4. **Experience type**: `Other > Custom`
5. **Hosting**: `Provision your own` (aponta para seu backend)
6. Clique em **Create Skill**
7. Escolha o template **Start from Scratch**

---

### Passo 2: Interaction Model

1. Va em **Build > Interaction Model > JSON Editor**
2. Cole o JSON completo do modelo (ver secao "Interaction Model da Skill" acima)
3. Clique em **Save Model**
4. Clique em **Build Model** e aguarde (~1 minuto ate "Build Successful")

O `invocationName` deve ser: `super family quest`

---

### Passo 3: Endpoint

1. Va em **Build > Endpoint**
2. Selecione **HTTPS**
3. **Default Region**: `https://seu-backend.com/alexa/intent`
4. **SSL Certificate**: selecione:
   `My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority`
   (usar essa opcao para ngrok — cobre dominios `*.ngrok-free.dev`)
5. Clique em **Save Endpoints**
6. Apos salvar, volte em **Build Model** novamente para aplicar o endpoint

---

### Passo 4: Account Linking

1. Va em **Build > Account Linking**
2. Ative a opcao **"Do users need to create an account or link an existing one?"**: `Yes`
3. Preencha os campos:

| Campo | Valor |
|---|---|
| Authorization URI | `https://seu-backend.com/auth/oauth/authorize` |
| Access Token URI | `https://seu-backend.com/auth/oauth/token` |
| Client ID | valor definido em `ALEXA_CLIENT_ID` no backend |
| Client Secret | valor definido em `ALEXA_CLIENT_SECRET` no backend |
| Authentication Scheme | `Credentials in request body` |
| Scope | deixar em branco (backend aceita scope opcional) |
| Domain List | deixar em branco |

4. Clique em **Save**
5. Apos salvar, a pagina exibe os **Alexa Redirect URLs** (ex: `https://layla.amazon.com/api/skill/link/XXXXX`) — guarde essas URLs, o backend precisa aceitar redirecionar para elas

> IMPORTANTE: O `scope` do campo Account Linking deve ficar em branco.
> A Alexa nao envia o campo `scope` no authorize, e o backend deve aceita-lo como opcional.
> Nao use `alexa::skills:account_linking` — esse scope NAO existe no Login with Amazon.

---

### Passo 5: Permissions

1. Va em **Build > Permissions**
2. Desative todas as permissoes (nao sao necessarias para lista de compras propria)

---

### Passo 6: Distribuicao na Loja

> Necessario para a skill aparecer em "Skills do Desenvolvedor" no App da Alexa
> e para habilitar o Account Linking pelo celular.

1. Va em **Distribution**
2. Preencha os campos obrigatorios:

**Skill Store Info**
- **Public Name**: `Super Family Quest`
- **One Sentence Description**: `Adicione e gerencie itens da sua lista de compras por voz`
- **Detailed Description**: descricao completa do que a skill faz
- **Example Phrases** (3 exemplos obrigatorios):
  - `Alexa, abre o Super Family Quest`
  - `adiciona tres leites na lista`
  - `o que tem na minha lista`
- **Keywords**: `lista de compras, mercado, familia, compras`
- **Category**: `Shopping`

**Privacy & Compliance**
- Does this skill allow users to make purchases or spend real money? `No`
- Does this Alexa skill collect users' personal information? `No`
- Is this skill directed to or does it target children? `No`
- Does this skill contain advertising? `No`

**Availability**
- Beta Test ou Public: para desenvolvimento, mantenha como **Development**

3. Clique em **Save and continue** em cada aba

> Nao e necessario submeter para certificacao para testar.
> A skill em modo Development ja aparece no App da Alexa em
> **Mais > Skills e Jogos > Skills do Desenvolvedor**

---

### Passo 7: Testar pelo App da Alexa (Account Linking)

1. Abra o **App da Alexa** no celular
2. Va em **Mais > Skills e Jogos > Skills do Desenvolvedor**
3. Encontre **Super Family Quest** e toque em **Ativar Skill**
4. Toque em **Vincular Conta**
5. O webview abre apontando para o backend (`/auth/oauth/authorize`)
6. O backend redireciona para a tela `/alexa-login` do frontend
7. Faca login com email e senha do app
8. Apos o login, o webview fecha e a Alexa confirma o vinculo
9. No app Super Family Quest, a tela `/settings` deve exibir status verde (Conectado)

---

### Variaveis de ambiente do backend necessarias

```env
ALEXA_CLIENT_ID=valor-definido-no-console
ALEXA_CLIENT_SECRET=valor-definido-no-console
FRONTEND_URL=https://seu-frontend.com
```

### Onde encontrar o Skill ID

O Skill ID aparece em tres lugares:
- **Build > Endpoint**: exibido no topo da pagina
- **Lista de Skills**: link "View Skill ID" abaixo do nome
- **URL do navegador**: trecho `amzn1.ask.skill.XXXX` na URL

---

## Como testar localmente (sem Account Linking feito)

### Passo 1: Gerar session_code valido
Acesse no navegador:
```
http://localhost:3001/auth/oauth/authorize?client_id=SEU_CLIENT_ID&redirect_uri=https://layla.amazon.com/fake&state=teste123&response_type=code
```
O backend redireciona para `/alexa-login?session_code=UUID-GERADO`.

### Passo 2: Testar o login OAuth
Abra a URL redirecionada, faca login — deve redirecionar para a URL da Amazon (erro esperado no browser, pois e URL da Amazon).

### Passo 3: Testar intents via Manual JSON
Na aba Test do Alexa Developer Console, use a aba "Manual JSON":
- Substitua `applicationId` pelo Skill ID real
- Coloque um `accessToken` valido do banco no campo `context.System.user.accessToken`
- Selecione SSL: `wildcard certificate` no Endpoint
- O controller deve ter `@HttpCode(200)` no NestJS

---

## Regra de status na UI

No item da Alexa na tela de Configuracoes:

- Conectado (verde): `alexa.connected === true`
- Desconectado (vermelho/cinza): `alexa.connected === false`
- Quando desconectado: exibe card "Como vincular" com instrucoes do App da Alexa

## Atualizacao sem refresh manual

A pagina `/settings`:

1. Carrega status ao montar (`GET /profile/integrations`)
2. Detecta query params de retorno OAuth (`?code=` ou `?state=`) e recarrega automaticamente
3. Atualiza estado React para refletir indicador verde/vermelho imediatamente

---

## i18n implementado

Chaves adicionadas nos dois temas (`default/pt.json` e `rpg/pt.json`):

- `settings.integrations.alexa.howToConnect`
- `settings.integrations.alexa.howToConnectStep1`
- `settings.integrations.alexa.howToConnectStep2`
- `settings.integrations.alexa.howToConnectStep3`
- `alexaLogin.title`
- `alexaLogin.subtitle`
- `alexaLogin.email`
- `alexaLogin.password`
- `alexaLogin.submit`
- `alexaLogin.loading`
- `alexaLogin.error`
- `alexaLogin.errorDescription`
- `alexaLogin.invalidSession`
- `alexaLogin.invalidSessionDescription`

---

## Tokens de tema utilizados

- `theme.colors.background.settings`
- `theme.colors.background.integrations.statusConnected`
- `theme.colors.background.integrations.statusDisconnected`
- `theme.colors.text.integrations.title`
- `theme.colors.text.integrations.description`
- `theme.colors.text.integrations.statusConnected`
- `theme.colors.text.integrations.statusDisconnected`
- `theme.colors.border.integrations.statusConnected`
- `theme.colors.border.integrations.statusDisconnected`

---

## Observacoes de implementacao

- Usar `useVisualTheme()` para cores/fontes
- Usar `useThemedTranslation()` para textos
- `/settings` mantem layout padrao mobile com `Header` e `NavigationBar`
- `/alexa-login` NAO tem Header nem NavigationBar (e webview da Alexa)
- Variaveis `VITE_AMAZON_CLIENT_ID` e `VITE_ALEXA_REDIRECT_URI` foram REMOVIDAS do frontend
- O frontend nunca chama OAuth da Amazon diretamente — apenas o backend e o App da Alexa fazem isso
- `VITE_API_URL` deve apontar para a URL acessivel externamente (ngrok ou dominio) durante testes com celular
