"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

// 管理面板組件
function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalViews: "125.6K",
    totalArticles: "42",
    totalProjects: "18",
    securityAlerts: "0",
  })

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push("/login")
    }
  }

  const tabs = [
    { id: "dashboard", label: "儀表板", icon: "📊" },
    { id: "articles", label: "文章管理", icon: "📝" },
    { id: "projects", label: "專案管理", icon: "🚀" },
    { id: "security", label: "安全監控", icon: "🔒" },
    { id: "settings", label: "系統設置", icon: "⚙️" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
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
                🔐 ADMIN PANEL
              </motion.h1>
              <div className="hidden md:block text-green-300 text-sm">歡迎回來，{user?.email}</div>
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

          {/* 系統狀態 */}
          <div className="mt-8 p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
            <h3 className="text-green-400 font-bold mb-2">系統狀態</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">服務器運行正常</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">數據庫連接正常</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">安全系統啟用</span>
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
                <h2 className="text-3xl font-bold text-green-400 mb-6">儀表板總覽</h2>

                {/* 統計卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { title: "總瀏覽量", value: stats.totalViews, icon: "👁️", color: "blue" },
                    { title: "文章數量", value: stats.totalArticles, icon: "📝", color: "green" },
                    { title: "專案數量", value: stats.totalProjects, icon: "🚀", color: "purple" },
                    { title: "安全警報", value: stats.securityAlerts, icon: "🔒", color: "red" },
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
                        <span className={`text-${stat.color}-400 text-sm`}>實時</span>
                      </div>
                      <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                      <div className={`text-${stat.color}-300 text-sm`}>{stat.title}</div>
                    </motion.div>
                  ))}
                </div>

                {/* 最近活動 */}
                <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">最近活動</h3>
                  <div className="space-y-4">
                    {[
                      { time: "2 分鐘前", action: "新用戶訪問了首頁", type: "info" },
                      { time: "15 分鐘前", action: "WriteUp 文章被瀏覽", type: "success" },
                      { time: "1 小時前", action: "管理員登錄成功", type: "warning" },
                      { time: "3 小時前", action: "系統自動備份完成", type: "info" },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
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
                                : "bg-blue-400"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="text-green-200">{activity.action}</div>
                          <div className="text-gray-400 text-sm">{activity.time}</div>
                        </div>
                      </motion.div>
                    ))}
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
                  <h2 className="text-3xl font-bold text-green-400">文章管理</h2>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ➕ 新增文章
                  </motion.button>
                </div>

                <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
                  <div className="space-y-4">
                    {[
                      {
                        title: "Advanced SQL Injection in Modern Web Applications",
                        status: "已發布",
                        views: "12.5K",
                        date: "2024-01-15",
                      },
                      {
                        title: "Quantum Cryptography Implementation",
                        status: "草稿",
                        views: "8.7K",
                        date: "2024-01-10",
                      },
                      {
                        title: "AI-Powered Malware Analysis",
                        status: "已發布",
                        views: "15.2K",
                        date: "2024-01-08",
                      },
                    ].map((article, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <h3 className="text-green-300 font-bold">{article.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span>📅 {article.date}</span>
                            <span>👁️ {article.views}</span>
                            <span
                              className={`px-2 py-1 rounded ${
                                article.status === "已發布"
                                  ? "bg-green-400/20 text-green-300"
                                  : "bg-yellow-400/20 text-yellow-300"
                              }`}
                            >
                              {article.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="px-3 py-2 bg-blue-400/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-400 hover:text-black transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            編輯
                          </motion.button>
                          <motion.button
                            className="px-3 py-2 bg-red-400/20 text-red-300 rounded border border-red-400/30 hover:bg-red-400 hover:text-black transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            刪除
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
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
                  <h2 className="text-3xl font-bold text-green-400">專案管理</h2>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-black font-bold rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ➕ 新增專案
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "QuantumUI Framework", status: "開發中", progress: 75 },
                    { name: "NeuralStack Backend", status: "已完成", progress: 100 },
                    { name: "SecureVault Crypto", status: "測試中", progress: 90 },
                  ].map((project, index) => (
                    <motion.div
                      key={index}
                      className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-xl p-6"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <h3 className="text-purple-400 font-bold mb-2">{project.name}</h3>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-300 text-sm">{project.status}</span>
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
                        >
                          查看
                        </motion.button>
                        <motion.button
                          className="flex-1 px-3 py-2 bg-blue-400/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-400 hover:text-black transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          編輯
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
                <h2 className="text-3xl font-bold text-green-400 mb-6">安全監控</h2>

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
                <h2 className="text-3xl font-bold text-green-400 mb-6">系統設置</h2>

                <div className="space-y-6">
                  {/* 基本設置 */}
                  <div className="bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6">
                    <h3 className="text-blue-400 font-bold mb-4">⚙️ 基本設置</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-blue-300 mb-2">網站標題</label>
                        <input
                          type="text"
                          defaultValue="Syan - Red Team Exercise & Developer"
                          className="w-full px-4 py-2 bg-black/60 border border-blue-400/30 rounded-lg text-blue-100 focus:outline-none focus:border-blue-400/60"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-300 mb-2">網站描述</label>
                        <textarea
                          defaultValue="自由の奴隷"
                          className="w-full px-4 py-2 bg-black/60 border border-blue-400/30 rounded-lg text-blue-100 focus:outline-none focus:border-blue-400/60 h-20 resize-none"
                        />
                      </div>
                    </div>
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
                        >
                          啟用
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

                  {/* 保存按鈕 */}
                  <div className="flex justify-end">
                    <motion.button
                      className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      💾 保存設置
                    </motion.button>
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
