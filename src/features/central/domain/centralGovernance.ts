export const centralDataCategories = [
  {
    name: 'Itens operacionais',
    description: 'Tarefas, metas, projetos, hábitos, rotinas, eventos, lembretes, notas, listas e templates.',
  },
  {
    name: 'Inbox',
    description: 'Entradas em triagem e estados de manter, adiar, converter, concluir ou descartar.',
  },
  {
    name: 'Condições',
    description: 'Sinais como bloqueado, atenção, unknown, recorrente, atrasado e essencial protegido.',
  },
  {
    name: 'Vínculos',
    description: 'Relações contextuais entre entidades, separadas de dependências operacionais.',
  },
  {
    name: 'Dependências',
    description: 'Predecessor, sucessor, tipo, status, impacto e justificativa quando já carregados.',
  },
  {
    name: 'Sessões diárias',
    description: 'Abertura, fechamento e nota mínima do dia quando registrada.',
  },
  {
    name: 'Memória',
    description: 'Arquivados, concluídos, Caixola, templates, recuperação e busca local carregada.',
  },
  {
    name: 'Preferências futuras',
    description: 'Preferências ainda precisam de persistência governada antes de serem aplicadas.',
  },
]

export const centralAiLimits = [
  'Idea usa apenas contexto carregado e minimizado nesta sessão.',
  'Outputs são separados em leitura, sugestão, relatório e ação proposta.',
  'Ação proposta exige Confirmation Sheet e Safety Gate.',
  'Prompt e resposta brutos não devem ser persistidos por padrão.',
  'Nesta fase, a Idea permanece local/determinística quando não há integração segura.',
  'Idea não substitui decisão humana e não executa ação persistente automaticamente.',
]

export const centralExportLimits = [
  'Exportação real precisa backend seguro, escopo definido e geração controlada.',
  'Esta fase não gera arquivo, não cria download e não lê repositories diretamente.',
  'Antes de exportar, o app deve declarar categorias incluídas e limitações conhecidas.',
]

export const centralDeletionLimits = [
  'Exclusão real precisa backend seguro, confirmação forte e consequência clara.',
  'Esta fase não apaga dados, não chama command handlers e não altera store.',
  'Conta, dados operacionais e anexos futuros exigem governança antes de deleção real.',
]

export const centralOfflineLimits = [
  'Offline não significa sincronização completa.',
  'Modo local ou degradado pode manter o app navegável, mas precisa declarar limites.',
  'Anexos privados ainda dependem de storage governado e não usam storage público legado.',
]

export const centralSupportPaths = [
  'Entender estado do app e configuração.',
  'Reportar erro com contexto mínimo, sem texto sensível livre.',
  'Recuperar acesso pelos fluxos de login e recuperação.',
  'Consultar limitações conhecidas de IA, PWA, offline, exportação e exclusão.',
]

export const centralGuardrails = [
  'Central não é Admin.',
  'Central não aparece na BottomNav.',
  'Central não cria analytics, tracking, API externa ou storage.',
  'Central não promete exportação ou exclusão sem backend.',
  'Central não transforma suporte em help center genérico.',
]
