import { useState } from 'react'
import { CompounderDeskPage } from './pages/CompounderDeskPage'
import { DoctorDeskPage } from './pages/DoctorDeskPage'
import { JointChartPage } from './pages/JointChartPage'
import { UploadLabReportPage } from './pages/UploadLabReportPage'

export default function App() {
  const [view, setView] = useState<'compounder' | 'doctor' | 'joint-chart' | 'upload-lab-report'>('compounder')

  if (view === 'upload-lab-report') {
    return <UploadLabReportPage onBackToDashboard={() => setView('doctor')} />
  }

  if (view === 'joint-chart') {
    return <JointChartPage onBackToDashboard={() => setView('doctor')} />
  }

  if (view === 'doctor') {
    return (
      <DoctorDeskPage
        onSwitchCompounder={() => setView('compounder')}
        onOpenJointChart={() => setView('joint-chart')}
        onOpenUploadLabReport={() => setView('upload-lab-report')}
      />
    )
  }

  return (
    <CompounderDeskPage
      onSwitchDoctor={() => setView('doctor')}
      onOpenUploadLabReport={() => setView('upload-lab-report')}
    />
  )
}
