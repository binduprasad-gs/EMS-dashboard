"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material"
import {
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from "@mui/icons-material"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useLeaves } from "../../contexts/LeaveContext"
import { useAttendance } from "../../contexts/AttendanceContext"
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Reports() {
  const { employees, getDepartments } = useEmployees()
  const { leaves } = useLeaves()
  const { attendance, getAttendanceStats } = useAttendance()
  const { user, isAdmin } = useAuth()
  const theme = useTheme()

  const [tabValue, setTabValue] = useState(0)
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  const [departmentData, setDepartmentData] = useState([])
  const [leaveData, setLeaveData] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [employeePerformanceData, setEmployeePerformanceData] = useState([])

  useEffect(() => {
    // Prepare department data
    const deptData = getDepartments().map((dept) => {
      const count = employees.filter((emp) => emp.department === dept).length
      return { name: dept, value: count }
    })
    setDepartmentData(deptData)

    // Prepare leave data
    const leaveTypes = [...new Set(leaves.map((leave) => leave.type))]
    const leaveByType = leaveTypes.map((type) => {
      const count = leaves.filter((leave) => leave.type === type).length
      return { name: type, value: count }
    })
    setLeaveData(leaveByType)

    // Prepare attendance data
    const attendanceStats = getAttendanceStats()
    setAttendanceData([
      { name: "Present", value: attendanceStats.presentCount },
      { name: "Absent", value: attendanceStats.absentCount },
      { name: "Late", value: attendanceStats.lateCount },
    ])

    // Prepare employee performance data (sample data)
    const performanceData = employees.slice(0, 5).map((emp) => ({
      name: emp.name,
      attendance: Math.floor(Math.random() * 30) + 70, // Random value between 70-100
      productivity: Math.floor(Math.random() * 40) + 60, // Random value between 60-100
      projects: Math.floor(Math.random() * 5) + 1, // Random value between 1-5
    }))
    setEmployeePerformanceData(performanceData)
  }, [employees, leaves, attendance])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>

        <Box>
          <IconButton color="primary" title="Download Report">
            <DownloadIcon />
          </IconButton>
          <IconButton color="primary" title="Print Report">
            <PrintIcon />
          </IconButton>
          <IconButton color="primary" title="Share Report">
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Filters */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <FilterListIcon color="action" />
            <Typography variant="body1" sx={{ mr: 1 }}>
              Filter Reports:
            </Typography>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="department-filter-label">Department</InputLabel>
              <Select
                labelId="department-filter-label"
                id="department-filter"
                value={filterDepartment}
                label="Department"
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {getDepartments().map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterDateRange.startDate}
              onChange={(e) => setFilterDateRange({ ...filterDateRange, startDate: e.target.value })}
            />

            <TextField
              label="End Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterDateRange.endDate}
              onChange={(e) => setFilterDateRange({ ...filterDateRange, endDate: e.target.value })}
            />

            <Button variant="contained" color="primary" size="small">
              Apply Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="report tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" />
            <Tab label="Employee Distribution" />
            <Tab label="Leave Analysis" />
            <Tab label="Attendance Trends" />
            <Tab label="Performance Metrics" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Leave Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={leaveData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill={theme.palette.primary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attendance Overview
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={theme.palette.success.main} />
                          <Cell fill={theme.palette.error.main} />
                          <Cell fill={theme.palette.warning.main} />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} days`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Employee Performance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={employeePerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" name="Attendance %" fill={theme.palette.success.main} />
                        <Bar dataKey="productivity" name="Productivity %" fill={theme.palette.primary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Employee Distribution Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Role Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Manager", value: employees.filter((emp) => emp.role.includes("Manager")).length },
                          {
                            name: "Developer",
                            value: employees.filter((emp) => emp.role.includes("Developer")).length,
                          },
                          { name: "Designer", value: employees.filter((emp) => emp.role.includes("Designer")).length },
                          { name: "HR", value: employees.filter((emp) => emp.role.includes("HR")).length },
                          {
                            name: "Marketing",
                            value: employees.filter((emp) => emp.role.includes("Marketing")).length,
                          },
                          { name: "Finance", value: employees.filter((emp) => emp.role.includes("Finance")).length },
                          {
                            name: "Other",
                            value: employees.filter(
                              (emp) =>
                                !emp.role.includes("Manager") &&
                                !emp.role.includes("Developer") &&
                                !emp.role.includes("Designer") &&
                                !emp.role.includes("HR") &&
                                !emp.role.includes("Marketing") &&
                                !emp.role.includes("Finance"),
                            ).length,
                          },
                        ]}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Employees" fill={theme.palette.primary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Leave Analysis Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Leave Types Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaveData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {leaveData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} leaves`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Leave Status
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Approved", value: leaves.filter((leave) => leave.status === "Approved").length },
                          { name: "Pending", value: leaves.filter((leave) => leave.status === "Pending").length },
                          { name: "Rejected", value: leaves.filter((leave) => leave.status === "Rejected").length },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill={theme.palette.primary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Leave Trends
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: "Jan", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Feb", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Mar", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Apr", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "May", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Jun", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Jul", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Aug", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Sep", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Oct", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Nov", value: Math.floor(Math.random() * 20) + 5 },
                          { name: "Dec", value: Math.floor(Math.random() * 20) + 5 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Leave Requests"
                          stroke={theme.palette.primary.main}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Attendance Trends Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attendance Status
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={theme.palette.success.main} />
                          <Cell fill={theme.palette.error.main} />
                          <Cell fill={theme.palette.warning.main} />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} days`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department-wise Attendance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDepartments().map((dept) => ({
                          name: dept,
                          present: Math.floor(Math.random() * 30) + 70, // Random value between 70-100
                          absent: Math.floor(Math.random() * 30), // Random value between 0-30
                        }))}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" name="Present %" fill={theme.palette.success.main} />
                        <Bar dataKey="absent" name="Absent %" fill={theme.palette.error.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Attendance Trends
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { name: "Jan", present: 85, absent: 15 },
                          { name: "Feb", present: 88, absent: 12 },
                          { name: "Mar", present: 90, absent: 10 },
                          { name: "Apr", present: 92, absent: 8 },
                          { name: "May", present: 87, absent: 13 },
                          { name: "Jun", present: 89, absent: 11 },
                          { name: "Jul", present: 91, absent: 9 },
                          { name: "Aug", present: 93, absent: 7 },
                          { name: "Sep", present: 90, absent: 10 },
                          { name: "Oct", present: 88, absent: 12 },
                          { name: "Nov", present: 86, absent: 14 },
                          { name: "Dec", present: 84, absent: 16 },
                        ]}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="present"
                          name="Present %"
                          stackId="1"
                          stroke={theme.palette.success.main}
                          fill={theme.palette.success.light}
                        />
                        <Area
                          type="monotone"
                          dataKey="absent"
                          name="Absent %"
                          stackId="1"
                          stroke={theme.palette.error.main}
                          fill={theme.palette.error.light}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Metrics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Employee Performance Metrics
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={employeePerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" name="Attendance %" fill={theme.palette.success.main} />
                        <Bar dataKey="productivity" name="Productivity %" fill={theme.palette.primary.main} />
                        <Bar dataKey="projects" name="Projects" fill={theme.palette.secondary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department Performance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={getDepartments().map((dept) => ({
                          department: dept,
                          attendance: Math.floor(Math.random() * 30) + 70,
                          productivity: Math.floor(Math.random() * 40) + 60,
                          projects: Math.floor(Math.random() * 5) + 1,
                          teamwork: Math.floor(Math.random() * 30) + 70,
                          innovation: Math.floor(Math.random() * 40) + 60,
                        }))}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="department" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="productivity"
                          stroke={theme.palette.primary.main}
                          fill={theme.palette.primary.main}
                          fillOpacity={0.6}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Productivity Trends
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: "Jan", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Feb", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Mar", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Apr", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "May", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Jun", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Jul", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Aug", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Sep", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Oct", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Nov", productivity: Math.floor(Math.random() * 20) + 70 },
                          { name: "Dec", productivity: Math.floor(Math.random() * 20) + 70 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="productivity"
                          name="Productivity %"
                          stroke={theme.palette.primary.main}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  )
}

