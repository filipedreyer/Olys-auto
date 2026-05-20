import type { IdeaOutput } from '../domain/ideaTypes'
import { IdeaOutputCard } from './IdeaOutputCard'

type IdeaOutputListProps = {
  outputs: IdeaOutput[]
  onReviewAction: (output: IdeaOutput) => void
}

export function IdeaOutputList({ outputs, onReviewAction }: IdeaOutputListProps) {
  return (
    <section className="idea-output-list" aria-label="Saídas da Idea">
      {outputs.map((output) => (
        <IdeaOutputCard key={output.id} output={output} onReviewAction={onReviewAction} />
      ))}
    </section>
  )
}
