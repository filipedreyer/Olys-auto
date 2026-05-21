export type CentralSectionId =
  | 'CTR00'
  | 'CTR01'
  | 'CTR02'
  | 'CTR03'
  | 'CTR04'
  | 'CTR05'
  | 'CTR06'
  | 'CTR07'

export type CentralSectionStatus = 'active' | 'preparatory' | 'requires_backend'

export type CentralSectionDefinition = {
  id: CentralSectionId
  title: string
  description: string
  status: CentralSectionStatus
  limit: string
}

export const centralSections: CentralSectionDefinition[] = [
  {
    id: 'CTR00',
    title: 'Central Home',
    description: 'Mapa curto de confiança, conta, privacidade, IA, suporte, recados e guia.',
    status: 'active',
    limit: 'Não substitui Fazer, Planejar, Memória ou Admin.',
  },
  {
    id: 'CTR01',
    title: 'Guia',
    description: 'Leitura simples do modelo operacional do Olys.',
    status: 'active',
    limit: 'Não vira tutorial longo nem tese de produtividade.',
  },
  {
    id: 'CTR02',
    title: 'Recados',
    description: 'Espaço visível para recados do produto.',
    status: 'preparatory',
    limit: 'Recados administrados dependem do Admin seguro.',
  },
  {
    id: 'CTR03',
    title: 'Dados e Privacidade',
    description: 'Categorias de dados, limites reais, exportação e exclusão governadas.',
    status: 'active',
    limit: 'Sem exportar ou excluir dados reais nesta fase.',
  },
  {
    id: 'CTR04',
    title: 'Preferências',
    description: 'Preferências reais ou preparatórias com escopo declarado.',
    status: 'preparatory',
    limit: 'Não finge persistência que ainda não existe.',
  },
  {
    id: 'CTR05',
    title: 'IA e Transparência',
    description: 'Como Idea usa contexto, tipa respostas e exige confirmação.',
    status: 'active',
    limit: 'Não executa ação persistente nem chama IA externa aqui.',
  },
  {
    id: 'CTR06',
    title: 'Suporte',
    description: 'Caminhos para entender estado do app e reportar problemas.',
    status: 'preparatory',
    limit: 'Não cria ticket, chat ou backend de suporte.',
  },
  {
    id: 'CTR07',
    title: 'Conta',
    description: 'Estado de acesso, modo de execução e saída segura.',
    status: 'active',
    limit: 'Não expõe Admin nem apaga dados.',
  },
]

export const centralStatusLabels: Record<CentralSectionStatus, string> = {
  active: 'Ativo',
  preparatory: 'Preparatório',
  requires_backend: 'Depende de backend',
}

export const centralHeaderCopy = {
  eyebrow: 'Central de Confiança',
  title: 'Controle sem promessa falsa',
  statement:
    'A Central reúne dados, privacidade, IA, conta, suporte e limites reais do Olys sem virar território principal.',
}

export const centralPreferenceContracts = [
  {
    title: 'Redução de movimento',
    description: 'Contrato para respeitar menor movimento visual quando a preferência estiver persistida.',
  },
  {
    title: 'Densidade de leitura',
    description: 'Contrato para ajustar compactação sem mudar o sentido das superfícies operacionais.',
  },
  {
    title: 'Presença da Idea',
    description: 'Contrato para calibrar apoio contextual sem permitir ação autônoma.',
  },
  {
    title: 'Notificações futuras',
    description: 'Contrato para avisos explícitos, nunca pressão produtivista.',
  },
  {
    title: 'Onboarding futuro',
    description: 'Contrato para retomar orientação curta sem tutorial obrigatório.',
  },
]
