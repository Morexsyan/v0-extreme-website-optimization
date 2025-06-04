// Loading state manager - ensures loading screen only shows on first visit
class LoadingStateManager {
  private static instance: LoadingStateManager
  private hasLoaded = false

  private constructor() {
    // 檢查是否在客戶端環境
    if (typeof window !== "undefined") {
      try {
        this.hasLoaded = localStorage.getItem("portfolio-loaded") === "true"
      } catch (error) {
        console.warn("localStorage not available:", error)
        this.hasLoaded = false
      }
    }
  }

  public static getInstance(): LoadingStateManager {
    if (!LoadingStateManager.instance) {
      LoadingStateManager.instance = new LoadingStateManager()
    }
    return LoadingStateManager.instance
  }

  public shouldShowLoading(): boolean {
    return !this.hasLoaded
  }

  public setLoaded(): void {
    this.hasLoaded = true
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("portfolio-loaded", "true")
      } catch (error) {
        console.warn("localStorage not available:", error)
      }
    }
  }

  public reset(): void {
    this.hasLoaded = false
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("portfolio-loaded")
      } catch (error) {
        console.warn("localStorage not available:", error)
      }
    }
  }
}

export default LoadingStateManager
