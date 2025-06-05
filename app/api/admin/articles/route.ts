import { NextResponse } from "next/server"
import { getArticles, createArticle, initializeDatabase } from "@/lib/fs-db-service"

export async function GET() {
  try {
    console.log("📝 GET /api/admin/articles - Starting...")

    // 確保數據庫已初始化
    await initializeDatabase()

    const articles = await getArticles()
    console.log(`✅ GET /api/admin/articles - Success: ${articles.length} articles`)

    return NextResponse.json(articles)
  } catch (error) {
    console.error("❌ GET /api/admin/articles - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("📝 POST /api/admin/articles - Starting...")

    const articleData = await request.json()
    console.log("📄 Article data received:", {
      title: articleData.title,
      status: articleData.status,
      category: articleData.category,
    })

    // 確保數據庫已初始化
    await initializeDatabase()

    // 添加必需字段
    const newArticleData = {
      ...articleData,
      views: 0,
      likes: 0,
      date: new Date().toISOString().split("T")[0],
      author: "Syan",
    }

    const newArticle = await createArticle(newArticleData)
    console.log("✅ POST /api/admin/articles - Success:", {
      id: newArticle.id,
      title: newArticle.title,
    })

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error("❌ POST /api/admin/articles - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
