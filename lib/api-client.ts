// API client for making requests to the backend
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      console.log(`🌐 API Request: ${options.method || "GET"} ${endpoint}`)

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      console.log(`📡 API Response: ${response.status} ${response.ok ? "✅" : "❌"}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("❌ API Error:", errorData)
        throw new ApiError(errorData.error || errorData.message || "API request failed", response.status)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error("❌ API Request failed:", error)
      throw new ApiError(error instanceof Error ? error.message : "Unknown error", 500)
    }
  }

  // Dashboard
  async getDashboardStats() {
    return this.request("/api/admin/stats")
  }

  async updateDashboardStats(updates: any) {
    return this.request("/api/admin/stats", {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  // Articles
  async getArticles() {
    return this.request("/api/admin/articles")
  }

  async getArticle(id: string) {
    return this.request(`/api/admin/articles/${id}`)
  }

  async createArticle(article: any) {
    return this.request("/api/admin/articles", {
      method: "POST",
      body: JSON.stringify(article),
    })
  }

  async updateArticle(id: string, updates: any) {
    return this.request(`/api/admin/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteArticle(id: string) {
    return this.request(`/api/admin/articles/${id}`, {
      method: "DELETE",
    })
  }

  // Projects
  async getProjects() {
    return this.request("/api/admin/projects")
  }

  async getProject(id: string) {
    return this.request(`/api/admin/projects/${id}`)
  }

  async createProject(project: any) {
    return this.request("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(project),
    })
  }

  async updateProject(id: string, updates: any) {
    return this.request(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteProject(id: string) {
    return this.request(`/api/admin/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Activities
  async getActivities(limit = 10) {
    return this.request(`/api/admin/activities?limit=${limit}`)
  }

  async addActivity(activity: any) {
    return this.request("/api/admin/activities", {
      method: "POST",
      body: JSON.stringify(activity),
    })
  }

  // Login attempts
  async getLoginAttempts(limit = 10) {
    return this.request(`/api/admin/login-attempts?limit=${limit}`)
  }

  async addLoginAttempt(attempt: any) {
    return this.request("/api/admin/login-attempts", {
      method: "POST",
      body: JSON.stringify(attempt),
    })
  }

  // Database initialization
  async initializeDatabase() {
    return this.request("/api/admin/init", {
      method: "POST",
    })
  }

  async checkDatabaseStatus() {
    return this.request("/api/admin/init")
  }
}

export const apiClient = new ApiClient()
