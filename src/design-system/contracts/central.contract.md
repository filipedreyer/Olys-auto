# Central Contract

## Papel

A Central é uma superfície de confiança, controle pessoal, privacidade e suporte. Ela existe dentro do ambiente logado, mas não é território operacional principal, não é Admin, não é help center genérico e não aparece na BottomNav.

## Escopo Obrigatório

- CTR00 Central Home: entrada para dados, privacidade, preferências, IA, conta, suporte, recados e guia.
- CTR01 Guia: explica o modelo operacional do Olys sem tutorial longo ou marketing.
- CTR02 Recados: espaço de comunicação do produto sem backend ou governança Admin nesta fase.
- CTR03 Dados e Privacidade: declara categorias de dados, limites reais, offline, anexos futuros, exportação e exclusão governadas.
- CTR04 Preferências: mostra preferências reais ou preparatórias de forma honesta, sem cosmética vazia.
- CTR05 IA e Transparência: explica contexto, outputs tipados, Safety Gate, confirmação, logs minimizados e ausência de ação autônoma.
- CTR06 Suporte: orienta suporte sem ticket, chat ou FAQ extensa sem backend.
- CTR07 Conta: mostra estado mínimo de acesso e ações seguras, sem expor Admin.

## Fluxos Governados

- Exportação precisa de preflight, escopo declarado e backend seguro antes de gerar arquivo real.
- Exclusão precisa de consequência clara, confirmação forte e backend seguro antes de apagar dados.
- Sem backend seguro, exportação e exclusão devem aparecer como contratos preparatórios honestos.
- Nenhum fluxo sensível pode apagar, exportar ou persistir dados por simulação.

## Proibido

- Misturar Central com Admin ou expor controles administrativos.
- Adicionar Central à BottomNav.
- Prometer exportação, exclusão, sincronização, logs ou privacidade que o backend ainda não garante.
- Criar storage, analytics, tracking, API externa ou logs com texto livre sensível.
- Transformar suporte em chat real, help center genérico ou marketing.
- Alterar domínio, projections, repositories ou command handlers.

## Critérios De Aceite

- A pessoa entende o que o app manipula, o que não manipula e quais limites ainda existem.
- IA e transparência declaram outputs, confirmação, Safety Gate e ausência de ação persistente automática.
- Exportação e exclusão são legíveis como fluxos governados futuros, sem execução real.
- Conta não apaga dados e não expõe Admin.
- Central fica acessível por rota privada e não entra na navegação principal.

## Riscos De Regressão

- Help center genérico.
- Configurações cosméticas sem efeito.
- Admin disfarçado.
- Promessa falsa de controle de dados.
- Exportação ou exclusão sem backend governado.
