"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ContactPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 這裡可以添加表單提交邏輯
    console.log("Form submitted:", formData)
    alert("訊息已發送！我會盡快回覆您。")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
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
        className="fixed top-6 left-6 z-50 px-4 md:px-6 py-2 md:py-3 bg-black/80 backdrop-blur-xl border border-cyan-400/50 rounded-full text-cyan-400 hover:text-black hover:bg-cyan-400 transition-all duration-300 font-mono text-sm md:text-base"
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
        <div className="max-w-6xl mx-auto">
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
                background: "linear-gradient(45deg, #00ffff, #0088ff, #8800ff)",
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
              CONTACT
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-cyan-300 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              聯繫我 • 合作機會 • 技術交流
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* 聯繫方式 */}
            <motion.div
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6">聯繫方式</h2>

                <div className="space-y-4 md:space-y-6">
                  {[
                    { icon: "📧", label: "Email", value: "morex.rick@gmail.com", href: "mailto:morex.rick@gmail.com" },
                    {
                      icon: "🐙",
                      label: "GitHub",
                      value: "github.com/Morexsyan",
                      href: "https://github.com/Morexsyan",
                    },
                    {
                      icon: "💼",
                      label: "discord",
                      value: "discord.gg/c8nMcwqq",
                      href: "https://discord.gg/c8nMcwqq",
                    },
                    { icon: "💬", label: "Discord", value: "shunshun1234_80520", href: "#" },
                  ].map((contact, index) => (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
                      className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <span className="text-2xl md:text-3xl">{contact.icon}</span>
                      <div>
                        <div className="font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {contact.label}
                        </div>
                        <div className="text-cyan-200 text-sm md:text-base font-mono">{contact.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">合作領域</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["前端開發", "資安顧問", "技術演講", "開源專案", "技術寫作", "程式教學"].map((area, index) => (
                    <motion.div
                      key={area}
                      className="px-3 py-2 bg-cyan-400/20 text-cyan-300 rounded-lg text-center font-mono text-sm md:text-base"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                      {area}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 聯繫表單 */}
            <motion.div
              className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6">發送訊息</h2>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-cyan-300 font-mono mb-2 text-sm md:text-base">姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-cyan-100 font-mono focus:outline-none focus:border-cyan-400/60 transition-colors text-sm md:text-base"
                    placeholder="您的姓名"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-mono mb-2 text-sm md:text-base">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-cyan-100 font-mono focus:outline-none focus:border-cyan-400/60 transition-colors text-sm md:text-base"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-mono mb-2 text-sm md:text-base">主題</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-cyan-100 font-mono focus:outline-none focus:border-cyan-400/60 transition-colors text-sm md:text-base"
                    placeholder="訊息主題"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-mono mb-2 text-sm md:text-base">訊息內容</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-cyan-100 font-mono focus:outline-none focus:border-cyan-400/60 transition-colors resize-none text-sm md:text-base"
                    placeholder="請描述您的需求或想法..."
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 md:py-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-black font-bold rounded-lg font-mono hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 text-sm md:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  發送訊息 🚀
                </motion.button>
              </form>

              <div className="mt-6 md:mt-8 text-center">
                <p className="text-cyan-300 text-xs md:text-sm font-mono">通常在 24 小時內回覆 ⚡</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
