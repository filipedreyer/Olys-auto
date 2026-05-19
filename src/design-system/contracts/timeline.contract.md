# Timeline Contract

## Papel
Definir Timeline como superficie temporal operacional.

## Obrigatorio
- Timeline e superficie temporal unica.
- Calendario, Capacidade e Dependencias sao lentes.
- Dia, Semana e Mes sao controles temporais.
- Capacidade declara unknown, low confidence ou qualitative quando faltar informacao.
- Dependencias mostram bloqueio, sequencia, impacto e risco operacional.

## Proibido
- Timeline virar calendario simples.
- Capacidade inventar duracao, esforco ou carga.
- Dependencia virar vinculo contextual.
- Graficos BI ou analytics corporativo.

## Dependencias De Dominio
- TimelineProjection controla renderizacao.
- DependencyEdge e separado de EntityLink.
- Capacity reading vem de dominio/projection.

## Criterios De Aceite
- Cada lens muda a leitura operacional.
- Calendario nao elimina Capacidade e Dependencias.
- Ausencia de duracao permanece desconhecida.

## Riscos De Regressao
- Google Calendar clone.
- Lista com filtros.
- Numeros artificiais.
