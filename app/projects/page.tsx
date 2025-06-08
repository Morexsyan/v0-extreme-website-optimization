"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PersistentHomeButton from "@/components/persistent-home-button"

export default function ProjectsPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 常駐首頁按鈕 */}
      <PersistentHomeButton />

      {/* 返回按鈕 */}
      <motion.button
        className="fixed top-6 left-6 z-50 px-4 md:px-6 py-2 md:py-3 bg-black/80 backdrop-blur-xl border border-orange-400/50 rounded-full text-orange-400 hover:text-black hover:bg-orange-400 transition-all duration-300 font-mono text-sm md:text-base"
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
      <div className="relative z-10 pt-20 md:pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 標題區域 */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6"
              style={{
                background: "linear-gradient(45deg, #ff8800, #ff0088, #8800ff)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(255, 136, 0, 0.5)",
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
              Projects
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-orange-300 font-mono mb-6 md:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              創新技術 • 安全研究 • 開源貢獻
            </motion.p>
          </motion.div>

          {/* 暫無項目內容 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {/* 主要圖標 */}
            <motion.div
              className="mb-8"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="text-8xl md:text-9xl mb-4">🚧</div>
            </motion.div>

            {/* 主要訊息 */}
            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-8 md:p-12 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4">項目開發中</h2>
              <p className="text-lg md:text-xl text-orange-200 mb-6 leading-relaxed">
                目前正在專注於各種創新項目的開發中
                <br />
                敬請期待即將發布的精彩內容！
              </p>

              {/* 進度指示器 */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-orange-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>

              <p className="text-orange-300 font-mono text-sm">正在構建令人驚艷的項目...</p>
            </motion.div>

            {/* 即將推出的領域 */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { icon: "🔐", title: "網路安全", desc: "滲透測試工具與安全研究" },
                { icon: "🤖", title: "人工智慧", desc: "機器學習與深度學習應用" },
                { icon: "⛓️", title: "區塊鏈", desc: "智能合約與 DeFi 協議" },
                { icon: "🌐", title: "Web 開發", desc: "現代化前端與後端技術" },
                { icon: "📱", title: "移動應用", desc: "跨平台移動應用開發" },
                { icon: "☁️", title: "雲端服務", desc: "微服務架構與容器化" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-black/40 backdrop-blur-xl border border-orange-400/20 rounded-lg p-6 hover:border-orange-400/40 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">{item.title}</h3>
                  <p className="text-sm text-orange-200">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* 聯繫信息 */}
            <motion.div
              className="bg-gradient-to-r from-orange-400/10 to-red-400/10 border border-orange-400/30 rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <h3 className="text-xl font-bold text-orange-400 mb-4">📬 想要了解更多？</h3>
              <p className="text-orange-200 mb-6">如果您對我的項目感興趣，或有合作機會，歡迎隨時聯繫！</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => router.push("/contact")}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-black font-bold rounded-lg hover:from-orange-300 hover:to-red-300 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📧 聯繫我
                </motion.button>
                <motion.button
                  onClick={() => router.push("/writeups")}
                  className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-orange-400/50 text-orange-400 font-bold rounded-lg hover:bg-orange-400 hover:text-black transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📚 查看 WriteUps
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
