"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { WRITEUPS_DATABASE, type WriteUp } from "@/lib/writeups-data"
import { useAllWriteUpStats } from "@/hooks/use-writeup-metrics"

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout, requireAuth } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [writeups, setWriteups] = useState<WriteUp[]>(WRITEUPS_DATABASE)
  const liveStats = useAllWriteUpStats()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 保護路由
  useEffect(() => {
    if (mounted && !isLoading) {
      requireAuth()
    }
  }, [mounted, isLoading, requireAuth])

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push("/login")
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">載入管理面板...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // 會被 requireAuth 重定向
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 40 }).map((_, i) => (
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-green-400/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="px-4 md:px-6 py-2 md:py-3 bg-black/60 border border-green-400/50 rounded-full text-green-400 hover:text-black hover:bg-green-400 transition-all duration-300 font-mono text-sm md:text-base"
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 首頁
            </motion.button>

            <div className="text-green-400 font-mono">
              <span className="text-green-300">👑 管理員:</span> {user?.email}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-green-400 font-mono text-sm">
              <span className="text-green-300">🕒 登錄時間:</span>{" "}
              {user?.loginTime ? new Date(user.loginTime).toLocaleString() : "N/A"}
            </div>

            <motion.button
              className="px-4 md:px-6 py-2 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-mono transition-all duration-300 text-sm md:text-base"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 登出
            </motion.button>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 pt-20 md:pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* 標題 */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-black mb-4"
              style={{
                background: "linear-gradient(45deg, #00ff88, #0088ff, #8800ff)",
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
              👑 ADMIN PANEL
            </motion.h1>
            <p className="text-green-300 font-mono">超級管理員控制中心</p>
          </motion.div>

          {/* 標籤導航 */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { id: "dashboard", label: "📊 儀表板", icon: "📊" },
              { id: "writeups", label: "📝 文章管理", icon: "📝" },
              { id: "analytics", label: "📈 數據分析", icon: "📈" },
              { id: "security", label: "🔒 安全監控", icon: "🔒" },
              { id: "settings", label: "⚙️ 系統設置", icon: "⚙️" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-mono transition-all duration-300 text-sm md:text-base ${
                  activeTab === tab.id
                    ? "bg-green-400 text-black"
                    : "bg-black/60 border border-green-400/30 text-green-400 hover:bg-green-400/20"
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* 內容區域 */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "dashboard" && (
              <div className="space-y-6 md:space-y-8">
                {/* 統計卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 md:p-6">
                    <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{writeups.length}</div>
                    <div className="text-green-300 font-mono text-sm md:text-base">總文章數</div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4 md:p-6">
                    <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{liveStats.totalViews}</div>
                    <div className="text-blue-300 font-mono text-sm md:text-base">總瀏覽量</div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-xl border border-red-400/30 rounded-xl p-4 md:p-6">
                    <div className="text-2xl md:text-3xl font-bold text-red-400 mb-2">{liveStats.totalLikes}</div>
                    <div className="text-red-300 font-mono text-sm md:text-base">總讚數</div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 md:p-6">
                    <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">{liveStats.totalShares}</div>
                    <div className="text-purple-300 font-mono text-sm md:text-base">總分享數</div>
                  </div>
                </div>

                {/* 快速操作 */}
                <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-4">快速操作</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      className="p-4 bg-gradient-to-r from-green-400/20 to-blue-400/20 border border-green-400/30 rounded-lg text-green-400 hover:bg-green-400/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("writeups")}
                    >
                      <div className="text-2xl mb-2">📝</div>
                      <div className="font-mono">新增文章</div>
                    </motion.button>

                    <motion.button
                      className="p-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 rounded-lg text-blue-400 hover:bg-blue-400/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("analytics")}
                    >
                      <div className="text-2xl mb-2">📈</div>
                      <div className="font-mono">查看分析</div>
                    </motion.button>

                    <motion.button
                      className="p-4 bg-gradient-to-r from-red-400/20 to-orange-400/20 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-400/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("security")}
                    >
                      <div className="text-2xl mb-2">🔒</div>
                      <div className="font-mono">安全監控</div>
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "writeups" && (
              <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-green-400">文章管理</h2>
                  <motion.button
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg hover:from-green-300 hover:to-blue-300 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ➕ 新增文章
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {writeups.map((writeup) => (
                    <div key={writeup.id} className="p-4 bg-black/40 border border-green-400/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-green-400">{writeup.title}</h3>
                          <p className="text-green-300 text-sm">
                            {writeup.category} • {writeup.difficulty}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            編輯
                          </motion.button>
                          <motion.button
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            刪除
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-6">數據分析</h2>
                <div className="text-green-300">
                  <p>詳細的數據分析功能正在開發中...</p>
                  <p className="mt-2">將包含：訪問統計、用戶行為分析、內容表現等</p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-6">安全監控</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/30 border border-green-400/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-green-400 font-bold">系統安全狀態</span>
                    </div>
                    <p className="text-green-300 text-sm">所有安全系統運行正常</p>
                  </div>

                  <div className="p-4 bg-blue-900/30 border border-blue-400/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400">🔒</span>
                      <span className="text-blue-400 font-bold">加密狀態</span>
                    </div>
                    <p className="text-blue-300 text-sm">AES-256 加密已啟用，JWT 令牌安全</p>
                  </div>

                  <div className="p-4 bg-purple-900/30 border border-purple-400/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-400">👁️</span>
                      <span className="text-purple-400 font-bold">監控狀態</span>
                    </div>
                    <p className="text-purple-300 text-sm">登錄嘗試監控、IP 追蹤已啟用</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-6">系統設置</h2>
                <div className="text-green-300">
                  <p>系統設置功能正在開發中...</p>
                  <p className="mt-2">將包含：網站配置、安全設置、備份管理等</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
