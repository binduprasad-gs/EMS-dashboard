"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material"
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarMonthIcon,
  Work as WorkIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useLeaves } from "../../contexts/LeaveContext"
import { useAttendance } from "../../contexts/AttendanceContext"
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

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const { employees, getDepartments } = useEmployees()
  const { leaves, getPendingLeaves, getLeavesByEmployee } = useLeaves()
  const { getAttendanceStats } = useAttendance()
  const navigate = useNavigate()
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    pendingLeaves: 0,
    attendanceRate: 0,
  })

  const [departmentData, setDepartmentData] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [userLeaves, setUserLeaves] = useState([])

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    // Calculate dashboard stats
    const activeEmployees = employees.filter((emp) => emp.status === "Active").length
    const departments = getDepartments().length
    const pendingLeaves = getPendingLeaves().length
    const attendanceStats = getAttendanceStats()

    setStats({
      totalEmployees: employees.length,
      activeEmployees,
      departments,
      pendingLeaves,
      attendanceRate: attendanceStats.presentPercentage.toFixed(1),
    })

    // Prepare department data for chart
    const deptData = getDepartments().map((dept) => {
      const count = employees.filter((emp) => emp.department === dept).length
      return { name: dept, value: count }
    })
    setDepartmentData(deptData)

    // Prepare attendance data for chart
    setAttendanceData([
      { name: "Present", value: attendanceStats.presentCount },
      { name: "Absent", value: attendanceStats.absentCount },
      { name: "Late", value: attendanceStats.lateCount },
    ])

    // Get user's leaves if not admin
    if (!isAdmin() && user) {
      setUserLeaves(getLeavesByEmployee(user.id))
    }
  }, [employees, leaves, user, isAdmin])

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 8, // Use boxShadow instead of elevation for hover effects
              },
              boxShadow: 2, // Use boxShadow instead of elevation prop
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Employees
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {stats.totalEmployees}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {stats.activeEmployees} active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 8, // Use boxShadow instead of elevation for hover effects
              },
              boxShadow: 2, // Use boxShadow instead of elevation prop
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Departments
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {stats.departments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Active departments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "secondary.light" }}>
                  <WorkIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.success.main}`,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 8, // Use boxShadow instead of elevation for hover effects
              },
              boxShadow: 2, // Use boxShadow instead of elevation prop
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Leaves
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {stats.pendingLeaves}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Awaiting approval
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.light" }}>
                  <EventNoteIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.warning.main}`,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 8, // Use boxShadow instead of elevation for hover effects
              },
              boxShadow: 2, // Use boxShadow instead of elevation prop
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Attendance Rate
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {stats.attendanceRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Overall presence
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "warning.light" }}>
                  <AccessTimeIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Department Distribution */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 2,
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 8,
              },
            }}
          >
            <CardHeader
              title="Department Distribution"
              action={
                <IconButton aria-label="settings" onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
              <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
            </Menu>
            <Divider />
            <CardContent>
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

        {/* Attendance Overview */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 2,
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 8,
              },
            }}
          >
            <CardHeader
              title="Attendance Overview"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
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

        {/* Recent Activities or Pending Approvals */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 2,
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 8,
              },
            }}
          >
            <CardHeader
              title={isAdmin() ? "Pending Leave Approvals" : "Your Recent Leaves"}
              action={
                <Button size="small" color="primary" onClick={() => navigate("/leave")}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List sx={{ width: "100%" }}>
                {isAdmin()
                  ? getPendingLeaves()
                      .slice(0, 5)
                      .map((leave) => (
                        <ListItem
                          key={leave.id}
                          secondaryAction={
                            <Box>
                              <Button size="small" color="success" variant="outlined" sx={{ mr: 1 }}>
                                Approve
                              </Button>
                              <Button size="small" color="error" variant="outlined">
                                Reject
                              </Button>
                            </Box>
                          }
                          sx={{
                            mb: 1,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            boxShadow: 1,
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={leave.employeeName}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {leave.type}
                                </Typography>
                                {` — ${leave.startDate} to ${leave.endDate}`}
                              </>
                            }
                          />
                        </ListItem>
                      ))
                  : userLeaves.slice(0, 5).map((leave) => (
                      <ListItem
                        key={leave.id}
                        secondaryAction={
                          <Chip
                            label={leave.status}
                            color={
                              leave.status === "Approved"
                                ? "success"
                                : leave.status === "Rejected"
                                  ? "error"
                                  : "warning"
                            }
                            size="small"
                          />
                        }
                        sx={{
                          mb: 1,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                          boxShadow: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <CalendarMonthIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={leave.type} secondary={`${leave.startDate} to ${leave.endDate}`} />
                      </ListItem>
                    ))}
                {((isAdmin() && getPendingLeaves().length === 0) || (!isAdmin() && userLeaves.length === 0)) && (
                  <ListItem>
                    <ListItemText primary="No records found" secondary="There are no items to display at this time." />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Employees or Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 2,
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 8,
              },
            }}
          >
            <CardHeader
              title={isAdmin() ? "Recent Employees" : "Quick Actions"}
              action={
                isAdmin() && (
                  <Button size="small" color="primary" onClick={() => navigate("/employees")}>
                    View All
                  </Button>
                )
              }
            />
            <Divider />
            <CardContent>
              {isAdmin() ? (
                <List sx={{ width: "100%" }}>
                  {employees.slice(0, 5).map((employee) => (
                    <ListItem
                      key={employee.id}
                      secondaryAction={
                        <IconButton edge="end" aria-label="view" onClick={() => navigate(`/employees/${employee.id}`)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      sx={{
                        mb: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={employee.name} src={employee.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={employee.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {employee.role}
                            </Typography>
                            {` — ${employee.department}`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<AccessTimeIcon />}
                      onClick={() => navigate("/attendance")}
                      sx={{ height: "100%" }}
                    >
                      Mark Attendance
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      startIcon={<EventNoteIcon />}
                      onClick={() => navigate("/leave")}
                      sx={{ height: "100%" }}
                    >
                      Apply for Leave
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="success"
                      fullWidth
                      startIcon={<PersonIcon />}
                      onClick={() => navigate("/profile")}
                      sx={{ height: "100%" }}
                    >
                      View Profile
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="warning"
                      fullWidth
                      startIcon={<TrendingUpIcon />}
                      onClick={() => navigate("/reports")}
                      sx={{ height: "100%" }}
                    >
                      View Reports
                    </Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

