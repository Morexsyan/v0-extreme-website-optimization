import { NextResponse } from "next/server"
import { getActivities, addActivity, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request) {
  try {
    console.log("📊 GET /api/admin/activities - Fetching activities...")

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    // Ensure database is initialized
    await initializeDatabase()

    const activities = await getActivities(limit)
    console.log(`✅ Fetched ${activities.length} activities successfully`)

    return NextResponse.json(activities)
  } catch (error) {
    console.error("❌ Error fetching activities:", error)
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
    console.log("📊 POST /api/admin/activities - Creating activity...")

    const activityData = await request.json()
    console.log("📋 Activity data:", activityData)

    // Ensure database is initialized
    await initializeDatabase()

    const newActivity = await addActivity({
      ...activityData,
      time: activityData.time || new Date().toISOString(),
    })

    console.log("✅ Activity created successfully:", newActivity)

    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating activity:", error)
    return NextResponse.json(
      {
        error: "Failed to create activity",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
