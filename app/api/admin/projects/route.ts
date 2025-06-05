import { NextResponse } from "next/server"
import { getProjects, createProject, initializeDatabase } from "@/lib/memory-db-service"

export async function GET() {
  try {
    console.log("🚀 GET /api/admin/projects - Fetching projects...")

    // Ensure database is initialized
    await initializeDatabase()

    const projects = await getProjects()
    console.log(`✅ Fetched ${projects.length} projects successfully`)

    return NextResponse.json(projects)
  } catch (error) {
    console.error("❌ Error fetching projects:", error)
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
    console.log("🚀 POST /api/admin/projects - Creating project...")

    const projectData = await request.json()
    console.log("📋 Project data:", projectData)

    // Ensure database is initialized
    await initializeDatabase()

    const newProject = await createProject(projectData)
    console.log("✅ Project created successfully:", newProject)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating project:", error)
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
