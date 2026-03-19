# Family Stories - Documentação

## Visão Geral

O componente **Family Stories** adiciona uma barra horizontal scrollável (estilo Instagram Stories) na página Home, logo abaixo do Header. Permite visualizar dados financeiros da família inteira ou de membros individuais.

## Conceito

O aplicativo é um controle de finanças familiar. O responsável da família (owner) vincula outras contas da família à conta principal. Na Home, cada membro aparece como um avatar que pode ser selecionado para filtrar os dados exibidos.

### Fluxo do Usuário

1. Ao abrir a Home, o item **"Família"** vem selecionado por padrão (todas as receitas e despesas somadas)
2. O usuário pode scrollar horizontalmente e clicar em um membro específico
3. Ao selecionar um membro, os cards de resumo e a lista de registros atualizam com os dados daquele membro
4. Clicar novamente em "Família" volta a exibir os dados consolidados

## Arquivos Criados/Modificados

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/mocks/familyMembers.ts` | Dados mockados dos membros da família (tipos + mock data) |
| `src/components/FamilyStories.tsx` | Componente da barra de stories com avatares |

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Home/index.tsx` | Integração do FamilyStories, lógica de seleção de membro, dados dinâmicos |
| `src/components/LastRegistrationsList.tsx` | Nova prop `externalRegistrations` para aceitar dados via props |
| `src/theme/types.ts` | Novos tokens: `background.familyStories`, `text.familyStories`, `border.familyStories` |
| `src/theme/themes.ts` | Valores dos tokens para tema `default` e `rpg` |
| `src/i18n/locales/default/pt.json` | Traduções de `home.familyStories.*` |
| `src/i18n/locales/rpg/pt.json` | Traduções de `home.familyStories.*` (tema medieval) |

## Tipos

### FamilyMember

```typescript
type FamilyMemberRole = 'owner' | 'member';

type FamilyMember = {
  id: string;
  name: string;
  avatar: string;
  role: FamilyMemberRole;
  income: number;
  expenses: number;
  registrations: Registration[];
};
```

### FamilyStoriesProps

```typescript
type FamilyStoriesProps = {
  members: FamilyMember[];
  selectedId: string | null;       // null = família inteira selecionada
  onSelect: (memberId: string | null) => void;
};
```

## Tokens de Tema

### Background
- `background.familyStories.container` - Fundo da barra de stories
- `background.familyStories.avatar` - Fundo do avatar (ícone da família)
- `background.familyStories.selected` - Gradiente do avatar selecionado

### Text
- `text.familyStories.name` - Nome do membro (não selecionado)
- `text.familyStories.selectedName` - Nome do membro (selecionado)

### Border
- `border.familyStories.default` - Borda do avatar (não selecionado)
- `border.familyStories.selected` - Borda/gradiente do avatar (selecionado)

## Traduções

### Default (pt.json)
```json
"home.familyStories.familyLabel": "Família"
"home.familyStories.summaryIncome": "Receitas de {{name}}"
"home.familyStories.summaryExpenses": "Despesas de {{name}}"
"home.familyStories.familyIncome": "Receitas da Família"
"home.familyStories.familyExpenses": "Despesas da Família"
```

### RPG (pt.json)
```json
"home.familyStories.familyLabel": "O Clã"
"home.familyStories.summaryIncome": "Recompensas de {{name}}"
"home.familyStories.summaryExpenses": "Tributos de {{name}}"
"home.familyStories.familyIncome": "Recompensas do Clã"
"home.familyStories.familyExpenses": "Tributos do Clã"
```

## Mock Data

Os dados mockados estão em `src/mocks/familyMembers.ts` e incluem 4 membros:

| Nome | Role | Receita | Despesa |
|------|------|---------|---------|
| Dener | owner | R$ 5.670 | R$ 2.887,10 |
| Ana | member | R$ 3.200 | R$ 1.450,50 |
| Lucas | member | R$ 0 | R$ 320 |
| Sofia | member | R$ 0 | R$ 185 |

Os avatares usam a API [DiceBear Adventurer](https://www.dicebear.com/styles/adventurer/) para gerar avatares SVG automaticamente.

## Próximos Passos (Backend)

Quando o backend estiver pronto:

1. Criar endpoint `GET /family/members` para retornar os membros vinculados
2. Criar endpoint `GET /family/members/:id/summary` para retornar receita/despesa de um membro
3. Criar endpoint `GET /family/members/:id/registrations` para retornar registros de um membro
4. Substituir `mockFamilyMembers` por chamada à API em `src/pages/Home/index.tsx`
5. Mover o tipo `FamilyMember` de `src/mocks/` para `src/types/`
6. Criar service `src/services/family.ts` com as chamadas HTTP
7. (Opcional) Criar hook `useFamilyMembers` para encapsular a lógica de fetch + estado

## Layout Final

```
┌─────────────────────────────┐
│         HEADER              │
├─────────────────────────────┤
│ [👨‍👩‍👧‍👦] [Dener] [Ana] [Lucas] [Sofia]  ← scrollável
├─────────────────────────────┤
│  Receitas da Família        │
│  R$ 8.870,00                │
├─────────────────────────────┤
│  Despesas da Família        │
│  R$ 4.842,60                │
├─────────────────────────────┤
│  [Registrar Tributo]        │
│  [Registrar Recompensa]     │
├─────────────────────────────┤
│  Últimos Registros          │
│  - Item 1                   │
│  - Item 2                   │
│  ...                        │
├─────────────────────────────┤
│       NAVIGATION BAR        │
└─────────────────────────────┘
```
