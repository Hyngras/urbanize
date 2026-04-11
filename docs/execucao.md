# Execução e Desenvolvimento

## Pré-requisitos
- Node.js 20 (usamos /opt/homebrew/opt/node@20/bin)
- npm

## Instalação
```bash
cd /Users/hyngridsouza/DevLocal/CESAR/urbanize/frontend
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm install
```

## Rodar em desenvolvimento
```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run dev -- --hostname 127.0.0.1 --port 4100
```
Acesse: http://127.0.0.1:4100

Se a porta estiver ocupada:
```bash
lsof -ti tcp:4100 | xargs kill
# ou escolha outra porta: --port 4101
```

## Scripts úteis
- `npm run dev` – servidor Next.js (Turbopack)
- `npm run build` – build de produção
- `npm run start` – servir build (após `npm run build`)
- `npm run lint` – lint do projeto

## Variáveis de ambiente
- `NEXT_PUBLIC_MOCKS=true` (opcional) para iniciar MSW caso queira mockar via worker; por padrão usamos rotas fake internas/serviços em memória.

## Estrutura de pastas (resumo)
- `src/app` – páginas (App Router)
- `src/components` – componentes de UI/layout/forms/demandas
- `src/services` – serviços e API fake
- `src/store` – Zustand stores
- `src/types` – modelos TS
- `src/utils` – utilitários (labels, datas, uuid)
- `docs` – documentação (jornada, requisitos, execução)
