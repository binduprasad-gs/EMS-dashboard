"use client"

import { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  useMediaQuery,
  Badge,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const drawerWidth = 240

export default function DashboardLayout() {
  const [open, setOpen] = useState(true)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [anchorElNotifications, setAnchorElNotifications] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [isMobile])

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget)
  }

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Employees", icon: <PeopleIcon />, path: "/employees" },
    { text: "Leave Management", icon: <EventNoteIcon />, path: "/leave" },
    { text: "Attendance", icon: <AccessTimeIcon />, path: "/attendance" },
    { text: "Reports", icon: <BarChartIcon />, path: "/reports" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  ]

  const notifications = [
    { id: 1, message: "New leave request from John Doe", time: "10 minutes ago" },
    { id: 2, message: "Meeting scheduled at 2:00 PM", time: "1 hour ago" },
    { id: 3, message: "Attendance report is ready", time: "3 hours ago" },
  ]

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HR Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleOpenNotificationsMenu}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.name} src={user?.avatar} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: [1],
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              py: 2,
            }}
          >
            EMS Dashboard
          </Typography>
        </Toolbar>
        <Divider />
        <List component="nav">
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                    color: location.pathname === item.path ? "primary.contrastText" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            © 2024 EMS Dashboard
          </Typography>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

