import { useAuth } from '../../../shared/auth/AuthProvider'
import { CentralAccountSection } from '../components/CentralAccountSection'
import { CentralAiTransparencySection } from '../components/CentralAiTransparencySection'
import { CentralDataPrivacySection } from '../components/CentralDataPrivacySection'
import { CentralGuideSection } from '../components/CentralGuideSection'
import { CentralHeader } from '../components/CentralHeader'
import { CentralMessagesSection } from '../components/CentralMessagesSection'
import { CentralPreferencesSection } from '../components/CentralPreferencesSection'
import { CentralSectionGrid } from '../components/CentralSectionGrid'
import { CentralSupportSection } from '../components/CentralSupportSection'

export function CentralScreen() {
  const { status, mode, user, logout } = useAuth()

  return (
    <div className="central-screen">
      <CentralHeader />
      <CentralSectionGrid />
      <CentralGuideSection />
      <CentralMessagesSection />
      <CentralDataPrivacySection />
      <CentralPreferencesSection />
      <CentralAiTransparencySection />
      <CentralSupportSection />
      <CentralAccountSection
        status={status}
        mode={mode}
        userEmail={user?.email}
        userId={user?.id}
        onLogout={logout}
      />
    </div>
  )
}
