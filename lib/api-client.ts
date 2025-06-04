// Real API client for making HTTP requests
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    console.log(`🌐 API Request: ${options.method || "GET"} ${url}`)

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      console.log(`📡 API Response: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`❌ API Error:`, errorData)
        throw new ApiError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        )
      }

      const data = await response.json()
      console.log(`✅ API Success:`, data)
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error(`🔥 Network Error:`, error)
      throw new ApiError("Network error occurred", 0, error)
    }
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request("/api/admin/stats")
  }

  async updateDashboardStats(updates: any) {
    return this.request("/api/admin/stats", {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  // Articles API
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

  // Projects API
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

  // Activities API
  async getActivities() {
    return this.request("/api/admin/activities")
  }

  // Login attempts API
  async getLoginAttempts() {
    return this.request("/api/admin/login-attempts")
  }
}

export const apiClient = new ApiClient()
export { ApiError }
