import { NavLink } from 'react-router-dom'

type TodayHeaderProps = {
  dayState: string
  attentionSummary?: string
}

export function TodayHeader({ dayState, attentionSummary }: TodayHeaderProps) {
  return (
    <header className="today-header">
      <div className="today-header__topline">
        <nav className="fazer-tabs" aria-label="Fazer">
          <NavLink to="/fazer/hoje">Hoje</NavLink>
          <NavLink to="/fazer/timeline">Timeline</NavLink>
        </nav>
        <span className="day-state">{dayState}</span>
      </div>

      <div className="today-header__body">
        <small>Fazer</small>
        <h1>Pressão, direção e próximo movimento</h1>
        <p>{attentionSummary ?? 'Sem leitura registrada'}</p>
      </div>
    </header>
  )
}
