import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/memory-db-service"

export async function POST() {
  try {
    console.log("🔄 POST /api/admin/init - Initializing database...")

    // Initialize database
    await initializeDatabase()

    console.log("✅ Database initialization completed")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("🔍 GET /api/admin/init - Checking database status...")

    // Initialize database
    await initializeDatabase()

    console.log("✅ Database check completed")

    return NextResponse.json({
      success: true,
      message: "Database is initialized",
    })
  } catch (error) {
    console.error("❌ Error checking database:", error)
    return NextResponse.json(
      {
        error: "Failed to check database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
