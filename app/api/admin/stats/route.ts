import { NextResponse } from "next/server"
import { getStats, updateStats, initializeDataFiles } from "@/lib/db-service"

export async function GET() {
  try {
    console.log("📊 GET /api/admin/stats - Fetching stats...")

    // Ensure data files are initialized
    await initializeDataFiles()

    const stats = await getStats()
    console.log("✅ Stats fetched successfully:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("❌ Error fetching stats:", error)
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
    console.log("📊 PUT /api/admin/stats - Updating stats...")

    const updates = await request.json()
    console.log("📝 Stats updates:", updates)

    // Ensure data files are initialized
    await initializeDataFiles()

    const updatedStats = await updateStats(updates)
    console.log("✅ Stats updated successfully:", updatedStats)

    return NextResponse.json(updatedStats)
  } catch (error) {
    console.error("❌ Error updating stats:", error)
    return NextResponse.json(
      {
        error: "Failed to update stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
