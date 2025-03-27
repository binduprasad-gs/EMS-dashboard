"use client"

import { Box, Typography, Button, Container, Paper } from "@mui/material"
import { Error as ErrorIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <ErrorIcon sx={{ fontSize: 100, color: "error.main", mb: 2 }} />

        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>

          <Button variant="outlined" color="primary" size="large" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

