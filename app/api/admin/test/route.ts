import { NextResponse } from "next/server"
import { initializeDataFiles, getStats, getArticles } from "@/lib/db-service"

export async function GET() {
  try {
    // 初始化數據文件
    await initializeDataFiles()

    // 測試讀取數據
    const stats = await getStats()
    const articles = await getArticles()

    return NextResponse.json({
      success: true,
      message: "數據服務正常",
      data: {
        stats,
        articlesCount: articles.length,
      },
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
