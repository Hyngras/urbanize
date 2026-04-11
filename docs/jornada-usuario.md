# Jornada do Usuário (Urbanize)

## Cidadão (rotas)
1. Acessa [Home](/) e entende a proposta.
2. Faz [Cadastro](/cadastro) ou [Login](/login).
3. Registra demanda em [Nova demanda](/demandas/nova).
4. Acompanha status em [Listagem de demandas](/demandas) e vê detalhes em [Detalhe da demanda](/demandas/[id]).
5. Consulta visão resumida em [Dashboard do cidadão](/dashboard).

## Gestor (rotas)
1. Faz [Login](/login) com perfil de gestor.
2. Consulta métricas e fila em [Painel do gestor](/gestor).
3. Filtra e entra em [Listagem de demandas](/demandas) ou vai direto para [Detalhe da demanda](/demandas/[id]) para atualizar status/observação.
4. (Mock) Revisa triagem automática e aceita/ajusta encaminhamento na seção de triagem do painel do gestor.

## Fluxos de erro/estado
- Loading: skeleton/spinners em listas e métricas.
- Empty: mensagens com CTA para criar demanda.
- Erro: alertas amigáveis com possibilidade de tentar novamente.
