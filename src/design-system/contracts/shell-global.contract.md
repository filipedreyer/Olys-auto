# Shell Global Contract

## Papel
Organizar navegacao global sem confundir territorio, entrada transversal e apoio contextual.

## Obrigatorio
- TopBarOlys deve conter logo real, menu, Acesso, Inbox e Busca.
- BottomNavOlys contem apenas Fazer, Planejar e Memoria.
- Capturar e Idea pertencem ao FloatingActionPair.
- Inbox pode ter dot contextual.
- Acesso nao e cadeado.

## Proibido
- Capturar como item da bottom nav.
- Idea como item da bottom nav.
- Criar rota principal para Idea como entidade operacional.
- Substituir marca real por texto solto.

## Dependencias De Dominio
- Fazer, Planejar e Memoria sao os territorios principais.
- Capturar e entrada transversal.
- Idea e apoio contextual.

## Criterios De Aceite
- Bottom nav possui exatamente os tres territorios.
- Acoes globais nao competem com territorios.
- Shell preserva continuidade espacial.

## Riscos De Regressao
- Nav virar menu SaaS.
- Capturar virar modulo.
- Idea virar chatbot principal.
