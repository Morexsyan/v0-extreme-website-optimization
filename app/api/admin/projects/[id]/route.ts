import { NextResponse } from "next/server"
import { getProjectById, updateProject, deleteProject, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🚀 GET /api/admin/projects/${params.id} - Fetching project...`)

    // Ensure database is initialized
    await initializeDatabase()

    const project = await getProjectById(params.id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log("✅ Project fetched successfully:", project)
    return NextResponse.json(project)
  } catch (error) {
    console.error("❌ Error fetching project:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🚀 PUT /api/admin/projects/${params.id} - Updating project...`)

    const updates = await request.json()
    console.log("📋 Project updates:", updates)

    // Ensure database is initialized
    await initializeDatabase()

    const updatedProject = await updateProject(params.id, updates)
    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log("✅ Project updated successfully:", updatedProject)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("❌ Error updating project:", error)
    return NextResponse.json(
      {
        error: "Failed to update project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🚀 DELETE /api/admin/projects/${params.id} - Deleting project...`)

    // Ensure database is initialized
    await initializeDatabase()

    const success = await deleteProject(params.id)
    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log("✅ Project deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error deleting project:", error)
    return NextResponse.json(
      {
        error: "Failed to delete project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
