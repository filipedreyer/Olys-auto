import { DependencyEdge } from '../../domain/entities/types'
import { getSupabaseClient } from '../../lib/supabase/client'
import { getLocalState, replaceLocalState } from './localPersistence'
import { mapDependencyFromRow, mapDependencyToRow } from './repositoryMappers'

export const dependenciesRepository = {
  async list(userId: string): Promise<DependencyEdge[]> {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return getLocalState().dependencies.filter((edge) => edge.userId === userId)
    }

    const { data, error } = await supabase
      .from('dependency_edges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map(mapDependencyFromRow)
  },

  async create(edge: DependencyEdge) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        dependencies: [edge, ...getLocalState().dependencies],
      })
      return
    }

    const { error } = await supabase
      .from('dependency_edges')
      .insert(mapDependencyToRow(edge))

    if (error) {
      throw error
    }
  },

  async update(edge: DependencyEdge) {
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        dependencies: getLocalState().dependencies.map((candidate) =>
          candidate.id === edge.id && candidate.userId === edge.userId
            ? edge
            : candidate,
        ),
      })
      return
    }

    const { error } = await supabase
      .from('dependency_edges')
      .update(mapDependencyToRow(edge))
      .eq('user_id', edge.userId)
      .eq('id', edge.id)

    if (error) {
      throw error
    }
  },

  async replaceAll(userId: string, dependencies: DependencyEdge[]) {
    const userDependencies = dependencies.filter((edge) => edge.userId === userId)
    const supabase = getSupabaseClient()

    if (!supabase) {
      replaceLocalState({
        dependencies: [
          ...userDependencies,
          ...getLocalState().dependencies.filter((edge) => edge.userId !== userId),
        ],
      })
      return
    }

    const { error } = await supabase
      .from('dependency_edges')
      .upsert(userDependencies.map(mapDependencyToRow))

    if (error) {
      throw error
    }
  },
}
