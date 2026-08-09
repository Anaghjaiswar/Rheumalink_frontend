import { useState } from 'react'
import { CompounderDeskPage } from './pages/CompounderDeskPage'
import { DoctorDeskPage } from './pages/DoctorDeskPage'

export default function App() {
  const [view, setView] = useState<'compounder' | 'doctor'>('compounder')

  if (view === 'doctor') {
    return <DoctorDeskPage onSwitchCompounder={() => setView('compounder')} />
  }

  return <CompounderDeskPage onSwitchDoctor={() => setView('doctor')} />
}
