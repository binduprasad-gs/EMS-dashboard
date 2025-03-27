"use client"

import { createContext, useContext, useState } from "react"

// Sample employee data
const initialEmployees = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    department: "Engineering",
    role: "Senior Developer",
    status: "Active",
    joinDate: "2020-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Jane Smith",
    address: "123 Main St, Anytown, USA",
    skills: ["JavaScript", "React", "Node.js"],
    projects: ["Project Alpha", "Project Beta"],
    salary: 85000,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(234) 567-8901",
    department: "Engineering",
    role: "Engineering Manager",
    status: "Active",
    joinDate: "2019-03-10",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Michael Johnson",
    address: "456 Oak Ave, Somewhere, USA",
    skills: ["Leadership", "Project Management", "System Architecture"],
    projects: ["Project Alpha", "Project Gamma"],
    salary: 110000,
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "(345) 678-9012",
    department: "Executive",
    role: "CTO",
    status: "Active",
    joinDate: "2018-05-22",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "CEO",
    address: "789 Pine Blvd, Elsewhere, USA",
    skills: ["Strategic Planning", "Team Leadership", "Technology Vision"],
    projects: ["Company Strategy", "Technology Roadmap"],
    salary: 160000,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(456) 789-0123",
    department: "HR",
    role: "HR Manager",
    status: "Active",
    joinDate: "2019-08-15",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Michael Johnson",
    address: "101 Maple Dr, Nowhere, USA",
    skills: ["Recruitment", "Employee Relations", "Policy Development"],
    projects: ["Employee Handbook", "Recruitment Drive"],
    salary: 95000,
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "(567) 890-1234",
    department: "Marketing",
    role: "Marketing Specialist",
    status: "Active",
    joinDate: "2021-02-10",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Sarah Thompson",
    address: "202 Cedar St, Anywhere, USA",
    skills: ["Digital Marketing", "Content Creation", "SEO"],
    projects: ["Brand Refresh", "Social Media Campaign"],
    salary: 75000,
  },
  {
    id: 6,
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    phone: "(678) 901-2345",
    department: "Marketing",
    role: "Marketing Director",
    status: "Active",
    joinDate: "2019-11-05",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Michael Johnson",
    address: "303 Birch Ave, Someplace, USA",
    skills: ["Marketing Strategy", "Brand Management", "Team Leadership"],
    projects: ["Market Expansion", "Brand Refresh"],
    salary: 105000,
  },
  {
    id: 7,
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "(789) 012-3456",
    department: "Finance",
    role: "Financial Analyst",
    status: "Active",
    joinDate: "2020-07-20",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Lisa Miller",
    address: "404 Elm St, Otherplace, USA",
    skills: ["Financial Analysis", "Budgeting", "Forecasting"],
    projects: ["Annual Budget", "Cost Reduction"],
    salary: 80000,
  },
  {
    id: 8,
    name: "Lisa Miller",
    email: "lisa.miller@example.com",
    phone: "(890) 123-4567",
    department: "Finance",
    role: "Finance Director",
    status: "Active",
    joinDate: "2018-09-15",
    avatar: "/placeholder.svg?height=100&width=100",
    manager: "Michael Johnson",
    address: "505 Walnut Blvd, Lastplace, USA",
    skills: ["Financial Planning", "Risk Management", "Strategic Finance"],
    projects: ["Financial Strategy", "Investor Relations"],
    salary: 115000,
  },
]

const EmployeeContext = createContext()

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees)

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1,
      status: "Active",
    }
    setEmployees([...employees, newEmployee])
    return newEmployee
  }

  const updateEmployee = (id, updatedData) => {
    setEmployees(employees.map((employee) => (employee.id === id ? { ...employee, ...updatedData } : employee)))
  }

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id))
  }

  const getEmployee = (id) => {
    return employees.find((employee) => employee.id === Number.parseInt(id))
  }

  const getDepartments = () => {
    return [...new Set(employees.map((employee) => employee.department))]
  }

  const getEmployeesByDepartment = (department) => {
    return employees.filter((employee) => employee.department === department)
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        getDepartments,
        getEmployeesByDepartment,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  return useContext(EmployeeContext)
}

