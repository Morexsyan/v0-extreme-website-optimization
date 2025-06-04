import { NextResponse } from "next/server"
import { getStats, updateStats } from "@/lib/db-service"

export async function GET() {
  try {
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json()
    const updatedStats = await updateStats(updates)
    return NextResponse.json(updatedStats)
  } catch (error) {
    console.error("Error updating stats:", error)
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
