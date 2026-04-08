# Urbanize — Plataforma de Gestão de Demandas Urbanas [![CI](https://github.com/Hyngras/urbanize/actions/workflows/ci.yml/badge.svg)](https://github.com/Hyngras/urbanize/actions/workflows/ci.yml)

Frontend Next.js (App Router) para o MVP da disciplina. Inclui Chakra UI + Tailwind, Zustand para estado global e uma API fake via rotas do Next.

## Rodar local
```bash
cd frontend
npm install
npm run dev
```
Acesse http://localhost:3000.

### Rotas principais
- `/` landing
- `/login` e `/cadastro` (fluxo fake, persiste token no Zustand)
- `/dashboard` métricas básicas
- `/demandas` listagem com filtros
- `/demandas/nova` criação
- `/demandas/[id]` detalhe + avanço de status

## API Fake (Next Route Handlers)
- `GET /api/demands` com filtros `status`, `category`, `region`, `search`
- `POST /api/demands`
- `GET /api/demands/:id`
- `PATCH /api/demands/:id/status`
- `GET /api/metrics/summary`
- Auth fake: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`

## Dependências chave
- Next.js, TypeScript, Tailwind
- Chakra UI (tema em `src/theme`)
- Zustand (stores em `src/store`)
- Axios (`src/services/api.ts`)

## Estrutura
```
src/
  app/ (páginas e APIs)
  components/ (layout, forms, ui, demandas)
  services/ (axios + services)
  store/ (authStore, demandStore)
  types/ (Demand, User, Auth)
  utils/ (formatDate, statusLabel)
```

## Dados de demonstração
A API fake retorna alguns registros iniciais em `src/app/api/demands/data.ts`. Status e métricas são calculados em memória.

## Próximos passos sugeridos
- Adicionar proteção de rota com middleware de auth
- Conectar a um backend real (Prisma/Express) para Avaliação 2
- Cobrir formulários com validação (Zod/React Hook Form)
- Adicionar testes e2e (Playwright) e unitários
