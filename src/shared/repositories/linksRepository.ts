import { EntityLink } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import { mapLinkFromRow, mapLinkToRow } from './repositoryMappers'

export const linksRepository = {
  async list(userId: string): Promise<EntityLink[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().links.filter((link) => link.userId === userId)
    }

    const { data, error } = await supabase
      .from('entity_links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapLinkFromRow)
  },

  async replaceAll(userId: string, links: EntityLink[]) {
    const userLinks = links.filter((link) => link.userId === userId)
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        links: [
          ...userLinks,
          ...getLocalState().links.filter((link) => link.userId !== userId),
        ],
      })
      return
    }

    const { error } = await supabase
      .from('entity_links')
      .upsert(userLinks.map(mapLinkToRow))

    if (error) {
      throw error
    }
  },
}
