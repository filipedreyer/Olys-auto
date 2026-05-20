# Legacy Guardrails

Status: bloqueios contra reintroducao de deriva.

## Proibicoes Absolutas

- Proibida importacao de codigo legado.
- Proibido reintroduzir Orbita.
- Proibido usar emojis como iconografia.
- Proibido usar DesignTokens legado.
- Proibido usar UIElements legado.
- Proibido usar SheetComponents legado.
- Proibido copiar EntitySheet monolitica.
- Proibido copiar CaptureModal monolitico.
- Proibido copiar IntelligencePage como rota principal.
- Proibido copiar MorningRitual como componente.
- Proibido copiar TimelinePage como calendario generico.
- Proibido usar priority score bruto.
- Proibido usar goal progress com pesos fixos.
- Proibido usar goal health opaco.
- Proibido criar weekly review produtivista.
- Proibido criar day reading motivacional.
- Proibido usar storage publico para anexos.
- Proibido copiar Admin setup legado.
- Proibido armazenar prompt/resposta IA brutos por padrao.
- Proibido aplicar migrations antigas.
- Proibido importar edge functions antigas.
- Proibido reintroduzir navegacao antiga.
- Proibido usar produtividade como tese central.
- Proibido transformar Inbox em backlog.
- Proibido transformar Timeline em analytics.
- Proibido transformar Planejar em PM tool.
- Proibido transformar Memoria em knowledge base generica.
- Proibido transformar Entity Sheet em mega-formulario.
- Proibido transformar Central em ajuda simples.
- Proibido transformar Admin em tela protegida so por UI.
- Proibido IA com acao persistente sem confirmacao.

## Regra De Traducao

Todo conceito legado precisa ser reescrito na ontologia atual. Se a solucao depende de copiar arquivo, token, schema, migration, prompt, edge function ou componente antigo, a solucao deve ser recusada.

## Checklist De Revisao

- O conceito foi descrito como problema, nao como componente?
- Existe contrato atual para dominio, visual e governanca?
- A implementacao futura preserva Capturar como porta transversal?
- A implementacao futura preserva Inbox como triagem?
- A implementacao futura preserva Timeline como lente operacional?
- A implementacao futura preserva Memoria como recuperacao, nao arquivo morto?
- A implementacao futura exige confirmacao para acao IA persistente?
- A implementacao futura evita dashboard, backlog, PM tool e knowledge base generica?
