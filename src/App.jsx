import { ThemeProvider, CssBaseline } from "@mui/material"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

// Layouts
import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"

// Pages
import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import EmployeeDirectory from "./pages/employees/EmployeeDirectory"
import EmployeeDetails from "./pages/employees/EmployeeDetails"
import LeaveManagement from "./pages/leave/LeaveManagement"
import AttendanceTracking from "./pages/attendance/AttendanceTracking"
import Reports from "./pages/reports/Reports"
import Profile from "./pages/profile/Profile"
import NotFound from "./pages/NotFound"

// Context
import { AuthProvider } from "./contexts/AuthContext"
import { EmployeeProvider } from "./contexts/EmployeeContext"
import { LeaveProvider } from "./contexts/LeaveContext"
import { AttendanceProvider } from "./contexts/AttendanceContext"

// Theme
import theme from "./theme"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <EmployeeProvider>
            <LeaveProvider>
              <AttendanceProvider>
                <Router>
                  <Routes>
                    {/* Auth Routes */}
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<Login />} />
                    </Route>

                    {/* Dashboard Routes */}
                    <Route element={<DashboardLayout />}>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/employees" element={<EmployeeDirectory />} />
                      <Route path="/employees/:id" element={<EmployeeDetails />} />
                      <Route path="/leave" element={<LeaveManagement />} />
                      <Route path="/attendance" element={<AttendanceTracking />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              </AttendanceProvider>
            </LeaveProvider>
          </EmployeeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App

