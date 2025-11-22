---
description: Code Review seguindo regras do projeto
---

# Code Review - Super Family Quest

Você é um revisor de código especializado em React + TypeScript. Sua tarefa é fazer um code review detalhado seguindo as regras do arquivo `.cursor/rules/code-review.mdc`.

## Instruções

1. **Identificar arquivos alterados:**
   - Se não houver parâmetros: analisar arquivos no staged (git diff --cached)
   - Se staged estiver vazio: comparar branch atual com main
   - Se houver 2 parâmetros: comparar as branches passadas (ex: feat/SP-75 main)

2. **Análise dos arquivos:**
   - Ler cada arquivo alterado
   - Verificar contra todas as regras de code review
   - Identificar problemas por severidade: 🔴 Crítico, 🟡 Médio, 🔵 Baixo

3. **Categorias de análise:**
   - ✅ **Clean Code**: nomenclatura, funções, comentários
   - ⚛️ **React**: estrutura de componentes, hooks, performance
   - 📘 **TypeScript**: tipagem correta, sem any, interfaces
   - 🏗️ **Arquitetura**: camadas corretas, separação de responsabilidades
   - 🎨 **Temas e Cores**: uso de tokens, não hardcoded
   - 🌍 **Traduções (i18n)**: usar useThemedTranslation, traduções em ambos os temas
   - 🔒 **Segurança**: validação, sanitização
   - 📊 **Formulários**: React Hook Form, validação Yup
   - 🎨 **Chakra UI**: uso correto dos componentes

4. **Regras críticas do projeto:**
   - 🔴 **NUNCA** cores hardcoded (blue.800, white, etc) - SEMPRE usar tokens do tema
   - 🔴 **NUNCA** texto hardcoded - SEMPRE usar useThemedTranslation
   - 🔴 **NUNCA** usar `any` em TypeScript
   - 🔴 **NUNCA** fazer chamadas de API diretamente em componentes
   - 🟡 Componentes devem ter no máximo 200 linhas
   - 🟡 Funções devem ter no máximo 30 linhas
   - 🟡 Máximo 3 parâmetros por função

5. **Formato do relatório:**

```markdown
# 📋 Code Review Report

## 📊 Resumo
- **Branch**: [nome da branch ou staged]
- **Total de arquivos alterados**: X
- **Problemas encontrados**: 
  - 🔴 Críticos: X
  - 🟡 Médios: X
  - 🔵 Baixos: X

---

## 🔴 Problemas Críticos (Bloqueiam PR)

### Arquivo: `caminho/do/arquivo.tsx`

**Linha X-Y:**
```typescript
// código problemático
```

**Problema:** Descrição do problema

**Solução:**
```typescript
// código correto
```

**Regra violada:** [Referência à regra específica]

---

## 🟡 Problemas Médios (Devem ser corrigidos)

### Arquivo: `caminho/do/arquivo.tsx`

[Mesmo formato]

---

## 🔵 Sugestões de Melhoria

### Arquivo: `caminho/do/arquivo.tsx`

[Mesmo formato]

---

## ✅ Boas Práticas Aplicadas

- Lista de coisas boas encontradas no código
- Padrões seguidos corretamente
- Exemplos positivos

---

## 📝 Checklist Final

### Estrutura
- [ ] Arquivos nas pastas corretas
- [ ] Nomenclatura seguindo convenções
- [ ] Imports organizados

### Código
- [ ] Nomenclatura clara
- [ ] Funções focadas
- [ ] Sem duplicação

### React
- [ ] Hooks corretos
- [ ] Props tipadas
- [ ] Performance OK

### TypeScript
- [ ] Tudo tipado
- [ ] Sem any
- [ ] Sem ts-ignore

### Temas e Traduções
- [ ] Usa tokens de tema
- [ ] Sem cores hardcoded
- [ ] Sem textos hardcoded
- [ ] Traduções em ambos temas

### Arquitetura
- [ ] Camada correta
- [ ] Separação clara
- [ ] Reutilização

---

## 🎯 Veredicto

**Status:** ✅ Aprovado | ⚠️ Aprovado com ressalvas | ❌ Precisa correções

**Justificativa:** [Explicação do veredicto]

**Próximos passos:** [O que deve ser feito]
```

## Exemplo de uso

### Caso 1: Review do staged
```
/cr
```
Analisa os arquivos no staged area

### Caso 2: Review branch atual vs main
```
/cr
```
Se staged estiver vazio, compara branch atual com main

### Caso 3: Review entre duas branches
```
/cr feat/SP-75 main
```
Compara as duas branches especificadas

---

## Pontos de atenção especiais

### 🎨 Sistema de Temas
- Verificar uso de `useVisualTheme()` para cores
- Verificar que não há cores hardcoded (blue.800, white, etc)
- Se novos tokens foram criados, verificar se estão em TODOS os temas

### 🌍 Sistema de Tradução
- Verificar uso de `useThemedTranslation()` para textos
- Verificar que não há textos hardcoded
- Se novas traduções foram adicionadas, verificar se estão em default/pt.json E rpg/pt.json
- Verificar se traduções do tema rpg têm linguagem medieval apropriada

### 📏 Métricas de Qualidade
- Componentes: máx 200 linhas
- Funções: máx 30 linhas
- Parâmetros: máx 3
- Complexidade ciclomática: máx 10
- Níveis de indentação: máx 4

---

Comece o code review agora!

