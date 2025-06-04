import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// 確保數據目錄存在
const DATA_DIR = path.join(process.cwd(), "data")

async function initializeData() {
  try {
    // 創建數據目錄
    await fs.mkdir(DATA_DIR, { recursive: true })
    console.log("✅ 數據目錄已創建")

    // 初始化文章數據
    const articlesFile = path.join(DATA_DIR, "articles.json")
    const articles = [
      {
        id: uuidv4(),
        title: "Advanced SQL Injection in Modern Web Applications",
        status: "published",
        views: 12500,
        likes: 892,
        date: "2024-01-15",
        excerpt: "深入分析現代 Web 應用程式中的高級 SQL 注入技術",
        author: "Syan",
        category: "Web Security",
      },
      {
        id: uuidv4(),
        title: "Quantum Cryptography Implementation",
        status: "draft",
        views: 8700,
        likes: 654,
        date: "2024-01-10",
        excerpt: "實現量子密碼學協議，探討量子金鑰分發",
        author: "Syan",
        category: "Cryptography",
      },
    ]
    await fs.writeFile(articlesFile, JSON.stringify(articles, null, 2))
    console.log("✅ 文章數據已初始化")

    // 初始化專案數據
    const projectsFile = path.join(DATA_DIR, "projects.json")
    const projects = [
      {
        id: uuidv4(),
        name: "QuantumUI Framework",
        status: "development",
        progress: 75,
        description: "革命性的量子計算驅動 3D 使用者介面框架",
        technologies: ["WebGPU", "Quantum.js", "Three.js"],
        startDate: "2023-10-15",
      },
      {
        id: uuidv4(),
        name: "NeuralStack Backend",
        status: "completed",
        progress: 100,
        description: "使用深度學習自動優化的神經網絡後端架構",
        technologies: ["Rust", "TensorFlow", "Kubernetes"],
        startDate: "2023-08-01",
        endDate: "2023-12-20",
      },
    ]
    await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2))
    console.log("✅ 專案數據已初始化")

    // 初始化統計數據
    const statsFile = path.join(DATA_DIR, "stats.json")
    const stats = {
      totalViews: 125600,
      totalArticles: 42,
      totalProjects: 18,
      securityAlerts: 0,
      lastUpdated: new Date().toISOString(),
    }
    await fs.writeFile(statsFile, JSON.stringify(stats, null, 2))
    console.log("✅ 統計數據已初始化")

    // 初始化活動數據
    const activitiesFile = path.join(DATA_DIR, "activities.json")
    const activities = [
      {
        id: uuidv4(),
        action: "新用戶訪問了首頁",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: "info",
      },
      {
        id: uuidv4(),
        action: "WriteUp 文章被瀏覽",
        time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: "success",
      },
    ]
    await fs.writeFile(activitiesFile, JSON.stringify(activities, null, 2))
    console.log("✅ 活動數據已初始化")

    // 初始化登錄嘗試數據
    const loginAttemptsFile = path.join(DATA_DIR, "login-attempts.json")
    const loginAttempts = [
      {
        id: uuidv4(),
        ip: "192.168.1.100",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: "success",
        location: "台灣",
      },
    ]
    await fs.writeFile(loginAttemptsFile, JSON.stringify(loginAttempts, null, 2))
    console.log("✅ 登錄嘗試數據已初始化")

    console.log("🎉 所有數據初始化完成！")
  } catch (error) {
    console.error("❌ 初始化失敗:", error)
  }
}

initializeData()
