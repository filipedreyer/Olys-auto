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

  async create(condition: EntityCondition) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        conditions: [condition, ...getLocalState().conditions],
      })
      return
    }

    const { error } = await supabase
      .from('entity_conditions')
      .insert(mapConditionToRow(condition))

    if (error) {
      throw error
    }
  },

  async update(condition: EntityCondition) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        conditions: getLocalState().conditions.map((candidate) =>
          candidate.id === condition.id &&
          candidate.userId === condition.userId
            ? condition
            : candidate,
        ),
      })
      return
    }

    const { error } = await supabase
      .from('entity_conditions')
      .update(mapConditionToRow(condition))
      .eq('user_id', condition.userId)
      .eq('id', condition.id)

    if (error) {
      throw error
    }
  },

}
