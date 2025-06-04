import { NextResponse } from "next/server"
import { getArticles, createArticle, initializeDataFiles } from "@/lib/db-service"

export async function GET() {
  try {
    console.log("📝 GET /api/admin/articles - Fetching articles...")

    // Ensure data files are initialized
    await initializeDataFiles()

    const articles = await getArticles()
    console.log(`✅ Fetched ${articles.length} articles successfully`)

    return NextResponse.json(articles)
  } catch (error) {
    console.error("❌ Error fetching articles:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("📝 POST /api/admin/articles - Creating article...")

    const articleData = await request.json()
    console.log("📄 Article data:", articleData)

    // Ensure data files are initialized
    await initializeDataFiles()

    // Add required fields
    const newArticleData = {
      ...articleData,
      views: 0,
      likes: 0,
      date: new Date().toISOString().split("T")[0],
      author: "Syan",
    }

    const newArticle = await createArticle(newArticleData)
    console.log("✅ Article created successfully:", newArticle)

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating article:", error)
    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
