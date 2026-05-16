import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { initialDriverState } from './data/mockData'
import { LangProvider } from './context/LangContext'

import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import DriverDashboard from './pages/DriverDashboard'
import FinishTransport from './pages/FinishTransport'
import CancelTransport from './pages/CancelTransport'
import EditProfile from './pages/EditProfile'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [driverState, setDriverState] = useState(() => {
    const savedDriverState = localStorage.getItem('driverState')
    return savedDriverState ? JSON.parse(savedDriverState) : initialDriverState
  })

  /* Guardar usuari a localStorage quan canvia */
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  /* Guardar driverState a localStorage quan canvia */
  useEffect(() => {
    localStorage.setItem('driverState', JSON.stringify(driverState))
  }, [driverState])

  /* Funcions per login/logout amb persistència */
  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    setUser(null)
    setDriverState(initialDriverState)
    localStorage.removeItem('user')
    localStorage.removeItem('driverState')
  }

  /* Ruta protegida: redirigeix a /login si no hi ha usuari */
  function PrivateRoute({ children }) {
    return user ? children : <Navigate to="/" replace />
  }

  /* Ruta pública: redirigeix al dashboard si ja hi ha sessió */
  function PublicRoute({ children }) {
    return user ? <Navigate to="/dashboard" replace /> : children
  }

  return (
    <LangProvider>
    <BrowserRouter basename="/webIPO">
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login onLogin={handleLogin} /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DriverDashboard user={user} driverState={driverState} setDriverState={setDriverState} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/finish-transport"
          element={
            <PrivateRoute>
              <FinishTransport user={user} driverState={driverState} setDriverState={setDriverState} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cancel-transport"
          element={
            <PrivateRoute>
              <CancelTransport user={user} driverState={driverState} setDriverState={setDriverState} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile user={user} onUpdateUser={setUser} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        {/* Qualsevol altra ruta redirigeix a la home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LangProvider>
  )
}

export default App
