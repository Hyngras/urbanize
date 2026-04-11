# Requisitos (Avaliação 1 - Frontend)

- Next.js App Router + TypeScript
- Chakra UI como base de UI, Tailwind para ajustes pontuais
- Estado global: Zustand (auth, demandas, UI)
- Integração com API fake/mock
- Funcionalidades mínimas:
  - Home (proposta + CTA)
  - Listagem de demandas com filtros
  - Criação de demanda
  - Detalhe da demanda (timeline, triagem mock)
  - Dashboard cidadão
  - Painel gestor (métricas, fila, filtros)
  - Login/Cadastro (mock)
- Estados: loading, erro, vazio em páginas de dados
- Responsividade (mobile, tablet, desktop)
- Acessibilidade básica (labels, contraste, foco)

## Dados / Modelos
- Demand: status, categoria, prioridade, localização, solicitante, histórico, triagem mock.
- Metrics: total, porStatus, porCategoria, tempo médio.

## Tech/Dependências-chave
- next 16, react 18, chakra-ui 2, zustand 5, axios, date-fns, framer-motion 11.
