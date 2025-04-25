"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    const success = login(email, password, rememberMe)

    if (success) {
      navigate("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Sign In
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Demo Credentials:
        <br />
        Admin: admin@example.com / admin123
        <br />
        Employee: employee@example.com / employee123
      </Typography>

      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        autoFocus
        variant="outlined" // Explicitly set the variant
        margin="normal" // Add proper spacing
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        variant="outlined"
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
        label="Remember me"
      />

      <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
        Sign In
      </Button>
    </Box>
  )
}

