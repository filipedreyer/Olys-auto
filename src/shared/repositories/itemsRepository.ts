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

  async replaceAll(userId: string, items: OlysItem[]) {
    const userItems = items.filter((item) => item.userId === userId)
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        items: [
          ...userItems,
          ...getLocalState().items.filter((item) => item.userId !== userId),
        ],
      })
      return
    }

    const { error } = await supabase.from('items').upsert(userItems.map(mapItemToRow))

    if (error) {
      throw error
    }
  },
}
