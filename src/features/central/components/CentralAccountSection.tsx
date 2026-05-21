import { OlysButton } from '../../../design-system'
import type { AuthStatus } from '../../../shared/auth/AuthProvider'
import { CentralGovernedFlow } from './CentralGovernedFlow'

type CentralAccountSectionProps = {
  status: AuthStatus
  mode: 'supabase' | 'local'
  userEmail?: string
  userId?: string
  onLogout: () => Promise<void>
}

export function CentralAccountSection({
  status,
  mode,
  userEmail,
  userId,
  onLogout,
}: CentralAccountSectionProps) {
  const accountLabel = userEmail ?? userId ?? 'Conta local/degradada'

  return (
    <section className="central-section central-account-section" aria-label="CTR07 Conta">
      <header>
        <small>CTR07</small>
        <h2>Conta</h2>
        <p>Estado mínimo de acesso e ações seguras, sem Admin e sem apagar dados.</p>
      </header>
      <dl className="central-account-section__details">
        <div>
          <dt>Estado</dt>
          <dd>{status}</dd>
        </div>
        <div>
          <dt>Modo</dt>
          <dd>{mode === 'supabase' ? 'Supabase' : 'Local/degradado'}</dd>
        </div>
        <div>
          <dt>Identificação</dt>
          <dd>{accountLabel}</dd>
        </div>
      </dl>
      <OlysButton variant="secondary" aria-label="Sair da conta" onClick={() => void onLogout()}>
        Sair
      </OlysButton>
      <div className="central-section__grid">
        <CentralGovernedFlow
          flowType="export"
          title="Exportação da conta"
          description="Exportação de conta precisa escopo, backend e geração controlada."
          consequence="Quando existir, deverá mostrar categorias incluídas antes de gerar qualquer arquivo."
          limitation="Nesta fase a Central não gera download."
          requiresBackend
        />
        <CentralGovernedFlow
          flowType="deletion"
          title="Exclusão da conta"
          description="Exclusão de conta exige confirmação forte, retenção declarada e backend seguro."
          consequence="Quando existir, poderá remover conta e dados conforme política explícita."
          limitation="Nesta fase a Central não exclui conta nem dados operacionais."
          requiresBackend
          dangerous
        />
      </div>
    </section>
  )
}
