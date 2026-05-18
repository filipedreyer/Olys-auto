import { DailySession } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import {
  mapDailySessionFromRow,
  mapDailySessionToRow,
} from './repositoryMappers'

export const dailySessionsRepository = {
  async list(userId: string): Promise<DailySession[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().dailySessions.filter(
        (session) => session.userId === userId,
      )
    }

    const { data, error } = await supabase
      .from('daily_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapDailySessionFromRow)
  },

  async create(session: DailySession) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        dailySessions: [session, ...getLocalState().dailySessions],
      })
      return
    }

    const { error } = await supabase
      .from('daily_sessions')
      .insert(mapDailySessionToRow(session))

    if (error) {
      throw error
    }
  },

  async update(session: DailySession) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        dailySessions: getLocalState().dailySessions.map((candidate) =>
          candidate.id === session.id && candidate.userId === session.userId
            ? session
            : candidate,
        ),
      })
      return
    }

    const { error } = await supabase
      .from('daily_sessions')
      .update(mapDailySessionToRow(session))
      .eq('user_id', session.userId)
      .eq('id', session.id)

    if (error) {
      throw error
    }
  },

}
