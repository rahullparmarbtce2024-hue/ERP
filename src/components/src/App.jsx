import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Fees from './pages/Fees'
import Hostel from './pages/Hostel'
import Exams from './pages/Exams'
import Admin from './pages/Admin'
import Layout from './components/Layout'

const qc = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="students" element={
              <ProtectedRoute allowedRoles={['admin','super_admin','faculty','mentor']}>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="attendance" element={<Attendance />} />
            <Route path="fees" element={<Fees />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="exams" element={<Exams />} />
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin','super_admin']}>
                <Admin />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
