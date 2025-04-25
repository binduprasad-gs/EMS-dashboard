"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material"
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { useEmployees } from "../../contexts/EmployeeContext"
import { useAuth } from "../../contexts/AuthContext"

export default function EmployeeDirectory() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, getDepartments } = useEmployees()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    joinDate: "",
    manager: "",
    address: "",
  })
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    setDepartments(getDepartments())

    // Filter employees based on search term and department filter
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = filterDepartment === "" || employee.department === filterDepartment

      return matchesSearch && matchesDepartment
    })

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, filterDepartment])

  const handleAddEmployee = () => {
    addEmployee({
      ...newEmployee,
      avatar: "/placeholder.svg?height=100&width=100",
    })
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      role: "",
      joinDate: "",
      manager: "",
      address: "",
    })
    setOpenAddDialog(false)
  }

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee)
    setOpenDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id)
      setOpenDeleteDialog(false)
      setSelectedEmployee(null)
    }
  }

  const handleEmployeeClick = (id) => {
    navigate(`/employees/${id}`)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Directory
        </Typography>

        {isAdmin() && (
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
            Add Employee
          </Button>
        )}
      </Box>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 4, alignItems: "center" }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="department-filter-label">Filter by Department</InputLabel>
            <Select
              labelId="department-filter-label"
              id="department-filter"
              value={filterDepartment}
              label="Filter by Department"
              onChange={(e) => setFilterDepartment(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Employee Cards */}
      <Grid container spacing={3}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee.id}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                    <Avatar alt={employee.name} src={employee.avatar} sx={{ width: 80, height: 80, mb: 2 }} />
                    <Typography variant="h6" component="div" align="center">
                      {employee.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {employee.role}
                    </Typography>
                    <Chip label={employee.department} size="small" color="primary" sx={{ mt: 1 }} />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" noWrap>
                      {employee.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">{employee.phone}</Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button size="small" variant="outlined" onClick={() => handleEmployeeClick(employee.id)}>
                    View Profile
                  </Button>

                  {isAdmin() && (
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEmployeeClick(employee.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(employee)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              No employees found matching your search criteria.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Add Employee Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Employee
          <IconButton
            aria-label="close"
            onClick={() => setOpenAddDialog(false)}
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
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newEmployee.department}
                  label="Department"
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
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
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Join Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newEmployee.joinDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manager"
                fullWidth
                value={newEmployee.manager}
                onChange={(e) => setNewEmployee({ ...newEmployee, manager: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddEmployee}
            variant="contained"
            color="primary"
            disabled={!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.role}
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

