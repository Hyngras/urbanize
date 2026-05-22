# Avaliação 2 — Backend real

## Stack implementada

- Node.js + Express para API REST (`src/server`)
- Prisma ORM + SQLite para persistência local (`prisma/schema.prisma`)
- JWT com cookie HTTP-only e header `Authorization`
- Perfis `cidadao` e `gestor` com autorização por rota
- Redis opcional para cache de métricas
- Cron job opcional para snapshots periódicos de indicadores

## Arquitetura

```text
src/server/
├── app.ts                 # middlewares e rotas Express
├── index.ts               # bootstrap do servidor
├── config/                # env, prisma, redis
├── controllers/           # entrada HTTP e validação
├── services/              # regras de negócio
├── repositories/          # acesso ao Prisma
├── routes/                # definição dos endpoints
├── middlewares/           # auth e tratamento de erro
├── jobs/                  # cron de métricas
└── utils/                 # mappers e erros
```

## Endpoints principais

### Autenticação

- `POST /api/auth/register` — cadastra usuário
- `POST /api/auth/login` — autentica e grava cookie de sessão
- `GET /api/auth/me` — retorna usuário autenticado
- `POST /api/auth/logout` — encerra sessão

### Demandas

- `GET /api/demands` — lista demandas com filtros
- `POST /api/demands` — cria demanda do cidadão
- `GET /api/demands/:id` — detalhe da demanda
- `PATCH /api/demands/:id/status` — alteração de status apenas por gestor

### Métricas

- `GET /api/metrics/summary` — consolida indicadores por status e categoria

## Regras de negócio

- Cidadão acessa apenas suas próprias demandas.
- Gestor acessa todas as demandas e pode alterar status.
- Toda criação de demanda gera protocolo, histórico inicial e triagem automática simples.
- Alteração de status registra histórico com autor e observação.
- Métricas de cidadão são escopadas ao próprio usuário; métricas de gestor são globais.

## Redis

O Redis é opcional e está justificado para cache do endpoint de métricas (`metrics:summary:*`), pois é uma consulta frequente em dashboards e painéis de gestão. Se `REDIS_URL` não for configurado, a aplicação segue funcionando sem cache.

## Cron jobs

O cron `METRICS_CRON` executa periodicamente a consolidação de métricas em `MetricsSnapshot`, permitindo histórico de indicadores para relatórios futuros. Por padrão roda a cada 15 minutos.

## Execução local

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev:backend
npm run dev:frontend
```

Credenciais seed:

- Cidadão: `cidadao@urbanize.com` / `demo`
- Gestor: `gestor@urbanize.com` / `demo`
