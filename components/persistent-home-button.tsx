"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function PersistentHomeButton() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

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
  )
}
