export type AiState =
  | 'unavailable'
  | 'processing'
  | 'ready'
  | 'pending_suggestion'
  | 'needs_confirmation'
  | 'low_confidence'
  | 'fallback'

export type AiSuggestion = {
  id: string
  state: AiState
  title: string
  body: string
  proposedAction: string
  confidence: 'low' | 'medium' | 'high'
}

export const contextualIdeaSuggestion: AiSuggestion = {
  id: 'idea-release-risk',
  state: 'pending_suggestion',
  title: 'Idea contextual',
  body: 'Ha um bloqueio afetando a sequencia da Timeline. A acao sugerida e revisar escopo antes de puxar mais trabalho para agora.',
  proposedAction: 'Marcar bloqueio para decisao operacional',
  confidence: 'medium',
}
