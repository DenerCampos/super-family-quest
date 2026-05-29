---
description: Code Review (staged ou branches) — React, segurança, tema, i18n e docs
---

# Code Review - Super Family Quest

Revisor especializado em **React + TypeScript** (mobile-first). Analise **apenas o diff** e gere relatório para review **antes do commit/merge**.

**Leia e aplique:**
- `.cursor/rules/code-review.mdc` — checklist completo
- `.cursor/rules/regra-projeto.mdc` — arquitetura, React Query, tema, i18n
- `/.cursor/rules/workflow.mdc` — git (`homolog`), docs em `.cursor/docs/`

**Branch de integração padrão:** `homolog` (fallback `main` se não existir).

## Modos de operação

| Comando | Comportamento |
|---------|----------------|
| `/cr` | 1) Se houver **staged** → `git diff --cached`. 2) Senão → `git diff homolog...HEAD` |
| `/cr feat/SP-75 homolog` | Diff entre as duas branches (ignora staged) |
| `/cr feat/SP-75 main` | Comparar com `main` quando fizer sentido (ex.: antes de promover homolog) |

**Formato:** `/cr <branch-origem> <branch-destino>`

## Categorias de análise

- ✅ **Clean Code** — nomenclatura, tamanho de funções/componentes
- ⚛️ **React** — hooks, composição, performance, keys em listas
- 📘 **TypeScript** — sem `any`, props e retornos tipados
- 🏗️ **Arquitetura** — pages / components / hooks / services
- 🎨 **Tema** — `useVisualTheme()`, tokens em `themes.ts` (ambos os temas)
- 🌍 **i18n** — `useThemedTranslation()`, `default` + `rpg`
- 📊 **Formulários** — React Hook Form + Yup
- 🔒 **Segurança** — seção obrigatória abaixo
- 📡 **Dados** — TanStack Query, `services/`, sem fetch solto em componente
- 📄 **Docs** — `.cursor/docs/` alinhada ao código

## Regras críticas do projeto

- 🔴 **NUNCA** cores hardcoded — tokens do tema
- 🔴 **NUNCA** texto hardcoded — i18n nos dois temas
- 🔴 **NUNCA** `any` sem justificativa documentada
- 🔴 **NUNCA** chamada HTTP direta em componente (usar `services/` + hooks)
- 🟡 Componente ≤ ~200 linhas; função ≤ ~30 linhas; ≤ 3 parâmetros

## 🔒 Segurança (seção obrigatória no relatório)

Qualquer 🔴 aqui **bloqueia** aprovação.

### Auth e sessão
- [ ] Rotas sensíveis com `RequireAuth` em `App.tsx`
- [ ] Token JWT só via `services/api.ts` (interceptor); não duplicar lógica de auth espalhada
- [ ] **localStorage** (`accessToken`): consciência de risco XSS — não gravar outros segredos; não logar token
- [ ] Logout / 401: não deixar usuário em tela protegida com token inválido

### Segredos e config
- [ ] **Nenhum** secret no código ou commit (API keys, client secrets)
- [ ] Apenas `import.meta.env.VITE_*` para o que pode ser público no bundle; nunca chave privada de backend no front
- [ ] `.env` / `.env.local` fora do diff

### Entrada e renderização
- [ ] Inputs validados (Yup + RHF) antes de enviar à API
- [ ] **Sem** `dangerouslySetInnerHTML` sem sanitização explícita
- [ ] URLs/query params: não colocar PII ou tokens na barra de endereço
- [ ] Upload de imagem/áudio: validar tipo/tamanho no cliente; não confiar só no backend

### API e dados
- [ ] Não exibir em UI dados de outro usuário/família (confiar na API, mas não renderizar campos “extras” não usados)
- [ ] Erros da API: mensagem genérica ao usuário; detalhes só em dev/console controlado
- [ ] React Query: `queryKey` com escopo (user/familyGroup/id); invalidação correta após mutation

### Realtime e integrações
- [ ] **socket.io**: conectar com credencial/autenticação alinhada ao backend; não assinar salas de outro grupo
- [ ] **Alexa / OAuth** (`integrations.ts`, Settings): fluxo sem vazar code/state na UI ou logs
- [ ] QR / links externos: validar origem antes de abrir ou enviar à API

### Privacidade
- [ ] Sem `console.log` de email, token, payload completo de cupom/família
- [ ] PWA / cache: não persistir dados sensíveis em `localStorage` além do necessário

Registrar achados em **## 🔒 Segurança** (🔴/🟡/🔵 + arquivo + linha + correção).

## 📄 Documentação e entrega

- [ ] `.cursor/docs/<feature>.md` criada ou atualizada se feature/regra mudou
- [ ] `regra-projeto.mdc` (Docs de domínio) atualizado
- [ ] Novas rotas em `App.tsx` + service + types/hooks
- [ ] `npm run lint` e `npm run build` recomendados no veredito

## Formato do relatório

```markdown
# 📋 Code Review Report

## 📊 Resumo
- **Modo**: Staged | homolog...HEAD | branch vs branch
- **Origem / Destino**: feat/SP-XX → homolog
- **Arquivos**: X alterados (+ novos / removidos)
- **Issues**: 🔴 X | 🟡 X | 🔵 X

## 🔒 Segurança
[Lista priorizada — obrigatória mesmo se vazia: "Nenhum achado" só se revisado de fato]

## 🔴 Críticos
[...]

## 🟡 Médios
[...]

## 🔵 Sugestões
[...]

## ✅ Boas práticas
[...]

## 📝 Checklist final
[Marcar itens relevantes: tema, i18n, arquitetura, segurança, docs]

## 🎯 Veredicto
**Status:** ✅ Aprovado | ⚠️ Ressalvas | ❌ Correções obrigatórias
**Próximos passos:** [...]
```

## Exemplos de uso

```bash
# Revisar o que vai commitar
git add src/services/missions.ts src/hooks/useMissions.ts
/cr

# Revisar branch da tarefa antes de merge em homolog
/cr feat/SP-78 homolog

# Revisar tudo que homolog levaria para main
/cr homolog main
```

## Pontos de atenção (tema e i18n)

- `useVisualTheme()` + tokens; novos tokens em **default e rpg** em `themes.ts`
- `useThemedTranslation()`; novas keys em `i18n/locales/default/pt.json` e `rpg/pt.json`
- Layout mobile: shell 480px em `App.tsx`

---

Comece o code review agora: obtenha o diff, aplique as seções acima e gere o relatório completo com **🔒 Segurança** sempre preenchida.
