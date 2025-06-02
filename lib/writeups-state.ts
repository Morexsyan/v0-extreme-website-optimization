// WriteUps 狀態管理系統
export interface WriteUpMetrics {
  views: number
  likes: number
  shares: number
  comments: number
}

export interface WriteUpState {
  [writeupId: string]: WriteUpMetrics
}

class WriteUpStateManager {
  private static instance: WriteUpStateManager
  private state: WriteUpState = {}
  private listeners: Set<() => void> = new Set()

  private constructor() {
    this.loadFromStorage()
  }

  public static getInstance(): WriteUpStateManager {
    if (!WriteUpStateManager.instance) {
      WriteUpStateManager.instance = new WriteUpStateManager()
    }
    return WriteUpStateManager.instance
  }

  private loadFromStorage(): void {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("writeups-metrics")
        if (saved) {
          this.state = JSON.parse(saved)
        }
      } catch (error) {
        console.warn("Failed to load writeups metrics from localStorage:", error)
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("writeups-metrics", JSON.stringify(this.state))
      } catch (error) {
        console.warn("Failed to save writeups metrics to localStorage:", error)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public getMetrics(writeupId: string): WriteUpMetrics {
    return this.state[writeupId] || { views: 0, likes: 0, shares: 0, comments: 0 }
  }

  public incrementViews(writeupId: string): void {
    if (!this.state[writeupId]) {
      this.state[writeupId] = { views: 0, likes: 0, shares: 0, comments: 0 }
    }
    this.state[writeupId].views += 1
    this.saveToStorage()
    this.notifyListeners()
  }

  public incrementLikes(writeupId: string): number {
    if (!this.state[writeupId]) {
      this.state[writeupId] = { views: 0, likes: 0, shares: 0, comments: 0 }
    }
    this.state[writeupId].likes += 1
    this.saveToStorage()
    this.notifyListeners()
    return this.state[writeupId].likes
  }

  public decrementLikes(writeupId: string): number {
    if (!this.state[writeupId]) {
      this.state[writeupId] = { views: 0, likes: 0, shares: 0, comments: 0 }
    }
    this.state[writeupId].likes = Math.max(0, this.state[writeupId].likes - 1)
    this.saveToStorage()
    this.notifyListeners()
    return this.state[writeupId].likes
  }

  public incrementShares(writeupId: string): void {
    if (!this.state[writeupId]) {
      this.state[writeupId] = { views: 0, likes: 0, shares: 0, comments: 0 }
    }
    this.state[writeupId].shares += 1
    this.saveToStorage()
    this.notifyListeners()
  }

  public getAllMetrics(): WriteUpState {
    return { ...this.state }
  }

  public getTotalStats(): { totalViews: number; totalLikes: number; totalShares: number } {
    const metrics = Object.values(this.state)
    return {
      totalViews: metrics.reduce((sum, m) => sum + m.views, 0),
      totalLikes: metrics.reduce((sum, m) => sum + m.likes, 0),
      totalShares: metrics.reduce((sum, m) => sum + m.shares, 0),
    }
  }

  public hasLiked(writeupId: string): boolean {
    if (typeof window !== "undefined") {
      const liked = localStorage.getItem(`writeup-liked-${writeupId}`)
      return liked === "true"
    }
    return false
  }

  public setLiked(writeupId: string, liked: boolean): void {
    if (typeof window !== "undefined") {
      if (liked) {
        localStorage.setItem(`writeup-liked-${writeupId}`, "true")
      } else {
        localStorage.removeItem(`writeup-liked-${writeupId}`)
      }
    }
  }

  public hasViewed(writeupId: string): boolean {
    if (typeof window !== "undefined") {
      const viewed = localStorage.getItem(`writeup-viewed-${writeupId}`)
      return viewed === "true"
    }
    return false
  }

  public setViewed(writeupId: string): void {
    if (typeof window !== "undefined") {
      const alreadyViewed = this.hasViewed(writeupId)
      if (!alreadyViewed) {
        localStorage.setItem(`writeup-viewed-${writeupId}`, "true")
        this.incrementViews(writeupId)
      }
    }
  }
}

export default WriteUpStateManager
