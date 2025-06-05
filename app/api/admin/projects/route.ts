import { NextResponse } from "next/server"
import { getProjects, createProject, initializeDatabase } from "@/lib/fs-db-service"

export async function GET() {
  try {
    console.log("🚀 GET /api/admin/projects - Starting...")

    await initializeDatabase()

    const projects = await getProjects()
    console.log(`✅ GET /api/admin/projects - Success: ${projects.length} projects`)

    return NextResponse.json(projects)
  } catch (error) {
    console.error("❌ GET /api/admin/projects - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("🚀 POST /api/admin/projects - Starting...")

    const projectData = await request.json()
    console.log("📄 Project data received:", projectData)

    await initializeDatabase()

    const newProject = await createProject(projectData)
    console.log("✅ POST /api/admin/projects - Success:", newProject.id)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("❌ POST /api/admin/projects - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
