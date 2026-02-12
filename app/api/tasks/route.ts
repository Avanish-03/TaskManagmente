import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Task from "@/models/Task"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    const query: Record<string, number> = {}
    if (month) query.month = parseInt(month)
    if (year) query.year = parseInt(year)

    const tasks = await Task.find(query).sort({ date: 1 })
    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error("GET /api/tasks error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    try {
      await dbConnect()
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      const dbMessage = dbError instanceof Error ? dbError.message : "Database connection failed"
      return NextResponse.json(
        { error: `Database error: ${dbMessage}. Please check your MONGODB_URI in .env.local` },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log("Received task data:", body)

    // Validate required fields - support both old and new format
    const hasTimeSegments = body.timeSegments && Array.isArray(body.timeSegments) && body.timeSegments.length > 0
    const hasOldFormat = body.startTime && body.endTime

    if (!body.date || !body.description || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: date, description, and type are required" },
        { status: 400 }
      )
    }

    // Only require time for Work type
    if (body.type === "Work") {
      if (!hasTimeSegments && !hasOldFormat) {
        return NextResponse.json(
          { error: "Please provide time segments or start/end time for Work tasks" },
          { status: 400 }
        )
      }
    }


    // Convert old format to new format if needed
    let timeSegments = body.timeSegments || []
    if (!hasTimeSegments && hasOldFormat) {
      timeSegments = [{ startTime: body.startTime, endTime: body.endTime }]
    }

    // Ensure date is properly formatted
    const taskData = {
      ...body,
      date: new Date(body.date),
      timeSegments: timeSegments,
      month: body.month || new Date(body.date).getMonth() + 1,
      year: body.year || new Date(body.date).getFullYear(),
    }

    console.log("Creating task with data:", taskData)
    const task = await Task.create(taskData)
    console.log("Task created successfully:", task._id)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("POST /api/tasks error:", error)

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)

      // Check for validation errors
      if (error.name === "ValidationError") {
        const validationError = error as any
        const errors = Object.values(validationError.errors || {}).map(
          (err: any) => err.message
        )
        return NextResponse.json(
          { error: `Validation error: ${errors.join(", ")}` },
          { status: 400 }
        )
      }

      // Check for MongoDB connection errors
      if (error.message.includes("MONGODB_URI") || error.message.includes("Database")) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }
    }

    const message = error instanceof Error ? error.message : "Failed to create task"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { _id, ...updateData } = body

    // Handle time segments conversion if needed
    if (updateData.timeSegments && Array.isArray(updateData.timeSegments)) {
      // Already in new format
    } else if (updateData.startTime && updateData.endTime && !updateData.timeSegments) {
      // Convert old format to new format
      updateData.timeSegments = [
        { startTime: updateData.startTime, endTime: updateData.endTime }
      ]
    }

    // Ensure date is properly formatted
    if (updateData.date) {
      updateData.date = new Date(updateData.date)
    }

    const task = await Task.findByIdAndUpdate(_id, updateData, { new: true })
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error("PUT /api/tasks error:", error)

    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)

      if (error.name === "ValidationError") {
        const validationError = error as any
        const errors = Object.values(validationError.errors || {}).map(
          (err: any) => err.message
        )
        return NextResponse.json(
          { error: `Validation error: ${errors.join(", ")}` },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      )
    }
    const task = await Task.findByIdAndDelete(id)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Task deleted" }, { status: 200 })
  } catch (error) {
    console.error("DELETE /api/tasks error:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
