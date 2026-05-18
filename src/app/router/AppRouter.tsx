import { Navigate, Route, Routes } from 'react-router-dom'
import { CapturarScreen } from '../../features/capturar/screens/CapturarScreen'
import { HojeScreen } from '../../features/fazer/screens/HojeScreen'
import { TimelineScreen } from '../../features/fazer/screens/TimelineScreen'
import { InboxScreen } from '../../features/inbox/screens/InboxScreen'
import { MemoriaScreen } from '../../features/memoria/screens/MemoriaScreen'
import { PlanejarScreen } from '../../features/planejar/screens/PlanejarScreen'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fazer/hoje" replace />} />
      <Route path="/fazer" element={<Navigate to="/fazer/hoje" replace />} />
      <Route path="/fazer/hoje" element={<HojeScreen />} />
      <Route path="/fazer/timeline" element={<TimelineScreen />} />
      <Route path="/capturar" element={<CapturarScreen />} />
      <Route path="/memoria/inbox" element={<InboxScreen />} />
      <Route path="/planejar" element={<PlanejarScreen />} />
      <Route path="/memoria" element={<MemoriaScreen />} />

      <Route path="/hoje" element={<Navigate to="/fazer/hoje" replace />} />
      <Route path="/timeline" element={<Navigate to="/fazer/timeline" replace />} />
      <Route path="/inbox" element={<Navigate to="/memoria/inbox" replace />} />
      <Route path="*" element={<Navigate to="/fazer/hoje" replace />} />
    </Routes>
  )
}
