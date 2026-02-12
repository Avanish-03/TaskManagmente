import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Profile from "@/models/Profile"

export async function GET() {
  try {
    await dbConnect()
    const profile = await Profile.findOne().sort({ updatedAt: -1 })
    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error("GET /api/profile error:", error)
    return NextResponse.json(null, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    const existing = await Profile.findOne()
    if (existing) {
      const updated = await Profile.findByIdAndUpdate(existing._id, body, {
        new: true,
      })
      return NextResponse.json(updated, { status: 200 })
    }

    const profile = await Profile.create(body)
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("POST /api/profile error:", error)
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    )
  }
}
