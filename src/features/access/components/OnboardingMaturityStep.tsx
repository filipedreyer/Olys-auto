type OnboardingMaturityStepProps = {
  index: number
  title: string
  description: string
}

export function OnboardingMaturityStep({
  index,
  title,
  description,
}: OnboardingMaturityStepProps) {
  return (
    <article className="onboarding-maturity-step">
      <span>{index}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </article>
  )
}
