import { NextResponse } from "next/server"
import { getLoginAttempts, addLoginAttempt, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request) {
  try {
    console.log("🔐 GET /api/admin/login-attempts - Starting...")

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    await initializeDatabase()

    const attempts = await getLoginAttempts(limit)
    console.log(`✅ GET /api/admin/login-attempts - Success: ${attempts.length} attempts`)

    return NextResponse.json(attempts)
  } catch (error) {
    console.error("❌ GET /api/admin/login-attempts - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch login attempts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("🔐 POST /api/admin/login-attempts - Starting...")

    const attemptData = await request.json()
    console.log("📄 Login attempt data received:", attemptData)

    await initializeDatabase()

    const newAttempt = await addLoginAttempt(attemptData)
    console.log("✅ POST /api/admin/login-attempts - Success:", newAttempt.id)

    return NextResponse.json(newAttempt, { status: 201 })
  } catch (error) {
    console.error("❌ POST /api/admin/login-attempts - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create login attempt",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
