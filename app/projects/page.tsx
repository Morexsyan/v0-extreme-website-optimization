"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PersistentHomeButton from "@/components/persistent-home-button"

// 專案數據
const projects = [
  {
    id: "discord bot",
    title: "discord bot ai自主開發自身新功能",
    category: "Frontend Framework",
    status: "Active",
    description:
      "革命性的量子計算驅動 3D 使用者介面框架，支援即時量子模擬、多維度粒子系統和超現實光影效果。完全重新定義了人機互動的可能性。",
    technologies: ["python", "ai"],
    features: ["discord bot", "gemini api"],
    github: "nope",
    demo: "nope",
    stars: "nope",
    forks: "nope",
  },
  {
    id: "ios密碼漏洞發現&利用",
    title: "ios密碼漏洞發現&利用",
    category: "Backend Architecture",
    status: "Active",
    description:
      "透過研究漏洞深入了解ios系統",
    technologies: ["ios"],
    features: ["ios", "bug bounty"],
    github: "nope",
    demo: "nope",
    stars: "nope",
    forks: "nope",
  },
]

export default function ProjectsPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const categories = ["All", ...new Set(projects.map((p) => p.category))]
  const statuses = ["All", "Active", "Beta", "Development"]

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#00ff88"
      case "Beta":
        return "#ffaa00"
      case "Development":
        return "#0088ff"
      default:
        return "#888888"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Frontend Framework": "#61dafb",
      "Backend Architecture": "#68217a",
      Cybersecurity: "#ff6b6b",
      Blockchain: "#f39c12",
      "AI/ML Platform": "#9b59b6",
      "Security Tools": "#e74c3c",
    }
    return colors[category as keyof typeof colors] || "#00ff88"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
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
        className="fixed top-6 left-6 z-50 px-4 md:px-6 py-2 md:py-3 bg-black/80 backdrop-blur-xl border border-blue-400/50 rounded-full text-blue-400 hover:text-black hover:bg-blue-400 transition-all duration-300 font-mono text-sm md:text-base"
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
              className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6"
              style={{
                background: "linear-gradient(45deg, #0088ff, #00ff88, #8800ff)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(0, 136, 255, 0.5)",
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
              PROJECTS
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-blue-300 font-mono mb-6 md:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              創新專案 • 開源貢獻 • 技術突破
            </motion.p>

            {/* 篩選器 */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <motion.select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-full text-blue-300 font-mono focus:outline-none focus:border-blue-400/60 text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-black">
                    📂 {category}
                  </option>
                ))}
              </motion.select>

              <motion.select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-4 md:px-6 py-3 bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-full text-blue-300 font-mono focus:outline-none focus:border-blue-400/60 text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-black">
                    🎯 {status}
                  </option>
                ))}
              </motion.select>
            </div>
          </motion.div>

          {/* 專案網格 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6 md:p-8 h-full overflow-hidden hover:border-blue-400/60 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  {/* 背景發光效果 */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${getCategoryColor(project.category)}10, transparent)`,
                    }}
                  />

                  {/* 內容 */}
                  <div className="relative z-10">
                    {/* 頂部標籤 */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-3 py-1 text-white text-xs md:text-sm rounded-full border font-mono"
                        style={{
                          backgroundColor: getCategoryColor(project.category) + "40",
                          borderColor: getCategoryColor(project.category),
                          color: getCategoryColor(project.category),
                        }}
                      >
                        {project.category}
                      </span>
                      <span
                        className="px-3 py-1 text-white text-xs md:text-sm rounded-full font-mono font-bold"
                        style={{
                          backgroundColor: getStatusColor(project.status),
                          boxShadow: `0 0 10px ${getStatusColor(project.status)}50`,
                        }}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* 標題 */}
                    <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors duration-300">
                      {project.title}
                    </h2>

                    {/* 描述 */}
                    <p className="text-blue-200 mb-4 leading-relaxed text-sm md:text-base">{project.description}</p>

                    {/* 技術標籤 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded border border-gray-600/30 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded border border-gray-600/30 font-mono">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* 特色功能 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-blue-300 mb-2">核心功能：</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.features.map((feature) => (
                          <div key={feature} className="text-xs text-blue-200 flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 統計資訊 */}
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-4">
                      <div className="flex items-center gap-4">
                        <span>⭐ {project.stars}</span>
                        <span>🍴 {project.forks}</span>
                      </div>
                      <span className="text-blue-300">{project.status}</span>
                    </div>

                    {/* 按鈕 */}
                    <div className="flex gap-3">
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-lg text-center text-sm hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        🐙 GitHub
                      </motion.a>
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-black font-bold rounded-lg text-center text-sm hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        🚀 Demo
                      </motion.a>
                    </div>
                  </div>

                  {/* 懸停粒子效果 */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(project.category),
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
            ))}
          </div>

          {/* 統計資訊 */}
          <motion.div
            className="mt-12 md:mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-black/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{projects.length}+</div>
                <div className="text-blue-300 font-mono text-sm md:text-base">開源專案</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">1</div>
                <div className="text-green-300 font-mono text-sm md:text-base">GitHub Stars</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">2</div>
                <div className="text-purple-300 font-mono text-sm md:text-base">貢獻者</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl border border-yellow-400/30 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">1</div>
                <div className="text-yellow-300 font-mono text-sm md:text-base">下載量</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
