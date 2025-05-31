"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AboutPage() {
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

      {/* 返回按鈕 */}
      <motion.button
        className="fixed top-6 left-6 z-50 px-4 md:px-6 py-2 md:py-3 bg-black/80 backdrop-blur-xl border border-green-400/50 rounded-full text-green-400 hover:text-black hover:bg-green-400 transition-all duration-300 font-mono text-sm md:text-base"
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
          {/* 標題 */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-8xl font-black mb-6"
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
              ABOUT
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-green-300 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              關於我 • 技術之路 • 未來願景
            </motion.p>
          </motion.div>

          {/* 內容區域 */}
          <div className="space-y-8 md:space-y-12">
            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-4">👨‍💻 個人簡介</h2>
              <p className="text-green-200 leading-relaxed mb-4 text-sm md:text-base">
               I’m syan — a high school student just starting out with programming and red teaming.
I enjoy playing CTFs and diving into weird, creative stuff that most people don’t usually look at.
I’m especially curious about techniques that seem “wrong” at first glance, and I love figuring out how they actually work.
Still learning, but one day I hope to find (or even create) those really cursed bugs (?).
Also, if you’ve got time, let’s talk about whether the world is fake or not (?
              </p>
              <p className="text-green-200 leading-relaxed text-sm md:text-base">
                Technology changes the world — I'm driven to create breakthrough user experiences and solve complex technical challenges.
From web development to cybersecurity research, from AI applications to (maybe?) quantum mechanics, I always stay curious and passionate about exploring new technologies.
              </p>
            </motion.div>

            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-6">🚀 learning now & fantasy...</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-green-300 mb-3">前端開發</h3>
                  <ul className="space-y-2 text-green-200 text-sm md:text-base">
                    <li>• React 18 / Next.js 14</li>
                    <li>• TypeScript / JavaScript ES6+</li>
                    <li>• WebGL / Three.js / WebGPU</li>
                    <li>• Tailwind CSS / Styled Components</li>
                    <li>• Framer Motion / GSAP</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-300 mb-3">後端 & 基礎設施</h3>
                  <ul className="space-y-2 text-green-200 text-sm md:text-base">
                    <li>• Node.js / Python / Rust</li>
                    <li>• PostgreSQL / MongoDB / Redis</li>
                    <li>• Docker / Kubernetes</li>
                    <li>• AWS / GCP / Vercel</li>
                    <li>• GraphQL / REST APIs</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-6">🎯 核心理念</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">💡</div>
                  <h3 className="text-lg font-bold text-green-300 mb-2">創新驅動</h3>
                  <p className="text-green-200 text-sm">持續探索新技術，推動 Web 開發的邊界</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔒</div>
                  <h3 className="text-lg font-bold text-green-300 mb-2">安全第一</h3>
                  <p className="text-green-200 text-sm">將安全性融入開發的每個環節</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="text-lg font-bold text-green-300 mb-2">用戶體驗</h3>
                  <p className="text-green-200 text-sm">創造直觀、流暢的使用者體驗</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-6">📈 成就與里程碑</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">開源貢獻</h3>
                    <p className="text-green-200 text-sm md:text-base">維護多個開源專案，累計 10K+ GitHub Stars</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">技術演講</h3>
                    <p className="text-green-200 text-sm md:text-base">在多個技術會議分享前端創新技術和資安研究</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">漏洞發現</h3>
                    <p className="text-green-200 text-sm md:text-base">發現並負責任地披露 25+ 個安全漏洞</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">技術文章</h3>
                    <p className="text-green-200 text-sm md:text-base">寫 100+ 篇技術文章，累計閱讀量超過 500K</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
