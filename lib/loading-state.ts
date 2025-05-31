// Loading state manager - ensures loading screen only shows on first visit
class LoadingStateManager {
  private static instance: LoadingStateManager
  private hasLoaded = false

  private constructor() {
    // 檢查是否在客戶端環境
    if (typeof window !== "undefined") {
      this.hasLoaded = localStorage.getItem("portfolio-loaded") === "true"
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
      localStorage.setItem("portfolio-loaded", "true")
    }
  }

  public reset(): void {
    this.hasLoaded = false
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio-loaded")
    }
  }
}

export default LoadingStateManager
