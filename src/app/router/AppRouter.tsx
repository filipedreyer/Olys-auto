import { Routes, Route, Navigate } from 'react-router-dom'
import { HojeScreen } from '../../features/fazer/screens/HojeScreen'
import { TimelineScreen } from '../../features/fazer/screens/TimelineScreen'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/hoje" replace />} />
      <Route path="/hoje" element={<HojeScreen />} />
      <Route path="/timeline" element={<TimelineScreen />} />
    </Routes>
  )
}
