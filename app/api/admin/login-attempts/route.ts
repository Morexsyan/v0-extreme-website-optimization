import { NextResponse } from "next/server"
import { getLoginAttempts, addLoginAttempt } from "@/lib/db-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const attempts = await getLoginAttempts(limit)
    return NextResponse.json(attempts)
  } catch (error) {
    console.error("Error fetching login attempts:", error)
    return NextResponse.json({ error: "Failed to fetch login attempts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const attemptData = await request.json()
    const newAttempt = await addLoginAttempt({
      ...attemptData,
      time: attemptData.time || new Date().toISOString(),
    })
    return NextResponse.json(newAttempt, { status: 201 })
  } catch (error) {
    console.error("Error creating login attempt:", error)
    return NextResponse.json({ error: "Failed to create login attempt" }, { status: 500 })
  }
}
