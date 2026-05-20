# Visual Matrix Responsive Rules

Status: regras de responsividade e densidade.

## Regras Globais

- O Olys e mobile-first.
- TopBar e BottomNav devem respeitar safe area top e bottom.
- FloatingActionPair fica acima da BottomNav e nao cobre acao primaria.
- Touch target minimo: 44px.
- Sheets precisam altura maxima, rolagem interna e tratamento de teclado mobile.
- Evitar overflow horizontal em qualquer largura.
- Texto longo deve quebrar linha sem ocultar acao.
- Alta densidade reduz peso visual, nao transforma tela em dashboard.
- Estados offline e erro parcial devem ser legiveis em mobile.
- Em PWA instalada, safe areas continuam obrigatorias.

## Por Territorio

| Territorio | Mobile | Tablet/Desktop | Risco | Aceite |
|---|---|---|---|---|
| Shell global | TopBar 56px, BottomNav + safe area, FAB acima da nav. | Pode virar rail/sidebar preservando territorios. | Arquitetura diferente por breakpoint. | Fazer/Planejar/Memoria permanecem primarios. |
| Fazer / Hoje | Coluna unica, Agora dominante. | Diagnostico pode ir para lateral. | Perder prioridade da proxima acao. | Usuario identifica o que fazer agora. |
| Timeline | Lentes compactas, superficie com scroll. | Lentes ganham area, sem virar tres produtos. | Calendario/grafo/BI separados. | Mesma Timeline alterna lente sem reorientacao. |
| Capturar | Bottom sheet, input dominante, grid 3x4. | Drawer/painel mantendo contexto. | Exigir tipo antes de capturar. | Entrada livre e sempre mais rapida. |
| Inbox | Lista vertical e triagem clara. | Lista + preview possivel. | Unknown parecer disabled. | Cada item pede decisao. |
| Planejar | Lista/camadas simples. | Master-detail leve possivel. | Virar PM tool. | Direcao, conexao e ritmo aparecem juntos. |
| Memoria | Subareas e busca em coluna. | Sidebar de subareas e preview. | Arquivo morto/knowledge base. | Recuperar por tipo, origem, status e acao. |
| Idea | Drawer/bottom sheet contextual. | Side panel com tela de origem visivel. | IA dominar experiencia. | Leitura, sugestao e acao ficam separadas. |
| Entity Sheets | Bottom sheet quase full-screen. | Side panel/master-detail. | Mega-formulario. | Editavel, calculado e historico sao distintos. |
| Central | Lista de secoes. | Nav lateral + conteudo. | Misturar com Admin. | Dados, conta e preferencias com confianca. |
| Admin | Mobile so leitura/alerta. | Desktop-first com tabelas. | Parecer app pessoal. | Ator, acao, permissao e status legiveis. |
