# Today Contract

## Papel
Organizar o Fazer como superficie de execucao diaria.

## Obrigatorio
- Hoje organiza Para fazer agora, Cabe hoje, Atencao e Concluidos.
- Para fazer agora domina visualmente.
- Cabe hoje e Atencao sao camadas secundarias.
- Abrir o Dia e Fechar o Dia sao portas de ciclo, nao botoes genericos.
- Capacidade e Direcao sao diagnosticos, nao decoracao.

## Proibido
- Sections equivalentes empilhadas.
- Hierarquia plana.
- Fazer como grid de cards.
- UI filtrando dominio por conta propria.

## Dependencias De Dominio
- TodayProjection controla now, later, attention, blocked, paused, completed e readings.
- Capacidade nao inventa duracao.
- Dependencia nao e vinculo.

## Criterios De Aceite
- OperationalRow/OperationalItem domina Fazer.
- Leituras vem de projection.
- Ciclo do dia preserva rastreabilidade.

## Riscos De Regressao
- Dashboard de produtividade.
- Agenda simples.
- Superficies repetitivas sem hierarquia.
