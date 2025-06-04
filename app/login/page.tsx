"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loginState, setLoginState] = useState({
    isLoading: false,
    error: "",
    remainingAttempts: null as number | null,
    lockedUntil: null as number | null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 如果已經登錄，重定向到管理面板
  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated) {
      router.push("/admin")
    }
  }, [mounted, isLoading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loginState.lockedUntil && Date.now() < loginState.lockedUntil) {
      return
    }

    setLoginState((prev) => ({ ...prev, isLoading: true, error: "" }))

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        router.push("/admin")
      } else {
        setLoginState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || "登錄失敗",
          remainingAttempts: result.remainingAttempts || null,
          lockedUntil: result.lockedUntil || null,
        }))
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginState((prev) => ({
        ...prev,
        isLoading: false,
        error: "登錄過程中發生錯誤，請稍後再試",
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getRemainingLockTime = () => {
    if (!loginState.lockedUntil) return 0
    return Math.max(0, Math.ceil((loginState.lockedUntil - Date.now()) / 1000))
  }

  const [remainingTime, setRemainingTime] = useState(getRemainingLockTime())

  useEffect(() => {
    if (loginState.lockedUntil) {
      const interval = setInterval(() => {
        const remaining = getRemainingLockTime()
        setRemainingTime(remaining)
        if (remaining <= 0) {
          setLoginState((prev) => ({ ...prev, lockedUntil: null, error: "" }))
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [loginState.lockedUntil])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">驗證身份中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full"
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

      {/* 返回按鈕 */}
      <motion.button
        className="fixed top-6 left-6 z-50 px-4 md:px-6 py-2 md:py-3 bg-black/80 backdrop-blur-xl border border-red-400/50 rounded-full text-red-400 hover:text-black hover:bg-red-400 transition-all duration-300 font-mono text-sm md:text-base"
        onClick={() => router.push("/")}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← 返回首頁
      </motion.button>

      {/* 主要內容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* 標題 */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                background: "linear-gradient(45deg, #ff0000, #ff4444, #ff0000)",
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
              🔐 ADMIN LOGIN
            </motion.h1>
            <p className="text-red-300 font-mono">高級權限訪問 • 極致安全保護</p>
          </div>

          {/* 登錄表單 */}
          <motion.div
            className="bg-black/60 backdrop-blur-xl border border-red-400/30 rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* 安全警告 */}
            <div className="mb-6 p-4 bg-red-900/30 border border-red-400/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-red-400 text-xl">⚠️</span>
                <span className="text-red-400 font-bold">安全警告</span>
              </div>
              <p className="text-red-300 text-sm">
                此為管理員專用登錄頁面。所有登錄嘗試都會被記錄和監控。 未經授權的訪問嘗試將被追蹤並可能面臨法律後果。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 錯誤訊息 */}
              {loginState.error && (
                <motion.div
                  className="p-4 bg-red-900/50 border border-red-400/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">❌</span>
                    <span className="text-red-300 text-sm">{loginState.error}</span>
                  </div>
                  {loginState.remainingAttempts !== null && loginState.remainingAttempts > 0 && (
                    <p className="text-red-400 text-xs mt-2">剩餘嘗試次數: {loginState.remainingAttempts}</p>
                  )}
                  {remainingTime > 0 && (
                    <p className="text-red-400 text-xs mt-2">
                      帳戶已鎖定，請等待 {Math.floor(remainingTime / 60)}:
                      {(remainingTime % 60).toString().padStart(2, "0")} 後重試
                    </p>
                  )}
                </motion.div>
              )}

              {/* Email 輸入 */}
              <div>
                <label className="block text-red-300 font-mono mb-2 text-sm">管理員郵箱</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/60 border border-red-400/30 rounded-lg text-red-100 font-mono focus:outline-none focus:border-red-400/60 transition-colors pl-10"
                    placeholder="admin@example.com"
                    required
                    disabled={loginState.isLoading || remainingTime > 0}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400">👤</span>
                </div>
              </div>

              {/* 密碼輸入 */}
              <div>
                <label className="block text-red-300 font-mono mb-2 text-sm">管理員密碼</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/60 border border-red-400/30 rounded-lg text-red-100 font-mono focus:outline-none focus:border-red-400/60 transition-colors pl-10 pr-12"
                    placeholder="••••••••••"
                    required
                    disabled={loginState.isLoading || remainingTime > 0}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400">🔑</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                    disabled={loginState.isLoading || remainingTime > 0}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* 登錄按鈕 */}
              <motion.button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg font-mono hover:from-red-500 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loginState.isLoading || remainingTime > 0}
                whileHover={{ scale: loginState.isLoading || remainingTime > 0 ? 1 : 1.02 }}
                whileTap={{ scale: loginState.isLoading || remainingTime > 0 ? 1 : 0.98 }}
              >
                {loginState.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    驗證中...
                  </div>
                ) : remainingTime > 0 ? (
                  `帳戶已鎖定 (${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, "0")})`
                ) : (
                  "🚀 安全登錄"
                )}
              </motion.button>
            </form>

            {/* 安全資訊 */}
            <div className="mt-6 md:mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-xs text-red-400">
                <span>🔒 AES-256 加密</span>
                <span>🛡️ JWT 認證</span>
                <span>🔐 bcrypt 保護</span>
              </div>
              <p className="text-red-300 text-xs mt-2 font-mono">連接已加密 • IP 已記錄 • 活動已監控</p>
            </div>
          </motion.div>

          {/* 系統狀態 */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono">安全系統運行正常</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
