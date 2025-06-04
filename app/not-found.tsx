"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NotFound() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
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

      {/* 主要內容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* 404 動畫 */}
          <motion.div
            className="text-8xl md:text-9xl font-black mb-6"
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
            404
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-red-400 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            頁面未找到
          </motion.h1>

          <motion.p
            className="text-lg text-red-300 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            抱歉，您要找的頁面不存在。可能已被移動、刪除或您輸入了錯誤的網址。
          </motion.p>

          {/* 導航按鈕 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg hover:from-green-300 hover:to-blue-300 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 返回首頁
            </motion.button>

            <motion.button
              onClick={() => router.back()}
              className="px-8 py-3 border border-red-400 text-red-400 font-bold rounded-lg hover:bg-red-400 hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← 返回上頁
            </motion.button>

            <motion.button
              onClick={() => router.push("/writeups")}
              className="px-8 py-3 border border-orange-400 text-orange-400 font-bold rounded-lg hover:bg-orange-400 hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📝 查看文章
            </motion.button>
          </motion.div>

          {/* 搜索建議 */}
          <motion.div
            className="mt-12 p-6 bg-black/60 backdrop-blur-xl border border-red-400/30 rounded-xl max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <h3 className="text-red-400 font-bold mb-4">您可能在尋找：</h3>
            <div className="space-y-2">
              {[
                { label: "技術文章", path: "/writeups" },
                { label: "專案展示", path: "/projects" },
                { label: "關於我", path: "/about" },
                { label: "聯繫方式", path: "/contact" },
              ].map((item, index) => (
                <motion.button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="block w-full text-left px-4 py-2 text-red-300 hover:text-red-100 hover:bg-red-400/20 rounded transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                >
                  → {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
