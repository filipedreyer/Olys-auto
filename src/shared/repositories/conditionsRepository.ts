import { EntityCondition } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import { mapConditionFromRow, mapConditionToRow } from './repositoryMappers'

export const conditionsRepository = {
  async list(userId: string): Promise<EntityCondition[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().conditions.filter(
        (condition) => condition.userId === userId,
      )
    }

    const { data, error } = await supabase
      .from('entity_conditions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapConditionFromRow)
  },

  async replaceAll(userId: string, conditions: EntityCondition[]) {
    const userConditions = conditions.filter(
      (condition) => condition.userId === userId,
    )
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        conditions: [
          ...userConditions,
          ...getLocalState().conditions.filter(
            (condition) => condition.userId !== userId,
          ),
        ],
      })
      return
    }

    const { error } = await supabase
      .from('entity_conditions')
      .upsert(userConditions.map(mapConditionToRow))

    if (error) {
      throw error
    }
  },
}
