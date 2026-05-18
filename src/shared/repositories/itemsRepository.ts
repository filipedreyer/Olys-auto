import { OlysItem } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import { mapItemFromRow, mapItemToRow } from './repositoryMappers'

export const itemsRepository = {
  async list(userId: string): Promise<OlysItem[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().items.filter((item) => item.userId === userId)
    }

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapItemFromRow)
  },

  async create(item: OlysItem) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        items: [item, ...getLocalState().items],
      })
      return
    }

    const { error } = await supabase.from('items').insert(mapItemToRow(item))

    if (error) {
      throw error
    }
  },

  async update(item: OlysItem) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        items: getLocalState().items.map((candidate) =>
          candidate.id === item.id && candidate.userId === item.userId
            ? item
            : candidate,
        ),
      })
      return
    }

    const { error } = await supabase
      .from('items')
      .update(mapItemToRow(item))
      .eq('user_id', item.userId)
      .eq('id', item.id)

    if (error) {
      throw error
    }
  },

}
