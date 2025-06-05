import { NextResponse } from "next/server"
import { getArticleById, updateArticle, deleteArticle, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`📝 GET /api/admin/articles/${params.id} - Fetching article...`)

    // Ensure database is initialized
    await initializeDatabase()

    const article = await getArticleById(params.id)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("✅ Article fetched successfully:", article)
    return NextResponse.json(article)
  } catch (error) {
    console.error("❌ Error fetching article:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`📝 PUT /api/admin/articles/${params.id} - Updating article...`)

    const updates = await request.json()
    console.log("📄 Article updates:", updates)

    // Ensure database is initialized
    await initializeDatabase()

    const updatedArticle = await updateArticle(params.id, updates)
    if (!updatedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("✅ Article updated successfully:", updatedArticle)
    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("❌ Error updating article:", error)
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`📝 DELETE /api/admin/articles/${params.id} - Deleting article...`)

    // Ensure database is initialized
    await initializeDatabase()

    const success = await deleteArticle(params.id)
    if (!success) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("✅ Article deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error deleting article:", error)
    return NextResponse.json(
      {
        error: "Failed to delete article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
