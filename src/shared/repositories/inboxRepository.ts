import { InboxItem } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import { mapInboxFromRow, mapInboxToRow } from './repositoryMappers'

export const inboxRepository = {
  async list(userId: string): Promise<InboxItem[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().inboxItems.filter((item) => item.userId === userId)
    }

    const { data, error } = await supabase
      .from('inbox_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapInboxFromRow)
  },

  async replaceAll(userId: string, inboxItems: InboxItem[]) {
    const userInboxItems = inboxItems.filter((item) => item.userId === userId)
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        inboxItems: [
          ...userInboxItems,
          ...getLocalState().inboxItems.filter((item) => item.userId !== userId),
        ],
      })
      return
    }

    const { error } = await supabase
      .from('inbox_items')
      .upsert(userInboxItems.map(mapInboxToRow))

    if (error) {
      throw error
    }
  },
}
