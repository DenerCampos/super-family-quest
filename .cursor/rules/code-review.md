# Regras de Code Review - Super Family Quest

## 📋 Contexto do Projeto

Este projeto é uma aplicação React + TypeScript focada em mobile, usando Chakra UI e seguindo princípios de Clean Architecture.

---

## 🎯 Princípios Fundamentais

### 1. Clean Code

#### Nomenclatura
- ✅ Variáveis e funções: camelCase descritivo
- ✅ Componentes React: PascalCase
- ✅ Constantes: UPPER_SNAKE_CASE
- ✅ Arquivos de componentes: PascalCase.tsx
- ✅ Hooks customizados: use + PascalCase
- ✅ Tipos/Interfaces: PascalCase
- ❌ Evitar abreviações obscuras
- ❌ Evitar nomes genéricos (data, temp, info)

#### Funções
- ✅ Devem fazer UMA coisa apenas (Single Responsibility)
- ✅ Máximo de 3 parâmetros (usar objeto se precisar mais)
- ✅ Nome deve descrever exatamente o que faz
- ✅ Máximo de 20-30 linhas (preferir menos)
- ❌ Evitar side effects inesperados
- ❌ Evitar flags booleanos como parâmetros

#### Comentários
- ✅ Código deve ser auto-explicativo
- ✅ Comentar apenas o "porquê", não o "como"
- ✅ Comentar lógicas de negócio complexas
- ❌ Evitar comentários redundantes
- ❌ Remover código comentado

---

## ⚛️ Boas Práticas React

### Componentes

#### Estrutura
```typescript
// ✅ Bom: Componente bem estruturado
interface Props {
  title: string;
  onSave: (data: FormData) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  // Hooks no topo
  const [state, setState] = useState();
  const { theme } = useThemeContext();
  
  // Handlers
  const handleSubmit = () => { /* ... */ };
  
  // Effects
  useEffect(() => { /* ... */ }, []);
  
  // Render helpers (se necessário)
  const renderContent = () => { /* ... */ };
  
  // JSX
  return <div>{/* ... */}</div>;
};

// ❌ Ruim: Componente desorganizado
export const MyComponent = (props: any) => {
  const handleClick = () => { /* ... */ };
  const [state1, setState1] = useState();
  useEffect(() => { /* ... */ }, []);
  const [state2, setState2] = useState();
  // ...desordenado
};
```

#### Composição
- ✅ Preferir composição a herança
- ✅ Quebrar componentes grandes em menores
- ✅ Usar children para composição
- ✅ Extrair lógica complexa para hooks
- ❌ Evitar componentes com mais de 200 linhas
- ❌ Evitar prop drilling excessivo (usar Context)

### Hooks

#### Regras dos Hooks
- ✅ Chamar no topo do componente
- ✅ Não chamar condicionalmente
- ✅ Custom hooks começam com "use"
- ✅ Declarar todas as dependências
- ❌ Evitar dependências desnecessárias

#### Custom Hooks
```typescript
// ✅ Bom: Hook bem separado
export const useExpenseForm = (initialData?: Expense) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    // ...lógica
    setIsLoading(false);
  };
  
  return { formData, isLoading, handleSubmit };
};

// ❌ Ruim: Lógica no componente
const MyComponent = () => {
  const [formData, setFormData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => { /* ... 50 linhas ... */ };
  // ...
};
```

### Performance

#### Otimizações
- ✅ useMemo para cálculos pesados
- ✅ useCallback para funções passadas como props
- ✅ React.memo para componentes puros
- ✅ Lazy loading de rotas e componentes
- ✅ Virtualização de listas longas
- ❌ Não otimizar prematuramente
- ❌ Evitar renders desnecessários

#### Anti-patterns
```typescript
// ❌ Ruim: Criar função em cada render
<Button onClick={() => handleClick(id)} />

// ✅ Bom: useCallback
const handleClickWithId = useCallback(
  () => handleClick(id),
  [id]
);
<Button onClick={handleClickWithId} />

// ❌ Ruim: Objetos literais em props
<Component style={{ margin: 10 }} />

// ✅ Bom: Memorizar objeto
const style = useMemo(() => ({ margin: 10 }), []);
<Component style={style} />
```

---

## 📘 TypeScript

### Tipagem

#### Boas Práticas
- ✅ Tipar tudo explicitamente
- ✅ Usar interfaces para objetos
- ✅ Usar types para unions/intersections
- ✅ Usar generics quando apropriado
- ✅ Props e state sempre tipados
- ❌ NUNCA usar `any`
- ❌ Evitar `as` (type casting) quando possível
- ❌ Evitar `@ts-ignore`

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  email: string;
}

type Status = 'pending' | 'active' | 'completed';

interface Props {
  user: User;
  status: Status;
  onUpdate: (user: User) => Promise<void>;
}

// ❌ Ruim
const MyComponent = (props: any) => { /* ... */ };
const data: any = fetchData();
```

### Organização de Tipos
- ✅ Tipos compartilhados em `src/types/`
- ✅ Tipos locais no próprio arquivo
- ✅ Exportar apenas o necessário
- ✅ Nomear interfaces/types claramente

---

## 🏗️ Arquitetura

### Camadas

#### 1. Pages
- ✅ Apenas composição e lógica de página
- ✅ Usar hooks customizados
- ✅ Gerenciar estados da página
- ❌ Não fazer chamadas diretas de API
- ❌ Não ter lógica de negócio complexa

#### 2. Components
- ✅ Componentes reutilizáveis
- ✅ Props bem definidas
- ✅ Sem lógica de negócio
- ✅ Responsabilidade única
- ❌ Não acessar services diretamente

#### 3. Hooks
- ✅ Lógica reutilizável
- ✅ Integração com services
- ✅ Gerenciamento de estado local
- ✅ Um hook = uma responsabilidade

#### 4. Services
- ✅ Comunicação com API
- ✅ Transformação de dados
- ✅ Tratamento de erros
- ❌ Não ter lógica de UI
- ❌ Não acessar estado React

#### 5. Utils
- ✅ Funções puras
- ✅ Sem dependências de React
- ✅ Bem testáveis
- ✅ Reutilizáveis

### Organização de Arquivos
```
src/
├── pages/              # Apenas páginas/rotas
│   └── Home/
│       └── index.tsx
├── components/         # Componentes reutilizáveis
│   ├── Button.tsx
│   └── modals/
├── hooks/             # Lógica reutilizável
│   └── useExpenseForm.ts
├── services/          # API calls
│   └── expense.ts
└── utils/             # Helpers puros
    └── formatCurrency.ts
```

---

## 🔒 Segurança

### Checklist
- ✅ Validar inputs do usuário
- ✅ Sanitizar dados antes de renderizar
- ✅ Usar HTTPS para APIs
- ✅ Não expor tokens/secrets no frontend
- ✅ Validar tipos no runtime quando necessário
- ❌ Não usar `dangerouslySetInnerHTML` sem sanitização
- ❌ Não logar informações sensíveis

---

## 🎨 Chakra UI

### Boas Práticas
- ✅ Usar componentes do Chakra
- ✅ Usar sistema de design tokens
- ✅ Usar props responsivos
- ✅ Usar hooks do Chakra (useDisclosure, useToast)
- ❌ Não criar componentes que já existem no Chakra
- ❌ Evitar CSS inline quando possível

```typescript
// ✅ Bom: Usar sistema do Chakra
<Box p={4} bg="gray.100" borderRadius="md">
  <Text fontSize="lg" color="brand.500">
    Content
  </Text>
</Box>

// ❌ Ruim: CSS inline
<div style={{ padding: '16px', background: '#f0f0f0' }}>
  <p style={{ fontSize: '18px', color: '#123456' }}>
    Content
  </p>
</div>
```

---

## 🌍 Internacionalização

### i18next
- ✅ Usar hooks `useThemedTranslation` do projeto
- ✅ Todas as strings visíveis devem ser traduzidas
- ✅ Keys descritivas no JSON
- ❌ Não usar strings hardcoded
- ❌ Não concatenar traduções

```typescript
// ✅ Bom
const { t } = useThemedTranslation();
<Text>{t('common.welcome', { name: user.name })}</Text>

// ❌ Ruim
<Text>Bem-vindo, {user.name}!</Text>
```

---

## 📊 Formulários

### React Hook Form + Yup
- ✅ Usar React Hook Form
- ✅ Validação com Yup schemas
- ✅ Mensagens de erro claras
- ✅ Feedback visual de erros
- ❌ Não validar apenas no submit
- ❌ Não usar estado local para formulários complexos

---

## 🧪 Qualidade de Código

### Métricas
- ✅ Componentes: máximo 200 linhas
- ✅ Funções: máximo 30 linhas
- ✅ Complexidade ciclomática: máximo 10
- ✅ Parâmetros de função: máximo 3
- ✅ Níveis de indentação: máximo 4

### Code Smells a Evitar
- ❌ Funções muito longas
- ❌ Componentes fazendo muitas coisas
- ❌ Duplicação de código
- ❌ Magic numbers (usar constantes)
- ❌ Props drilling excessivo
- ❌ God components/hooks
- ❌ Lógica em JSX
- ❌ Callbacks complexos inline

---

## ✅ Checklist de Review

### Estrutura
- [ ] Arquivo está na pasta correta
- [ ] Nome do arquivo segue convenção
- [ ] Imports organizados (React, libs, local)
- [ ] Exports no final do arquivo

### Código
- [ ] Nomenclatura clara e descritiva
- [ ] Funções pequenas e focadas
- [ ] Sem duplicação de código
- [ ] Sem código comentado
- [ ] Sem console.logs esquecidos
- [ ] Sem TODOs antigos

### React
- [ ] Hooks no topo
- [ ] Dependências corretas nos arrays
- [ ] Props tipadas
- [ ] Componente focado (SRP)
- [ ] Performance considerada

### TypeScript
- [ ] Tudo tipado corretamente
- [ ] Sem any
- [ ] Sem ts-ignore
- [ ] Tipos/interfaces exportados se necessário

### Arquitetura
- [ ] Camada correta
- [ ] Separação de responsabilidades
- [ ] Reutilização quando possível
- [ ] Não viola arquitetura do projeto

### Segurança
- [ ] Inputs validados
- [ ] Dados sanitizados
- [ ] Sem informações sensíveis expostas

### UX
- [ ] Loading states
- [ ] Error states
- [ ] Feedback ao usuário
- [ ] Acessibilidade básica
- [ ] Responsivo (mobile-first)

---

## 🎯 Prioridades de Severidade

### 🔴 Crítico (Bloqueia PR)
- Bugs que quebram funcionalidade
- Vulnerabilidades de segurança
- Violações graves de arquitetura
- Uso de `any` sem justificativa
- Memory leaks

### 🟡 Médio (Deve ser corrigido)
- Code smells
- Más práticas
- Falta de tipagem adequada
- Componentes muito grandes
- Duplicação de código
- Falta de tratamento de erro

### 🔵 Baixo (Sugestão)
- Otimizações de performance
- Melhorias de nomenclatura
- Refatorações sugeridas
- Comentários adicionais
- Testes sugeridos

---

## 📚 Referências

- [React Best Practices](https://react.dev/learn)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Chakra UI Best Practices](https://chakra-ui.com/getting-started)
- [React Hook Form](https://react-hook-form.com/get-started)

