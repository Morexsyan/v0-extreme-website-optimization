import { NextResponse } from "next/server"
import { getActivities, addActivity, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request) {
  try {
    console.log("📋 GET /api/admin/activities - Starting...")

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    await initializeDatabase()

    const activities = await getActivities(limit)
    console.log(`✅ GET /api/admin/activities - Success: ${activities.length} activities`)

    return NextResponse.json(activities)
  } catch (error) {
    console.error("❌ GET /api/admin/activities - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch activities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("📋 POST /api/admin/activities - Starting...")

    const activityData = await request.json()
    console.log("📄 Activity data received:", activityData)

    await initializeDatabase()

    const newActivity = await addActivity(activityData)
    console.log("✅ POST /api/admin/activities - Success:", newActivity.id)

    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    console.error("❌ POST /api/admin/activities - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create activity",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
