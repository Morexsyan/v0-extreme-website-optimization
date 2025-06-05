// 基於內存的數據庫服務
import { v4 as uuidv4 } from "uuid"

// 定義數據類型
export interface Article {
  id: string
  title: string
  status: "published" | "draft"
  views: number
  likes: number
  date: string
  content?: string
  excerpt: string
  author: string
  category: string
}

export interface Project {
  id: string
  name: string
  status: "active" | "completed" | "development"
  progress: number
  description: string
  technologies: string[]
  startDate: string
  endDate?: string
}

export interface SystemStat {
  totalViews: number
  totalArticles: number
  totalProjects: number
  securityAlerts: number
  lastUpdated: string
}

export interface Activity {
  id: string
  action: string
  time: string
  type: "info" | "success" | "warning" | "error"
  details?: string
  ip?: string
}

export interface LoginAttempt {
  id: string
  ip: string
  time: string
  status: "success" | "failure"
  location: string
  details?: string
}

// 內存數據存儲
// 使用 global 對象來存儲數據，這樣在 Next.js 的 API 路由中數據可以在請求之間保持
declare global {
  var __memoryDb: {
    articles: Article[]
    projects: Project[]
    stats: SystemStat
    activities: Activity[]
    loginAttempts: LoginAttempt[]
    initialized: boolean
  }
}

// 初始化全局數據存儲
if (!global.__memoryDb) {
  global.__memoryDb = {
    articles: [],
    projects: [],
    stats: {
      totalViews: 0,
      totalArticles: 0,
      totalProjects: 0,
      securityAlerts: 0,
      lastUpdated: new Date().toISOString(),
    },
    activities: [],
    loginAttempts: [],
    initialized: false,
  }
}

// 初始化數據庫
export async function initializeDatabase(): Promise<void> {
  console.log("🔄 Initializing memory database...")

  // 如果已經初始化過，則跳過
  if (global.__memoryDb.initialized) {
    console.log("✅ Memory database already initialized")
    return
  }

  // 初始化文章數據
  if (global.__memoryDb.articles.length === 0) {
    global.__memoryDb.articles = [
      {
        id: uuidv4(),
        title: "Advanced SQL Injection in Modern Web Applications",
        status: "published",
        views: 12500,
        likes: 892,
        date: "2024-01-15",
        excerpt: "深入分析現代 Web 應用程式中的高級 SQL 注入技術，包括 WAF 繞過、盲注技巧和自動化工具開發。",
        content: "這是一篇關於高級 SQL 注入技術的詳細文章...",
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
        excerpt: "實現量子密碼學協議，探討量子金鑰分發和後量子密碼學的實際應用。",
        content: "量子密碼學是未來信息安全的重要方向...",
        author: "Syan",
        category: "Cryptography",
      },
      {
        id: uuidv4(),
        title: "AI-Powered Malware Analysis",
        status: "published",
        views: 15200,
        likes: 1024,
        date: "2024-01-08",
        excerpt: "使用機器學習和深度學習技術自動化惡意軟體分析流程，提高檢測效率和準確性。",
        content: "人工智能在惡意軟體分析中的應用越來越廣泛...",
        author: "Syan",
        category: "Malware Analysis",
      },
    ]
    console.log("📝 Initialized articles data")
  }

  // 初始化項目數據
  if (global.__memoryDb.projects.length === 0) {
    global.__memoryDb.projects = [
      {
        id: uuidv4(),
        name: "QuantumUI Framework",
        status: "development",
        progress: 75,
        description: "革命性的量子計算驅動 3D 使用者介面框架",
        technologies: ["WebGPU", "Quantum.js", "Three.js", "TypeScript"],
        startDate: "2023-10-15",
      },
      {
        id: uuidv4(),
        name: "NeuralStack Backend",
        status: "completed",
        progress: 100,
        description: "使用深度學習自動優化的神經網絡後端架構",
        technologies: ["Rust", "TensorFlow", "Kubernetes", "GraphQL"],
        startDate: "2023-08-01",
        endDate: "2023-12-20",
      },
      {
        id: uuidv4(),
        name: "SecureVault Crypto",
        status: "active",
        progress: 90,
        description: "企業級量子抗性安全架構",
        technologies: ["Post-Quantum Crypto", "Zero Trust", "Golang"],
        startDate: "2023-11-05",
      },
    ]
    console.log("🚀 Initialized projects data")
  }

  // 初始化統計數據
  global.__memoryDb.stats = {
    totalViews: 125600,
    totalArticles: global.__memoryDb.articles.length,
    totalProjects: global.__memoryDb.projects.length,
    securityAlerts: 0,
    lastUpdated: new Date().toISOString(),
  }
  console.log("📊 Initialized stats data")

  // 初始化活動數據
  if (global.__memoryDb.activities.length === 0) {
    global.__memoryDb.activities = [
      {
        id: uuidv4(),
        action: "系統初始化完成",
        time: new Date().toISOString(),
        type: "success",
      },
      {
        id: uuidv4(),
        action: "內存數據庫創建成功",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: "info",
      },
    ]
    console.log("📋 Initialized activities data")
  }

  // 初始化登錄嘗試數據
  if (global.__memoryDb.loginAttempts.length === 0) {
    global.__memoryDb.loginAttempts = [
      {
        id: uuidv4(),
        ip: "192.168.1.100",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: "success",
        location: "台灣",
      },
    ]
    console.log("🔐 Initialized login attempts data")
  }

  // 標記為已初始化
  global.__memoryDb.initialized = true
  console.log("✅ Memory database initialization complete!")
}

// 文章 CRUD 操作
export async function getArticles(): Promise<Article[]> {
  console.log("📖 Getting all articles...")
  await initializeDatabase()
  console.log(`✅ Retrieved ${global.__memoryDb.articles.length} articles`)
  return [...global.__memoryDb.articles]
}

export async function getArticleById(id: string): Promise<Article | null> {
  console.log(`📖 Getting article by ID: ${id}`)
  await initializeDatabase()
  const article = global.__memoryDb.articles.find((a) => a.id === id) || null
  console.log(article ? "✅ Article found" : "❌ Article not found")
  return article ? { ...article } : null
}

export async function createArticle(articleData: Omit<Article, "id">): Promise<Article> {
  console.log("📝 Creating new article:", articleData.title)
  await initializeDatabase()

  const newArticle: Article = {
    ...articleData,
    id: uuidv4(),
  }

  global.__memoryDb.articles.push(newArticle)

  // 更新統計數據
  global.__memoryDb.stats.totalArticles = global.__memoryDb.articles.length
  global.__memoryDb.stats.lastUpdated = new Date().toISOString()

  // 記錄活動
  await addActivity({
    action: `新文章已創建: ${newArticle.title}`,
    time: new Date().toISOString(),
    type: "success",
  })

  console.log("✅ Article created successfully:", newArticle.id)
  return { ...newArticle }
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  console.log(`📝 Updating article: ${id}`)
  await initializeDatabase()

  const index = global.__memoryDb.articles.findIndex((a) => a.id === id)

  if (index === -1) {
    console.log("❌ Article not found for update")
    return null
  }

  global.__memoryDb.articles[index] = { ...global.__memoryDb.articles[index], ...updates }

  // 記錄活動
  await addActivity({
    action: `文章已更新: ${global.__memoryDb.articles[index].title}`,
    time: new Date().toISOString(),
    type: "info",
  })

  console.log("✅ Article updated successfully")
  return { ...global.__memoryDb.articles[index] }
}

export async function deleteArticle(id: string): Promise<boolean> {
  console.log(`🗑️ Deleting article: ${id}`)
  await initializeDatabase()

  const articleToDelete = global.__memoryDb.articles.find((a) => a.id === id)

  if (!articleToDelete) {
    console.log("❌ Article not found for deletion")
    return false
  }

  global.__memoryDb.articles = global.__memoryDb.articles.filter((a) => a.id !== id)

  // 更新統計數據
  global.__memoryDb.stats.totalArticles = global.__memoryDb.articles.length
  global.__memoryDb.stats.lastUpdated = new Date().toISOString()

  // 記錄活動
  await addActivity({
    action: `文章已刪除: ${articleToDelete.title}`,
    time: new Date().toISOString(),
    type: "warning",
  })

  console.log("✅ Article deleted successfully")
  return true
}

// 項目 CRUD 操作
export async function getProjects(): Promise<Project[]> {
  console.log("📖 Getting all projects...")
  await initializeDatabase()
  console.log(`✅ Retrieved ${global.__memoryDb.projects.length} projects`)
  return [...global.__memoryDb.projects]
}

export async function getProjectById(id: string): Promise<Project | null> {
  console.log(`📖 Getting project by ID: ${id}`)
  await initializeDatabase()
  const project = global.__memoryDb.projects.find((p) => p.id === id) || null
  console.log(project ? "✅ Project found" : "❌ Project not found")
  return project ? { ...project } : null
}

export async function createProject(projectData: Omit<Project, "id">): Promise<Project> {
  console.log("🚀 Creating new project:", projectData.name)
  await initializeDatabase()

  const newProject: Project = {
    ...projectData,
    id: uuidv4(),
  }

  global.__memoryDb.projects.push(newProject)

  // 更新統計數據
  global.__memoryDb.stats.totalProjects = global.__memoryDb.projects.length
  global.__memoryDb.stats.lastUpdated = new Date().toISOString()

  // 記錄活動
  await addActivity({
    action: `新項目已創建: ${newProject.name}`,
    time: new Date().toISOString(),
    type: "success",
  })

  console.log("✅ Project created successfully:", newProject.id)
  return { ...newProject }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  console.log(`🚀 Updating project: ${id}`)
  await initializeDatabase()

  const index = global.__memoryDb.projects.findIndex((p) => p.id === id)

  if (index === -1) {
    console.log("❌ Project not found for update")
    return null
  }

  global.__memoryDb.projects[index] = { ...global.__memoryDb.projects[index], ...updates }

  // 記錄活動
  await addActivity({
    action: `項目已更新: ${global.__memoryDb.projects[index].name}`,
    time: new Date().toISOString(),
    type: "info",
  })

  console.log("✅ Project updated successfully")
  return { ...global.__memoryDb.projects[index] }
}

export async function deleteProject(id: string): Promise<boolean> {
  console.log(`🗑️ Deleting project: ${id}`)
  await initializeDatabase()

  const projectToDelete = global.__memoryDb.projects.find((p) => p.id === id)

  if (!projectToDelete) {
    console.log("❌ Project not found for deletion")
    return false
  }

  global.__memoryDb.projects = global.__memoryDb.projects.filter((p) => p.id !== id)

  // 更新統計數據
  global.__memoryDb.stats.totalProjects = global.__memoryDb.projects.length
  global.__memoryDb.stats.lastUpdated = new Date().toISOString()

  // 記錄活動
  await addActivity({
    action: `項目已刪除: ${projectToDelete.name}`,
    time: new Date().toISOString(),
    type: "warning",
  })

  console.log("✅ Project deleted successfully")
  return true
}

// 統計數據操作
export async function getStats(): Promise<SystemStat> {
  console.log("📊 Getting system stats...")
  await initializeDatabase()
  console.log("✅ Stats retrieved")
  return { ...global.__memoryDb.stats }
}

export async function updateStats(updates: Partial<SystemStat>): Promise<SystemStat> {
  console.log("📊 Updating system stats...")
  await initializeDatabase()

  global.__memoryDb.stats = {
    ...global.__memoryDb.stats,
    ...updates,
    lastUpdated: new Date().toISOString(),
  }

  console.log("✅ Stats updated successfully")
  return { ...global.__memoryDb.stats }
}

// 活動操作
export async function getActivities(limit = 10): Promise<Activity[]> {
  console.log(`📋 Getting activities (limit: ${limit})...`)
  await initializeDatabase()

  const sortedActivities = [...global.__memoryDb.activities]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit)

  console.log(`✅ Retrieved ${sortedActivities.length} activities`)
  return sortedActivities
}

export async function addActivity(activityData: Omit<Activity, "id">): Promise<Activity> {
  console.log("📋 Adding new activity:", activityData.action)
  await initializeDatabase()

  const newActivity: Activity = {
    ...activityData,
    id: uuidv4(),
  }

  global.__memoryDb.activities.push(newActivity)

  console.log("✅ Activity added successfully")
  return { ...newActivity }
}

// 登錄嘗試操作
export async function getLoginAttempts(limit = 10): Promise<LoginAttempt[]> {
  console.log(`🔐 Getting login attempts (limit: ${limit})...`)
  await initializeDatabase()

  const sortedAttempts = [...global.__memoryDb.loginAttempts]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit)

  console.log(`✅ Retrieved ${sortedAttempts.length} login attempts`)
  return sortedAttempts
}

export async function addLoginAttempt(attemptData: Omit<LoginAttempt, "id">): Promise<LoginAttempt> {
  console.log("🔐 Adding new login attempt:", attemptData.ip)
  await initializeDatabase()

  const newAttempt: LoginAttempt = {
    ...attemptData,
    id: uuidv4(),
  }

  global.__memoryDb.loginAttempts.push(newAttempt)

  // 記錄活動
  await addActivity({
    action: `登錄${attemptData.status === "success" ? "成功" : "失敗"} (${attemptData.ip})`,
    time: attemptData.time,
    type: attemptData.status === "success" ? "success" : "warning",
    details: `IP: ${attemptData.ip}, 位置: ${attemptData.location}`,
  })

  console.log("✅ Login attempt added successfully")
  return { ...newAttempt }
}

// 檢查數據庫狀態
export async function checkDatabaseStatus(): Promise<{
  initialized: boolean
  articleCount: number
  projectCount: number
  activityCount: number
}> {
  await initializeDatabase()
  return {
    initialized: global.__memoryDb.initialized,
    articleCount: global.__memoryDb.articles.length,
    projectCount: global.__memoryDb.projects.length,
    activityCount: global.__memoryDb.activities.length,
  }
}
