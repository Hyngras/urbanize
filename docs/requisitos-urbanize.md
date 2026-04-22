# Checklist de Requisitos - Avaliação 1

**Projeto:** Urbanize - Plataforma de Gestão de Demandas Urbanas  
**Equipe:** [Diego David, Hyngrid Souza e Pamela Rodrigues]

## 1. Stack Tecnológica Obrigatória

Requisitos do professor que precisávamos implementar:

| Tecnologia | Status | Versão | Onde está |
|------------|--------|---------|-----------|
| **TypeScript** | ✅ Feito | 5.7.3 | `tsconfig.json` |
| **Next.js** | ✅ Feito | 16.2.4 | Todo o projeto |
| **Chakra UI** | ✅ Feito | 2.10.9 | `/components/*` |
| **Tailwind CSS** | ✅ Feito | 4.2.2 | Integrado com Chakra |
| **Zustand** | ✅ Feito | 5.0.12 | `/store/*` |
| **API Fake** | ✅ Feito | MSW 2.13.1 | `/mocks/*` + `/services/api.ts` |

**Notas da equipe:**
- Configuramos TypeScript em modo strict desde o início
- Tivemos que atualizar o Next.js de 16.2.2 para 16.2.4 por causa de vulnerabilidades
- Chakra UI e Tailwind estão funcionando bem juntos, sem conflitos

## 2. Funcionalidades Mínimas (MVP)

10 funcionalidades obrigatórias do PDF do professor:

### Checklist de Implementação

- [x] **1. Cadastro de usuários** ✅
  - Página: `/cadastro`
  - API: `POST /api/auth/register`
  - Testado e funcionando

- [x] **2. Autenticação de usuários** ✅
  - Página: `/login`
  - API: `POST /api/auth/login`
  - Persistência no localStorage via Zustand

- [x] **3. Registro de demandas urbanas** ✅
  - Página: `/demandas/nova`
  - API: `POST /api/demands`
  - Formulário completo com todos os campos

- [x] **4. Definição de categoria da demanda** ✅
  - 7 categorias implementadas:
    - Iluminação pública
    - Vias públicas
    - Coleta de lixo
    - Saneamento
    - Fiscalização
    - Zeladoria urbana
    - Outros

- [x] **5. Descrição da solicitação** ✅
  - Campo textarea no formulário
  - Validação de campo obrigatório

- [x] **6. Registro de localização** ✅
  - Campos: endereço, bairro, cidade
  - Todos salvos corretamente

- [x] **7. Acompanhamento do status da demanda** ✅
  - Página de detalhes `/demandas/[id]`
  - Timeline com histórico completo
  - Badge de status colorido

- [x] **8. Painel administrativo para gestores** ✅
  - Página: `/gestor`
  - Métricas específicas
  - Fila de triagem
  - Filtros avançados

- [x] **9. Filtros por tipo, região e status** ✅
  - Componente `DemandFilters`
  - Filtros: status, categoria, bairro, busca
  - Funcionando em tempo real

- [x] **10. Visualização de métricas básicas** ✅
  - API: `GET /api/metrics/summary`
  - Mostra:
    - Total de demandas
    - Por status
    - Por categoria
    - Tempo médio de atendimento

## 3. Páginas Obrigatórias

### Páginas Principais

- [x] **Página inicial/dashboard** ✅
  - `/` - Home pública
  - `/dashboard` - Dashboard do cidadão
  - Mostra métricas e últimas demandas

- [x] **Listagem de demandas** ✅
  - `/demandas`
  - Cards com informações resumidas
  - Funciona para cidadão e gestor (visões diferentes)

- [x] **Formulário de criação de demanda** ✅
  - `/demandas/nova`
  - 12+ campos implementados
  - Validação básica funcionando

- [x] **Visualização de detalhes da demanda** ✅
  - `/demandas/[id]`
  - Timeline de histórico
  - Informações completas
  - Gestores podem alterar status

- [x] **Painel administrativo para gestores** ✅
  - `/gestor`
  - Métricas gerais
  - Fila de triagem inteligente (mock de IA)
  - Filtros específicos

- [x] **Sistemas de Filtros** ✅
  - Implementado em `/demandas`
  - Filtros: status, categoria, bairro, busca por título

- [x] **Navegação entre páginas** ✅
  - Next.js Router funcionando
  - Navbar responsiva
  - Links funcionais

- [x] **Integração com API fake** ✅
  - 7 endpoints implementados e funcionando
  - Dados persistem no localStorage

### Páginas "Menos Prioritárias" (também fizemos)

- [x] **Tela de cadastro** ✅
  - `/cadastro`
  - Totalmente funcional

- [x] **Tela de login** ✅
  - `/login`
  - Redirecionamento por perfil

## 4. Requisitos Técnicos

Checklist dos aspectos técnicos que serão avaliados:

### 4.1 Estrutura e Organização do Projeto

- [x] ✅ Organização clara de pastas
  - `src/app/` - Páginas
  - `src/components/` - Componentes (separados por domínio)
  - `src/services/` - Camada de API
  - `src/store/` - Zustand stores
  - `src/types/` - TypeScript interfaces
  - `src/utils/` - Funções auxiliares

- [x] ✅ Separação entre componentes, páginas, serviços e stores
  - Cada coisa no seu lugar
  - Fácil de encontrar qualquer arquivo

- [x] ✅ Legibilidade do código
  - Nomes descritivos
  - Código comentado onde necessário

- [x] ✅ Padronização de nomenclatura
  - camelCase para funções/variáveis
  - PascalCase para componentes
  - Consistente em todo projeto

### 4.2 Uso de TypeScript

- [x] ✅ Tipagem adequada de dados
  - Todos os componentes tipados
  - Props sempre com interface

- [x] ✅ Definição de interfaces e tipos
  - 16 interfaces criadas em `/src/types/`
  - Types: `DemandStatus`, `DemandCategory`, `DemandPriority`, etc
  - Interfaces: `Demand`, `User`, `FilterState`, `MetricsSummary`, etc

- [x] ✅ Consistência na modelagem de estruturas
  - Padrões claros para cada tipo de entidade

- [x] ✅ Redução do uso de `any`
  - Quase zero uso de `any`
  - Usamos `unknown` quando necessário

### 4.3 Uso do Next.js

- [x] ✅ Organização adequada das rotas
  - App Router (estrutura moderna)
  - Rotas aninhadas organizadas

- [x] ✅ Estruturação das páginas
  - Cada página em sua pasta
  - Layouts compartilhados

- [x] ✅ Separação de responsabilidades
  - Server Components vs Client Components
  - "use client" só onde necessário

- [x] ✅ Organização geral do projeto
  - Seguindo convenções do Next.js 14+

### 4.4 Componentização

- [x] ✅ Componentes reutilizáveis
  - 30+ componentes criados
  - Exemplos: `StatusBadge`, `DemandCard`, `MetricsCard`

- [x] ✅ Separação entre layout e lógica
  - Componentes de apresentação vs containers
  - Lógica nos hooks/stores

- [x] ✅ Reaproveitamento de código
  - Badges reutilizados em várias páginas
  - Cards padronizados
  - Layouts compartilhados

### 4.5 Interface e Experiência do Usuário

- [x] ✅ Clareza visual
  - Design limpo
  - Cores consistentes

- [x] ✅ Consistência entre telas
  - Mesma navbar em todas as páginas
  - Padrões visuais mantidos

- [x] ✅ Hierarquia de informação
  - Títulos claros
  - Informações importantes em destaque

- [x] ✅ Feedback visual de ações
  - Loading states implementados
  - Toasts de sucesso/erro
  - Hover effects nos botões

- [x] ✅ Tratamento de estados de carregamento
  - `LoadingState` component
  - `ErrorState` component
  - `EmptyState` component
  - Spinners nos botões durante ações

### 4.6 Uso de Chakra UI e Tailwind

- [x] ✅ Padronização visual
  - Tema customizado em `/src/theme/`
  - Cores padronizadas

- [x] ✅ Organização dos estilos
  - Chakra para componentes estruturais
  - Tailwind para utilitários

- [x] ✅ Uso coerente das bibliotecas
  - Sem conflitos entre elas
  - Integradas via PostCSS

### 4.7 Gerenciamento de Estado com Zustand

- [x] ✅ Modelagem adequada das stores
  - 3 stores criadas: `authStore`, `demandStore`, `uiStore`

- [x] ✅ Uso correto de estado global
  - Auth → global (precisa em todo app)
  - Demands → global (compartilhado entre páginas)
  - UI → global (sidebar state)

- [x] ✅ Organização do fluxo de dados
  - Stores → Services → API
  - Fluxo claro e previsível

**Stores implementadas:**
- `authStore`: login, register, logout, user, token
- `demandStore`: demands, filters, create, update, fetch
- `uiStore`: sidebar, modals

### 4.8 Integração com API Fake

- [x] ✅ Consumo correto de endpoints
  - Services fazem chamadas para API
  - Dados mockados respondem corretamente

- [x] ✅ Tratamento de loading
  - Estado de loading em todas as stores
  - Spinners enquanto carrega

- [x] ✅ Tratamento de erro
  - Try/catch em todas as chamadas
  - Toasts de erro para o usuário

- [x] ✅ Coerência no mapeamento de dados
  - Tipos TypeScript batem com respostas da API
  - Transformações quando necessário

**Endpoints implementados:**
1. `POST /api/auth/register` - Criar conta
2. `POST /api/auth/login` - Login
3. `GET /api/auth/me` - Usuário logado
4. `GET /api/demands` - Listar demandas (com filtros)
5. `POST /api/demands` - Criar demanda
6. `GET /api/demands/[id]` - Detalhes da demanda
7. `PATCH /api/demands/[id]/status` - Atualizar status
8. `GET /api/metrics/summary` - Métricas

### 4.9 Formulários

- [x] ✅ Validações básicas
  - Campos obrigatórios marcados
  - Validação no submit

- [x] ✅ Campos coerentes com o domínio
  - Formulário de demanda tem todos os campos necessários
  - Formulário de login/cadastro simples

- [x] ✅ Tratamento adequado de erros
  - Mensagens de erro claras
  - Toasts quando algo dá errado

**Formulários criados:**
- Login: email, senha
- Cadastro: nome, email, telefone
- Nova demanda: título, descrição, categoria, prioridade, endereço, etc

### 4.10 Responsividade

- [x] ✅ Adaptação para desktop e mobile
  - Breakpoints Chakra: `base`, `md`, `lg`
  - Testado em várias resoluções

- [x] ✅ Manutenção da usabilidade
  - Botões grandes em mobile
  - Menu hamburger funcionando

- [x] ✅ Ausência de quebras graves de layout
  - Tudo funciona em mobile e desktop
  - Sem scroll horizontal

## 5. Extras que Implementamos

- [x] **Sistema de perfis diferenciados**
  - Cidadão e gestor têm navegações diferentes
  - Igual app de banco (cada perfil vê coisas diferentes)
  - Detecção automática por email (@cidadaourbanize.com vs @gestorurbanize.com)

- [x] **Proteção de rotas por perfil**
  - Component `RoleProtectedRoute`
  - Gestor não acessa telas de cidadão e vice-versa
  - Redirecionamento automático

- [x] **Timeline de histórico**
  - Cada demanda tem histórico completo
  - Mostra quem fez o quê e quando

- [x] **Persistência de autenticação**
  - Usuário continua logado mesmo após fechar o navegador
  - Zustand persist middleware

- [x] **3 documentos em /docs/**
  - `jornada-usuario.md` - Fluxos de cada perfil
  - `requisitos.md` - Requisitos da Avaliação 1
  - `perfis-usuarios.md` - Guia completo de perfis
  - Este checklist (`conformidade-requisitos.md`)