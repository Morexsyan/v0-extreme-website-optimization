"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function PersistentHomeButton() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 服務器端渲染時不顯示
  if (!isMounted) {
    return null
  }

  // 在首頁不顯示
  if (pathname === "/") {
    return null
  }

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-green-400 to-blue-400 text-black rounded-full shadow-lg shadow-green-400/50 flex items-center justify-center text-xl md:text-2xl font-bold hover:shadow-green-400/70 transition-all duration-300"
        onClick={() => router.push("/")}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        title="返回首頁"
      >
        🏠
      </motion.button>

      {isMobile && (
        <>
          <motion.button
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 text-black rounded-full shadow-lg shadow-orange-400/50 flex items-center justify-center text-xl font-bold hover:shadow-orange-400/70 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="導航選單"
          >
            {isMenuOpen ? "✕" : "☰"}
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="fixed bottom-24 left-6 z-50 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 text-black rounded-full shadow-lg shadow-blue-400/50 flex items-center justify-center text-xl font-bold"
                  onClick={() => {
                    router.push("/writeups")
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="WriteUps"
                >
                  📝
                </motion.button>

                <motion.button
                  className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 text-black rounded-full shadow-lg shadow-green-400/50 flex items-center justify-center text-xl font-bold"
                  onClick={() => {
                    router.push("/projects")
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="專案"
                >
                  🚀
                </motion.button>

                <motion.button
                  className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 text-black rounded-full shadow-lg shadow-cyan-400/50 flex items-center justify-center text-xl font-bold"
                  onClick={() => {
                    router.push("/about")
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="關於"
                >
                  👨‍💻
                </motion.button>

                <motion.button
                  className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 text-black rounded-full shadow-lg shadow-purple-400/50 flex items-center justify-center text-xl font-bold"
                  onClick={() => {
                    router.push("/contact")
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="聯繫"
                >
                  📡
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}
