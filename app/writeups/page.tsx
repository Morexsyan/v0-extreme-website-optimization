"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PersistentHomeButton from "@/components/persistent-home-button"
import {
  WRITEUPS_DATABASE,
  CATEGORIES,
  DIFFICULTIES,
  searchWriteUps,
  getFeaturedWriteUps,
  getWriteUpStats,
  type WriteUp,
} from "@/lib/writeups-data"

// WriteUp 卡片組件 - 修復 author 對象渲染問題
function WriteUpCard({ writeup, index }: { writeup: WriteUp; index: number }) {
  const router = useRouter()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#00ff88"
      case "Intermediate":
        return "#0088ff"
      case "Advanced":
        return "#ff8800"
      case "Expert":
        return "#ff0088"
      case "Master":
        return "#8800ff"
      default:
        return "#00ff88"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Featured":
        return "#ffd700"
      case "Updated":
        return "#00ff88"
      case "Published":
        return "#0088ff"
      default:
        return "#888888"
    }
  }

  const handleClick = () => {
    router.push(`/writeups/${writeup.slug}`)
  }

  return (
    <motion.article
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={handleClick}
    >
      <div className="relative bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-4 md:p-6 h-full overflow-hidden hover:border-orange-400/60 transition-all duration-300 group-hover:transform group-hover:scale-105">
        {/* 特色標籤 - 修復重複問題 */}
        {writeup.featured && writeup.status !== "Featured" && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">⭐ Featured</span>
          </div>
        )}

        {/* 背景發光效果 */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(45deg, ${getDifficultyColor(writeup.difficulty)}10, transparent)`,
          }}
        />

        {/* 內容 */}
        <div className="relative z-10">
          {/* 頂部標籤 */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="px-3 py-1 bg-orange-400/20 text-orange-300 text-xs md:text-sm rounded-full border border-orange-400/30 font-mono">
              {writeup.category}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 text-white text-xs md:text-sm rounded-full font-mono font-bold"
                style={{
                  backgroundColor: getDifficultyColor(writeup.difficulty),
                  boxShadow: `0 0 10px ${getDifficultyColor(writeup.difficulty)}50`,
                }}
              >
                {writeup.difficulty}
              </span>
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: getStatusColor(writeup.status),
                  color: writeup.status === "Featured" ? "#000" : "#fff",
                }}
              >
                {writeup.status}
              </span>
            </div>
          </div>

          {/* 標題 */}
          <h2 className="text-lg md:text-xl font-bold text-orange-400 mb-3 group-hover:text-orange-300 transition-colors duration-300 line-clamp-2">
            {writeup.title}
          </h2>

          {/* 作者和日期 - 修復 author 對象渲染 */}
          <div className="flex items-center gap-2 mb-3 text-xs text-orange-300">
            <span>✍️ {writeup.author.name}</span>
            <span>•</span>
            <span>📅 {writeup.publishedDate}</span>
            {writeup.lastUpdated && (
              <>
                <span>•</span>
                <span>🔄 {writeup.lastUpdated}</span>
              </>
            )}
          </div>

          {/* 系列信息 */}
          {writeup.series && (
            <div className="mb-3 text-xs text-purple-300">
              📚 {writeup.series.name} - Part {writeup.series.part}/{writeup.series.totalParts}
            </div>
          )}

          {/* 描述 */}
          <p className="text-orange-200 mb-4 leading-relaxed text-sm line-clamp-3">{writeup.description}</p>

          {/* 標籤 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {writeup.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.name}
                className="px-2 py-1 text-white text-xs rounded border font-mono"
                style={{
                  backgroundColor: tag.color + "20",
                  borderColor: tag.color + "50",
                  color: tag.color,
                }}
              >
                #{tag.name}
              </span>
            ))}
            {writeup.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded border border-gray-600/30 font-mono">
                +{writeup.tags.length - 3}
              </span>
            )}
          </div>

          {/* 統計資訊 - 使用真實數據 */}
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <span>👁 {writeup.metrics.views}</span>
              <span>❤️ {writeup.metrics.likes}</span>
              {writeup.metrics.shares && Number.parseInt(writeup.metrics.shares) > 0 && (
                <span>📤 {writeup.metrics.shares}</span>
              )}
              {writeup.metrics.comments && Number.parseInt(writeup.metrics.comments) > 0 && (
                <span>💬 {writeup.metrics.comments}</span>
              )}
            </div>
            <span>⏱ {writeup.readTime}</span>
          </div>

          {/* 閱讀按鈕 */}
          <motion.div
            className="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-black font-bold rounded-lg font-mono text-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            閱讀完整文章 →
          </motion.div>
        </div>

        {/* 懸停粒子效果 */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: getDifficultyColor(writeup.difficulty),
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export default function WriteUpsPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredWriteups, setFilteredWriteups] = useState<WriteUp[]>(WRITEUPS_DATABASE)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 篩選和搜索邏輯
  useEffect(() => {
    let results = WRITEUPS_DATABASE

    // 搜索
    if (searchTerm) {
      results = searchWriteUps(searchTerm)
    }

    // 分類篩選
    if (selectedCategory !== "All") {
      results = results.filter((writeup) => writeup.category === selectedCategory)
    }

    // 難度篩選
    if (selectedDifficulty !== "All") {
      results = results.filter((writeup) => writeup.difficulty === selectedDifficulty)
    }

    // 排序
    switch (sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        break
      case "oldest":
        results.sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime())
        break
      case "popular":
        results.sort((a, b) => Number.parseInt(b.metrics.likes) - Number.parseInt(a.metrics.likes))
        break
      case "views":
        results.sort(
          (a, b) =>
            Number.parseFloat(b.metrics.views.replace("K", "")) - Number.parseFloat(a.metrics.views.replace("K", "")),
        )
        break
    }

    setFilteredWriteups(results)
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy])

  const stats = getWriteUpStats()
  const featuredWriteups = getFeaturedWriteUps()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 50 }).map((_, i) => (
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
        <div className="max-w-7xl mx-auto">
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
              WriteUps
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-orange-300 font-mono mb-6 md:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              深度技術分析 • 漏洞研究 • 安全實戰
            </motion.p>

            {/* 搜索和篩選 */}
            <div className="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto">
              <motion.input
                type="text"
                placeholder="搜索 WriteUps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-full text-orange-300 placeholder-orange-400/50 font-mono focus:outline-none focus:border-orange-400/60 text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              />

              <div className="flex flex-col md:flex-row gap-4">
                <motion.select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-full text-orange-300 font-mono focus:outline-none focus:border-orange-400/60 text-sm md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-black">
                      📂 {category}
                    </option>
                  ))}
                </motion.select>

                <motion.select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-full text-orange-300 font-mono focus:outline-none focus:border-orange-400/60 text-sm md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty} className="bg-black">
                      🎯 {difficulty}
                    </option>
                  ))}
                </motion.select>

                <motion.select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-full text-orange-300 font-mono focus:outline-none focus:border-orange-400/60 text-sm md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <option value="newest" className="bg-black">
                    📅 最新
                  </option>
                  <option value="oldest" className="bg-black">
                    📅 最舊
                  </option>
                  <option value="popular" className="bg-black">
                    ❤️ 最受歡迎
                  </option>
                  <option value="views" className="bg-black">
                    👁 最多瀏覽
                  </option>
                </motion.select>
              </div>
            </div>
          </motion.div>

          {/* 特色文章區域 */}
          {featuredWriteups.length > 0 &&
            searchTerm === "" &&
            selectedCategory === "All" &&
            selectedDifficulty === "All" && (
              <motion.div
                className="mb-12 md:mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 text-center">⭐ 特色文章</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {featuredWriteups.slice(0, 2).map((writeup, index) => (
                    <WriteUpCard key={writeup.id} writeup={writeup} index={index} />
                  ))}
                </div>
              </motion.div>
            )}

          {/* 搜索結果提示 */}
          <motion.div
            className="mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <p className="text-orange-300 font-mono">
              找到 {filteredWriteups.length} 篇文章
              {searchTerm && ` 包含 "${searchTerm}"`}
              {selectedCategory !== "All" && ` 在 "${selectedCategory}"`}
              {selectedDifficulty !== "All" && ` 難度 "${selectedDifficulty}"`}
            </p>
          </motion.div>

          {/* WriteUps 網格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredWriteups.map((writeup, index) => (
              <WriteUpCard key={writeup.id} writeup={writeup} index={index} />
            ))}
          </div>

          {/* 無結果提示 */}
          {filteredWriteups.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">沒有找到相關文章</h3>
              <p className="text-orange-300 mb-6">嘗試調整搜索條件或篩選器</p>
              <motion.button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setSelectedDifficulty("All")
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-black font-bold rounded-lg hover:from-orange-300 hover:to-red-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                重置篩選器
              </motion.button>
            </motion.div>
          )}

          {/* 統計資訊 */}
          <motion.div
            className="mt-12 md:mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-black/60 backdrop-blur-xl border border-orange-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-2">{stats.total}+</div>
                <div className="text-orange-300 font-mono text-sm md:text-base">技術文章</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl border border-red-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-red-400 mb-2">{stats.categories}+</div>
                <div className="text-red-300 font-mono text-sm md:text-base">技術領域</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">
                  {Math.round(stats.totalViews / 1000)}K+
                </div>
                <div className="text-purple-300 font-mono text-sm md:text-base">總閱讀量</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{stats.totalLikes}+</div>
                <div className="text-green-300 font-mono text-sm md:text-base">總讚數</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
