"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material"
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
} from "@mui/icons-material"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useLeaves } from "../../contexts/LeaveContext"
import { useAttendance } from "../../contexts/AttendanceContext"
import { useAuth } from "../../contexts/AuthContext"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function EmployeeDetails() {
  const { id } = useParams()
  const { getEmployee, updateEmployee, getDepartments } = useEmployees()
  const { getLeavesByEmployee } = useLeaves()
  const { getAttendanceByEmployee, getAttendanceStats } = useAttendance()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const [employee, setEmployee] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [attendance, setAttendance] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({})
  const [tabValue, setTabValue] = useState(0)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState({})
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const employeeData = getEmployee(id)
    if (employeeData) {
      setEmployee(employeeData)
      setEditedEmployee(employeeData)
      setLeaves(getLeavesByEmployee(employeeData.id))
      setAttendance(getAttendanceByEmployee(employeeData.id))
      setAttendanceStats(getAttendanceStats(employeeData.id))
      setDepartments(getDepartments())
    }
  }, [id])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleEditSave = () => {
    updateEmployee(employee.id, editedEmployee)
    setEmployee(editedEmployee)
    setOpenEditDialog(false)
  }

  if (!employee) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Typography variant="h6">Employee not found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/employees")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Employee Profile
        </Typography>
      </Box>

      {/* Employee Header Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Avatar alt={employee.name} src={employee.avatar} sx={{ width: 120, height: 120 }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
                <Typography variant="h5" gutterBottom>
                  {employee.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {employee.role}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mt: 1 }}>
                  <Chip icon={<WorkIcon />} label={employee.department} color="primary" variant="outlined" />
                  <Chip icon={<PersonIcon />} label={`Reports to: ${employee.manager}`} variant="outlined" />
                  <Chip icon={<CalendarIcon />} label={`Joined: ${employee.joinDate}`} variant="outlined" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {isAdmin() && (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpenEditDialog(true)}>
                  Edit Profile
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="employee tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Info" />
            <Tab label="Leave History" />
            <Tab label="Attendance" />
            <Tab label="Skills & Projects" />
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem>
                      <EmailIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary="Email" secondary={employee.email} />
                    </ListItem>
                    <ListItem>
                      <PhoneIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary="Phone" secondary={employee.phone} />
                    </ListItem>
                    <ListItem>
                      <LocationIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary="Address" secondary={employee.address} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Employment Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem>
                      <WorkIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary="Department" secondary={employee.department} />
                    </ListItem>
                    <ListItem>
                      <PersonIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary="Role" secondary={employee.role} />
                    </ListItem>
                    <ListItem>
                      <CalendarIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary="Join Date" secondary={employee.joinDate} />
                    </ListItem>
                    {isAdmin() && (
                      <ListItem>
                        <MoneyIcon color="action" sx={{ mr: 2 }} />
                        <ListItemText primary="Salary" secondary={`$${employee.salary?.toLocaleString() || "N/A"}`} />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Leave History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Leave History
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {leaves.length > 0 ? (
                <Box sx={{ overflowX: "auto" }}>
                  <Box sx={{ minWidth: 650 }}>
                    <Box sx={{ display: "flex", fontWeight: "bold", p: 2, bgcolor: "background.default" }}>
                      <Box sx={{ flex: 2 }}>Type</Box>
                      <Box sx={{ flex: 2 }}>Duration</Box>
                      <Box sx={{ flex: 3 }}>Reason</Box>
                      <Box sx={{ flex: 1 }}>Status</Box>
                      <Box sx={{ flex: 2 }}>Applied On</Box>
                    </Box>
                    <Divider />

                    {leaves.map((leave) => (
                      <Box key={leave.id}>
                        <Box sx={{ display: "flex", p: 2, "&:hover": { bgcolor: "action.hover" } }}>
                          <Box sx={{ flex: 2 }}>{leave.type}</Box>
                          <Box sx={{ flex: 2 }}>{`${leave.startDate} to ${leave.endDate}`}</Box>
                          <Box sx={{ flex: 3 }}>{leave.reason}</Box>
                          <Box sx={{ flex: 1 }}>
                            <Chip
                              label={leave.status}
                              size="small"
                              color={
                                leave.status === "Approved"
                                  ? "success"
                                  : leave.status === "Rejected"
                                    ? "error"
                                    : "warning"
                              }
                            />
                          </Box>
                          <Box sx={{ flex: 2 }}>{leave.appliedOn}</Box>
                        </Box>
                        <Divider />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 4 }}>
                  No leave records found for this employee.
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Attendance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attendance Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: "success.light", color: "success.contrastText" }}>
                      <Typography variant="subtitle2">Present</Typography>
                      <Typography variant="h4">{attendanceStats.presentCount || 0}</Typography>
                      <Typography variant="body2">{`${attendanceStats.presentPercentage?.toFixed(1) || 0}% of total`}</Typography>
                    </Paper>

                    <Paper elevation={1} sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText" }}>
                      <Typography variant="subtitle2">Absent</Typography>
                      <Typography variant="h4">{attendanceStats.absentCount || 0}</Typography>
                      <Typography variant="body2">{`${attendanceStats.absentPercentage?.toFixed(1) || 0}% of total`}</Typography>
                    </Paper>

                    <Paper elevation={1} sx={{ p: 2, bgcolor: "warning.light", color: "warning.contrastText" }}>
                      <Typography variant="subtitle2">Late</Typography>
                      <Typography variant="h4">{attendanceStats.lateCount || 0}</Typography>
                      <Typography variant="body2">{`${attendanceStats.latePercentage?.toFixed(1) || 0}% of present days`}</Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attendance Records
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {attendance.length > 0 ? (
                    <Box sx={{ overflowX: "auto" }}>
                      <Box sx={{ minWidth: 650 }}>
                        <Box sx={{ display: "flex", fontWeight: "bold", p: 2, bgcolor: "background.default" }}>
                          <Box sx={{ flex: 2 }}>Date</Box>
                          <Box sx={{ flex: 2 }}>Check In</Box>
                          <Box sx={{ flex: 2 }}>Check Out</Box>
                          <Box sx={{ flex: 1 }}>Status</Box>
                          <Box sx={{ flex: 1 }}>Hours</Box>
                        </Box>
                        <Divider />

                        {attendance.map((record) => (
                          <Box key={record.id}>
                            <Box sx={{ display: "flex", p: 2, "&:hover": { bgcolor: "action.hover" } }}>
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
                    <Typography variant="body1" align="center" sx={{ py: 4 }}>
                      No attendance records found for this employee.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Skills & Projects Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {employee.skills &&
                      employee.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="primary"
                          variant="outlined"
                          icon={<SchoolIcon />}
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    {(!employee.skills || employee.skills.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No skills listed for this employee.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Projects
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {employee.projects &&
                      employee.projects.map((project, index) => (
                        <ListItem key={index} divider={index < employee.projects.length - 1}>
                          <ListItemText primary={project} secondary="Active project" />
                        </ListItem>
                      ))}
                    {(!employee.projects || employee.projects.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No projects assigned to this employee.
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      {/* Edit Employee Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Edit Employee</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                fullWidth
                value={editedEmployee.name || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editedEmployee.email || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={editedEmployee.phone || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={editedEmployee.department || ""}
                  label="Department"
                  onChange={(e) => setEditedEmployee({ ...editedEmployee, department: e.target.value })}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role"
                fullWidth
                value={editedEmployee.role || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, role: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Join Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editedEmployee.joinDate || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, joinDate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manager"
                fullWidth
                value={editedEmployee.manager || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, manager: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary"
                type="number"
                fullWidth
                value={editedEmployee.salary || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, salary: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={editedEmployee.address || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

