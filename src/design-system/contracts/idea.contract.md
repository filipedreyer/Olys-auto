# Idea Contract

## Papel

Idea e apoio contextual distribuido. Ela abre como drawer/sheet a partir da acao transversal, nao como rota principal, chatbot generico ou executor autonomo.

## Obrigatorio

- Leitura, sugestao, relatorio e acao proposta sao tipos distintos.
- Acao persistente exige Confirmation Sheet.
- Safety Gate e obrigatorio antes de qualquer acao persistente.
- Incerteza, baixa confianca e informacao faltante devem ser declaradas.
- IA indisponivel nao quebra Hoje, Timeline, Capturar, Inbox, Planejar ou Memoria.
- Logs devem ser minimizados.
- Prompt/resposta brutos nao sao persistidos.
- Conteudo de risco nao pode ser operacionalizado.
- Usuario decide.

## Proibido

- Criar rota principal de IA.
- Copiar IntelligencePage legado.
- IA autoexecutar acao relevante.
- IA dominar fluxo operacional.
- Persistir sem Confirmation Sheet.
- Esconder baixa confianca.
- Misturar leitura, sugestao, relatorio e acao proposta.
- Apresentar sugestao como comando.

## Dependencias De Dominio

- Confirmation Sheet governa acoes persistentes.
- Safety Gate governa risco.
- Context builder deve usar apenas dados carregados e minimizados.
- Falha de IA preserva app funcional.

## Criterios De Aceite

- Sugestao e diferente de comando.
- Acao relevante passa por confirmacao.
- Output invalido vira unavailable ou safety_blocked.
- Fallback preserva app funcional.

## Riscos De Regressao

- Startup AI generica.
- Decisao delegada indevidamente.
- Falsa certeza.
- Logs com texto sensivel.
- Automacao persistente sem governanca.
