import { EntityChangeEvent } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import {
  mapEntityChangeEventFromRow,
  mapEntityChangeEventToRow,
} from './repositoryMappers'

export const entityChangeEventsRepository = {
  async list(userId: string): Promise<EntityChangeEvent[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().entityChangeEvents.filter(
        (event) => event.userId === userId,
      )
    }

    const { data, error } = await supabase
      .from('entity_change_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapEntityChangeEventFromRow)
  },

  async create(event: EntityChangeEvent) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        entityChangeEvents: [event, ...getLocalState().entityChangeEvents],
      })
      return
    }

    const { error } = await supabase
      .from('entity_change_events')
      .insert(mapEntityChangeEventToRow(event))

    if (error) {
      throw error
    }
  },
}
