# Visual Matrix Component Anatomy

Status: consolidacao da anatomia de componentes da matriz visual.

## Shell

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| TopBarOlys | Orientacao global e acesso rapido. | Menu, logo, Acesso, Inbox, Busca. | Capturar/Idea na topbar, cadeado para Acesso. | Fase 1, QA 15 | Implementado. |
| BottomNavOlys | Navegacao primaria. | Fazer, Planejar, Memoria. | Central, Capturar, Idea ou Admin na nav. | Fase 1, QA 15 | Implementado. |
| FloatingActionPair | Portas transversais. | Idea e Capturar acima da bottom nav. | Virar nav primaria ou competir com conteudo. | Fase 1, 4, 9 | Implementado parcialmente. |

## Navegacao Contextual

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| Tabs Hoje / Timeline | Troca contextual dentro de Fazer. | Orientar sem titulo redundante. | Duplicar header ou parecer nav primaria. | Fase 3/6 | Parcial. |
| Lens switcher | Alternar lentes da Timeline. | Calendario, Capacidade, Dependencias. | Filtros genericos ou analytics. | Fase 6 | Parcial. |
| Controles temporais | Escopo dia/semana/mes. | Timeline futura. | Calendario corporativo. | Fase 15/futuro | Pendente. |

## Indicadores

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| Capacidade | Diagnosticar viabilidade. | Hoje e Timeline. | Score, gauge, duracao inventada. | Fase 3/6/15 | Parcial. |
| Direcao | Conectar execucao a trajetoria. | Hoje e Planejar. | Motivacao generica. | Fase 3/7 | Parcial. |
| Unknown | Declarar falta de dado. | Capacidade, IA, Timeline, Entity Sheets. | Tratar como zero ou disabled. | Todas | Parcial. |
| Atencao | Sinalizar risco operacional. | Hoje, Inbox, Planejar. | Criticidade sem motivo. | Fase 3/5/7 | Parcial. |
| Dependencia | Expor bloqueio/sequencia. | Timeline, Planejar, Entity Sheets. | Confundir vinculo com dependencia. | Fase 6/10 | Parcial. |

## Ciclo Diario

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| Abrir o Dia | Porta de inicio operacional. | Preparar foco, capacidade e ordem. | Ritual gamificado. | Fase 11 | Parcial. |
| Fechar o Dia | Encerrar e preservar contexto. | Nota e resumo curto. | Journaling complexo. | Fase 11 | Parcial. |
| Diario | Registro minimo de fechamento. | Fechar o Dia e Memoria. | Feed emocional. | Fase 11 | Pendente. |
| Carta de Respiro | Pausa de preservacao de capacidade. | Fazer/Hoje. | Motivacao generica. | Fase 11 | Pendente. |

## OperationalItem

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| OperationalCard featured | Foco operacional. | Agora/carrossel. | Dashboard card generico. | Fase 2/3 | Implementado parcial. |
| OperationalRow | Leitura densa. | Cabe hoje, Timeline, Planejar, Memoria. | Row CRUD. | Fase 2+ | Implementado parcial. |
| EntityRail | Marca visual primaria da entidade. | Rows e cards. | Icone redundante ou fundo colorido. | Fase 2 | Implementado. |
| OperationalSignalStack | Sinais curtos. | Essential, dependency, unknown, blocked. | Nuvem de chips decorativos. | Fase 2 | Implementado. |
| OperationalActions | Acoes discretas. | Complete, open, defer, more. | CRUD dominante. | Fase 2+ | Implementado preparatorio. |

## Agrupadores

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| SectionGroup | Agrupar sem virar dashboard. | Hoje, Memoria, Planejar. | Cards equivalentes e seccoes planas. | Fase 8/15 | Parcial. |
| Layer | Camada de hierarquia operacional. | Agora, Cabe hoje, Atenção. | Hierarquia plana. | Fase 3+ | Parcial. |
| ReadingBand | Leitura curta. | Inbox, Planejar, Timeline. | Placar ou painel analitico. | Fase 5/6/7 | Parcial. |
| EmptyState | Estado de ausencia. | Todas as telas. | Tom motivacional ou vago. | Fase 12/15 | Parcial. |

## Atencao

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| AttentionItem | Risco/incompletude. | Hoje e Planejar. | Virar erro critico sem causa. | Fase 3/7 | Parcial. |
| BlockedItem | Bloqueio causal. | Hoje, Timeline, Entity Sheets. | Confundir com attention. | Fase 6/10 | Parcial. |
| UnknownItem | Dado faltante acionavel. | Capacidade, Inbox, IA. | Disabled ou invisivel. | Fase 15 | Parcial. |

## Lembretes

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| ReminderCard | Lembrete em foco. | Futuro carousel/sheets. | Lembrete sem data. | Fase 10/15 | Pendente. |
| ReminderRow | Lembrete em lista. | Timeline/Memoria. | Confundir com tarefa. | Fase 10 | Pendente. |
| Estado com data obrigatoria | Guardrail visual. | Capturar e Entity Sheet. | Criar lembrete incompleto. | Fase 4/10 | Parcial. |

## Captura

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| CaptureSheet | Porta transversal. | Sheet emergente. | Pagina/formulario. | Fase 4 | Implementado. |
| CaptureGridTile | Destino tipado. | Grid 3x4. | Chips decorativos. | Fase 4 | Implementado parcial. |
| QuickCaptureInput | Entrada dominante. | Campo livre. | Exigir classificacao. | Fase 4 | Implementado. |
| CaptureComposer | Compor captura. | Texto, acao, placeholders. | Upload real prematuro. | Fase 4 | Implementado. |

## Inbox

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| InboxItem | Entrada transitiva. | Lista de triagem. | Virar OlysItem antes de converter. | Fase 5 | Parcial. |
| InboxTriageItem | Item decisional. | Nova triagem. | Backlog. | Fase 5 | Implementado. |
| TriageActions | Decisoes minimas. | Manter, Converter, Concluir, Adiar, Descartar. | CRUD dominante. | Fase 5/10 | Parcial. |
| RevisitLayer | Revisita controlada. | Kept/postponed. | Fila ativa escondida. | Fase 5 | Implementado. |

## Timeline

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| LensRow | Entrada por lente. | Calendar/capacity/dependency. | Row tecnica. | Fase 6 | Parcial. |
| TemporalControl | Dia/semana/mes. | Timeline futura. | Calendario generico. | Fase 15/futuro | Pendente. |
| TimeGrid | Campo temporal. | Calendar lens futura. | Google Calendar clone. | Fase 15/futuro | Pendente. |
| CapacitySummary | Leitura de viabilidade. | Capacity lens. | BI chart. | Fase 6 | Parcial. |
| DependencyTree | Cadeia causal. | Dependency lens. | Grafo tecnico. | Fase 6/10 | Parcial. |
| TimelineEntryRow | Item temporal. | Lens entries. | Unclassified sem rail. | Fase 6 | Parcial. |

## Planejar

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| PlanningDomainCard | Superficie de direcao. | Metas/projetos. | Dashboard executivo. | Fase 7 | Parcial. |
| GoalCard | Meta. | Direcao qualitativa. | OKR tool. | Fase 7/10 | Parcial. |
| ProjectCard | Projeto. | Conexao com meta e execucao. | Kanban/PM. | Fase 7/10 | Parcial. |
| RhythmRow | Habito/rotina. | Ritmo contextual. | Streak/checklist. | Fase 7 | Parcial. |
| WeeklyReviewEntry | Revisao semanal. | PL06. | Relatorio produtivista. | Fase 11 | Pendente. |

## Memoria

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| MemorySubareaCard | Entrada para subarea. | MEM00. | Biblioteca generica. | Fase 8 | Pendente. |
| CaixolaCluster | Incubacao e recuperacao. | MEM02. | Inbox oculta. | Fase 8 | Pendente. |
| TemplateCard | Modelo reutilizavel. | MEM03. | Marketplace. | Fase 8 | Pendente. |
| AttachmentRow | Anexo privado. | MEM06/Entity Sheets. | File manager/storage publico. | Fase 8/10/13 | Pendente. |
| SearchResultRow | Resultado acionavel. | MEM07. | Search generico. | Fase 8/13 | Pendente. |

## Idea

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| IdeaChatInput | Entrada contextual. | Drawer/sheet. | Chatbot generico. | Fase 9 | Pendente. |
| SuggestionCard | Sugestao governada. | IA03. | Acao automatica. | Fase 9 | Parcial/stub. |
| ReportBlock | Relatorio contextual. | IA04. | Dashboard narrativo. | Fase 9 | Pendente. |
| ConfirmationSheet | Confirmacao IA. | IA05. | Confirmacao insuficiente. | Fase 9 | Parcial/stub. |

## Entity Sheets

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| EntityHeader | Identidade e estado. | ENT00-ENT09. | Header CRUD. | Fase 10 | Pendente. |
| FieldBlock | Campo especifico. | Sheets por entidade. | Metadata livre. | Fase 10 | Pendente. |
| RelationBlock | Vinculos. | Relacoes contextuais. | Confundir dependencia. | Fase 10 | Pendente. |
| DependencyBlock | Causalidade. | Bloqueios/sequencia. | Confundir vinculo. | Fase 10 | Pendente. |
| HistoryBlock | Rastreabilidade. | Eventos. | Log bruto sensivel. | Fase 10/14 | Pendente. |
| AttachmentBlock | Anexos. | Privado/metadata. | Storage publico. | Fase 10/13 | Pendente. |
| EntityActions | Acoes sensiveis. | Arquivar/restaurar/excluir. | Acao sem confirmacao. | Fase 10 | Pendente. |

## Central

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| CentralSectionCard | Agrupar confianca. | CTR00. | Help center simples. | Fase 13 | Pendente. |
| PrivacyBlock | Dados/privacidade. | CTR03. | Promessa sem backend. | Fase 13 | Pendente. |
| PreferenceRow | Preferencias. | CTR04. | Config cosmetica. | Fase 13 | Pendente. |

## Admin

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| AdminTable | Operacao administrativa. | ADM01-ADM06. | Dashboard generico. | Fase 14 | Pendente. |
| AdminGate | Acesso restrito real. | ADM00. | UI-only permission. | Fase 14 | Pendente. |
| AuditLogRow | Auditoria. | ADM05. | Texto bruto sensivel. | Fase 14 | Pendente. |
| PromptVersionRow | Governanca de prompts. | ADM04. | Prompt editavel sem versao. | Fase 14 | Pendente. |

## Sistema

| Componente | Papel | Uso | Riscos | Fases | Status |
|---|---|---|---|---|---|
| Skeleton | Loading silencioso. | SYS01. | Spinner dominante. | Fase 12/15 | Pendente. |
| OfflineBanner | Falha de rede. | SYS02. | Promessa falsa de sync. | Fase 12/15 | Pendente. |
| InlineError | Erro contextual. | Todas. | Toast generico sem acao. | Fase 12/15 | Parcial. |
| EmptyState | Ausencia acionavel. | Todas. | Motivacional ou vazio demais. | Fase 12/15 | Parcial. |
| LoadingState | Estado de espera. | Todas. | Tela quebrada. | Fase 12/15 | Parcial. |
