import { useState } from 'react'
import { CompounderDeskPage } from './pages/CompounderDeskPage'
import { DoctorDeskPage } from './pages/DoctorDeskPage'
import { JointChartPage } from './pages/JointChartPage'

export default function App() {
  const [view, setView] = useState<'compounder' | 'doctor' | 'joint-chart'>('compounder')

  if (view === 'joint-chart') {
    return <JointChartPage onBackToDashboard={() => setView('doctor')} />
  }

  if (view === 'doctor') {
    return (
      <DoctorDeskPage
        onSwitchCompounder={() => setView('compounder')}
        onOpenJointChart={() => setView('joint-chart')}
      />
    )
  }

  return <CompounderDeskPage onSwitchDoctor={() => setView('doctor')} />
}
