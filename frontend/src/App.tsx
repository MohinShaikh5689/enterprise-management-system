import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashbord'
import EmployeeDashboard from './pages/employeeDashbord'
import EmployeeLists from './pages/employeeLists'
import TaskComponent from './pages/TaskComponent'
import AddEmployee from './pages/addEmployee'
import AssignTask from './pages/assignTask'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('Authtoken')
      const role = localStorage.getItem('role')
      
      if (token) {
        setIsAuthenticated(true)
        setUserRole(role)
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }
      
      setIsLoading(false)
    }

    // Check immediately
    checkAuth()
    
    window.addEventListener('storage', checkAuth)

    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>
    if (isAuthenticated && userRole === 'ADMIN') {
      return <>{children}</>
    }
    return <Navigate to="/login/admin" />
  }

  const EmployeeRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>
    if (isAuthenticated && userRole === 'EMPLOYEE') {
      return <>{children}</>
    }
    return <Navigate to="/login/employee" />
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>
    if (isAuthenticated) {
      return <>{children}</>
    }
    return <Navigate to="/login/employee" />
  }
  
  // Prevent authenticated users from accessing login pages
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>
    if (isAuthenticated) {
      return <Navigate to="/dashboard" />
    }
    return <>{children}</>
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-lg font-medium text-gray-600">
        Loading...
      </div>
    </div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login/:type" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login/employee"} />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        
        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={
          <EmployeeRoute>
            <EmployeeDashboard />
          </EmployeeRoute>
        } />

        <Route path="employee/tasks" element={
          <EmployeeRoute>
            <TaskComponent />
          </EmployeeRoute>
        } />

        <Route path="/admin/employees" element={
          <AdminRoute>
            <EmployeeLists />
          </AdminRoute>
        } />

        <Route path="/admin/employees/add" element={
          <AdminRoute>
            <AddEmployee />
          </AdminRoute>
        } />

        <Route path="/admin/tasks/assign" element={
          <AdminRoute>
            <AssignTask />
          </AdminRoute>
        } />
        
        {/* Common Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {userRole === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/employee/dashboard" />}
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App