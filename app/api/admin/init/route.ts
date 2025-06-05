import { NextResponse } from "next/server"
import { initializeDatabase, checkDatabaseStatus } from "@/lib/memory-db-service"

export async function GET() {
  try {
    console.log("🔍 GET /api/admin/init - Checking database status...")

    const status = await checkDatabaseStatus()
    console.log("✅ Database status:", status)

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("❌ GET /api/admin/init - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to check database status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("🔄 POST /api/admin/init - Initializing database...")

    await initializeDatabase()
    const status = await checkDatabaseStatus()

    console.log("✅ Database initialized:", status)
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      status,
    })
  } catch (error) {
    console.error("❌ POST /api/admin/init - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
