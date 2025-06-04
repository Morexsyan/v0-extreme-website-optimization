// Database service for handling data operations
import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Define data types
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

// Path to data files
const DATA_DIR = path.join(process.cwd(), "data")
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")
const STATS_FILE = path.join(DATA_DIR, "stats.json")
const ACTIVITIES_FILE = path.join(DATA_DIR, "activities.json")
const LOGIN_ATTEMPTS_FILE = path.join(DATA_DIR, "login-attempts.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Initialize data files if they don't exist
async function initializeDataFiles() {
  await ensureDataDir()

  // Initialize articles
  try {
    await fs.access(ARTICLES_FILE)
  } catch {
    const initialArticles: Article[] = [
      {
        id: uuidv4(),
        title: "Advanced SQL Injection in Modern Web Applications",
        status: "published",
        views: 12500,
        likes: 892,
        date: "2024-01-15",
        excerpt: "深入分析現代 Web 應用程式中的高級 SQL 注入技術，包括 WAF 繞過、盲注技巧和自動化工具開發。",
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
        author: "Syan",
        category: "Malware Analysis",
      },
    ]
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(initialArticles, null, 2))
  }

  // Initialize projects
  try {
    await fs.access(PROJECTS_FILE)
  } catch {
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
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2))
  }

  // Initialize stats
  try {
    await fs.access(STATS_FILE)
  } catch {
    const initialStats: SystemStat = {
      totalViews: 125600,
      totalArticles: 42,
      totalProjects: 18,
      securityAlerts: 0,
      lastUpdated: new Date().toISOString(),
    }
    await fs.writeFile(STATS_FILE, JSON.stringify(initialStats, null, 2))
  }

  // Initialize activities
  try {
    await fs.access(ACTIVITIES_FILE)
  } catch {
    const initialActivities: Activity[] = [
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
      {
        id: uuidv4(),
        action: "管理員登錄成功",
        time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        type: "warning",
      },
      {
        id: uuidv4(),
        action: "系統自動備份完成",
        time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        type: "info",
      },
    ]
    await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(initialActivities, null, 2))
  }

  // Initialize login attempts
  try {
    await fs.access(LOGIN_ATTEMPTS_FILE)
  } catch {
    const initialLoginAttempts: LoginAttempt[] = [
      {
        id: uuidv4(),
        ip: "192.168.1.100",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: "success",
        location: "台灣",
      },
      {
        id: uuidv4(),
        ip: "10.0.0.1",
        time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: "failure",
        location: "未知",
      },
      {
        id: uuidv4(),
        ip: "192.168.1.100",
        time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: "success",
        location: "台灣",
      },
    ]
    await fs.writeFile(LOGIN_ATTEMPTS_FILE, JSON.stringify(initialLoginAttempts, null, 2))
  }
}

// Remove the automatic initialization call at module level

// Read data from files
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data) as T[]
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error)
    return []
  }
}

// Write data to files
async function writeData<T>(filePath: string, data: T[]): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error)
    return false
  }
}

// Articles CRUD operations
export async function getArticles(): Promise<Article[]> {
  await initializeDataFiles()
  return readData<Article>(ARTICLES_FILE)
}

export async function getArticleById(id: string): Promise<Article | null> {
  await initializeDataFiles()
  const articles = await getArticles()
  return articles.find((article) => article.id === id) || null
}

export async function createArticle(article: Omit<Article, "id">): Promise<Article> {
  await initializeDataFiles()
  const articles = await getArticles()
  const newArticle: Article = {
    ...article,
    id: uuidv4(),
  }
  articles.push(newArticle)
  await writeData(ARTICLES_FILE, articles)
  return newArticle
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  await initializeDataFiles()
  const articles = await getArticles()
  const index = articles.findIndex((article) => article.id === id)
  if (index === -1) return null

  articles[index] = { ...articles[index], ...updates }
  await writeData(ARTICLES_FILE, articles)
  return articles[index]
}

export async function deleteArticle(id: string): Promise<boolean> {
  await initializeDataFiles()
  const articles = await getArticles()
  const filteredArticles = articles.filter((article) => article.id !== id)
  if (filteredArticles.length === articles.length) return false

  return writeData(ARTICLES_FILE, filteredArticles)
}

// Projects CRUD operations
export async function getProjects(): Promise<Project[]> {
  await initializeDataFiles()
  return readData<Project>(PROJECTS_FILE)
}

export async function getProjectById(id: string): Promise<Project | null> {
  await initializeDataFiles()
  const projects = await getProjects()
  return projects.find((project) => project.id === id) || null
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  await initializeDataFiles()
  const projects = await getProjects()
  const newProject: Project = {
    ...project,
    id: uuidv4(),
  }
  projects.push(newProject)
  await writeData(PROJECTS_FILE, projects)
  return newProject
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  await initializeDataFiles()
  const projects = await getProjects()
  const index = projects.findIndex((project) => project.id === id)
  if (index === -1) return null

  projects[index] = { ...projects[index], ...updates }
  await writeData(PROJECTS_FILE, projects)
  return projects[index]
}

export async function deleteProject(id: string): Promise<boolean> {
  await initializeDataFiles()
  const projects = await getProjects()
  const filteredProjects = projects.filter((project) => project.id !== id)
  if (filteredProjects.length === projects.length) return false

  return writeData(PROJECTS_FILE, filteredProjects)
}

// Stats operations
export async function getStats(): Promise<SystemStat> {
  await initializeDataFiles()
  try {
    const data = await fs.readFile(STATS_FILE, "utf-8")
    return JSON.parse(data) as SystemStat
  } catch (error) {
    console.error("Error reading stats:", error)
    return {
      totalViews: 0,
      totalArticles: 0,
      totalProjects: 0,
      securityAlerts: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}

export async function updateStats(updates: Partial<SystemStat>): Promise<SystemStat> {
  await initializeDataFiles()
  const stats = await getStats()
  const updatedStats = {
    ...stats,
    ...updates,
    lastUpdated: new Date().toISOString(),
  }

  try {
    await fs.writeFile(STATS_FILE, JSON.stringify(updatedStats, null, 2))
    return updatedStats
  } catch (error) {
    console.error("Error updating stats:", error)
    return stats
  }
}

// Activities operations
export async function getActivities(limit = 10): Promise<Activity[]> {
  await initializeDataFiles()
  const activities = await readData<Activity>(ACTIVITIES_FILE)
  return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, limit)
}

export async function addActivity(activity: Omit<Activity, "id">): Promise<Activity> {
  await initializeDataFiles()
  const activities = await readData<Activity>(ACTIVITIES_FILE)
  const newActivity: Activity = {
    ...activity,
    id: uuidv4(),
  }
  activities.push(newActivity)
  await writeData(ACTIVITIES_FILE, activities)

  // Update stats
  const stats = await getStats()
  if (activity.type === "warning" || activity.type === "error") {
    await updateStats({ securityAlerts: stats.securityAlerts + 1 })
  }

  return newActivity
}

// Login attempts operations
export async function getLoginAttempts(limit = 10): Promise<LoginAttempt[]> {
  await initializeDataFiles()
  const attempts = await readData<LoginAttempt>(LOGIN_ATTEMPTS_FILE)
  return attempts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, limit)
}

export async function addLoginAttempt(attempt: Omit<LoginAttempt, "id">): Promise<LoginAttempt> {
  await initializeDataFiles()
  const attempts = await readData<LoginAttempt>(LOGIN_ATTEMPTS_FILE)
  const newAttempt: LoginAttempt = {
    ...attempt,
    id: uuidv4(),
  }
  attempts.push(newAttempt)
  await writeData(LOGIN_ATTEMPTS_FILE, attempts)

  // Add activity
  await addActivity({
    action: `登錄${attempt.status === "success" ? "成功" : "失敗"} (${attempt.ip})`,
    time: attempt.time,
    type: attempt.status === "success" ? "success" : "warning",
    details: `IP: ${attempt.ip}, 位置: ${attempt.location}`,
  })

  return newAttempt
}

// Export the initialization function
export { initializeDataFiles }
