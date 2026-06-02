# 🎮 Super Family Quest

<div align="center">

**Uma aplicação gamificada de gestão financeira familiar**

![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff?logo=vite)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.4.9-319795?logo=chakraui)

</div>

---

## 📋 Sobre o Projeto

Super Family Quest é uma aplicação web frontend focada em mobile que transforma a gestão financeira familiar em uma experiência gamificada. Combine controle de despesas e receitas com elementos de RPG, ganhe moedas por suas conquistas financeiras e desbloqueie temas visuais personalizados!

### ✨ Características Principais

- 🎯 **Gamificação**: Sistema de moedas e desafios para incentivar boas práticas financeiras
- 💰 **Gestão Financeira**: Controle completo de despesas e receitas
- 📊 **Relatórios Visuais**: Gráficos interativos e dashboards informativos
- 🎨 **Multi-tema**: Temas visuais personalizáveis (default, medieval, etc.)
- 🌍 **Multi-idioma**: Suporte a internacionalização (atualmente PT-BR)
- 📱 **Responsivo**: Interface otimizada para dispositivos móveis
- 🧾 **Scanner de Cupons**: Leitura de QR codes de cupons fiscais
- 🔐 **Segurança**: Autenticação JWT com rotas protegidas

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd super-family-quest
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

### Scripts Disponíveis

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm run lint       # Executa linting do código
npm run preview    # Preview da build de produção
```

---

## 🛠️ Tecnologias Utilizadas

### Core

- **[React](https://react.dev/)** (^19.1.0) - Biblioteca para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** (~5.8.3) - Superset JavaScript com tipagem estática
- **[Vite](https://vitejs.dev/)** (^6.3.5) - Build tool e dev server ultra-rápido
- **[React Router DOM](https://reactrouter.com/)** (^6.20.1) - Roteamento e navegação

### UI e Estilização

- **[Chakra UI](https://chakra-ui.com/)** (^2.4.9) - Biblioteca de componentes acessíveis
- **[Emotion](https://emotion.sh/)** (^11.10.5) - CSS-in-JS
- **[Framer Motion](https://www.framer.com/motion/)** (^6.5.1) - Animações
- **[React Icons](https://react-icons.github.io/react-icons/)** (^5.5.0) - Ícones

### Formulários e Validação

- **[React Hook Form](https://react-hook-form.com/)** (^7.56.4) - Gerenciamento de formulários
- **[Yup](https://github.com/jquense/yup)** (^1.6.1) - Validação de schemas

### Gráficos e Visualização

- **[Recharts](https://recharts.org/)** (^3.0.2) - Biblioteca de gráficos para React

### Internacionalização

- **[i18next](https://www.i18next.com/)** (^25.3.2) - Framework de internacionalização
- **[react-i18next](https://react.i18next.com/)** (^15.6.1) - Binding React para i18next

### Utilitários

- **[Axios](https://axios-http.com/)** (^1.9.0) - Cliente HTTP
- **[@zxing/browser](https://github.com/zxing-js/browser)** (^0.1.5) - Leitor de QR Code

### Qualidade de Código

- **[ESLint](https://eslint.org/)** (^9.25.0) - Linter JavaScript/TypeScript
- **[TypeScript ESLint](https://typescript-eslint.io/)** (^8.30.1) - Regras ESLint para TypeScript

---

## 📁 Estrutura do Projeto

```
super-family-quest/
├── public/                 # Arquivos públicos estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── modals/        # Modais da aplicação
│   │   │   ├── BuyThemeModal.tsx
│   │   │   ├── CompleteProfileModal.tsx
│   │   │   ├── NewRecurringExpenseModal.tsx
│   │   │   ├── NewRecurringIncomeModal.tsx
│   │   │   └── SimpleResourceModal.tsx
│   │   ├── reports/       # Componentes de gráficos e relatórios
│   │   │   ├── BarChartExpensesByStore.tsx
│   │   │   ├── BarChartExpensesIncome.tsx
│   │   │   ├── DateRangeFilter.tsx
│   │   │   ├── HorizontalBarChartTopProducts.tsx
│   │   │   ├── LineChartExpensesByDate.tsx
│   │   │   └── PieChartExpensesByGroup.tsx
│   │   ├── resources/     # Componentes de recursos
│   │   │   ├── ExpenseResource.tsx
│   │   │   ├── GroupResource.tsx
│   │   │   ├── PaymentResource.tsx
│   │   │   ├── ResourceContainer.tsx
│   │   │   ├── RevenueResource.tsx
│   │   │   └── StoreResource.tsx
│   │   ├── skeletons/     # Loading states
│   │   │   └── Avenue.skeleton.tsx
│   │   ├── AutocompleteInput.tsx
│   │   ├── AvenueForm.tsx
│   │   ├── CoinDisplay.tsx
│   │   ├── ExpensesForm.tsx
│   │   ├── Header.tsx
│   │   ├── LastRegistrationsList.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── LoginThemeProvider.tsx
│   │   ├── NavigationBar.tsx
│   │   ├── QRScannerPage.tsx
│   │   ├── RequireAuth.tsx
│   │   └── SummaryCard.tsx
│   │
│   ├── contexts/          # Context API providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useExpenseForm.ts
│   │   ├── useExpenseFormAutofill.ts
│   │   ├── useExpenseFormSubmit.ts
│   │   ├── useExpensesMutations.ts
│   │   ├── useGetAutoFillExpenses.ts
│   │   ├── useGetLastRegistration.ts
│   │   ├── useLoginTheme.ts
│   │   ├── useRevenueMutations.ts
│   │   ├── useThemeContext.ts
│   │   ├── useThemedTranslation.ts
│   │   ├── useThemeTranslation.ts
│   │   └── useVisualTheme.ts
│   │
│   ├── i18n/              # Internacionalização
│   │   ├── config.ts
│   │   ├── locales/
│   │   │   ├── default/
│   │   │   │   └── pt.json
│   │   │   └── rpg/
│   │   │       └── pt.json
│   │   └── types.ts
│   │
│   ├── pages/             # Páginas da aplicação
│   │   ├── Dashboard/     # Dashboard com relatórios
│   │   ├── Expenses/      # Gerenciamento de despesas
│   │   ├── Home/          # Página inicial
│   │   ├── Login/         # Autenticação
│   │   ├── NewChallenge/  # Criação de desafios
│   │   ├── NewResources/  # Gerenciamento de recursos
│   │   ├── NotFoundPage/  # Página 404
│   │   ├── Profile/       # Perfil do usuário
│   │   ├── Register/      # Cadastro
│   │   └── Revenue/       # Gerenciamento de receitas
│   │
│   ├── services/          # Camada de comunicação com API
│   │   ├── api.ts         # Configuração base do Axios
│   │   ├── auth.ts        # Autenticação
│   │   ├── coin.ts        # Sistema de moedas
│   │   ├── couponReader.ts # Leitura de cupons
│   │   ├── expense.ts     # Despesas
│   │   ├── index.ts       # Exportações
│   │   ├── profile.ts     # Perfil do usuário
│   │   ├── reports.ts     # Relatórios
│   │   ├── resources.ts   # Recursos
│   │   ├── revenue.ts     # Receitas
│   │   ├── theme.ts       # Temas
│   │   └── user.ts        # Usuários
│   │
│   ├── styles/            # Estilos globais
│   │
│   ├── theme/             # Configuração de temas
│   │   ├── theme.ts
│   │   ├── themes.ts
│   │   └── types.ts
│   │
│   ├── types/             # Tipos TypeScript
│   │   └── revenue.ts
│   │
│   ├── utils/             # Funções utilitárias
│   │   ├── constants.ts
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   ├── formatGrams.ts
│   │   ├── formatString.ts
│   │   └── qrCode.ts
│   │
│   ├── App.tsx            # Componente raiz
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts      # Tipos Vite
│
├── .cursorrules           # Regras do projeto para Cursor AI
├── .gitignore
├── eslint.config.js       # Configuração ESLint
├── index.html             # HTML principal
├── netlify.toml           # Configuração Netlify
├── package.json
├── tsconfig.json          # Configuração TypeScript
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts         # Configuração Vite
```

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura baseada em camadas e componentes:

### 1. **Pages (Views)**
Componentes de página que representam rotas da aplicação. Fazem a composição de componentes menores e gerenciam a lógica específica da página.

### 2. **Components**
Componentes reutilizáveis organizados por funcionalidade:
- **modals/**: Modais específicos da aplicação
- **reports/**: Componentes de visualização de dados
- **resources/**: Componentes de gerenciamento de recursos
- **skeletons/**: Estados de carregamento

### 3. **Contexts**
Gerenciamento de estado global usando Context API:
- **AuthContext**: Estado de autenticação e usuário
- **ThemeContext**: Tema visual ativo

### 4. **Services**
Camada de abstração para comunicação com APIs. Cada serviço é responsável por um domínio específico do negócio.

### 5. **Hooks**
Custom hooks para reutilização de lógica:
- Hooks de tema e tradução
- Hooks de formulários
- Hooks de mutações e queries

### 6. **Utils**
Funções utilitárias para formatação, constantes e helpers diversos.

---

## 🔐 Rotas da Aplicação

### Rotas Públicas
- `/login` - Página de login
- `/register` - Página de cadastro

### Rotas Protegidas
- `/` ou `/home` - Página inicial
- `/dashboard` - Dashboard com relatórios e gráficos
- `/new-resources` - Gerenciamento de recursos financeiros
- `/new-challenge` - Criação de desafios
- `/profile` - Perfil e configurações do usuário
- `/scan` - Scanner de QR Code para cupons fiscais
- `/expense/:id?` - Criação/edição de despesas
- `/revenue/:id?` - Criação/edição de receitas

### Outras
- `*` - Página 404 (Not Found)

---

## 🎨 Sistema de Temas

O projeto suporta múltiplos temas visuais que podem ser desbloqueados através do sistema de moedas:

- **Default**: Tema padrão moderno
- **Medieval/RPG**: Tema com estética medieval gamificada

Cada tema possui:
- Paleta de cores personalizada
- Textos e traduções específicas
- Imagens e ícones temáticos

---

## 🌍 Internacionalização (i18n)

O sistema de i18n está integrado com o sistema de temas, permitindo diferentes textos para diferentes contextos visuais:

```
i18n/locales/
├── default/      # Traduções tema padrão
│   └── pt.json
└── rpg/          # Traduções tema medieval
    └── pt.json
```

---

## 🚢 Deploy

O projeto está configurado para deploy no **Netlify**:

- **Build Command**: `tsc -b && vite build`
- **Output Directory**: `dist/`
- **Redirects**: Configurado para SPA no `netlify.toml`

---

## 💡 Boas Práticas

- ✅ TypeScript strict mode habilitado
- ✅ ESLint configurado com regras React
- ✅ Componentização e reutilização de código
- ✅ Separação de responsabilidades por camadas
- ✅ Context API para estado global
- ✅ Custom hooks para lógica reutilizável
- ✅ Services para abstração de API
- ✅ Validação de formulários com Yup
- ✅ Código limpo e bem documentado

---

## 📄 Licença

[Adicione aqui a licença do projeto]

---

## 👥 Contribuindo

[Adicione aqui instruções de como contribuir com o projeto]

---

<div align="center">

**Desenvolvido com ❤️ e ⚡ Vite**

</div>
