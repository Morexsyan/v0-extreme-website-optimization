import { NextResponse } from "next/server"
import { getArticleById, updateArticle, deleteArticle, initializeDatabase } from "@/lib/memory-db-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`📝 GET /api/admin/articles/${params.id} - Starting...`)

    await initializeDatabase()

    const article = await getArticleById(params.id)
    if (!article) {
      console.log(`❌ Article not found: ${params.id}`)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log(`✅ GET /api/admin/articles/${params.id} - Success`)
    return NextResponse.json(article)
  } catch (error) {
    console.error(`❌ GET /api/admin/articles/${params.id} - Error:`, error)
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
    console.log(`📝 PUT /api/admin/articles/${params.id} - Starting...`)

    const updates = await request.json()
    console.log("📄 Update data:", updates)

    await initializeDatabase()

    const updatedArticle = await updateArticle(params.id, updates)
    if (!updatedArticle) {
      console.log(`❌ Article not found for update: ${params.id}`)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log(`✅ PUT /api/admin/articles/${params.id} - Success`)
    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error(`❌ PUT /api/admin/articles/${params.id} - Error:`, error)
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
    console.log(`🗑️ DELETE /api/admin/articles/${params.id} - Starting...`)

    await initializeDatabase()

    const success = await deleteArticle(params.id)
    if (!success) {
      console.log(`❌ Article not found for deletion: ${params.id}`)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log(`✅ DELETE /api/admin/articles/${params.id} - Success`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`❌ DELETE /api/admin/articles/${params.id} - Error:`, error)
    return NextResponse.json(
      {
        error: "Failed to delete article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
