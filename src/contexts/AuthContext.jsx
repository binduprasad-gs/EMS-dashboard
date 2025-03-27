"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Sample user data
const adminUser = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  avatar: "/placeholder.svg?height=40&width=40",
}

const employeeUser = {
  id: 2,
  name: "Employee User",
  email: "employee@example.com",
  role: "employee",
  avatar: "/placeholder.svg?height=40&width=40",
}

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password, rememberMe) => {
    // Simulate authentication
    let authenticatedUser = null

    if (email === "admin@example.com" && password === "admin123") {
      authenticatedUser = adminUser
    } else if (email === "employee@example.com" && password === "employee123") {
      authenticatedUser = employeeUser
    }

    if (authenticatedUser) {
      setUser(authenticatedUser)
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(authenticatedUser))
      }
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  return <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

