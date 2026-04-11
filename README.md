# Urbanize — Plataforma de Gestão de Demandas Urbanas

Frontend (Avaliação 1) em Next.js + TypeScript + Chakra UI + Tailwind + Zustand. API fake em memória preparada para troca futura por backend.

## Como rodar
1. Instalar dependências
```bash
cd /Users/hyngridsouza/DevLocal/CESAR/urbanize/frontend
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm install
```
2. Subir dev server
```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run dev -- --hostname 127.0.0.1 --port 4100
```
Acesse http://127.0.0.1:4100

Se a porta estiver ocupada:
```bash
lsof -ti tcp:4100 | xargs kill
# ou escolha outra porta: --port 4101
```

Scripts:
- `npm run dev` — desenvolvimento
- `npm run build` — build produção
- `npm run start` — serve build
- `npm run lint` — lint

## Documentação
- [Jornadas de usuário](docs/jornada-usuario.md)
- [Requisitos (Avaliação 1)](docs/requisitos.md)
- [Execução/rodar o projeto](docs/execucao.md)

## Rotas
- [Home](/)
- [Login](/login)
- [Cadastro](/cadastro)
- [Dashboard do cidadão](/dashboard)
- [Painel do gestor](/gestor)
- [Listagem de demandas](/demandas)
- [Nova demanda](/demandas/nova)
- [Detalhe da demanda](/demandas/[id])

Consulte as jornadas detalhadas em [docs/jornada-usuario.md](docs/jornada-usuario.md).

## Estrutura principal
```
src/
  app/            # páginas (home, login, cadastro, dashboard, gestor, demandas)
  components/     # ui, layout, forms, demandas, feedback, dashboard
  services/       # api fake, mockData, demand/auth/metrics services
  store/          # Zustand stores (auth, demand, ui)
  types/          # modelos TS
  utils/          # formatadores, labels, uuid seguro, delay mock
  styles/         # globais
```

## Notas de produto
- Triagem automática e sugestões de órgão são mockadas no front, prontas para integrar IA/backend.
- Estados de loading/erro/vazio cobertos em listas, métricas e detalhes.
- Responsivo para mobile/tablet/desktop.
- Auth mock: use `cidadao@urbanize.com` ou `gestor@urbanize.com` para demo.
