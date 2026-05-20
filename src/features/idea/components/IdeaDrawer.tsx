import { useMemo, useState } from 'react'
import { OlysSheet } from '../../../design-system'
import type {
  DependencyEdge,
  EntityCondition,
  EntityLink,
  InboxItem,
  OlysItem,
} from '../../../domain/entities/types'
import { buildIdeaContext } from '../domain/ideaContextBuilder'
import { buildDeterministicIdeaOutputs } from '../domain/ideaDeterministicResponder'
import type { IdeaOutput } from '../domain/ideaTypes'
import { IdeaConfirmationSheet } from './IdeaConfirmationSheet'
import { IdeaContextSummary } from './IdeaContextSummary'
import { IdeaDisclosure } from './IdeaDisclosure'
import { IdeaInput } from './IdeaInput'
import { IdeaOutputList } from './IdeaOutputList'
import { IdeaUnavailableState } from './IdeaUnavailableState'

type IdeaDrawerProps = {
  open: boolean
  onClose: () => void
  currentPath: string
  items: OlysItem[]
  inboxItems: InboxItem[]
  conditions: EntityCondition[]
  dependencies: DependencyEdge[]
  links: EntityLink[]
}

export function IdeaDrawer({
  open,
  onClose,
  currentPath,
  items,
  inboxItems,
  conditions,
  dependencies,
  links,
}: IdeaDrawerProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedOutput, setSelectedOutput] = useState<IdeaOutput | undefined>()
  const context = useMemo(
    () =>
      buildIdeaContext({
        currentPath,
        items,
        inboxItems,
        conditions,
        dependencies,
        links,
        textInput: prompt,
      }),
    [conditions, currentPath, dependencies, inboxItems, items, links, prompt],
  )
  const outputs = useMemo(
    () => buildDeterministicIdeaOutputs(context, prompt),
    [context, prompt],
  )

  function handleSubmit(text: string) {
    setPrompt(text)
  }

  return (
    <>
      <OlysSheet
        open={open}
        title="Idea"
        eyebrow="IA01"
        description="Apoio contextual governado. Sem automação e sem persistência nesta fase."
        onClose={onClose}
        panelClassName="idea-drawer"
      >
        <IdeaContextSummary context={context} />
        <IdeaUnavailableState onGenerateLocal={() => setPrompt('')} />
        <IdeaInput onSubmit={handleSubmit} onGenerateReading={() => setPrompt('')} />
        <IdeaOutputList outputs={outputs} onReviewAction={setSelectedOutput} />
        <IdeaDisclosure />
      </OlysSheet>
      <IdeaConfirmationSheet
        output={selectedOutput}
        onClose={() => setSelectedOutput(undefined)}
      />
    </>
  )
}
