import { NextResponse } from "next/server"
import { getProjectById, updateProject, deleteProject, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🚀 GET /api/admin/projects/${params.id} - Starting...`)

    await initializeDatabase()

    const project = await getProjectById(params.id)
    if (!project) {
      console.log(`❌ Project not found: ${params.id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log(`✅ GET /api/admin/projects/${params.id} - Success`)
    return NextResponse.json(project)
  } catch (error) {
    console.error(`❌ GET /api/admin/projects/${params.id} - Error:`, error)
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
    console.log(`🚀 PUT /api/admin/projects/${params.id} - Starting...`)

    const updates = await request.json()
    console.log("📄 Update data:", updates)

    await initializeDatabase()

    const updatedProject = await updateProject(params.id, updates)
    if (!updatedProject) {
      console.log(`❌ Project not found for update: ${params.id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log(`✅ PUT /api/admin/projects/${params.id} - Success`)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error(`❌ PUT /api/admin/projects/${params.id} - Error:`, error)
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
    console.log(`🗑️ DELETE /api/admin/projects/${params.id} - Starting...`)

    await initializeDatabase()

    const success = await deleteProject(params.id)
    if (!success) {
      console.log(`❌ Project not found for deletion: ${params.id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log(`✅ DELETE /api/admin/projects/${params.id} - Success`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`❌ DELETE /api/admin/projects/${params.id} - Error:`, error)
    return NextResponse.json(
      {
        error: "Failed to delete project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
