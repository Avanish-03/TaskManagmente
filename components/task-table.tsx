"use client"

import { toast } from "sonner"
import { format } from "date-fns"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TaskType } from "@/types"

interface TaskTableProps {
  tasks: TaskType[]
  loading: boolean
  onEdit: (task: TaskType) => void
  onRefresh: () => void
}

export function TaskTable({
  tasks,
  loading,
  onEdit,
  onRefresh,
}: TaskTableProps) {
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Task deleted")
        onRefresh()
      } else {
        toast.error("Failed to delete task")
      }
    } catch {
      toast.error("Failed to delete task")
    }
  }

  function getTypeBadgeVariant(type: string) {
    switch (type) {
      case "Work":
        return "default"
      case "Holiday":
        return "destructive"
      case "Weekend":
        return "secondary"
      default:
        return "outline"
    }
  }

  function formatTimeDisplay(task: TaskType): string {
    if (task.timeSegments && task.timeSegments.length > 0) {
      return task.timeSegments
        .map((seg) => `${seg.startTime} - ${seg.endTime}`)
        .join(", ")
    }
    // Fallback to old format
    if (task.startTime && task.endTime) {
      return `${task.startTime} - ${task.endTime}`
    }
    return "N/A"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-foreground">Task List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">No tasks found for this month.</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Date</TableHead>
                  <TableHead className="text-foreground">Time</TableHead>
                  <TableHead className="text-foreground">Description</TableHead>
                  <TableHead className="text-foreground">Type</TableHead>
                  <TableHead className="text-foreground">Duration</TableHead>
                  <TableHead className="text-right text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="whitespace-nowrap text-foreground">
                      {format(new Date(task.date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex flex-col gap-0.5">
                        {task.timeSegments && task.timeSegments.length > 0 ? (
                          task.timeSegments.map((seg, idx) => (
                            <span key={idx} className="text-xs">
                              {seg.startTime} - {seg.endTime}
                            </span>
                          ))
                        ) : (
                          <span>{task.startTime || "N/A"} - {task.endTime || "N/A"}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-foreground">
                      {task.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(task.type) as "default" | "destructive" | "secondary" | "outline"}>
                        {task.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{task.duration}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(task)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task._id!)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
