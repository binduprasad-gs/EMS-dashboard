"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material"
import Grid from '@mui/material/Grid';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useLeaves } from "../../contexts/LeaveContext"
import { useAttendance } from "../../contexts/AttendanceContext"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const { getEmployee, updateEmployee } = useEmployees()
  const { getLeavesByEmployee } = useLeaves()
  const { getAttendanceStats } = useAttendance()
  const theme = useTheme()

  const [employee, setEmployee] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordError, setPasswordError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (user) {
      const employeeData = getEmployee(user.id)
      if (employeeData) {
        setEmployee(employeeData)
        setEditedEmployee(employeeData)
      }
    }
  }, [user])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleEditSave = () => {
    updateEmployee(employee.id, editedEmployee)
    setEmployee(editedEmployee)
    setOpenEditDialog(false)
    setSuccessMessage("Profile updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handlePasswordChange = () => {
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return
    }

    // Simulate password change
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setOpenPasswordDialog(false)
    setSuccessMessage("Password changed successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    })
  }

  if (!employee) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Profile Header Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{xs:12 , md:2}} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Avatar alt={employee.name} src={employee.avatar} sx={{ width: 120, height: 120 }} />
            </Grid>
            <Grid size={{xs:12 , md:8}}>
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
            <Grid size={{xs:12 , md:2}} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpenEditDialog(true)}>
                Edit Profile
              </Button>
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
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonIcon />} label="Personal Info" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SettingsIcon />} label="Settings" />
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size={{xs:12 , md:6}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Email" secondary={employee.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Phone" secondary={employee.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText primary="Address" secondary={employee.address} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{xs:12 , md:6}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Employment Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BadgeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Employee ID"
                        secondary={`EMP-${employee.id.toString().padStart(4, "0")}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText primary="Department" secondary={employee.department} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="Role" secondary={employee.role} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarIcon />
                      </ListItemIcon>
                      <ListItemText primary="Join Date" secondary={employee.joinDate} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{xs:12}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skills & Expertise
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
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
                        No skills listed for your profile.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={{xs:12 , md:6}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Password Management
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Your password was last changed 30 days ago.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      We recommend changing your password regularly to ensure account security.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LockIcon />}
                      onClick={() => setOpenPasswordDialog(true)}
                      sx={{ mt: 2 }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{xs:12 , md:6}}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Two-factor authentication is currently disabled.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Enable two-factor authentication to add an extra layer of security to your account.
                    </Typography>
                    <Button variant="outlined" color="primary" startIcon={<SecurityIcon />} sx={{ mt: 2 }}>
                      Enable 2FA
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{xs:12 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Login History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem divider>
                      <ListItemText primary="Today, 09:15 AM" secondary="Chrome on Windows • IP: 192.168.1.1" />
                      <Chip label="Current Session" color="success" size="small" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary="Yesterday, 05:30 PM" secondary="Chrome on Windows • IP: 192.168.1.1" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary="Jan 15, 2024, 10:45 AM" secondary="Safari on macOS • IP: 192.168.1.2" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Jan 14, 2024, 08:20 AM" secondary="Chrome on Windows • IP: 192.168.1.1" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem divider>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive important updates and announcements via email"
                  />
                  <Chip label="Enabled" color="success" size="small" />
                </ListItem>
                <ListItem divider>
                  <ListItemText
                    primary="Leave Request Updates"
                    secondary="Get notified when your leave requests are approved or rejected"
                  />
                  <Chip label="Enabled" color="success" size="small" />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Attendance Reminders" secondary="Receive reminders to mark your attendance" />
                  <Chip label="Disabled" color="default" size="small" />
                </ListItem>
                <ListItem divider>
                  <ListItemText
                    primary="Project Assignments"
                    secondary="Get notified when you're assigned to new projects"
                  />
                  <Chip label="Enabled" color="success" size="small" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="System Notifications"
                    secondary="Receive system maintenance and update notifications"
                  />
                  <Chip label="Enabled" color="success" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem divider>
                  <ListItemText primary="Language" secondary="English (United States)" />
                  <Button size="small" color="primary">
                    Change
                  </Button>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Time Zone" secondary="(UTC-05:00) Eastern Time (US & Canada)" />
                  <Button size="small" color="primary">
                    Change
                  </Button>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Date Format" secondary="MM/DD/YYYY" />
                  <Button size="small" color="primary">
                    Change
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Theme" secondary="Light Mode" />
                  <Button size="small" color="primary">
                    Change
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{xs:12 ,sm:6}}>
              <TextField
                label="Full Name"
                fullWidth
                value={editedEmployee.name || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{xs:12 ,sm:6}}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editedEmployee.email || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{xs:12 ,sm:6}}>
              <TextField
                label="Phone"
                fullWidth
                value={editedEmployee.phone || ""}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{xs:12 ,sm:6}}>
              <TextField label="Role" fullWidth value={editedEmployee.role || ""} disabled />
            </Grid>
            <Grid size={{xs:12}}>
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
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <TextField
                label="Current Password"
                type={showPassword.current ? "text" : "password"}
                fullWidth
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  setPasswordError("")
                }}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => togglePasswordVisibility("current")} edge="end">
                      {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                label="New Password"
                type={showPassword.new ? "text" : "password"}
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                  setPasswordError("")
                }}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                      {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                label="Confirm New Password"
                type={showPassword.confirm ? "text" : "password"}
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  setPasswordError("")
                }}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                      {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            color="primary"
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


