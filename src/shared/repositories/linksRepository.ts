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

  async create(link: EntityLink) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        links: [link, ...getLocalState().links],
      })
      return
    }

    const { error } = await supabase
      .from('entity_links')
      .insert(mapLinkToRow(link))

    if (error) {
      throw error
    }
  },

  async update(link: EntityLink) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        links: getLocalState().links.map((candidate) =>
          candidate.id === link.id && candidate.userId === link.userId
            ? link
            : candidate,
        ),
      })
      return
    }

    const { error } = await supabase
      .from('entity_links')
      .update(mapLinkToRow(link))
      .eq('user_id', link.userId)
      .eq('id', link.id)

    if (error) {
      throw error
    }
  },

}
