import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type PwaInstallState = {
  supported: boolean
  ready: boolean
  dismissed: boolean
  install: () => Promise<void>
  dismiss: () => void
}

export function usePwaInstallState(): PwaInstallState {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  return {
    supported: typeof window !== 'undefined',
    ready: Boolean(promptEvent),
    dismissed,
    dismiss: () => setDismissed(true),
    install: async () => {
      if (!promptEvent) {
        setDismissed(true)
        return
      }

      await promptEvent.prompt()
      await promptEvent.userChoice
      setPromptEvent(null)
      setDismissed(true)
    },
  }
}
