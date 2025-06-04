"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import type { Activity } from "@/lib/db-service"

interface ActivityFeedProps {
  initialActivities: Activity[]
}

export function ActivityFeed({ initialActivities }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Periodically refresh activities
  useEffect(() => {
    const interval = setInterval(() => {
      refreshActivities(true)
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  const refreshActivities = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    }

    try {
      const response = await fetch("/api/admin/activities")
      if (!response.ok) throw new Error("Failed to fetch activities")

      const data = await response.json()
      setActivities(data)

      if (!silent) {
        toast({
          title: "活動已更新",
          description: "最近活動列表已成功刷新",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error refreshing activities:", error)
      if (!silent) {
        toast({
          title: "更新失敗",
          description: "無法刷新活動列表，請稍後再試",
          variant: "destructive",
        })
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) return `${diffDay} 天前`
    if (diffHour > 0) return `${diffHour} 小時前`
    if (diffMin > 0) return `${diffMin} 分鐘前`
    return "剛剛"
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "success":
        return "bg-green-400"
      case "warning":
        return "bg-yellow-400"
      case "error":
        return "bg-red-400"
      default:
        return "bg-blue-400"
    }
  }

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-green-400">最近活動</h3>
        <motion.button
          onClick={() => refreshActivities()}
          className="px-3 py-1 bg-green-400/20 text-green-300 rounded-lg border border-green-400/30 hover:bg-green-400 hover:text-black transition-all duration-300 text-sm flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-3 w-3 text-green-300"
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
              <span>刷新中</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
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
              <span>刷新</span>
            </>
          )}
        </motion.button>
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={`w-3 h-3 rounded-full ${getTypeColor(activity.type)}`}></div>
              <div className="flex-1">
                <div className="text-green-200">{activity.action}</div>
                <div className="text-gray-400 text-sm">{getTimeAgo(activity.time)}</div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">沒有最近活動</div>
        )}
      </div>
    </div>
  )
}
