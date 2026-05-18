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

  async replaceAll(userId: string, dailySessions: DailySession[]) {
    const userSessions = dailySessions.filter(
      (session) => session.userId === userId,
    )
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        dailySessions: [
          ...userSessions,
          ...getLocalState().dailySessions.filter(
            (session) => session.userId !== userId,
          ),
        ],
      })
      return
    }

    const { error } = await supabase
      .from('daily_sessions')
      .upsert(userSessions.map(mapDailySessionToRow))

    if (error) {
      throw error
    }
  },
}
