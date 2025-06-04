import { NextResponse } from "next/server"
import { initializeDataFiles } from "@/lib/db-service"
import fs from "fs/promises"
import path from "path"

export async function POST() {
  try {
    console.log("🔄 POST /api/admin/init - Initializing data files...")

    // Initialize data files
    await initializeDataFiles()

    // Check if files exist
    const dataDir = path.join(process.cwd(), "data")
    const files = await fs.readdir(dataDir).catch(() => [])

    console.log("✅ Data initialization completed")
    console.log("📁 Data files:", files)

    return NextResponse.json({
      success: true,
      message: "Data files initialized successfully",
      files: files,
      dataDir: dataDir,
    })
  } catch (error) {
    console.error("❌ Error initializing data:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("🔍 GET /api/admin/init - Checking data files...")

    const dataDir = path.join(process.cwd(), "data")

    try {
      const files = await fs.readdir(dataDir)
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dataDir, file)
          const stats = await fs.stat(filePath)
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime.toISOString(),
          }
        }),
      )

      console.log("✅ Data files check completed:", fileStats)

      return NextResponse.json({
        success: true,
        dataDir: dataDir,
        files: fileStats,
      })
    } catch (dirError) {
      console.log("📁 Data directory does not exist yet")
      return NextResponse.json({
        success: false,
        message: "Data directory does not exist",
        dataDir: dataDir,
        files: [],
      })
    }
  } catch (error) {
    console.error("❌ Error checking data files:", error)
    return NextResponse.json(
      {
        error: "Failed to check data files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
