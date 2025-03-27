"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material"
import Grid from '@mui/material/Grid';
import {
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { useAttendance } from "../../contexts/AttendanceContext"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useAuth } from "../../contexts/AuthContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AttendanceTracking() {
  const { attendance, markAttendance, markAbsent, getAttendanceByEmployee, getAttendanceByDate, getAttendanceStats } =
    useAttendance()
  const { employees } = useEmployees()
  const { user, isAdmin } = useAuth()
  const theme = useTheme()

  const [tabValue, setTabValue] = useState(0)
  const [openMarkDialog, setOpenMarkDialog] = useState(false)
  const [openAbsentDialog, setOpenAbsentDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEmployee, setSelectedEmployee] = useState(user?.id || "")
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")
  const [filterEmployee, setFilterEmployee] = useState("all")
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0])
  const [filteredAttendance, setFilteredAttendance] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Filter attendance based on role and filters
    let filtered = []

    if (isAdmin()) {
      if (filterEmployee === "all") {
        filtered = [...attendance]
      } else {
        filtered = attendance.filter((record) => record.employeeId === Number.parseInt(filterEmployee))
      }
    } else if (user) {
      filtered = getAttendanceByEmployee(user.id)
    }

    // Apply date filter if not 'all'
    if (filterDate !== "all") {
      filtered = filtered.filter((record) => record.date === filterDate)
    }

    setFilteredAttendance(filtered)

    // Calculate attendance stats
    const stats = isAdmin()
      ? getAttendanceStats(filterEmployee !== "all" ? Number.parseInt(filterEmployee) : null)
      : getAttendanceStats(user?.id)

    setAttendanceStats(stats)
  }, [attendance, user, isAdmin, filterEmployee, filterDate])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleMarkAttendance = () => {
    if (isAdmin()) {
      const employee = employees.find((emp) => emp.id === Number.parseInt(selectedEmployee))
      markAttendance(Number.parseInt(selectedEmployee), employee?.name || "", checkInTime, checkOutTime)
    } else {
      markAttendance(user.id, user.name, checkInTime, checkOutTime)
    }

    setCheckInTime("")
    setCheckOutTime("")
    setOpenMarkDialog(false)
  }

  const handleMarkAbsent = () => {
    if (isAdmin()) {
      const employee = employees.find((emp) => emp.id === Number.parseInt(selectedEmployee))
      markAbsent(Number.parseInt(selectedEmployee), employee?.name || "", selectedDate)
    } else {
      markAbsent(user.id, user.name, selectedDate)
    }

    setOpenAbsentDialog(false)
  }

  const handleQuickCheckIn = () => {
    setIsCheckingIn(true)
    setTimeout(() => {
      markAttendance(user.id, user.name)
      setIsCheckingIn(false)
    }, 1500)
  }

  const handleQuickCheckOut = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0]
      const todayRecord = attendance.find((record) => record.employeeId === user.id && record.date === today)

      if (todayRecord) {
        markAttendance(user.id, user.name, todayRecord.checkIn)
      } else {
        markAttendance(user.id, user.name)
      }

      setIsCheckingOut(false)
    }, 1500)
  }

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split("T")[0]
    return attendance.find((record) => record.employeeId === user?.id && record.date === today)
  }

  const COLORS = [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Tracking
        </Typography>

        <Box>
          {isAdmin() ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AccessTimeIcon />}
                onClick={() => setOpenMarkDialog(true)}
                sx={{ mr: 2 }}
              >
                Mark Attendance
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => setOpenAbsentDialog(true)}
              >
                Mark Absent
              </Button>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">Current Time: {currentTime}</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={isCheckingIn ? <CircularProgress size={20} color="inherit" /> : <AccessTimeIcon />}
                onClick={handleQuickCheckIn}
                disabled={isCheckingIn || getTodayAttendance()?.checkIn}
              >
                Check In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={isCheckingOut ? <CircularProgress size={20} color="inherit" /> : <AccessTimeIcon />}
                onClick={handleQuickCheckOut}
                disabled={isCheckingOut || !getTodayAttendance()?.checkIn || getTodayAttendance()?.checkOut}
              >
                Check Out
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Today's Status Card for Employees */}
      {!isAdmin() && (
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs:12, md:6}}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" gutterBottom>
                    Today's Status
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <CalendarIcon color="action" sx={{ mr: 2 }} />
                    <Typography variant="body1">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>

                  {getTodayAttendance() ? (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <AccessTimeIcon color="action" sx={{ mr: 2 }} />
                        <Typography variant="body1">
                          Check In: {getTodayAttendance()?.checkIn || "Not checked in"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <AccessTimeIcon color="action" sx={{ mr: 2 }} />
                        <Typography variant="body1">
                          Check Out: {getTodayAttendance()?.checkOut || "Not checked out"}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={getTodayAttendance()?.status}
                          color={getTodayAttendance()?.status === "Present" ? "success" : "error"}
                        />
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
                      You haven't marked your attendance for today.
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs:12, md:6}}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" gutterBottom>
                    Attendance Summary
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Paper
                      elevation={1}
                      sx={{ p: 2, flex: 1, bgcolor: "success.light", color: "success.contrastText" }}
                    >
                      <Typography variant="subtitle2">Present</Typography>
                      <Typography variant="h4">{attendanceStats.presentCount || 0}</Typography>
                      <Typography variant="body2">{`${attendanceStats.presentPercentage?.toFixed(1) || 0}%`}</Typography>
                    </Paper>

                    <Paper elevation={1} sx={{ p: 2, flex: 1, bgcolor: "error.light", color: "error.contrastText" }}>
                      <Typography variant="subtitle2">Absent</Typography>
                      <Typography variant="h4">{attendanceStats.absentCount || 0}</Typography>
                      <Typography variant="body2">{`${attendanceStats.absentPercentage?.toFixed(1) || 0}%`}</Typography>
                    </Paper>

                    <Paper
                      elevation={1}
                      sx={{ p: 2, flex: 1, bgcolor: "warning.light", color: "warning.contrastText" }}
                    >
                      <Typography variant="subtitle2">Late</Typography>
                      <Typography variant="h4">{attendanceStats.lateCount || 0}</Typography>
                      <Typography variant="body2">{`${attendanceStats.latePercentage?.toFixed(1) || 0}%`}</Typography>
                    </Paper>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tabs and Filters */}
      <Card elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="attendance tabs">
            <Tab label="Attendance Records" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Filters */}
        <Box
          sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", bgcolor: "background.default" }}
        >
          <FilterListIcon color="action" />
          <Typography variant="body2" sx={{ mr: 1 }}>
            Filter by:
          </Typography>

          {isAdmin() && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="employee-filter-label">Employee</InputLabel>
              <Select
                labelId="employee-filter-label"
                id="employee-filter"
                value={filterEmployee}
                label="Employee"
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="date-filter-label">Date</InputLabel>
            <Select
              labelId="date-filter-label"
              id="date-filter"
              value={filterDate}
              label="Date"
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value={new Date().toISOString().split("T")[0]}>Today</MenuItem>
              {/* Add more date options as needed */}
            </Select>
          </FormControl>
        </Box>

        {/* Attendance Records Tab */}
        <TabPanel value={tabValue} index={0}>
          {filteredAttendance.length > 0 ? (
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 800 }}>
                <Box sx={{ display: "flex", fontWeight: "bold", p: 2, bgcolor: "background.default" }}>
                  {isAdmin() && <Box sx={{ flex: 2 }}>Employee</Box>}
                  <Box sx={{ flex: 2 }}>Date</Box>
                  <Box sx={{ flex: 2 }}>Check In</Box>
                  <Box sx={{ flex: 2 }}>Check Out</Box>
                  <Box sx={{ flex: 1 }}>Status</Box>
                  <Box sx={{ flex: 1 }}>Work Hours</Box>
                </Box>
                <Divider />

                {filteredAttendance.map((record) => (
                  <Box key={record.id}>
                    <Box sx={{ display: "flex", p: 2, "&:hover": { bgcolor: "action.hover" } }}>
                      {isAdmin() && <Box sx={{ flex: 2 }}>{record.employeeName}</Box>}
                      <Box sx={{ flex: 2 }}>{record.date}</Box>
                      <Box sx={{ flex: 2 }}>{record.checkIn || "N/A"}</Box>
                      <Box sx={{ flex: 2 }}>{record.checkOut || "N/A"}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Chip
                          label={record.status}
                          size="small"
                          color={record.status === "Present" ? "success" : "error"}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>{record.workHours}</Box>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <Typography variant="body1" color="text.secondary">
                No attendance records found matching your filters.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={{ xs:12, md:6}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attendance Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Present", value: attendanceStats.presentCount || 0 },
                            { name: "Absent", value: attendanceStats.absentCount || 0 },
                            { name: "Late", value: attendanceStats.lateCount || 0 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} days`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs:12, md:6}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Work Hours Analysis
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredAttendance
                          .filter((record) => record.status === "Present")
                          .slice(0, 7)
                          .map((record) => ({
                            date: record.date,
                            hours: record.workHours,
                          }))}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hours" name="Work Hours" fill={theme.palette.primary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Mark Attendance Dialog */}
      <Dialog open={openMarkDialog} onClose={() => setOpenMarkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Mark Attendance
          <IconButton
            aria-label="close"
            onClick={() => setOpenMarkDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {isAdmin() && (
              <Grid size={{ xs:12}}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    label="Employee"
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs:12, sm:6}}>
              <TextField
                label="Check In Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs:12, sm:6}}>
              <TextField
                label="Check Out Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs:12}}>
              <Typography variant="body2" color="text.secondary">
                Note: Leave fields empty to use the current time.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMarkDialog(false)}>Cancel</Button>
          <Button
            onClick={handleMarkAttendance}
            variant="contained"
            color="primary"
            disabled={isAdmin() && !selectedEmployee}
          >
            Mark Attendance
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark Absent Dialog */}
      <Dialog open={openAbsentDialog} onClose={() => setOpenAbsentDialog(false)}>
        <DialogTitle>Mark as Absent</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {isAdmin() && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    label="Employee"
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs:12}}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAbsentDialog(false)}>Cancel</Button>
          <Button
            onClick={handleMarkAbsent}
            color="error"
            variant="contained"
            disabled={isAdmin() && !selectedEmployee}
          >
            Mark Absent
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

