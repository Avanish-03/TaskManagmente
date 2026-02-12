"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import {
  ClipboardList,
  FileText,
  User,
  CalendarDays,
  Clock,
  Briefcase,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TaskType, ProfileType } from "@/types"
import { MONTHS } from "@/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function useCurrentDate() {
  const [currentMonth] = useState(() => new Date().getMonth() + 1)
  const [currentYear] = useState(() => new Date().getFullYear())
  return { currentMonth, currentYear }
}

export default function DashboardPageContent() {
  const { currentMonth, currentYear } = useCurrentDate()

  const { data: rawTasks, isLoading: tasksLoading } = useSWR<TaskType[]>(
    `/api/tasks?month=${currentMonth}&year=${currentYear}`,
    fetcher
  )

  const { data: profile, isLoading: profileLoading } = useSWR<ProfileType>(
    "/api/profile",
    fetcher
  )

  const tasks = Array.isArray(rawTasks) ? rawTasks : []
  const workTasks = tasks.filter((t) => t.type === "Work")
  const holidays = tasks.filter((t) => t.type === "Holiday")
  const weekends = tasks.filter((t) => t.type === "Weekend")

  function getTotalHours() {
    let totalMinutes = 0
    for (const task of workTasks) {
      const match = task.duration.match(/(\d+)h\s*(\d+)m/)
      if (match) {
        totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2])
      }
    }
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${hours}h ${mins}m`
  }

  const isLoading = tasksLoading || profileLoading

  const statsCards = [
    {
      title: "Total Tasks",
      value: tasks.length,
      description: `${MONTHS[currentMonth - 1]} ${currentYear}`,
      icon: ClipboardList,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Work Days",
      value: workTasks.length,
      description: "Active working days",
      icon: Briefcase,
      color: "bg-chart-2/15 text-chart-2",
    },
    {
      title: "Total Hours",
      value: getTotalHours(),
      description: "Work hours logged",
      icon: Clock,
      color: "bg-chart-4/15 text-chart-4",
    },
    {
      title: "Days Off",
      value: holidays.length + weekends.length,
      description: `${holidays.length} holidays, ${weekends.length} weekends`,
      icon: CalendarDays,
      color: "bg-chart-5/15 text-chart-5",
    },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back${profile?.studentName ? `, ${profile.studentName}` : ""}. Here's your internship overview.`}
      />
      <div className="flex flex-col gap-6 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  <CardDescription>
                    Jump to frequently used sections
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Link href="/tasks">
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                    >
                      <span className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Add Daily Task
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/report">
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Monthly Report
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                    >
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Update Profile
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Profile Summary</CardTitle>
                  <CardDescription>
                    Your internship details at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile?.studentName ? (
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium text-foreground">
                          {profile.studentName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                        <span className="text-muted-foreground">Company</span>
                        <span className="font-medium text-foreground">
                          {profile.companyName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                        <span className="text-muted-foreground">Designation</span>
                        <span className="font-medium text-foreground">
                          {profile.designation}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                        <span className="text-muted-foreground">Project</span>
                        <span className="font-medium text-foreground">
                          {profile.projectTitle}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <User className="mb-3 h-10 w-10 text-muted-foreground/40" />
                      <p className="mb-3 text-sm text-muted-foreground">
                        No profile set up yet.
                      </p>
                      <Link href="/profile">
                        <Button size="sm">Set Up Profile</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Recent Tasks - {MONTHS[currentMonth - 1]} {currentYear}
                </CardTitle>
                <CardDescription>
                  Your latest recorded activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {tasks.slice(-5).reverse().map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                      >
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium text-foreground">
                            {task.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(task.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            |{" "}
                            {task.timeSegments && task.timeSegments.length > 0
                              ? task.timeSegments
                                  .map((seg) => `${seg.startTime} - ${seg.endTime}`)
                                  .join(", ")
                              : task.startTime && task.endTime
                                ? `${task.startTime} - ${task.endTime}`
                                : "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              task.type === "Work"
                                ? "bg-primary/10 text-primary"
                                : task.type === "Holiday"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {task.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {task.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="mb-3 text-sm text-muted-foreground">
                      No tasks recorded this month.
                    </p>
                    <Link href="/tasks">
                      <Button size="sm">Add Your First Task</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
