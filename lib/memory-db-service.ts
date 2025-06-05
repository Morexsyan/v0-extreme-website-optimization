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

// In-memory database
class MemoryDatabase {
  private static instance: MemoryDatabase
  private articles: Article[] = []
  private projects: Project[] = []
  private stats: SystemStat = {
    totalViews: 0,
    totalArticles: 0,
    totalProjects: 0,
    securityAlerts: 0,
    lastUpdated: new Date().toISOString(),
  }
  private activities: Activity[] = []
  private loginAttempts: LoginAttempt[] = []
  private initialized = false

  private constructor() {}

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase()
    }
    return MemoryDatabase.instance
  }

  public async initialize() {
    if (this.initialized) {
      return
    }

    console.log("🔄 Initializing in-memory database...")

    // Initialize articles
    this.articles = [
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

    // Initialize projects
    this.projects = [
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

    // Initialize stats
    this.stats = {
      totalViews: 125600,
      totalArticles: 42,
      totalProjects: 18,
      securityAlerts: 0,
      lastUpdated: new Date().toISOString(),
    }

    // Initialize activities
    this.activities = [
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

    // Initialize login attempts
    this.loginAttempts = [
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

    this.initialized = true
    console.log("✅ In-memory database initialized successfully!")
  }

  // Articles CRUD operations
  public async getArticles(): Promise<Article[]> {
    await this.initialize()
    return [...this.articles]
  }

  public async getArticleById(id: string): Promise<Article | null> {
    await this.initialize()
    return this.articles.find((article) => article.id === id) || null
  }

  public async createArticle(article: Omit<Article, "id">): Promise<Article> {
    await this.initialize()
    const newArticle: Article = {
      ...article,
      id: uuidv4(),
    }
    this.articles.push(newArticle)
    return newArticle
  }

  public async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    await this.initialize()
    const index = this.articles.findIndex((article) => article.id === id)
    if (index === -1) return null

    this.articles[index] = { ...this.articles[index], ...updates }
    return this.articles[index]
  }

  public async deleteArticle(id: string): Promise<boolean> {
    await this.initialize()
    const initialLength = this.articles.length
    this.articles = this.articles.filter((article) => article.id !== id)
    return this.articles.length !== initialLength
  }

  // Projects CRUD operations
  public async getProjects(): Promise<Project[]> {
    await this.initialize()
    return [...this.projects]
  }

  public async getProjectById(id: string): Promise<Project | null> {
    await this.initialize()
    return this.projects.find((project) => project.id === id) || null
  }

  public async createProject(project: Omit<Project, "id">): Promise<Project> {
    await this.initialize()
    const newProject: Project = {
      ...project,
      id: uuidv4(),
    }
    this.projects.push(newProject)
    return newProject
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    await this.initialize()
    const index = this.projects.findIndex((project) => project.id === id)
    if (index === -1) return null

    this.projects[index] = { ...this.projects[index], ...updates }
    return this.projects[index]
  }

  public async deleteProject(id: string): Promise<boolean> {
    await this.initialize()
    const initialLength = this.projects.length
    this.projects = this.projects.filter((project) => project.id !== id)
    return this.projects.length !== initialLength
  }

  // Stats operations
  public async getStats(): Promise<SystemStat> {
    await this.initialize()
    return { ...this.stats }
  }

  public async updateStats(updates: Partial<SystemStat>): Promise<SystemStat> {
    await this.initialize()
    this.stats = {
      ...this.stats,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }
    return { ...this.stats }
  }

  // Activities operations
  public async getActivities(limit = 10): Promise<Activity[]> {
    await this.initialize()
    return [...this.activities].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, limit)
  }

  public async addActivity(activity: Omit<Activity, "id">): Promise<Activity> {
    await this.initialize()
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
    }
    this.activities.push(newActivity)

    // Update stats
    if (activity.type === "warning" || activity.type === "error") {
      this.stats.securityAlerts += 1
      this.stats.lastUpdated = new Date().toISOString()
    }

    return newActivity
  }

  // Login attempts operations
  public async getLoginAttempts(limit = 10): Promise<LoginAttempt[]> {
    await this.initialize()
    return [...this.loginAttempts]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit)
  }

  public async addLoginAttempt(attempt: Omit<LoginAttempt, "id">): Promise<LoginAttempt> {
    await this.initialize()
    const newAttempt: LoginAttempt = {
      ...attempt,
      id: uuidv4(),
    }
    this.loginAttempts.push(newAttempt)

    // Add activity
    await this.addActivity({
      action: `登錄${attempt.status === "success" ? "成功" : "失敗"} (${attempt.ip})`,
      time: attempt.time,
      type: attempt.status === "success" ? "success" : "warning",
      details: `IP: ${attempt.ip}, 位置: ${attempt.location}`,
    })

    return newAttempt
  }
}

// Export singleton instance
const db = MemoryDatabase.getInstance()

// Export functions that use the singleton
export async function initializeDatabase() {
  await db.initialize()
}

export async function getArticles(): Promise<Article[]> {
  return db.getArticles()
}

export async function getArticleById(id: string): Promise<Article | null> {
  return db.getArticleById(id)
}

export async function createArticle(article: Omit<Article, "id">): Promise<Article> {
  return db.createArticle(article)
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  return db.updateArticle(id, updates)
}

export async function deleteArticle(id: string): Promise<boolean> {
  return db.deleteArticle(id)
}

export async function getProjects(): Promise<Project[]> {
  return db.getProjects()
}

export async function getProjectById(id: string): Promise<Project | null> {
  return db.getProjectById(id)
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  return db.createProject(project)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  return db.updateProject(id, updates)
}

export async function deleteProject(id: string): Promise<boolean> {
  return db.deleteProject(id)
}

export async function getStats(): Promise<SystemStat> {
  return db.getStats()
}

export async function updateStats(updates: Partial<SystemStat>): Promise<SystemStat> {
  return db.updateStats(updates)
}

export async function getActivities(limit = 10): Promise<Activity[]> {
  return db.getActivities(limit)
}

export async function addActivity(activity: Omit<Activity, "id">): Promise<Activity> {
  return db.addActivity(activity)
}

export async function getLoginAttempts(limit = 10): Promise<LoginAttempt[]> {
  return db.getLoginAttempts(limit)
}

export async function addLoginAttempt(attempt: Omit<LoginAttempt, "id">): Promise<LoginAttempt> {
  return db.addLoginAttempt(attempt)
}
