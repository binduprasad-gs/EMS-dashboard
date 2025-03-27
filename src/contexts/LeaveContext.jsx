"use client"

import { createContext, useContext, useState } from "react"

// Sample leave data
const initialLeaves = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "John Doe",
    type: "Vacation",
    startDate: "2023-12-20",
    endDate: "2023-12-25",
    reason: "Family vacation",
    status: "Approved",
    appliedOn: "2023-11-15",
    approvedBy: "Jane Smith",
    approvedOn: "2023-11-20",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Jane Smith",
    type: "Sick Leave",
    startDate: "2023-11-10",
    endDate: "2023-11-12",
    reason: "Flu",
    status: "Approved",
    appliedOn: "2023-11-09",
    approvedBy: "Michael Johnson",
    approvedOn: "2023-11-09",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Michael Johnson",
    type: "Personal Leave",
    startDate: "2023-12-05",
    endDate: "2023-12-07",
    reason: "Family matter",
    status: "Approved",
    appliedOn: "2023-11-25",
    approvedBy: "CEO",
    approvedOn: "2023-11-26",
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: "Emily Davis",
    type: "Vacation",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    reason: "Winter vacation",
    status: "Pending",
    appliedOn: "2023-12-15",
  },
  {
    id: 5,
    employeeId: 1,
    employeeName: "John Doe",
    type: "Sick Leave",
    startDate: "2024-01-05",
    endDate: "2024-01-06",
    reason: "Cold",
    status: "Rejected",
    appliedOn: "2024-01-04",
    approvedBy: "Jane Smith",
    approvedOn: "2024-01-04",
  },
]

const LeaveContext = createContext()

export function LeaveProvider({ children }) {
  const [leaves, setLeaves] = useState(initialLeaves)

  const addLeave = (leave) => {
    const newLeave = {
      ...leave,
      id: leaves.length > 0 ? Math.max(...leaves.map((l) => l.id)) + 1 : 1,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    }
    setLeaves([...leaves, newLeave])
    return newLeave
  }

  const updateLeaveStatus = (id, status, approverName) => {
    setLeaves(
      leaves.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status,
              approvedBy: approverName,
              approvedOn: new Date().toISOString().split("T")[0],
            }
          : leave,
      ),
    )
  }

  const getLeavesByEmployee = (employeeId) => {
    return leaves.filter((leave) => leave.employeeId === employeeId)
  }

  const getPendingLeaves = () => {
    return leaves.filter((leave) => leave.status === "Pending")
  }

  const getLeaveById = (id) => {
    return leaves.find((leave) => leave.id === Number.parseInt(id))
  }

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        addLeave,
        updateLeaveStatus,
        getLeavesByEmployee,
        getPendingLeaves,
        getLeaveById,
      }}
    >
      {children}
    </LeaveContext.Provider>
  )
}

export function useLeaves() {
  return useContext(LeaveContext)
}

