"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { recordPageView } from "@/app/actions/admin-actions"
import type { SystemStat } from "@/lib/db-service"

interface DashboardStatsProps {
  initialStats: SystemStat
}

export function DashboardStats({ initialStats }: DashboardStatsProps) {
  const [stats, setStats] = useState<SystemStat>(initialStats)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Record page view when component mounts
  useEffect(() => {
    recordPageView().catch(console.error)
  }, [])

  // Periodically refresh stats
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats(true)
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const refreshStats = async (silent = false) => {
    if (!silent) {
      setRefreshing(true)
    }

    try {
      const response = await fetch("/api/admin/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data)

      if (!silent) {
        toast({
          title: "數據已更新",
          description: "儀表板統計數據已成功刷新",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error refreshing stats:", error)
      if (!silent) {
        toast({
          title: "更新失敗",
          description: "無法刷新統計數據，請稍後再試",
          variant: "destructive",
        })
      }
    } finally {
      if (!silent) {
        setRefreshing(false)
      }
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const statItems = [
    { title: "總瀏覽量", value: formatNumber(stats.totalViews), icon: "👁️", color: "blue" },
    { title: "文章數量", value: stats.totalArticles.toString(), icon: "📝", color: "green" },
    { title: "專案數量", value: stats.totalProjects.toString(), icon: "🚀", color: "purple" },
    { title: "安全警報", value: stats.securityAlerts.toString(), icon: "🔒", color: "red" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-green-400">儀表板總覽</h2>
        <motion.button
          onClick={() => refreshStats()}
          className="px-4 py-2 bg-green-400/20 text-green-300 rounded-lg border border-green-400/30 hover:bg-green-400 hover:text-black transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-green-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              刷新中...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              刷新數據
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`bg-black/60 backdrop-blur-xl border border-${stat.color}-400/30 rounded-xl p-6`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-${stat.color}-400 text-sm`}>實時</span>
            </div>
            <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
            <div className={`text-${stat.color}-300 text-sm`}>{stat.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="text-xs text-gray-400 text-right">最後更新: {new Date(stats.lastUpdated).toLocaleString()}</div>
    </div>
  )
}
