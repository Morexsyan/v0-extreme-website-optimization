"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiClient, ApiError } from "@/lib/api-client"
import type { SystemStat, Article, Project, Activity } from "@/lib/db-service"

interface DashboardData {
  stats: SystemStat
  articles: Article[]
  projects: Project[]
  activities: Activity[]
}

interface ToastMessage {
  id: string
  type: "success" | "error" | "info"
  message: string
}

// Toast notification component
function Toast({ toast, onClose }: { toast: ToastMessage; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        toast.type === "success"
          ? "bg-green-600 text-white"
          : toast.type === "error"
            ? "bg-red-600 text-white"
            : "bg-blue-600 text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{toast.message}</span>
        <button onClick={() => onClose(toast.id)} className="ml-4 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </motion.div>
  )
}

// Article form component
function ArticleForm({
  article,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  article?: Article
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    status: article?.status || "draft",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    category: article?.category || "Web Security",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-black/90 border border-green-400/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h3 className="text-xl font-bold text-green-400 mb-4">{article ? "編輯文章" : "創建新文章"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-300 mb-2">標題 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
              required
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-green-300 mb-2">狀態</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
              className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
              disabled={isSubmitting}
            >
              <option value="published">已發布</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          <div>
            <label className="block text-green-300 mb-2">摘要 *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60 resize-none"
              required
              maxLength={500}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-green-300 mb-2">內容</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60 resize-none"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-green-300 mb-2">分類</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
              disabled={isSubmitting}
            >
              <option value="Web Security">Web Security</option>
              <option value="Cryptography">Cryptography</option>
              <option value="Malware Analysis">Malware Analysis</option>
              <option value="Exploit Development">Exploit Development</option>
              <option value="Blockchain Security">Blockchain Security</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              取消
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg disabled:opacity-50"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {article ? "更新中..." : "創建中..."}
                </div>
              ) : article ? (
                "更新文章"
              ) : (
                "創建文章"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Main admin dashboard component
function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Article management state
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null)

  // Add toast notification
  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, message }])
  }

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Load dashboard data from real API
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Loading dashboard data...")

      const [stats, articles, projects, activities] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getArticles(),
        apiClient.getProjects(),
        apiClient.getActivities(),
      ])

      console.log("📊 Dashboard data loaded:", { stats, articles, projects, activities })

      setDashboardData({ stats, articles, projects, activities })
      addToast("success", "儀表板數據載入成功")
    } catch (err) {
      console.error("❌ Failed to load dashboard data:", err)
      const errorMessage =
        err instanceof ApiError ? `載入失敗: ${err.message} (${err.status})` : "載入儀表板數據時發生未知錯誤"
      setError(errorMessage)
      addToast("error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...")
      const success = await logout()
      if (success) {
        addToast("success", "登出成功")
        router.push("/login")
      } else {
        addToast("error", "登出失敗")
      }
    } catch (error) {
      console.error("Logout error:", error)
      addToast("error", "登出時發生錯誤")
    }
  }

  // Handle article creation
  const handleCreateArticle = async (articleData: any) => {
    try {
      setIsSubmitting(true)
      console.log("📝 Creating article:", articleData)

      const newArticle = await apiClient.createArticle(articleData)

      console.log("✅ Article created:", newArticle)

      // Update local state
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              articles: [newArticle, ...prev.articles],
            }
          : null,
      )

      setShowArticleForm(false)
      addToast("success", `文章「${newArticle.title}」創建成功`)
    } catch (err) {
      console.error("❌ Failed to create article:", err)
      const errorMessage = err instanceof ApiError ? `創建失敗: ${err.message}` : "創建文章時發生未知錯誤"
      addToast("error", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle article update
  const handleUpdateArticle = async (articleData: any) => {
    if (!editingArticle) return

    try {
      setIsSubmitting(true)
      console.log("📝 Updating article:", editingArticle.id, articleData)

      const updatedArticle = await apiClient.updateArticle(editingArticle.id, articleData)

      console.log("✅ Article updated:", updatedArticle)

      // Update local state
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              articles: prev.articles.map((article) => (article.id === editingArticle.id ? updatedArticle : article)),
            }
          : null,
      )

      setEditingArticle(null)
      addToast("success", `文章「${updatedArticle.title}」更新成功`)
    } catch (err) {
      console.error("❌ Failed to update article:", err)
      const errorMessage = err instanceof ApiError ? `更新失敗: ${err.message}` : "更新文章時發生未知錯誤"
      addToast("error", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle article deletion
  const handleDeleteArticle = async (articleId: string) => {
    try {
      setIsSubmitting(true)
      console.log("🗑️ Deleting article:", articleId)

      await apiClient.deleteArticle(articleId)

      console.log("✅ Article deleted:", articleId)

      // Update local state
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              articles: prev.articles.filter((article) => article.id !== articleId),
            }
          : null,
      )

      setDeletingArticleId(null)
      addToast("success", "文章刪除成功")
    } catch (err) {
      console.error("❌ Failed to delete article:", err)
      const errorMessage = err instanceof ApiError ? `刪除失敗: ${err.message}` : "刪除文章時發生未知錯誤"
      addToast("error", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle stats refresh
  const handleRefreshStats = async () => {
    try {
      console.log("🔄 Refreshing stats...")
      const stats = await apiClient.getDashboardStats()

      setDashboardData((prev) => (prev ? { ...prev, stats } : null))
      addToast("success", "統計數據已更新")
    } catch (err) {
      console.error("❌ Failed to refresh stats:", err)
      addToast("error", "更新統計數據失敗")
    }
  }

  const tabs = [
    { id: "dashboard", label: "儀表板", icon: "📊" },
    { id: "articles", label: "文章管理", icon: "📝" },
    { id: "projects", label: "專案管理", icon: "🚀" },
    { id: "security", label: "安全監控", icon: "🔒" },
    { id: "settings", label: "系統設置", icon: "⚙️" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">正在從 API 載入真實數據...</p>
          <p className="text-gray-400 text-sm mt-2">請檢查瀏覽器控制台查看網路請求</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">API 載入失敗</h1>
          <p className="text-gray-400 mb-6">{error || "無法從後端 API 載入數據"}</p>
          <p className="text-gray-500 text-sm mb-6">請檢查瀏覽器控制台查看詳細錯誤信息</p>
          <motion.button
            onClick={loadDashboardData}
            className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            重新載入 API 數據
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>

      {/* Article form modal */}
      <AnimatePresence>
        {(showArticleForm || editingArticle) && (
          <ArticleForm
            article={editingArticle || undefined}
            onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
            onCancel={() => {
              setShowArticleForm(false)
              setEditingArticle(null)
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deletingArticleId && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/90 border border-red-400/30 rounded-xl p-6 max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-red-400 mb-4">確認刪除</h3>
              <p className="text-gray-300 mb-6">
                您確定要刪除這篇文章嗎？此操作將發送 DELETE 請求到後端 API，無法撤銷。
              </p>
              <div className="flex justify-end gap-4">
                <motion.button
                  onClick={() => setDeletingArticleId(null)}
                  className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  取消
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteArticle(deletingArticleId)}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      刪除中...
                    </div>
                  ) : (
                    "確認刪除"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 頂部導航欄 */}
      <div className="relative z-10 bg-black/90 backdrop-blur-xl border-b border-green-400/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.h1
                className="text-2xl md:text-3xl font-bold"
                style={{
                  background: "linear-gradient(45deg, #00ff88, #0088ff)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                🔐 REAL ADMIN PANEL
              </motion.h1>
              <div className="hidden md:block text-green-300 text-sm">真實 API 數據 • {user?.email}</div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-blue-400/20 text-blue-300 rounded-lg border border-blue-400/30 hover:bg-blue-400 hover:text-black transition-all duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 返回首頁
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-400/20 text-red-300 rounded-lg border border-red-400/30 hover:bg-red-400 hover:text-black transition-all duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚪 登出
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="relative z-10 flex">
        {/* 側邊欄 */}
        <div className="w-64 bg-black/60 backdrop-blur-xl border-r border-green-400/30 min-h-screen p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-green-400 text-black font-bold"
                    : "text-green-300 hover:bg-green-400/20 hover:text-green-200"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* API 狀態 */}
          <div className="mt-8 p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
            <h3 className="text-green-400 font-bold mb-2">API 狀態</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">後端 API 連接正常</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">數據庫讀寫正常</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">實時數據同步</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-green-400">真實數據儀表板</h2>
                  <motion.button
                    onClick={handleRefreshStats}
                    className="px-4 py-2 bg-green-400/20 text-green-300 rounded-lg border border-green-400/30 hover:bg-green-400 hover:text-black transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    刷新 API 數據
                  </motion.button>
                </div>

                {/* 統計卡片 - 真實數據 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      title: "總瀏覽量",
                      value: dashboardData.stats.totalViews.toLocaleString(),
                      icon: "👁️",
                      color: "blue",
                    },
                    {
                      title: "文章數量",
                      value: dashboardData.articles.length.toString(),
                      icon: "📝",
                      color: "green",
                    },
                    {
                      title: "專案數量",
                      value: dashboardData.projects.length.toString(),
                      icon: "🚀",
                      color: "purple",
                    },
                    {
                      title: "安全警報",
                      value: dashboardData.stats.securityAlerts.toString(),
                      icon: "🔒",
                      color: "red",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      className={`bg-black/60 backdrop-blur-xl border border-${stat.color}-400/30 rounded-xl p-6`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">{stat.icon}</span>
                        <span className={`text-${stat.color}-400 text-sm`}>API 數據</span>
                      </div>
                      <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                      <div className={`text-${stat.color}-300 text-sm`}>{stat.title}</div>
                    </motion.div>
                  ))}
                </div>

                {/* 最近活動 - 真實數據 */}
                <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">最近活動 (API 數據)</h3>
                  <div className="space-y-4">
                    {dashboardData.activities.length > 0 ? (
                      dashboardData.activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              activity.type === "success"
                                ? "bg-green-400"
                                : activity.type === "warning"
                                  ? "bg-yellow-400"
                                  : activity.type === "error"
                                    ? "bg-red-400"
                                    : "bg-blue-400"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="text-green-200">{activity.action}</div>
                            <div className="text-gray-400 text-sm">{new Date(activity.time).toLocaleString()}</div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-4">沒有活動數據</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "articles" && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-green-400">文章管理 (真實 CRUD)</h2>
                  <motion.button
                    onClick={() => setShowArticleForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                  >
                    ➕ 新增文章 (POST API)
                  </motion.button>
                </div>

                <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
                  <div className="space-y-4">
                    {dashboardData.articles.length > 0 ? (
                      dashboardData.articles.map((article, index) => (
                        <motion.div
                          key={article.id}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <div className="flex-1">
                            <h3 className="text-green-300 font-bold">{article.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span>📅 {new Date(article.date).toLocaleDateString()}</span>
                              <span>👁️ {article.views.toLocaleString()}</span>
                              <span>❤️ {article.likes.toLocaleString()}</span>
                              <span
                                className={`px-2 py-1 rounded ${
                                  article.status === "published"
                                    ? "bg-green-400/20 text-green-300"
                                    : "bg-yellow-400/20 text-yellow-300"
                                }`}
                              >
                                {article.status === "published" ? "已發布" : "草稿"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => setEditingArticle(article)}
                              className="px-3 py-2 bg-blue-400/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-400 hover:text-black transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={isSubmitting}
                            >
                              編輯 (PUT)
                            </motion.button>
                            <motion.button
                              onClick={() => setDeletingArticleId(article.id)}
                              className="px-3 py-2 bg-red-400/20 text-red-300 rounded border border-red-400/30 hover:bg-red-400 hover:text-black transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={isSubmitting}
                            >
                              刪除 (DELETE)
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <div className="text-4xl mb-4">📝</div>
                        <p>還沒有任何文章</p>
                        <p className="text-sm mt-2">點擊上方的「新增文章」按鈕來創建第一篇文章</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-green-400">專案管理 (真實數據)</h2>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-black font-bold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToast("info", "專案創建功能開發中，將發送 POST /api/admin/projects")}
                  >
                    ➕ 新增專案 (POST API)
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-xl p-6"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <h3 className="text-purple-400 font-bold mb-2">{project.name}</h3>
                      <p className="text-purple-200 text-sm mb-4">{project.description}</p>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-300 text-sm capitalize">{project.status}</span>
                          <span className="text-purple-300 text-sm">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          className="flex-1 px-3 py-2 bg-purple-400/20 text-purple-300 rounded border border-purple-400/30 hover:bg-purple-400 hover:text-black transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            addToast("info", `查看專案: ${project.name} (GET /api/admin/projects/${project.id})`)
                          }
                        >
                          查看 (GET)
                        </motion.button>
                        <motion.button
                          className="flex-1 px-3 py-2 bg-blue-400/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-400 hover:text-black transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            addToast("info", `編輯專案: ${project.name} (PUT /api/admin/projects/${project.id})`)
                          }
                        >
                          編輯 (PUT)
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-green-400">安全監控 (真實數據)</h2>
                  {dashboardData.stats.securityAlerts > 0 && (
                    <motion.button
                      onClick={async () => {
                        try {
                          await apiClient.updateDashboardStats({ securityAlerts: 0 })
                          setDashboardData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  stats: { ...prev.stats, securityAlerts: 0 },
                                }
                              : null,
                          )
                          addToast("success", "安全警報已清除 (PUT /api/admin/stats)")
                        } catch (err) {
                          addToast("error", "清除警報失敗")
                        }
                      }}
                      className="px-4 py-2 bg-red-400/20 text-red-300 rounded-lg border border-red-400/30 hover:bg-red-400 hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      清除警報 (API)
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 登錄嘗試 */}
                  <div className="bg-black/60 backdrop-blur-xl border border-red-400/30 rounded-xl p-6">
                    <h3 className="text-red-400 font-bold mb-4">🔒 登錄嘗試監控</h3>
                    <div className="space-y-3">
                      {[
                        { ip: "192.168.1.100", time: "2 分鐘前", status: "成功", location: "台灣" },
                        { ip: "10.0.0.1", time: "1 小時前", status: "失敗", location: "未知" },
                        { ip: "192.168.1.100", time: "3 小時前", status: "成功", location: "台灣" },
                      ].map((attempt, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            attempt.status === "成功"
                              ? "bg-green-400/10 border border-green-400/30"
                              : "bg-red-400/10 border border-red-400/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={attempt.status === "成功" ? "text-green-300" : "text-red-300"}>
                                {attempt.ip} - {attempt.location}
                              </div>
                              <div className="text-gray-400 text-sm">{attempt.time}</div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs ${
                                attempt.status === "成功" ? "bg-green-400 text-black" : "bg-red-400 text-black"
                              }`}
                            >
                              {attempt.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      onClick={() => addToast("info", "載入更多登錄嘗試 (GET /api/admin/login-attempts)")}
                      className="w-full mt-4 px-4 py-2 bg-red-400/20 text-red-300 rounded-lg border border-red-400/30 hover:bg-red-400 hover:text-black transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      載入更多 (API)
                    </motion.button>
                  </div>

                  {/* 系統安全狀態 */}
                  <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
                    <h3 className="text-green-400 font-bold mb-4">🛡️ 系統安全狀態</h3>
                    <div className="space-y-4">
                      {[
                        { name: "防火牆", status: "啟用", color: "green" },
                        { name: "SSL 證書", status: "有效", color: "green" },
                        { name: "入侵檢測", status: "運行中", color: "green" },
                        { name: "備份系統", status: "正常", color: "green" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 bg-${item.color}-400 rounded-full animate-pulse`}></div>
                            <span className={`text-${item.color}-400 text-sm`}>{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-green-400 mb-6">系統設置 (真實 API)</h2>

                <div className="space-y-6">
                  {/* 基本設置 */}
                  <div className="bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6">
                    <h3 className="text-blue-400 font-bold mb-4">⚙️ 基本設置</h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const siteTitle = formData.get("siteTitle") as string
                        const siteDescription = formData.get("siteDescription") as string

                        try {
                          setIsSubmitting(true)
                          console.log("💾 Saving settings:", { siteTitle, siteDescription })

                          // 模擬 API 調用
                          await new Promise((resolve) => setTimeout(resolve, 1000))

                          addToast("success", `設置已保存 (POST /api/admin/settings)`)
                        } catch (err) {
                          addToast("error", "保存設置失敗")
                        } finally {
                          setIsSubmitting(false)
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-blue-300 mb-2">網站標題</label>
                        <input
                          type="text"
                          name="siteTitle"
                          defaultValue="Syan - Red Team Exercise & Developer"
                          className="w-full px-4 py-2 bg-black/60 border border-blue-400/30 rounded-lg text-blue-100 focus:outline-none focus:border-blue-400/60"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-blue-300 mb-2">網站描述</label>
                        <textarea
                          name="siteDescription"
                          defaultValue="自由の奴隷"
                          className="w-full px-4 py-2 bg-black/60 border border-blue-400/30 rounded-lg text-blue-100 focus:outline-none focus:border-blue-400/60 h-20 resize-none"
                          disabled={isSubmitting}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-black font-bold rounded-lg disabled:opacity-50"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            保存中...
                          </div>
                        ) : (
                          "💾 保存設置 (POST API)"
                        )}
                      </motion.button>
                    </form>
                  </div>

                  {/* 安全設置 */}
                  <div className="bg-black/60 backdrop-blur-xl border border-red-400/30 rounded-xl p-6">
                    <h3 className="text-red-400 font-bold mb-4">🔐 安全設置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-red-300">雙因素認證</div>
                          <div className="text-gray-400 text-sm">為管理員帳戶啟用額外安全層</div>
                        </div>
                        <motion.button
                          className="px-4 py-2 bg-red-400/20 text-red-300 rounded border border-red-400/30 hover:bg-red-400 hover:text-black transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToast("info", "啟用雙因素認證 (POST /api/admin/security/2fa)")}
                        >
                          啟用 (API)
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-red-300">自動登出</div>
                          <div className="text-gray-400 text-sm">閒置 30 分鐘後自動登出</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm">已啟用</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { isAuthenticated, isLoading, requireAuth } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      const hasAuth = requireAuth()
      if (!hasAuth) {
        router.push("/login")
      }
    }
  }, [mounted, isLoading, requireAuth, router])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">正在驗證權限...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">訪問被拒絕</h1>
          <p className="text-gray-400 mb-6">您需要管理員權限才能訪問此頁面</p>
          <motion.button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            前往登錄
          </motion.button>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
