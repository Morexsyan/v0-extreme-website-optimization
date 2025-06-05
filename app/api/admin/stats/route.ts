import { NextResponse } from "next/server"
import { getStats, updateStats, initializeDatabase } from "@/lib/fs-db-service"

export async function GET() {
  try {
    console.log("📊 GET /api/admin/stats - Starting...")

    await initializeDatabase()

    const stats = await getStats()
    console.log("✅ GET /api/admin/stats - Success:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("❌ GET /api/admin/stats - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("📊 PUT /api/admin/stats - Starting...")

    const updates = await request.json()
    console.log("📄 Stats updates:", updates)

    await initializeDatabase()

    const updatedStats = await updateStats(updates)
    console.log("✅ PUT /api/admin/stats - Success:", updatedStats)

    return NextResponse.json(updatedStats)
  } catch (error) {
    console.error("❌ PUT /api/admin/stats - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to update stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
