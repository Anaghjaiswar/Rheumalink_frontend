import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react'
import { LandingPage } from './pages/LandingPage'
import { CompounderDeskPage } from './pages/CompounderDeskPage'
import { DoctorDeskPage } from './pages/DoctorDeskPage'
import { JointChartPage } from './pages/JointChartPage'
import { UploadLabReportPage } from './pages/UploadLabReportPage'
import { RheumatDiagnosisPage } from './pages/RheumatDiagnosisPage'
import { LoginPage } from './pages/LoginPage'
import {
  getStoredDoctorUser,
  getStoredDoctorToken,
  clearDoctorAuthSession,
  getStoredCompounderUser,
  getStoredCompounderToken,
  clearCompounderAuthSession,
  decodeJwtClaims,
  UserProfile,
} from './services/auth'

type RoutePath = '/' | '/doctor/login' | '/compounder/login' | '/compounder-dashboard' | '/doctor-dashboard' | '/joint-chart' | '/upload-lab-report' | '/rheumat-diagnosis'

// ── ERROR BOUNDARY TO PREVENT BLANK WHITE SCREENS ──
interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo)
  }

  private handleReset = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              ⚠️
            </div>
            <h2 className="text-xl font-800 text-slate-800">Something went wrong</h2>
            <p className="text-slate-500 text-sm font-500 leading-relaxed">
              An unexpected UI rendering error occurred. You can reset your session data and return to the main clinical portal.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left font-mono text-xs text-red-600 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-800 text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              Reset Session &amp; Reload App 🔄
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    const path = window.location.pathname as RoutePath
    if (['/', '/doctor/login', '/compounder/login', '/compounder-dashboard', '/doctor-dashboard', '/joint-chart', '/upload-lab-report', '/rheumat-diagnosis'].includes(path)) {
      return path
    }
    return '/'
  })

  const [doctorUser, setDoctorUser] = useState<UserProfile | null>(() => getStoredDoctorUser())
  const [compounderUser, setCompounderUser] = useState<UserProfile | null>(() => getStoredCompounderUser())

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as RoutePath
      if (['/', '/doctor/login', '/compounder/login', '/compounder-dashboard', '/doctor-dashboard', '/joint-chart', '/upload-lab-report', '/rheumat-diagnosis'].includes(path)) {
        setCurrentPath(path)
      } else {
        setCurrentPath('/')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (path: RoutePath) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const handleDoctorLoginSuccess = (loggedInUser: UserProfile) => {
    setDoctorUser(loggedInUser)
    navigateTo('/doctor-dashboard')
  }

  const handleCompounderLoginSuccess = (loggedInUser: UserProfile) => {
    setCompounderUser(loggedInUser)
    navigateTo('/compounder-dashboard')
  }

  const handleDoctorLogout = () => {
    clearDoctorAuthSession()
    setDoctorUser(null)
    navigateTo('/')
  }

  const handleCompounderLogout = () => {
    clearCompounderAuthSession()
    setCompounderUser(null)
    navigateTo('/')
  }

  let renderContent = null

  // 1. Root Route '/' -> Clinic Landing Page
  if (currentPath === '/') {
    renderContent = (
      <LandingPage
        onSelectDoctorPortal={() => {
          const token = getStoredDoctorToken()
          const claims = token ? decodeJwtClaims(token) : null
          if (token && claims?.role === 'DOCTOR') {
            navigateTo('/doctor-dashboard')
          } else {
            navigateTo('/doctor/login')
          }
        }}
        onSelectCompounderPortal={() => {
          const token = getStoredCompounderToken()
          const claims = token ? decodeJwtClaims(token) : null
          if (token && (claims?.role === 'COMPOUNDER' || claims?.role === 'DOCTOR')) {
            navigateTo('/compounder-dashboard')
          } else {
            navigateTo('/compounder/login')
          }
        }}
      />
    )
  }
  // 2. Doctor Login Page (Strictly DOCTOR portal)
  else if (currentPath === '/doctor/login') {
    renderContent = (
      <LoginPage
        portalRole="DOCTOR"
        onLoginSuccess={handleDoctorLoginSuccess}
        onBackToHome={() => navigateTo('/')}
      />
    )
  }
  // 3. Compounder Login Page (Strictly COMPOUNDER portal)
  else if (currentPath === '/compounder/login') {
    renderContent = (
      <LoginPage
        portalRole="COMPOUNDER"
        onLoginSuccess={handleCompounderLoginSuccess}
        onBackToHome={() => navigateTo('/')}
      />
    )
  }
  // 4. Doctor Dashboard Portal (Strict RBAC: DOCTOR role required)
  else if (currentPath === '/doctor-dashboard') {
    const docToken = getStoredDoctorToken()
    const claims = docToken ? decodeJwtClaims(docToken) : null

    if (!docToken || claims?.role !== 'DOCTOR') {
      renderContent = (
        <LoginPage
          portalRole="DOCTOR"
          onLoginSuccess={handleDoctorLoginSuccess}
          onBackToHome={() => navigateTo('/')}
        />
      )
    } else {
      renderContent = (
        <DoctorDeskPage
          onSwitchCompounder={() => navigateTo('/compounder-dashboard')}
          onOpenJointChart={() => navigateTo('/joint-chart')}
          onOpenUploadLabReport={() => navigateTo('/upload-lab-report')}
          onOpenRheumDiagnosis={() => navigateTo('/rheumat-diagnosis')}
          onLogout={handleDoctorLogout}
        />
      )
    }
  }
  // 5. Compounder Dashboard Portal (Staff Access: COMPOUNDER or DOCTOR role permitted)
  else if (currentPath === '/compounder-dashboard') {
    const compToken = getStoredCompounderToken() || getStoredDoctorToken()
    const claims = compToken ? decodeJwtClaims(compToken) : null

    if (!compToken || (claims?.role !== 'COMPOUNDER' && claims?.role !== 'DOCTOR')) {
      renderContent = (
        <LoginPage
          portalRole="COMPOUNDER"
          onLoginSuccess={handleCompounderLoginSuccess}
          onBackToHome={() => navigateTo('/')}
        />
      )
    } else {
      renderContent = (
        <CompounderDeskPage
          onSwitchDoctor={() => {
            const docToken = getStoredDoctorToken()
            const docClaims = docToken ? decodeJwtClaims(docToken) : null
            if (docToken && docClaims?.role === 'DOCTOR') {
              navigateTo('/doctor-dashboard')
            } else {
              navigateTo('/doctor/login')
            }
          }}
          onOpenUploadLabReport={() => navigateTo('/upload-lab-report')}
          onLogout={handleCompounderLogout}
        />
      )
    }
  }
  // 6. Sub-pages
  else if (currentPath === '/joint-chart') {
    renderContent = <JointChartPage onBackToDashboard={() => navigateTo('/doctor-dashboard')} />
  }
  // 7. Rheumat Diagnosis Page
  else if (currentPath === '/rheumat-diagnosis') {
    renderContent = <RheumatDiagnosisPage onBackToDashboard={() => navigateTo('/doctor-dashboard')} />
  }
  // 8. Upload Lab Report Page
  else if (currentPath === '/upload-lab-report') {
    renderContent = <UploadLabReportPage onBackToDashboard={() => navigateTo('/doctor-dashboard')} />
  }
  else {
    renderContent = (
      <LandingPage
        onSelectDoctorPortal={() => navigateTo('/doctor/login')}
        onSelectCompounderPortal={() => navigateTo('/compounder/login')}
      />
    )
  }

  return <ErrorBoundary>{renderContent}</ErrorBoundary>
}
