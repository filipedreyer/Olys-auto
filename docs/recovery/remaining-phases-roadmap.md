# Remaining Phases Roadmap

Status: roadmap revisado apos matriz visual e legacy.

## Fase 8 - Memoria, Caixola, Templates, Anexos e Busca

Fontes da matriz: MEM00, MEM01, MEM02, MEM03, MEM04, MEM05, MEM06, MEM07, SYS01, SYS02.

Conceitos legacy aplicaveis:
- Templates governados.
- Caixola como incubacao e recuperacao.
- Arquivados e concluidos como ciclo de vida.
- Anexos privados como contrato futuro.
- Busca por origem, status, entidade e acao.
- Vinculos contextuais separados de dependencias.

Nao pode:
- Virar arquivo morto, wiki, knowledge base ou file manager.
- Criar storage publico.
- Misturar Inbox com Caixola.
- Transformar Template em entidade principal.

Dependencias:
- OperationalItem canonico.
- Inbox e Capturar preservando origem.
- Repositories e eventos ja existentes.

Criterios de aceite:
- Memoria recupera contexto.
- Caixola nao vira backlog.
- Arquivados e concluidos sao recuperaveis.
- Templates sao reutilizaveis sem virar marketplace.
- Anexos ficam como contrato privado se nao houver backend pronto.

Testes esperados:
- MemoryProjection.
- Caixola nao backlog.
- Arquivamento preserva rastreabilidade.
- Concluidos recuperaveis.
- Busca/atalhos nao chamam Supabase direto.

## Fase 9 - Idea e IA Contextual Governada

Fontes da matriz: IA01, IA02, IA03, IA04, IA05, SYS01, SYS02.

Conceitos legacy aplicaveis:
- Structured actions.
- Context builder minimo por superficie.
- Chat contextual como drawer.
- Output schema validado.
- Safety Gate.
- Logs minimizados.

Nao pode:
- Virar chatbot generico.
- Virar rota principal.
- Executar acao persistente sem Confirmation Sheet.
- Guardar prompt/resposta brutos por padrao.
- Operacionalizar conteudo de risco.

Dependencias:
- ConfirmationSheet.
- Contratos de actions.
- Governanca IA.
- Contexto minimo por superficie.

Criterios de aceite:
- Leitura, sugestao, relatorio e acao proposta sao distintos.
- `requires_confirmation` e obrigatorio para acao persistente.
- Incerteza e lacunas sao declaradas.
- App continua funcional sem IA.

Testes esperados:
- IA01 a IA05 presentes.
- Safety Gate bloqueia acoes sensiveis.
- Acao proposta nao persiste sem confirmacao.
- Logs minimizados.

## Fase 10 - Entity Sheets Por Entidade

Fontes da matriz: ENT00, ENT01, ENT02, ENT03, ENT04, ENT05, ENT06, ENT07, ENT08, ENT09.

Conceitos legacy aplicaveis:
- Sheet base.
- Campos especificos por entidade.
- Vinculos.
- Dependencias.
- Composicao.
- Event Prep.
- Project Stages.
- Milestones.
- Riscos.
- Anexos.
- Historico.

Nao pode:
- Criar mega-formulario universal.
- Copiar EntitySheet monolitica.
- Tratar campos derivados como editaveis.
- Confundir vinculo com dependencia.
- Criar anexo publico.

Dependencias:
- OperationalItem.
- Repository boundary.
- Event log.
- Contratos por entidade.

Criterios de aceite:
- Cada entidade tem sheet propria ou contrato especifico.
- Meta, Projeto, Tarefa, Habito, Rotina, Agenda/Evento, Lembrete, Nota e Lista diferem por campos reais.
- Acoes sensiveis exigem confirmacao.

Testes esperados:
- ENT00 a ENT09 documentados/implementados.
- Campos derivados nao editaveis.
- Link e DependencyEdge separados.
- Lembrete exige data/tempo suficiente.

## Fase 11 - Abrir o Dia, Fechar o Dia e Revisao Semanal

Fontes da matriz: FZ03, FZ04, FZ05, PL05, PL06.

Conceitos legacy aplicaveis:
- Morning Ritual traduzido.
- Projection propria.
- Replanejamento.
- Ordenacao manual temporaria.
- Carta de Respiro.
- Weekly Review.

Nao pode:
- Virar relatorio produtivista.
- Virar limpeza de backlog.
- Usar Day Reading motivacional.
- Tratar Essencial protegido como entidade.

Dependencias:
- Daily sessions.
- TodayProjection.
- Planejar e Memoria.
- Eventos de mudanca.

Criterios de aceite:
- Abrir o Dia reduz friccao e prepara execucao.
- Fechar o Dia preserva memoria e contexto.
- Revisao Semanal conecta direcao, capacidade e continuidade.
- PL05 e PL06 deixam de ser pendencias.

Testes esperados:
- Open/close day persistem.
- Replanejamento registra rastreabilidade.
- Weekly review nao usa score/streak.
- Essencial protegido continua condicao.

## Fase 12 - Acesso, Onboarding, PWA e Estados Sistemicos

Fontes da matriz: AC01, AC02, AC03, AC04, AC05, AC06, AC07, SYS01, SYS02.

Conceitos legacy aplicaveis:
- Onboarding como jornada de maturidade.
- Sessao expirada.
- Loading/skeleton.
- Offline e erro parcial.

Nao pode:
- Onboarding produtivista.
- Bloquear app local/degraded sem necessidade.
- Prometer sync/offline alem do implementado.

Dependencias:
- AuthProvider.
- Degraded mode.
- Shell.
- Governanca de dados.

Criterios de aceite:
- Acesso trata loading, unauthenticated, authenticated, degraded e expired session.
- PWA e safe areas nao quebram fluxo.
- Estados sistemicos aparecem sem crash.

Testes esperados:
- AC01 a AC07.
- SYS01 e SYS02.
- Offline/degraded.
- Auth state transitions.

## Fase 13 - Central De Confianca

Fontes da matriz: CTR00, CTR01, CTR02, CTR03, CTR04, CTR05, CTR06, CTR07.

Conceitos legacy aplicaveis:
- Dados.
- Exportacao.
- Exclusao.
- Privacidade.
- IA e transparencia.
- Conta.
- Suporte.
- Delete account governado.

Nao pode:
- Virar pagina de ajuda simples.
- Misturar Central com Admin.
- Prometer exclusao/exportacao sem backend.

Dependencias:
- Auth.
- Governanca de dados.
- Event log.
- Politicas de retencao.

Criterios de aceite:
- Usuario entende dados, IA, privacidade, suporte e conta.
- Exportacao precede promessa de controle pleno.
- Exclusao tem escopo, confirmacao e falha segura.

Testes esperados:
- CTR00 a CTR07.
- Fluxos de conta seguros.
- Sem Admin no shell pessoal.

## Fase 14 - Admin Seguro

Fontes da matriz: ADM00, ADM01, ADM02, ADM03, ADM04, ADM05, ADM06.

Conceitos legacy aplicaveis:
- Admin separado de Central.
- Roles reais.
- Backend e RLS.
- Auditoria.
- Saude do app.
- Prompts IA.
- Recados administrados.
- Permissoes e usuarios.

Nao pode:
- Admin protegido apenas por UI.
- Copiar Admin setup legado.
- Logar texto sensivel bruto.
- Misturar shell pessoal com admin.

Dependencias:
- Roles reais.
- RLS validado.
- Backend seguro.
- Prompt governance.

Criterios de aceite:
- Permissao e aplicada no backend.
- Auditoria registra ator, acao, escopo e tempo.
- Prompts possuem versao e governanca.

Testes esperados:
- ADM00 a ADM06.
- Usuario sem role bloqueado por backend.
- Logs minimizados.
- RLS validado.

## Fase 15 - QA Arquitetural e Fixtures

Fontes da matriz: 12_QA_PreDesign, 09_Estados_por_Tela, 10_Responsividade, 11_UXWriting.

Conceitos legacy aplicaveis:
- Seed demo como fixture.
- Dados extremos.
- Textos longos.
- Itens incompletos.
- Itens atrasados.
- Dependencias.
- Anexos.
- Unknown.
- Alta densidade.
- Mobile.
- Safe area.
- Overflow.
- Empty states.
- Erro.

Nao pode:
- Validar so com mock ideal.
- Ignorar unknown.
- Aceitar dashboard, backlog, PM tool ou knowledge base generica.

Dependencias:
- Fases 8 a 14.
- Fixtures canonicas.
- Testes de regressao visual/responsividade/acessibilidade.

Criterios de aceite:
- Regressao visual coberta.
- UX writing consistente.
- Estados por tela cobertos.
- Dados extremos nao quebram UI.
- App preserva canon.

Testes esperados:
- Fixtures canonicas.
- Responsividade.
- Acessibilidade.
- Unknown.
- Erro/offline/loading.
- Anti-regressao de dominio e visual.
