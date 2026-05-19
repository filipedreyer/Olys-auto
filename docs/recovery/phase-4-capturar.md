# Fase 4 — Capturar Canônico

## Escopo

A Fase 4 migrou Capturar para a gramática canônica do Olys sem alterar domínio, Inbox, command handlers, repositories, store ou regra de resolução de destino.

## Arquivos Alterados

- `src/design-system/components/overlays/OlysSheet.tsx`
- `src/features/capturar/components/CaptureSheet.tsx`
- `src/features/capturar/components/CaptureSurface.tsx`
- `src/features/capturar/components/CaptureGrid.tsx`
- `src/features/capturar/screens/CapturarScreen.tsx`
- `src/styles/globals.css`

## Arquivos Criados

- `src/features/capturar/components/CaptureComposer.tsx`
- `src/features/capturar/components/capturePresentation.ts`
- `src/tests/captureSurfaceContract.test.ts`
- `docs/recovery/phase-4-capturar.md`
- `docs/recovery/phase-4-checklist.md`

## Sheet

`CaptureSheet` passou a usar `OlysSheet`. A camada continua sendo emergente, preserva `open`, `onClose`, fechamento pelo fundo e o uso pelo `AppShell`.

`OlysSheet` foi evoluído de forma genérica para aceitar eyebrow, descrição, classes de camada/painel e labels de fechamento. Não há lógica específica de Capturar dentro do componente de Design System.

## CaptureSurface

`CaptureSurface` preserva o fluxo:

- `destination` inicial como `inbox`;
- submit via `capture({ title, destination, dateStart })`;
- reset de título, data e destino;
- `onCaptured?.()` após captura bem-sucedida;
- erro e mensagem de campo vazio.

O campo principal foi movido para `CaptureComposer`, com textarea dominante e ações preparatórias inativas para áudio, anexo e Idea. Essas ações não persistem dados e não iniciam fluxo real.

## CaptureGrid

`CaptureGrid` agora segue a matriz 3x4:

1. Inbox, Meta, Projeto
2. Tarefa, Agenda, Nota
3. Lista, Hábito, Rotina
4. Template, Evento, Lembrete

Inbox recebeu ênfase visual como destino padrão. Tarefa, Agenda e Nota receberam ênfase contextual. Template ficou como destino secundário. Essencial protegido não foi incluído.

## Inbox Padrão

Inbox continua sendo o destino inicial. A mensagem “Sem tipo explícito, entra na Inbox.” foi preservada e corrigida, sem transformar Inbox em entidade final.

## Lembrete

A regra de Lembrete não foi alterada. `resolveCaptureTarget` continua mandando lembrete sem data ou horário suficiente para Inbox, com `suggestedType: reminder` e `reason: reminder_requires_date_or_time`.

A UI apenas deixa essa condição mais legível quando Lembrete está selecionado.

## O Que Não Foi Alterado

- Domínio de Capturar
- `resolveCaptureTarget`
- `inboxTriage`
- `operationalStore`
- command handlers
- repositories
- Hoje
- Timeline
- Planejar
- Memória
- Shell Global, exceto uso existente do `CaptureSheet`

## Riscos Remanescentes

- `OlysSheet` ainda não implementa focus trap completo.
- Ações preparatórias de áudio, anexo e Idea são placeholders estruturais.
- A rota `/capturar` continua como fallback técnico, mas o acesso principal permanece pelo FloatingActionPair.
- A suficiência de Lembrete ainda só é exposta por campo de data na UI; horário pode ser suportado futuramente sem alterar a regra de domínio.

## Pendências Para Fase 5

Migrar Inbox/Triagem para gramática canônica, preservando separação entre `InboxItem` e `OlysItem`, ações de triagem e rastreabilidade.
