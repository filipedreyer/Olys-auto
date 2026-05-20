# Visual Matrix QA Predesign

Status: checklist de QA antes de design visual final.

## Criterios Obrigatorios

- Cada tela tem empty state.
- Cada tela tem loading state.
- Cada tela tem erro localizado.
- Cada tela tem comportamento mobile.
- Unknown aparece sem inventar dado.
- Informacao critica nao depende so de cor.
- Touch target minimo de 44px.
- Contraste minimo validado.
- Sem overflow horizontal.
- Safe area top/bottom respeitada.
- Sheets tratam teclado mobile e rolagem interna.
- Sem cardificacao excessiva.
- Sem dashboard generico.
- Sem backlog disfarcado.
- Sem PM tool.
- Sem OKR tool.
- Sem knowledge base generica.
- Timeline nao vira calendario comum.
- Capacidade nao vira grafico BI.
- Dependencia nao vira vinculo.
- Inbox nao vira tarefa.
- IA nao executa acao persistente sem confirmacao.

## Como Verificar

| Grupo | Verificacao | Falha tipica | Correcao esperada |
|---|---|---|---|
| Fonte de verdade | Decisao e funcional, visual ou governanca? | Mock antigo vira regra. | Reclassificar fonte e marcar pendencia. |
| Navegacao | BottomNav tem so Fazer, Planejar e Memoria. | Capturar, Idea, Central ou Admin na nav. | Realocar como acao/controle. |
| Hierarquia | Tela tem elemento dominante coerente. | Tudo com mesmo peso. | Reforcar protagonista e reduzir secundarios. |
| Cor | Entidade aparece como rail/dot/marcador. | Fundo cheio por entidade. | Voltar para superficie neutra. |
| Estados | Unknown explicitado. | Zero falso ou equilibrio falso. | Usar unknown/sem dados. |
| Motion | Duracao curta e reduced motion. | Transition all, bounce, delay. | Propriedades especificas e alternativa silenciosa. |
| Acessibilidade | 44px, foco e labels. | Icone pequeno sem aria-label. | Hit area/foco/label. |
| Fazer | Agora domina. | Lista plana. | Reforcar card featured e camadas secundarias. |
| Timeline | Lentes da mesma superficie. | Tres produtos separados. | Unificar gramaticas. |
| Memoria | Recuperacao e ciclo de vida. | Lixeira/wiki. | Reescrever labels e hierarquia. |
