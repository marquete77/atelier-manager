import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { LoginView } from './views/Auth/LoginView'
import { RegisterView } from './views/Auth/RegisterView'
import { DashboardView } from './views/Dashboard/DashboardView'
import { ClientsView } from './views/Clients/ClientsView'
import { ClientProfileView } from './views/Clients/ClientProfile/ClientProfileView'
import { MeasurementsView } from './views/Measurements/MeasurementsView'
import { NewProjectView } from './views/Projects/NewProjectView'
import { CalendarView } from './views/Calendar/CalendarView'
import { SettingsView } from './views/Settings/SettingsView'
import { MainLayout } from './components/layout/MainLayout'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardView />} />
              <Route path="/clients" element={<ClientsView />} />
              <Route path="/clients/:clientId" element={<ClientProfileView />} />
              <Route path="/clients/:clientId/measurements" element={<MeasurementsView />} />
              <Route path="/projects" element={<NewProjectView />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App