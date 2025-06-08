"use client"

import { useState, useEffect } from "react"
import WriteUpStateManager from "@/lib/writeup-state-manager"

export function useWriteUpMetrics(writeupId: string) {
  const [metrics, setMetrics] = useState(() => {
    const manager = WriteUpStateManager.getInstance()
    return manager.getMetrics(writeupId)
  })

  const [isLiked, setIsLiked] = useState(() => {
    const manager = WriteUpStateManager.getInstance()
    return manager.hasLiked(writeupId)
  })

  useEffect(() => {
    const manager = WriteUpStateManager.getInstance()

    // 訂閱狀態變化
    const unsubscribe = manager.subscribe(() => {
      setMetrics(manager.getMetrics(writeupId))
    })

    // 初始化數據
    setMetrics(manager.getMetrics(writeupId))
    setIsLiked(manager.hasLiked(writeupId))

    return unsubscribe
  }, [writeupId])

  const incrementViews = () => {
    const manager = WriteUpStateManager.getInstance()
    manager.setViewed(writeupId)
  }

  const toggleLike = () => {
    const manager = WriteUpStateManager.getInstance()
    const newLikedState = !isLiked

    if (newLikedState) {
      manager.incrementLikes(writeupId)
    } else {
      manager.decrementLikes(writeupId)
    }

    manager.setLiked(writeupId, newLikedState)
    setIsLiked(newLikedState)
  }

  const incrementShares = () => {
    const manager = WriteUpStateManager.getInstance()
    manager.incrementShares(writeupId)
  }

  return {
    metrics,
    isLiked,
    incrementViews,
    toggleLike,
    incrementShares,
  }
}

export function useAllWriteUpStats() {
  const [stats, setStats] = useState(() => {
    const manager = WriteUpStateManager.getInstance()
    return manager.getTotalStats()
  })

  useEffect(() => {
    const manager = WriteUpStateManager.getInstance()

    const unsubscribe = manager.subscribe(() => {
      setStats(manager.getTotalStats())
    })

    setStats(manager.getTotalStats())

    return unsubscribe
  }, [])

  return stats
}
