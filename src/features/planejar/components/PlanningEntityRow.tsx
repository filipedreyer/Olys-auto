import type {
  OperationalItemDensity,
  OperationalItemSignal,
  OperationalItemVisualState,
} from '../../../design-system'
import { OperationalRow } from '../../fazer/components/OperationalRow'

type PlanningEntityType = 'goal' | 'project' | 'habit' | 'routine'

type PlanningEntityRowProps = {
  entityType: PlanningEntityType
  title: string
  context?: string
  detail?: string
  state?: OperationalItemVisualState
  signals?: readonly OperationalItemSignal[]
  relation?: string
  density?: OperationalItemDensity
  itemId?: string
}

export function PlanningEntityRow({
  entityType,
  title,
  context,
  detail,
  state = 'default',
  signals = [],
  relation,
  density = 'regular',
  itemId,
}: PlanningEntityRowProps) {
  return (
    <div className="planning-entity-row" data-entity={entityType} data-state={state}>
      <OperationalRow
        entityType={entityType}
        title={title}
        meta={context}
        detail={[detail, relation].filter(Boolean).join(' · ')}
        state={state}
        signals={signals}
        size={density}
        itemId={itemId}
      />
    </div>
  )
}
