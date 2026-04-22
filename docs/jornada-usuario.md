# Jornadas e Perfis de Usuário - Urbanize

> Documentação completa dos fluxos, permissões e comportamentos dos diferentes perfis de usuário da plataforma.

## Visão Geral

O Urbanize implementa um sistema de diferenciação de perfis similar a aplicativos bancários, onde cada tipo de usuário tem sua própria navegação e permissões. São **2 perfis principais**: **Cidadão** e **Gestor Público**.

**Detecção automática de perfil por email:**
- `@cidadaourbanize.com` ou `cidadao@urbanize.com` → **Cidadão**
- `@gestorurbanize.com` ou `gestor@urbanize.com` → **Gestor**
- Qualquer outro email → **Cidadão** (padrão)

## Perfil 1: Cidadão (Usuário Comum)

### Identificação
- **Email:** `@cidadaourbanize.com` ou `cidadao@urbanize.com` (demo)
- **Redirecionamento após login:** `/dashboard`

### Navegação Disponível

| Rota | Página | Descrição |
|------|--------|-----------|
| `/dashboard` | Meu Dashboard | Visão geral das demandas e métricas pessoais |
| `/demandas` | Minhas Demandas | Lista apenas as demandas criadas por você |
| `/demandas/nova` | Nova Demanda | Criar nova solicitação para a prefeitura |
| `/demandas/:id` | Detalhes | Ver timeline e status da demanda |

### Permissões

✅ **Pode fazer:**
- Criar novas demandas urbanas
- Visualizar suas próprias demandas
- Acompanhar status das suas solicitações
- Ver timeline de atualizações
- Consultar suas métricas pessoais

❌ **Não pode fazer:**
- Alterar status de demandas
- Acessar painel do gestor
- Ver demandas de outros cidadãos
- Encaminhar demandas para órgãos
- Revisar triagem automática

### Fluxo Detalhado

1. **Primeiro Acesso**
   - Acessa [Home](/) e entende a proposta
   - Clica em "Criar conta" → [Cadastro](/cadastro)
   - Preenche: nome, email, telefone
   - Sistema detecta perfil pelo email
   - Redireciona automaticamente para `/dashboard`

2. **Login Recorrente**
   - Acessa [Login](/login)
   - Insere credenciais
   - Redireciona para `/dashboard`

3. **Criar Demanda**
   - No dashboard, clica "Nova demanda"
   - Vai para `/demandas/nova`
   - Preenche formulário:
     - Título da demanda
     - Descrição detalhada
     - Categoria (iluminação, vias, lixo, etc)
     - Prioridade (baixa, média, alta)
     - Localização (endereço, bairro, cidade)
     - Anexo de foto (opcional)
   - Clica em "Enviar demanda"
   - Recebe toast de sucesso
   - Redireciona para `/demandas/:id` (detalhes)

4. **Acompanhar Demanda**
   - Acessa "Minhas Demandas" → `/demandas`
   - Vê lista de cards com suas demandas
   - Pode filtrar por: status, categoria, busca
   - Clica em uma demanda → `/demandas/:id`
   - Visualiza:
     - Informações completas
     - Timeline de histórico
     - Status atual com badge colorido
     - Observações do gestor (se houver)

5. **Dashboard**
   - Consulta métricas resumidas:
     - Total de demandas criadas
     - Demandas em atendimento
     - Demandas resolvidas
     - Tempo médio de atendimento
   - Vê últimas 4 demandas criadas
   - Acesso rápido para criar nova demanda

### Indicadores Visuais

**Navbar:**
- Nome e perfil exibidos: "João Silva (Cidadão)"
- Menu: Meu Dashboard | Minhas Demandas | Nova Demanda
- Botão "Sair"

**Dashboard:**
- Foco em "minhas demandas"
- Botão destaque para "Nova demanda"
- Métricas pessoais (não da cidade toda)
- Cards das últimas demandas

## Perfil 2: Gestor Público

### Identificação
- **Email:** `@gestorurbanize.com` ou `gestor@urbanize.com` (demo)
- **Redirecionamento após login:** `/gestor`

### Navegação Disponível

| Rota | Página | Descrição |
|------|--------|-----------|
| `/gestor` | Painel do Gestor | Métricas gerais, fila de triagem inteligente |
| `/demandas` | Todas as Demandas | Lista TODAS as demandas da plataforma |
| `/demandas/:id` | Gerenciar | Ver detalhes e alterar status |

### Permissões

✅ **Pode fazer:**
- Visualizar todas as demandas da cidade
- Alterar status de qualquer demanda
- Adicionar observações nas demandas
- Encaminhar demandas para órgãos competentes
- Revisar triagem automática da IA (mock)
- Visualizar métricas gerais da cidade
- Filtrar demandas por múltiplos critérios

❌ **Não pode fazer:**
- Criar novas demandas (cidadãos criam, gestores gerenciam)
- Acessar dashboard do cidadão
- Deletar demandas

### Fluxo Detalhado

1. **Login**
   - Acessa [Login](/login)
   - Insere email `gestor@urbanize.com`
   - Sistema detecta perfil de gestor
   - Redireciona automaticamente para `/gestor`

2. **Painel do Gestor**
   - Visualiza badge "Modo gestor" (verde)
   - Vê métricas gerais:
     - Total de demandas
     - Em análise
     - Encaminhadas
     - Em atendimento
   - Acessa seção "Fila recente"
   - Pode filtrar por status
   - Acessa seção "Triagem Inteligente" (mock de IA)

3. **Triagem Automática**
   - Sistema mostra demandas em análise
   - Para cada demanda, vê:
     - Score de priorização (0-1)
     - Sugestão de órgão responsável (mock)
     - Confiança da IA
   - Pode:
     - Aceitar sugestão → Encaminha automaticamente
     - Ajustar encaminhamento → Escolhe órgão diferente
     - Revisar detalhes → Vai para `/demandas/:id`

4. **Gerenciar Demandas**
   - Acessa "Todas as Demandas" → `/demandas`
   - Vê TODAS as demandas da cidade (não só suas)
   - Aplica filtros:
     - Status (registrada, em análise, encaminhada, etc)
     - Categoria
     - Bairro
     - Busca por título
   - Clica em uma demanda → `/demandas/:id`
   - Visualiza informações completas
   - **Ações exclusivas do gestor:**
     - Alterar status via dropdown
     - Adicionar observação
     - Ver histórico completo
     - Salvar alterações
   - Recebe toast de sucesso
   - Demanda atualizada no histórico

5. **Fluxo de Atualização de Status**
   ```
   Registrada → Em análise → Encaminhada → Em atendimento → Resolvida
   ```
   - Cada mudança gera item no histórico
   - Observação do gestor é salva
   - Cidadão vê atualização em tempo real

### Indicadores Visuais

**Navbar:**
- Nome e perfil: "Maria Gestora (Gestor)"
- Menu: Painel do Gestor | Todas as Demandas
- Botão "Sair"

**Painel do Gestor:**
- Badge verde "Modo gestor" no topo
- Ícone de escudo (FiShield)
- Seção "Triagem Inteligente" com ícone de CPU
- Métricas da cidade toda (não pessoais)
- Fila com filtros avançados

**Detalhes da Demanda:**
- Dropdown de status (habilitado)
- Campo de observação do gestor
- Botão "Salvar alterações"

## Matriz de Proteção de Rotas

| Rota | Cidadão | Gestor | Sem Login | Comportamento |
|------|---------|--------|-----------|---------------|
| `/` (Home) | ✅ Acessa | ✅ Acessa | ✅ Acessa | Página pública |
| `/login` | ✅ Acessa | ✅ Acessa | ✅ Acessa | Página pública |
| `/cadastro` | ✅ Acessa | ✅ Acessa | ✅ Acessa | Página pública |
| `/dashboard` | ✅ Acessa | ❌ Redireciona | ❌ Redireciona | Redireciona gestor → `/gestor`, sem login → `/login` |
| `/demandas` | ✅ Suas demandas | ✅ Todas | ❌ Redireciona | Redireciona sem login → `/login` |
| `/demandas/nova` | ✅ Acessa | ❌ Redireciona | ❌ Redireciona | Redireciona gestor → `/gestor`, sem login → `/login` |
| `/demandas/:id` | ✅ Visualiza | ✅ Edita status | ❌ Redireciona | Cidadão só vê, gestor pode alterar |
| `/gestor` | ❌ Redireciona | ✅ Acessa | ❌ Redireciona | Redireciona cidadão → `/dashboard`, sem login → `/login` |

### Regras de Redirecionamento

**Usuário não autenticado:**
- Tenta acessar rota protegida → Redireciona para `/login`
- Após login bem-sucedido → Redireciona para rota principal do perfil

**Cidadão tenta acessar rota de gestor:**
- `/gestor` → Redireciona para `/dashboard`
- Toast informativo: "Área restrita a gestores"

**Gestor tenta acessar rota exclusiva de cidadão:**
- `/dashboard` → Redireciona para `/gestor`
- `/demandas/nova` → Redireciona para `/gestor`
- Toast informativo: "Gestores gerenciam demandas, não criam"

## Estados de Feedback

Todos os perfis têm estados visuais completos:

### Loading States
- **Skeleton loaders** em listas de demandas
- **Spinners** em métricas
- **Botões com loading** durante ações (criar, atualizar)
- Componente `<LoadingState />` personalizado

### Empty States
- **Lista vazia de demandas:** Mensagem + CTA "Criar primeira demanda"
- **Busca sem resultados:** "Nenhuma demanda encontrada. Tente outros filtros"
- **Métricas zeradas:** Ilustração + texto motivacional
- Componente `<EmptyState />` personalizado

### Error States
- **Erro ao carregar:** Mensagem + botão "Tentar novamente"
- **Erro ao criar/atualizar:** Toast de erro + mensagem específica
- **Erro de rede:** "Verifique sua conexão"
- Componente `<ErrorState />` personalizado

### Toasts (Notificações)
- **Sucesso:** Verde, ícone de check, 3 segundos
- **Erro:** Vermelho, ícone de alerta, 5 segundos
- **Info:** Azul, ícone de informação, 4 segundos
- Posição: topo-direita (mobile: topo-centro)

## Implementação Técnica

### Arquivos Principais

**1. Detecção de Perfil**
```typescript
// src/utils/roleDetection.ts
export function detectRoleFromEmail(email: string): DemandRole {
  const lowercaseEmail = email.toLowerCase().trim();
  
  if (lowercaseEmail.includes("@gestorurbanize.com") || 
      lowercaseEmail === "gestor@urbanize.com") {
    return "gestor";
  }
  
  return "cidadao"; // Padrão
}
```

**2. Proteção de Rotas**
```typescript
// src/components/auth/RoleProtectedRoute.tsx
export function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: Props) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const redirect = user.role === "gestor" ? "/gestor" : "/dashboard";
      router.push(redirect);
    }
  }, [user, allowedRoles, router]);

  // Renderiza só se autorizado
  if (!user || !allowedRoles.includes(user.role)) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
```

**3. Navegação Condicional**
```typescript
// src/components/layout/AppNavbar.tsx
const linksByCitizen = [
  { href: "/dashboard", label: "Meu Dashboard" },
  { href: "/demandas", label: "Minhas Demandas" },
  { href: "/demandas/nova", label: "Nova Demanda" },
];

const linksByManager = [
  { href: "/gestor", label: "Painel do Gestor" },
  { href: "/demandas", label: "Todas as Demandas" },
];

// Seleciona links baseado no perfil
const links = user?.role === "gestor" ? linksByManager : linksByCitizen;
```

**4. Uso nas Páginas**
```typescript
// src/app/dashboard/page.tsx (Cidadão)
export default function DashboardPage() {
  return (
    <RoleProtectedRoute allowedRoles={["cidadao"]}>
      <AppLayout>
        {/* Conteúdo do dashboard */}
      </AppLayout>
    </RoleProtectedRoute>
  );
}

// src/app/gestor/page.tsx (Gestor)
export default function GestorPage() {
  return (
    <RoleProtectedRoute allowedRoles={["gestor"]}>
      <AppLayout>
        {/* Conteúdo do painel */}
      </AppLayout>
    </RoleProtectedRoute>
  );
}
```

## Guia de Testes

### Teste 1: Fluxo Completo do Cidadão

```bash
# Passo 1: Cadastro
1. Acesse: http://127.0.0.1:4100/cadastro
2. Preencha:
   - Nome: João Silva
   - Email: joao@cidadaourbanize.com
   - Telefone: (81) 99999-9999
3. Clique "Criar conta"
4. ✅ Deve redirecionar para /dashboard

# Passo 2: Criar Demanda
5. Clique no botão "Nova demanda"
6. ✅ Vai para /demandas/nova
7. Preencha:
   - Título: Poste apagado na minha rua
   - Descrição: Poste número 123 está sem luz há 3 dias
   - Categoria: Iluminação pública
   - Prioridade: Média
   - Endereço: Rua das Flores, 100
   - Bairro: Centro
   - Cidade: Recife
8. Clique "Enviar demanda"
9. ✅ Toast de sucesso aparece
10. ✅ Redireciona para /demandas/:id

# Passo 3: Acompanhar
11. Veja timeline da demanda
12. Volte para "Minhas Demandas"
13. ✅ Sua demanda aparece na lista
14. ✅ Status: "Registrada"

# Passo 4: Proteção de Rotas
15. Tente acessar: http://127.0.0.1:4100/gestor
16. ✅ Redireciona para /dashboard
17. ✅ Toast: "Área restrita a gestores"
```

### Teste 2: Fluxo Completo do Gestor

```bash
# Passo 1: Login
1. Acesse: http://127.0.0.1:4100/login
2. Email: gestor@urbanize.com
3. Senha: demo
4. Clique "Entrar"
5. ✅ Redireciona para /gestor

# Passo 2: Revisar Painel
6. ✅ Badge "Modo gestor" visível
7. ✅ Vê métricas gerais da cidade
8. ✅ Seção "Triagem Inteligente" aparece
9. ✅ Fila de demandas com filtros

# Passo 3: Gerenciar Demanda
10. Clique em "Todas as Demandas"
11. ✅ Vê TODAS as demandas (não só suas)
12. Filtre por: Status = "Registrada"
13. Clique na demanda do João Silva
14. ✅ Vai para /demandas/:id

# Passo 4: Atualizar Status
15. Veja dropdown de status (habilitado)
16. Selecione: "Em análise"
17. Adicione observação: "Equipe verificará o local"
18. Clique "Salvar alterações"
19. ✅ Toast de sucesso
20. ✅ Timeline atualizada com novo item

# Passo 5: Proteção de Rotas
21. Tente acessar: http://127.0.0.1:4100/dashboard
22. ✅ Redireciona para /gestor
23. Tente acessar: http://127.0.0.1:4100/demandas/nova
24. ✅ Redireciona para /gestor
```

### Teste 3: Proteção de Rotas sem Login

```bash
1. Faça logout (ou abra janela anônima)
2. Tente acessar: http://127.0.0.1:4100/dashboard
3. ✅ Redireciona para /login
4. Tente acessar: http://127.0.0.1:4100/gestor
5. ✅ Redireciona para /login
6. Tente acessar: http://127.0.0.1:4100/demandas/nova
7. ✅ Redireciona para /login
8. Acesse: http://127.0.0.1:4100/
9. ✅ Home carrega normalmente (página pública)
```

## Regras de Negócio

### Criação de Demandas
- ✅ Apenas cidadãos podem criar
- ✅ Campos obrigatórios: título, descrição, categoria, localização
- ✅ Protocolo gerado automaticamente (URB-XXXXX)
- ✅ Status inicial sempre "registrada"
- ✅ Origem sempre "cidadao"
- ✅ Data de criação automática

### Alteração de Status
- ✅ Apenas gestores podem alterar
- ✅ Fluxo sugerido: Registrada → Em análise → Encaminhada → Em atendimento → Resolvida
- ✅ Pode pular etapas se necessário
- ✅ Pode voltar para status anterior
- ✅ Cada alteração gera item no histórico
- ✅ Observação do gestor é opcional mas recomendada

### Visualização de Demandas
- ✅ Cidadãos veem apenas as próprias
- ✅ Gestores veem todas da cidade
- ✅ Filtros aplicam para ambos os perfis
- ✅ Busca funciona em títulos e descrições

### Detecção de Perfil
- ✅ Automática pelo domínio do email
- ✅ Definida no momento do cadastro/login
- ✅ Não pode ser alterada pelo usuário
- ✅ Persiste no localStorage (via Zustand persist)