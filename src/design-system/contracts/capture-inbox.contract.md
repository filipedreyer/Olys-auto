# Capture Inbox Contract

## Papel
Definir Capturar como porta transversal e Inbox como triagem.

## Obrigatorio
- Capturar e porta transversal.
- CaptureGrid e 3x4.
- Campo livre sem tipo vai para Inbox.
- Lembrete exige data suficiente.
- Inbox e camada de triagem, nao entidade final.
- Adiar preserva rastreabilidade.

## Proibido
- Capturar como upload.
- Capturar como pagina CRUD.
- Essencial protegido no grid.
- Inbox como backlog.
- Misturar InboxItem com OlysItem.

## Dependencias De Dominio
- InboxItem permanece separado de OlysItem.
- Converter passa por command handler/repository.
- Eventos preservam origem e triagem.

## Criterios De Aceite
- Captura sem tipo cria InboxItem.
- Converter fecha InboxItem e cria entidade operacional.
- Adiar preserva metadata de revisita.

## Riscos De Regressao
- Formularizacao.
- Backlog oculto.
- Perda de origem.
