"use client"

import { Outlet, Navigate } from "react-router-dom"
import { Box, Container, Paper, Typography } from "@mui/material"
import { useAuth } from "../contexts/AuthContext"

export default function AuthLayout() {
  const { user } = useAuth()

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
          >
            EMS Dashboard
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  )
}

