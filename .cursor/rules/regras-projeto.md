---
alwaysApply: true
---

# Super Family Quest - Regras do Projeto

> **Regra sempre ativa**: Este arquivo é aplicado automaticamente como contexto em todas as conversas sobre o projeto.

## 📋 Informações Gerais
- **Nome do Projeto**: Super Family Quest
- **Tipo**: Frontend Web Application
- **Versão**: 0.0.0
- **Tipo de Módulo**: ESM (ES Modules)
- **Projeto para mobile**: Focar no front para mobile.

## 🛠️ Stack Tecnológica

### Linguagem Principal
- **TypeScript**: ~5.8.3
  - Target: ES2020
  - Module: ESNext
  - Modo: Strict habilitado
  - JSX: react-jsx
  - Module Resolution: bundler

### Framework e Bibliotecas Core
- **React**: ^19.1.0
- **React DOM**: ^19.1.0
- **React Router DOM**: ^6.20.1

### Build Tools
- **Vite**: ^6.3.5
  - Plugin: @vitejs/plugin-react ^4.4.1
  - Configuração: HMR habilitado

### UI e Estilização
- **Chakra UI**: ^2.4.9
- **Emotion React**: ^11.10.5
- **Emotion Styled**: ^11.10.5
- **Framer Motion**: ^6.5.1
- **React Icons**: ^5.5.0

### Formulários e Validação
- **React Hook Form**: ^7.56.4
- **Yup**: ^1.6.1
- **@hookform/resolvers**: ^5.0.1

### Internacionalização (i18n)
- **i18next**: ^25.3.2
- **react-i18next**: ^15.6.1
- **i18next-browser-languagedetector**: ^8.2.0
- **i18next-http-backend**: ^3.0.2

### Gráficos e Visualização
- **Recharts**: ^3.0.2

### QR Code
- **@zxing/browser**: ^0.1.5

### HTTP Client
- **Axios**: ^1.9.0

### Linting e Code Quality
- **ESLint**: ^9.25.0
  - @eslint/js: ^9.25.0
  - eslint-plugin-react-hooks: ^5.2.0
  - eslint-plugin-react-refresh: ^0.4.19
  - typescript-eslint: ^8.30.1
  - globals: ^16.0.0

## 🏗️ Arquitetura e Estrutura

### Padrão Arquitetural
- **SPA (Single Page Application)** com React Router
- **Component-Based Architecture**
- **Context API** para gerenciamento de estado global

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── modals/         # Componentes de modais
│   │   ├── BuyThemeModal.tsx
│   │   ├── CompleteProfileModal.tsx
│   │   ├── NewRecurringExpenseModal.tsx
│   │   ├── NewRecurringIncomeModal.tsx
│   │   └── SimpleResourceModal.tsx
│   ├── reports/        # Componentes de relatórios/gráficos
│   │   ├── BarChartExpensesByStore.tsx
│   │   ├── BarChartExpensesIncome.tsx
│   │   ├── DateRangeFilter.tsx
│   │   ├── HorizontalBarChartTopProducts.tsx
│   │   ├── LineChartExpensesByDate.tsx
│   │   └── PieChartExpensesByGroup.tsx
│   ├── resources/      # Componentes de recursos
│   │   ├── ExpenseResource.tsx
│   │   ├── GroupResource.tsx
│   │   ├── PaymentResource.tsx
│   │   ├── ResourceContainer.tsx
│   │   ├── RevenueResource.tsx
│   │   └── StoreResource.tsx
│   ├── skeletons/      # Componentes skeleton para loading
│   │   └── Avenue.skeleton.tsx
│   ├── AutocompleteInput.tsx
│   ├── AvenueForm.tsx
│   ├── CoinDisplay.tsx
│   ├── ExpensesForm.tsx
│   ├── Header.tsx
│   ├── LastRegistrationsList.tsx
│   ├── LoadingOverlay.tsx
│   ├── LoginThemeProvider.tsx
│   ├── NavigationBar.tsx
│   ├── QRScannerPage.tsx
│   ├── RequireAuth.tsx
│   └── SummaryCard.tsx
├── contexts/           # Context Providers (Auth, Theme)
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/              # Custom React Hooks
│   ├── useExpenseForm.ts
│   ├── useExpenseFormAutofill.ts
│   ├── useExpenseFormSubmit.ts
│   ├── useExpensesMutations.ts
│   ├── useGetAutoFillExpenses.ts
│   ├── useGetLastRegistration.ts
│   ├── useInitialTheme.ts
│   ├── useLoginTheme.ts
│   ├── useRevenueMutations.ts
│   ├── useThemeContext.ts
│   ├── useThemedTranslation.ts
│   ├── useThemeTranslation.ts
│   └── useVisualTheme.ts
├── i18n/               # Configuração de internacionalização
│   ├── config.ts
│   ├── locales/
│   │   ├── default/
│   │   │   └── pt.json
│   │   └── rpg/
│   │       └── pt.json
│   └── types.ts
├── pages/              # Páginas/Views da aplicação
│   ├── Dashboard/
│   ├── Expenses/
│   ├── Home/
│   ├── Login/
│   ├── NewChallenge/
│   ├── NewResources/
│   ├── NotFoundPage/
│   ├── Profile/
│   ├── Register/
│   └── Revenue/
├── services/           # Serviços e API calls
│   ├── api.ts
│   ├── auth.ts
│   ├── coin.ts
│   ├── couponReader.ts
│   ├── expense.ts
│   ├── index.ts
│   ├── profile.ts
│   ├── reports.ts
│   ├── resources.ts
│   ├── revenue.ts
│   ├── theme.ts
│   └── user.ts
├── styles/             # Estilos globais
├── theme/              # Configuração de temas
│   ├── theme.ts
│   ├── themes.ts
│   └── types.ts
├── types/              # Definições de tipos TypeScript
│   └── revenue.ts
└── utils/              # Funções utilitárias
    ├── constants.ts
    ├── formatCurrency.ts
    ├── formatDate.ts
    ├── formatGrams.ts
    ├── formatString.ts
    └── qrCode.ts
```

### Camadas da Aplicação

#### 1. Pages (Views)
- Componentes de página que representam rotas
- Composição de componentes menores
- Gerenciamento de lógica de página

#### 2. Components
- Componentes reutilizáveis e específicos
- Separados por funcionalidade:
  - **modals/**: Modais específicos (BuyTheme, CompleteProfile, NewRecurringExpense, NewRecurringIncome, SimpleResource)
  - **reports/**: Componentes de gráficos e relatórios (BarCharts, LineChart, PieChart, DateRangeFilter)
  - **resources/**: Componentes de recursos (Expense, Group, Payment, Revenue, Store)
  - **skeletons/**: Componentes de loading
- Componentes de layout (Header, NavigationBar)
- Componentes de formulário (ExpensesForm, AvenueForm, AutocompleteInput)
- Componentes utilitários (CoinDisplay, LoadingOverlay, SummaryCard)

#### 3. Contexts
- **AuthContext**: Gerenciamento de autenticação e usuário
- **ThemeContext**: Gerenciamento de tema visual (default/medieval)

#### 4. Services
- Camada de comunicação com API
- Abstração de chamadas HTTP
- Separados por domínio:
  - api.ts (configuração base)
  - auth.ts
  - user.ts
  - expense.ts
  - revenue.ts
  - coin.ts
  - theme.ts
  - reports.ts
  - resources.ts
  - profile.ts
  - couponReader.ts

#### 5. Hooks Customizados
- **Tema**:
  - useInitialTheme
  - useLoginTheme
  - useThemeContext
  - useThemedTranslation
  - useThemeTranslation
  - useVisualTheme
- **Despesas**:
  - useExpenseForm
  - useExpenseFormAutofill
  - useExpenseFormSubmit
  - useExpensesMutations
  - useGetAutoFillExpenses
- **Geral**:
  - useGetLastRegistration
  - useRevenueMutations

#### 6. Utils
- Funções utilitárias para formatação:
  - formatCurrency
  - formatDate
  - formatGrams
  - formatString
- Utilitários de QR Code:
  - qrCode
- Constantes:
  - constants

### Sistema de Temas
- Suporta múltiplos temas visuais (default, medieval, etc.)
- Internacionalização integrada com temas
- Imagens e textos personalizados por tema

### Autenticação
- Sistema de autenticação com proteção de rotas
- Componente RequireAuth para rotas protegidas
- Context API para estado de autenticação

### Rotas Principais
- `/login` - Página de login
- `/register` - Página de registro
- `/` ou `/home` - Página inicial (protegida)
- `/dashboard` - Dashboard com relatórios (protegida)
- `/new-resources` - Gerenciamento de recursos (protegida)
- `/new-challenge` - Criação de desafios (protegida)
- `/profile` - Perfil do usuário (protegida)
- `/scan` - Scanner de QR Code (protegida)
- `/expense/:id?` - Criação/edição de despesas (protegida)
- `/revenue/:id?` - Criação/edição de receitas (protegida)
- `*` - Página 404

## 🚀 Deploy
- **Plataforma**: Netlify
- **Configuração**: SPA redirect rules configurado no netlify.toml
- **Build Command**: `tsc -b && vite build`
- **Output Directory**: `dist/`

## 📦 Scripts Disponíveis
```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build de produção
npm run lint       # Executa linting
npm run preview    # Preview da build de produção
```

## 🎨 Características do Projeto
- **Gamificação**: Sistema de moedas e desafios
- **Multi-idioma**: Suporte a diferentes idiomas (atualmente PT)
- **Multi-tema**: Temas visuais personalizáveis (compráveis com moedas)
- **Gestão Financeira**: Controle de despesas e receitas
- **Relatórios Visuais**: Gráficos com Recharts
- **Scanner de Cupons**: Leitura de QR codes de cupons fiscais
- **Responsivo**: Design adaptável para diferentes dispositivos

## 🔐 Segurança
- Rotas protegidas com RequireAuth
- Token JWT para autenticação
- Validação de formulários com Yup

## 💡 Boas Práticas
- Strict TypeScript habilitado
- ESLint configurado com regras React
- Componentização e reutilização de código
- Separação de responsabilidades por camadas
- Context API para estado global
- Custom hooks para lógica reutilizável
- Services para abstração de API

