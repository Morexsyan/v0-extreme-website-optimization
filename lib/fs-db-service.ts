// 真實的文件系統數據庫服務
import fs from "fs/promises"
import path from "path"
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

// 數據文件路徑 - 使用 public 目錄確保可寫入
const DATA_DIR = path.join(process.cwd(), "public", "data")
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")
const STATS_FILE = path.join(DATA_DIR, "stats.json")
const ACTIVITIES_FILE = path.join(DATA_DIR, "activities.json")
const LOGIN_ATTEMPTS_FILE = path.join(DATA_DIR, "login-attempts.json")

// 確保數據目錄存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
    console.log("✅ Data directory exists:", DATA_DIR)
  } catch {
    console.log("📁 Creating data directory:", DATA_DIR)
    await fs.mkdir(DATA_DIR, { recursive: true })
    console.log("✅ Data directory created successfully")
  }
}

// 安全地讀取 JSON 文件
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    console.log(`📖 Reading file: ${filePath}`)
    const data = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(data)
    console.log(`✅ Successfully read ${filePath}, items: ${Array.isArray(parsed) ? parsed.length : "object"}`)
    return parsed
  } catch (error) {
    console.log(`⚠️ File ${filePath} not found or invalid, using default value`)
    return defaultValue
  }
}

// 安全地寫入 JSON 文件
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, "utf-8")
    console.log(`✅ Successfully wrote to ${filePath}, size: ${jsonData.length} bytes`)
  } catch (error) {
    console.error(`❌ Failed to write to ${filePath}:`, error)
    throw new Error(`Failed to write to ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// 初始化所有數據文件
export async function initializeDatabase(): Promise<void> {
  console.log("🔄 Initializing file system database...")

  await ensureDataDir()

  // 初始化文章數據
  const articles = await readJsonFile<Article[]>(ARTICLES_FILE, [])
  if (articles.length === 0) {
    const initialArticles: Article[] = [
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
    await writeJsonFile(ARTICLES_FILE, initialArticles)
    console.log("📝 Initialized articles data")
  }

  // 初始化項目數據
  const projects = await readJsonFile<Project[]>(PROJECTS_FILE, [])
  if (projects.length === 0) {
    const initialProjects: Project[] = [
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
    await writeJsonFile(PROJECTS_FILE, initialProjects)
    console.log("🚀 Initialized projects data")
  }

  // 初始化統計數據
  const stats = await readJsonFile<SystemStat>(STATS_FILE, {
    totalViews: 125600,
    totalArticles: 42,
    totalProjects: 18,
    securityAlerts: 0,
    lastUpdated: new Date().toISOString(),
  })
  await writeJsonFile(STATS_FILE, stats)
  console.log("📊 Initialized stats data")

  // 初始化活動數據
  const activities = await readJsonFile<Activity[]>(ACTIVITIES_FILE, [])
  if (activities.length === 0) {
    const initialActivities: Activity[] = [
      {
        id: uuidv4(),
        action: "系統初始化完成",
        time: new Date().toISOString(),
        type: "success",
      },
      {
        id: uuidv4(),
        action: "數據庫文件創建成功",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: "info",
      },
    ]
    await writeJsonFile(ACTIVITIES_FILE, initialActivities)
    console.log("📋 Initialized activities data")
  }

  // 初始化登錄嘗試數據
  const loginAttempts = await readJsonFile<LoginAttempt[]>(LOGIN_ATTEMPTS_FILE, [])
  if (loginAttempts.length === 0) {
    const initialLoginAttempts: LoginAttempt[] = [
      {
        id: uuidv4(),
        ip: "192.168.1.100",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: "success",
        location: "台灣",
      },
    ]
    await writeJsonFile(LOGIN_ATTEMPTS_FILE, initialLoginAttempts)
    console.log("🔐 Initialized login attempts data")
  }

  console.log("✅ File system database initialization complete!")
}

// 文章 CRUD 操作
export async function getArticles(): Promise<Article[]> {
  console.log("📖 Getting all articles...")
  const articles = await readJsonFile<Article[]>(ARTICLES_FILE, [])
  console.log(`✅ Retrieved ${articles.length} articles`)
  return articles
}

export async function getArticleById(id: string): Promise<Article | null> {
  console.log(`📖 Getting article by ID: ${id}`)
  const articles = await getArticles()
  const article = articles.find((a) => a.id === id) || null
  console.log(article ? "✅ Article found" : "❌ Article not found")
  return article
}

export async function createArticle(articleData: Omit<Article, "id">): Promise<Article> {
  console.log("📝 Creating new article:", articleData.title)

  const articles = await getArticles()
  const newArticle: Article = {
    ...articleData,
    id: uuidv4(),
  }

  articles.push(newArticle)
  await writeJsonFile(ARTICLES_FILE, articles)

  // 記錄活動
  await addActivity({
    action: `新文章已創建: ${newArticle.title}`,
    time: new Date().toISOString(),
    type: "success",
  })

  console.log("✅ Article created successfully:", newArticle.id)
  return newArticle
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  console.log(`📝 Updating article: ${id}`)

  const articles = await getArticles()
  const index = articles.findIndex((a) => a.id === id)

  if (index === -1) {
    console.log("❌ Article not found for update")
    return null
  }

  articles[index] = { ...articles[index], ...updates }
  await writeJsonFile(ARTICLES_FILE, articles)

  // 記錄活動
  await addActivity({
    action: `文章已更新: ${articles[index].title}`,
    time: new Date().toISOString(),
    type: "info",
  })

  console.log("✅ Article updated successfully")
  return articles[index]
}

export async function deleteArticle(id: string): Promise<boolean> {
  console.log(`🗑️ Deleting article: ${id}`)

  const articles = await getArticles()
  const articleToDelete = articles.find((a) => a.id === id)

  if (!articleToDelete) {
    console.log("❌ Article not found for deletion")
    return false
  }

  const filteredArticles = articles.filter((a) => a.id !== id)
  await writeJsonFile(ARTICLES_FILE, filteredArticles)

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
  const projects = await readJsonFile<Project[]>(PROJECTS_FILE, [])
  console.log(`✅ Retrieved ${projects.length} projects`)
  return projects
}

export async function getProjectById(id: string): Promise<Project | null> {
  console.log(`📖 Getting project by ID: ${id}`)
  const projects = await getProjects()
  const project = projects.find((p) => p.id === id) || null
  console.log(project ? "✅ Project found" : "❌ Project not found")
  return project
}

export async function createProject(projectData: Omit<Project, "id">): Promise<Project> {
  console.log("🚀 Creating new project:", projectData.name)

  const projects = await getProjects()
  const newProject: Project = {
    ...projectData,
    id: uuidv4(),
  }

  projects.push(newProject)
  await writeJsonFile(PROJECTS_FILE, projects)

  // 記錄活動
  await addActivity({
    action: `新項目已創建: ${newProject.name}`,
    time: new Date().toISOString(),
    type: "success",
  })

  console.log("✅ Project created successfully:", newProject.id)
  return newProject
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  console.log(`🚀 Updating project: ${id}`)

  const projects = await getProjects()
  const index = projects.findIndex((p) => p.id === id)

  if (index === -1) {
    console.log("❌ Project not found for update")
    return null
  }

  projects[index] = { ...projects[index], ...updates }
  await writeJsonFile(PROJECTS_FILE, projects)

  // 記錄活動
  await addActivity({
    action: `項目已更新: ${projects[index].name}`,
    time: new Date().toISOString(),
    type: "info",
  })

  console.log("✅ Project updated successfully")
  return projects[index]
}

export async function deleteProject(id: string): Promise<boolean> {
  console.log(`🗑️ Deleting project: ${id}`)

  const projects = await getProjects()
  const projectToDelete = projects.find((p) => p.id === id)

  if (!projectToDelete) {
    console.log("❌ Project not found for deletion")
    return false
  }

  const filteredProjects = projects.filter((p) => p.id !== id)
  await writeJsonFile(PROJECTS_FILE, filteredProjects)

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
  const stats = await readJsonFile<SystemStat>(STATS_FILE, {
    totalViews: 0,
    totalArticles: 0,
    totalProjects: 0,
    securityAlerts: 0,
    lastUpdated: new Date().toISOString(),
  })
  console.log("✅ Stats retrieved")
  return stats
}

export async function updateStats(updates: Partial<SystemStat>): Promise<SystemStat> {
  console.log("📊 Updating system stats...")

  const stats = await getStats()
  const updatedStats = {
    ...stats,
    ...updates,
    lastUpdated: new Date().toISOString(),
  }

  await writeJsonFile(STATS_FILE, updatedStats)
  console.log("✅ Stats updated successfully")
  return updatedStats
}

// 活動操作
export async function getActivities(limit = 10): Promise<Activity[]> {
  console.log(`📋 Getting activities (limit: ${limit})...`)
  const activities = await readJsonFile<Activity[]>(ACTIVITIES_FILE, [])
  const sortedActivities = activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit)
  console.log(`✅ Retrieved ${sortedActivities.length} activities`)
  return sortedActivities
}

export async function addActivity(activityData: Omit<Activity, "id">): Promise<Activity> {
  console.log("📋 Adding new activity:", activityData.action)

  const activities = await readJsonFile<Activity[]>(ACTIVITIES_FILE, [])
  const newActivity: Activity = {
    ...activityData,
    id: uuidv4(),
  }

  activities.push(newActivity)
  await writeJsonFile(ACTIVITIES_FILE, activities)

  console.log("✅ Activity added successfully")
  return newActivity
}

// 登錄嘗試操作
export async function getLoginAttempts(limit = 10): Promise<LoginAttempt[]> {
  console.log(`🔐 Getting login attempts (limit: ${limit})...`)
  const attempts = await readJsonFile<LoginAttempt[]>(LOGIN_ATTEMPTS_FILE, [])
  const sortedAttempts = attempts
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit)
  console.log(`✅ Retrieved ${sortedAttempts.length} login attempts`)
  return sortedAttempts
}

export async function addLoginAttempt(attemptData: Omit<LoginAttempt, "id">): Promise<LoginAttempt> {
  console.log("🔐 Adding new login attempt:", attemptData.ip)

  const attempts = await readJsonFile<LoginAttempt[]>(LOGIN_ATTEMPTS_FILE, [])
  const newAttempt: LoginAttempt = {
    ...attemptData,
    id: uuidv4(),
  }

  attempts.push(newAttempt)
  await writeJsonFile(LOGIN_ATTEMPTS_FILE, attempts)

  // 記錄活動
  await addActivity({
    action: `登錄${attemptData.status === "success" ? "成功" : "失敗"} (${attemptData.ip})`,
    time: attemptData.time,
    type: attemptData.status === "success" ? "success" : "warning",
    details: `IP: ${attemptData.ip}, 位置: ${attemptData.location}`,
  })

  console.log("✅ Login attempt added successfully")
  return newAttempt
}
