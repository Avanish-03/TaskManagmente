export interface TimeSegment {
  startTime: string
  endTime: string
}

export interface TaskType {
  _id?: string
  date: string
  // Backward compatibility
  startTime?: string
  endTime?: string
  // New structure: array of time segments
  timeSegments?: TimeSegment[]
  description: string
  type: "Work" | "Holiday" | "Weekend"
  duration: string
  month: number
  year: number
}

export interface ProfileType {
  _id?: string
  studentName: string
  companyName: string
  designation: string
  projectTitle?: string
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
