"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { PageHeader } from "@/components/page-header"
import { TaskForm } from "@/components/task-form"
import { TaskTable } from "@/components/task-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { TaskType } from "@/types"
import { MONTHS } from "@/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TasksPageContent() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [editingTask, setEditingTask] = useState<TaskType | null>(null)

  const { data: rawTasks, mutate, isLoading } = useSWR<TaskType[]>(
    `/api/tasks?month=${month}&year=${year}`,
    fetcher
  )
  const tasks = Array.isArray(rawTasks) ? rawTasks : []

  const handleRefresh = useCallback(() => {
    mutate()
  }, [mutate])

  const years = Array.from({ length: 5 }, (_, i) => year - 2 + i)

  return (
    <>
      <PageHeader
        title="Daily Tasks"
        description="Log and manage your daily internship tasks"
      />
      <div className="flex flex-col gap-6 p-6">
        <TaskForm
          onTaskSaved={handleRefresh}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Month</Label>
            <Select
              value={month.toString()}
              onValueChange={(v) => setMonth(parseInt(v))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={(i + 1).toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Year</Label>
            <Select
              value={year.toString()}
              onValueChange={(v) => setYear(parseInt(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TaskTable
          tasks={tasks}
          loading={isLoading}
          onEdit={setEditingTask}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  )
}
