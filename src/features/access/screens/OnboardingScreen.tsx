import { Link } from 'react-router-dom'
import { AccessCard } from '../components/AccessCard'
import { AccessShell } from '../components/AccessShell'
import { OnboardingMaturityStep } from '../components/OnboardingMaturityStep'
import { onboardingSteps } from '../domain/accessPresentation'

export function OnboardingScreen() {
  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC05"
        title="Começar com menos carga"
        description="Um começo curto para entender a maturidade do Olys, sem tutorial longo."
      >
        <div className="onboarding-screen">
          {onboardingSteps.map((step, index) => (
            <OnboardingMaturityStep
              key={step.title}
              index={index + 1}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
        <p className="access-note">
          Esta etapa ainda não persiste preferência de onboarding; ela apenas orienta a entrada.
        </p>
        <Link className="olys-button" to="/fazer/hoje">Continuar para o Hoje</Link>
      </AccessCard>
    </AccessShell>
  )
}
