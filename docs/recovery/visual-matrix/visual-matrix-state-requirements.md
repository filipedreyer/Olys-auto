# Visual Matrix State Requirements

Status: estados obrigatorios por territorio.

| Estado | Onde aparece | O que comunica | O que nao pode fazer | Fase provavel | Teste esperado |
|---|---|---|---|---|---|
| empty | Todas as telas | Ausencia sem culpa e proxima acao possivel. | Virar texto motivacional generico. | 12/15 | Cada tela tem empty state. |
| loading | Acesso, telas com repositorios, IA | Espera curta e segura. | Spinner dominante ou layout quebrado. | 12/15 | Skeleton/loading por tela critica. |
| error | Todas | Falha localizada e recuperavel. | Ocultar dado ou culpar usuario. | 12/15 | Erro inline sem crash. |
| offline | Acesso, Global, Capturar, Inbox, Memoria | Operacao degradada. | Prometer sync real sem base. | 12/15 | Banner/estado offline. |
| partial sync | Global, Memoria, Entity Sheets | Parte dos dados pode estar atrasada. | Misturar com erro total. | 12/15 | Estado parcial separado. |
| unknown | Capacidade, Timeline, Inbox, IA, Entity Sheets | Falta dado suficiente. | Tratar como zero, disabled ou estimar. | Todas/15 | Unknown explicito. |
| blocked | Hoje, Timeline, Entity Sheets | Bloqueio causal ou sequencia impedida. | Confundir com attention. | 6/10/15 | Estado blocked distinto. |
| paused | Hoje, Planejar, Entity Sheets | Item pausado sem erro. | Parecer excluido ou concluido. | 7/10/15 | Paused visual e textual. |
| completed | Hoje, Memoria, Entity Sheets | Conclusao recuperavel. | Virar trofeu ou sumir sem rastro. | 3/8/10 | Concluidos recuperaveis. |
| archived | Memoria, Entity Sheets | Saida do fluxo ativo com rastreabilidade. | Deletar ou esconder para sempre. | 8/10 | Arquivados restauraveis. |
| deleted | Central, Entity Sheets, Admin | Exclusao governada. | Excluir sem confirmacao ou log. | 10/13/14 | Confirmacao e evento. |
| unauthenticated | Acesso | Sessao inexistente. | Quebrar app ou bloquear degraded local. | 12 | Auth state testado. |
| expired session | Acesso | Sessao precisa ser retomada. | Perder contexto local. | 12 | Rota AC07. |
| onboarding incomplete | Acesso | Entrada inicial ainda nao finalizada. | Tutorial longo e obrigatorio sem valor. | 12 | Onboarding curto e pulavel quando seguro. |
| capture empty | Capturar | Nada para enviar. | Criar item vazio. | 4/15 | Submit vazio mostra erro. |
| capture success | Capturar | Entrada preservada. | Roubar foco com celebracao. | 4/15 | Feedback discreto. |
| capture error | Capturar | Falha ao salvar mantendo texto. | Perder conteudo digitado. | 4/15 | Texto preservado. |
| inbox new | Inbox | Entrada aguardando decisao. | Parecer tarefa ativa. | 5 | Triage layer mostra new/error. |
| inbox kept | Inbox | Mantido para revisita controlada. | Virar backlog. | 5 | Revisit sem acao Manter. |
| inbox postponed | Inbox | Revisita futura com rastreabilidade. | Virar due date de tarefa. | 5 | needsRevisit/postponedAt preservados. |
| inbox converted | Inbox | Virou OlysItem por decisao. | Converter automaticamente. | 5 | convertedItemId e evento. |
| entity missing required data | Capturar, Entity Sheets, IA | Entidade nao tem dado suficiente. | Inventar data/duracao. | 10/15 | Required data guard. |
| IA unavailable | Idea, Global | IA indisponivel com app funcional. | Bloquear Hoje/Capturar/Inbox. | 9/12 | Fallback sem crash. |
| IA requires confirmation | Idea, Entity Sheets | Acao proposta ainda nao aplicada. | Persistir antes de confirmacao. | 9 | Confirmation Sheet obrigatoria. |
| Admin forbidden | Admin | Usuario sem permissao real. | Esconder so por UI. | 14 | Backend/RLS bloqueia. |
