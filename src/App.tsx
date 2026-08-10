import { useState, useEffect } from 'react'
import { CompounderDeskPage } from './pages/CompounderDeskPage'
import { DoctorDeskPage } from './pages/DoctorDeskPage'
import { JointChartPage } from './pages/JointChartPage'
import { UploadLabReportPage } from './pages/UploadLabReportPage'
import { RheumatDiagnosisPage } from './pages/RheumatDiagnosisPage'
import { LoginPage } from './pages/LoginPage'
import { getStoredUser, clearAuthSession, UserProfile } from './services/auth'

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser())
  const [view, setView] = useState<'login' | 'compounder' | 'doctor' | 'joint-chart' | 'upload-lab-report' | 'rheumat-diagnosis'>(() => {
    const saved = getStoredUser()
    if (!saved) return 'login'
    return saved.role === 'COMPOUNDER' ? 'compounder' : 'doctor'
  })

  useEffect(() => {
    if (!user) {
      setView('login')
    }
  }, [user])

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser)
    if (loggedInUser.role === 'COMPOUNDER') {
      setView('compounder')
    } else {
      setView('doctor')
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    setUser(null)
    setView('login')
  }

  if (view === 'login' || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  if (view === 'rheumat-diagnosis') {
    return <RheumatDiagnosisPage onBackToDashboard={() => setView(user.role === 'COMPOUNDER' ? 'compounder' : 'doctor')} />
  }

  if (view === 'upload-lab-report') {
    return <UploadLabReportPage onBackToDashboard={() => setView(user.role === 'COMPOUNDER' ? 'compounder' : 'doctor')} />
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
        onOpenRheumDiagnosis={() => setView('rheumat-diagnosis')}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <CompounderDeskPage
      onSwitchDoctor={() => setView('doctor')}
      onOpenUploadLabReport={() => setView('upload-lab-report')}
      onLogout={handleLogout}
    />
  )
}
