"use client"

import { createContext, useContext, useState } from "react"

// Sample attendance data
const initialAttendance = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "John Doe",
    date: "2024-01-02",
    checkIn: "09:05:00",
    checkOut: "17:30:00",
    status: "Present",
    workHours: 8.42,
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: "John Doe",
    date: "2024-01-03",
    checkIn: "08:55:00",
    checkOut: "17:45:00",
    status: "Present",
    workHours: 8.83,
  },
  {
    id: 3,
    employeeId: 1,
    employeeName: "John Doe",
    date: "2024-01-04",
    checkIn: "09:10:00",
    checkOut: "17:15:00",
    status: "Present",
    workHours: 8.08,
  },
  {
    id: 4,
    employeeId: 2,
    employeeName: "Jane Smith",
    date: "2024-01-02",
    checkIn: "08:45:00",
    checkOut: "18:00:00",
    status: "Present",
    workHours: 9.25,
  },
  {
    id: 5,
    employeeId: 2,
    employeeName: "Jane Smith",
    date: "2024-01-03",
    checkIn: "08:50:00",
    checkOut: "17:55:00",
    status: "Present",
    workHours: 9.08,
  },
  {
    id: 6,
    employeeId: 2,
    employeeName: "Jane Smith",
    date: "2024-01-04",
    status: "Absent",
    workHours: 0,
  },
  {
    id: 7,
    employeeId: 3,
    employeeName: "Michael Johnson",
    date: "2024-01-02",
    checkIn: "09:30:00",
    checkOut: "18:30:00",
    status: "Present",
    workHours: 9,
  },
  {
    id: 8,
    employeeId: 3,
    employeeName: "Michael Johnson",
    date: "2024-01-03",
    checkIn: "09:15:00",
    checkOut: "18:15:00",
    status: "Present",
    workHours: 9,
  },
  {
    id: 9,
    employeeId: 3,
    employeeName: "Michael Johnson",
    date: "2024-01-04",
    checkIn: "09:00:00",
    checkOut: "18:00:00",
    status: "Present",
    workHours: 9,
  },
]

const AttendanceContext = createContext()

export function AttendanceProvider({ children }) {
  const [attendance, setAttendance] = useState(initialAttendance)

  const markAttendance = (employeeId, employeeName, checkIn = null, checkOut = null) => {
    const today = new Date().toISOString().split("T")[0]
    const existingRecord = attendance.find((record) => record.employeeId === employeeId && record.date === today)

    if (existingRecord) {
      // Update existing record
      setAttendance(
        attendance.map((record) =>
          record.id === existingRecord.id
            ? {
                ...record,
                checkOut: checkOut || new Date().toTimeString().split(" ")[0],
                workHours: calculateWorkHours(record.checkIn, checkOut || new Date().toTimeString().split(" ")[0]),
              }
            : record,
        ),
      )
      return existingRecord.id
    } else {
      // Create new record
      const newRecord = {
        id: attendance.length > 0 ? Math.max(...attendance.map((a) => a.id)) + 1 : 1,
        employeeId,
        employeeName,
        date: today,
        checkIn: checkIn || new Date().toTimeString().split(" ")[0],
        status: "Present",
      }
      setAttendance([...attendance, newRecord])
      return newRecord.id
    }
  }

  const markAbsent = (employeeId, employeeName, date) => {
    const existingRecord = attendance.find((record) => record.employeeId === employeeId && record.date === date)

    if (existingRecord) {
      // Update existing record
      setAttendance(
        attendance.map((record) =>
          record.id === existingRecord.id
            ? {
                ...record,
                status: "Absent",
                checkIn: null,
                checkOut: null,
                workHours: 0,
              }
            : record,
        ),
      )
    } else {
      // Create new record
      const newRecord = {
        id: attendance.length > 0 ? Math.max(...attendance.map((a) => a.id)) + 1 : 1,
        employeeId,
        employeeName,
        date,
        status: "Absent",
        workHours: 0,
      }
      setAttendance([...attendance, newRecord])
    }
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    const startTime = new Date(`2000-01-01T${checkIn}`)
    const endTime = new Date(`2000-01-01T${checkOut}`)
    const diffMs = endTime - startTime
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100 // Hours with 2 decimal places
  }

  const getAttendanceByEmployee = (employeeId) => {
    return attendance.filter((record) => record.employeeId === employeeId)
  }

  const getAttendanceByDate = (date) => {
    return attendance.filter((record) => record.date === date)
  }

  const getAttendanceStats = (employeeId = null, startDate = null, endDate = null) => {
    let filteredAttendance = [...attendance]

    if (employeeId) {
      filteredAttendance = filteredAttendance.filter((record) => record.employeeId === employeeId)
    }

    if (startDate && endDate) {
      filteredAttendance = filteredAttendance.filter((record) => record.date >= startDate && record.date <= endDate)
    }

    const totalRecords = filteredAttendance.length
    const presentCount = filteredAttendance.filter((record) => record.status === "Present").length
    const absentCount = filteredAttendance.filter((record) => record.status === "Absent").length
    const lateCount = filteredAttendance.filter(
      (record) => record.status === "Present" && record.checkIn > "09:00:00",
    ).length

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      presentPercentage: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0,
      absentPercentage: totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0,
      latePercentage: presentCount > 0 ? (lateCount / presentCount) * 100 : 0,
    }
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        markAttendance,
        markAbsent,
        getAttendanceByEmployee,
        getAttendanceByDate,
        getAttendanceStats,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  )
}

export function useAttendance() {
  return useContext(AttendanceContext)
}

