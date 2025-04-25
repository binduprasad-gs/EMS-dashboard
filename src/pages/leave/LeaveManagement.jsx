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
  useTheme,
} from "@mui/material"
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material"
import { useLeaves } from "../../contexts/LeaveContext"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useAuth } from "../../contexts/AuthContext"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function LeaveManagement() {
  const { leaves, addLeave, updateLeaveStatus, getLeavesByEmployee } = useLeaves()
  const { employees } = useEmployees()
  const { user, isAdmin } = useAuth()
  const theme = useTheme()

  const [tabValue, setTabValue] = useState(0)
  const [openApplyDialog, setOpenApplyDialog] = useState(false)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [newLeave, setNewLeave] = useState({
    employeeId: user?.id || "",
    employeeName: user?.name || "",
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [userLeaves, setUserLeaves] = useState([])
  const [leaveStats, setLeaveStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })

  useEffect(() => {
    // Filter leaves based on role and filters
    let filtered = []

    if (isAdmin()) {
      filtered = [...leaves]
    } else if (user) {
      const userLeavesList = getLeavesByEmployee(user.id)
      setUserLeaves(userLeavesList)
      filtered = userLeavesList
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((leave) => leave.status === filterStatus)
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((leave) => leave.type === filterType)
    }

    setFilteredLeaves(filtered)

    // Calculate leave stats
    const stats = {
      pending: leaves.filter((leave) => leave.status === "Pending").length,
      approved: leaves.filter((leave) => leave.status === "Approved").length,
      rejected: leaves.filter((leave) => leave.status === "Rejected").length,
      total: leaves.length,
    }
    setLeaveStats(stats)
  }, [leaves, user, isAdmin, filterStatus, filterType])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleApplyLeave = () => {
    addLeave(newLeave)
    setNewLeave({
      employeeId: user?.id || "",
      employeeName: user?.name || "",
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
    })
    setOpenApplyDialog(false)
  }

  const handleApproveLeave = () => {
    updateLeaveStatus(selectedLeave.id, "Approved", user?.name)
    setOpenApproveDialog(false)
    setSelectedLeave(null)
  }

  const handleRejectLeave = () => {
    updateLeaveStatus(selectedLeave.id, "Rejected", user?.name)
    setOpenRejectDialog(false)
    setSelectedLeave(null)
  }

  const getLeaveTypes = () => {
    const types = [...new Set(leaves.map((leave) => leave.type))]
    return types
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Leave Management
        </Typography>

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenApplyDialog(true)}>
          Apply for Leave
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.warning.main}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {leaveStats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Awaiting approval
                  </Typography>
                </Box>
                <Chip label="Pending" color="warning" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.success.main}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Approved
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {leaveStats.approved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Leaves approved
                  </Typography>
                </Box>
                <Chip label="Approved" color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.error.main}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejected
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {leaveStats.rejected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Leaves rejected
                  </Typography>
                </Box>
                <Chip label="Rejected" color="error" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {leaveStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    All leave requests
                  </Typography>
                </Box>
                <Chip label="Total" color="primary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs and Filters */}
      <Card elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave tabs">
            <Tab label="All Leaves" />
            <Tab label="Calendar View" />
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="type-filter-label">Leave Type</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              value={filterType}
              label="Leave Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {getLeaveTypes().map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* All Leaves Tab */}
        <TabPanel value={tabValue} index={0}>
          {filteredLeaves.length > 0 ? (
            <Box sx={{ overflowX: "auto", width: "100%" }}>
              <Box sx={{ minWidth: 800, width: "100%" }}>
                <Box sx={{ display: "flex", fontWeight: "bold", p: 2, bgcolor: "background.default" }}>
                  {isAdmin() && <Box sx={{ flex: 2 }}>Employee</Box>}
                  <Box sx={{ flex: 1 }}>Type</Box>
                  <Box sx={{ flex: 2 }}>Duration</Box>
                  <Box sx={{ flex: 3 }}>Reason</Box>
                  <Box sx={{ flex: 1 }}>Status</Box>
                  <Box sx={{ flex: 1 }}>Applied On</Box>
                  <Box sx={{ flex: 2 }}>Actions</Box>
                </Box>
                <Divider />

                {filteredLeaves.map((leave) => (
                  <Box key={leave.id}>
                    <Box sx={{ display: "flex", p: 2, "&:hover": { bgcolor: "action.hover" } }}>
                      {isAdmin() && <Box sx={{ flex: 2 }}>{leave.employeeName}</Box>}
                      <Box sx={{ flex: 1 }}>{leave.type}</Box>
                      <Box sx={{ flex: 2 }}>{`${leave.startDate} to ${leave.endDate}`}</Box>
                      <Box sx={{ flex: 3 }}>{leave.reason}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Chip
                          label={leave.status}
                          size="small"
                          color={
                            leave.status === "Approved" ? "success" : leave.status === "Rejected" ? "error" : "warning"
                          }
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>{leave.appliedOn}</Box>
                      <Box sx={{ flex: 2 }}>
                        {isAdmin() && leave.status === "Pending" && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              variant="outlined"
                              startIcon={<CheckIcon />}
                              onClick={() => {
                                setSelectedLeave(leave)
                                setOpenApproveDialog(true)
                              }}
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<CloseIcon />}
                              onClick={() => {
                                setSelectedLeave(leave)
                                setOpenRejectDialog(true)
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {!isAdmin() && leave.status === "Pending" && (
                          <Typography variant="body2" color="text.secondary">
                            Awaiting approval
                          </Typography>
                        )}
                        {leave.status !== "Pending" && (
                          <Typography variant="body2" color="text.secondary">
                            {leave.status === "Approved" ? "Approved by " : "Rejected by "}
                            {leave.approvedBy} on {leave.approvedOn}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <Typography variant="body1" color="text.secondary">
                No leave requests found matching your filters.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Calendar View Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
            <Typography variant="body1" color="text.secondary">
              Calendar view will be implemented in the next phase.
            </Typography>
          </Box>
        </TabPanel>
      </Card>

      {/* Apply Leave Dialog */}
      <Dialog open={openApplyDialog} onClose={() => setOpenApplyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Apply for Leave
          <IconButton
            aria-label="close"
            onClick={() => setOpenApplyDialog(false)}
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
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={newLeave.employeeId}
                    label="Employee"
                    onChange={(e) => {
                      const employee = employees.find((emp) => emp.id === e.target.value)
                      setNewLeave({
                        ...newLeave,
                        employeeId: e.target.value,
                        employeeName: employee ? employee.name : "",
                      })
                    }}
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

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={newLeave.type}
                  label="Leave Type"
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                >
                  <MenuItem value="Vacation">Vacation</MenuItem>
                  <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                  <MenuItem value="Personal Leave">Personal Leave</MenuItem>
                  <MenuItem value="Maternity/Paternity">Maternity/Paternity</MenuItem>
                  <MenuItem value="Bereavement">Bereavement</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reason"
                fullWidth
                multiline
                rows={4}
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplyDialog(false)}>Cancel</Button>
          <Button
            onClick={handleApplyLeave}
            variant="contained"
            color="primary"
            disabled={!newLeave.type || !newLeave.startDate || !newLeave.endDate || !newLeave.reason}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Leave Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to approve the leave request for {selectedLeave?.employeeName}?</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Type:</strong> {selectedLeave?.type}
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {selectedLeave?.startDate} to {selectedLeave?.endDate}
            </Typography>
            <Typography variant="body2">
              <strong>Reason:</strong> {selectedLeave?.reason}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={handleApproveLeave} color="success" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Leave Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject the leave request for {selectedLeave?.employeeName}?</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Type:</strong> {selectedLeave?.type}
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {selectedLeave?.startDate} to {selectedLeave?.endDate}
            </Typography>
            <Typography variant="body2">
              <strong>Reason:</strong> {selectedLeave?.reason}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectLeave} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

