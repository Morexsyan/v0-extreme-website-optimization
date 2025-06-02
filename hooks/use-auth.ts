"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  role: string
  loginTime: number
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const router = useRouter()

  // 獲取 CSRF 令牌
  const getCSRFToken = useCallback((): string | null => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";")
      const csrfCookie = cookies.find((cookie) => cookie.trim().startsWith("csrf-token="))
      return csrfCookie ? csrfCookie.split("=")[1] : null
    }
    return null
  }, [])

  // 驗證當前會話
  const verifySession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
        return false
      }
    } catch (error) {
      console.error("Session verification error:", error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      return false
    }
  }, [])

  // 登錄函數
  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string; remainingAttempts?: number; lockedUntil?: number }> => {
      try {
        const csrfToken = getCSRFToken()

        const response = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, csrfToken }),
        })

        const data = await response.json()

        if (response.ok) {
          // 登錄成功，重新驗證會話
          await verifySession()
          return { success: true }
        } else {
          return {
            success: false,
            error: data.error,
            remainingAttempts: data.remainingAttempts,
            lockedUntil: data.lockedUntil,
          }
        }
      } catch (error) {
        console.error("Login error:", error)
        return { success: false, error: "Network error occurred" }
      }
    },
    [getCSRFToken, verifySession],
  )

  // 登出函數
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
        router.push("/login")
        return true
      }
      return false
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }, [router])

  // 需要認證的路由保護
  const requireAuth = useCallback(
    (redirectTo = "/login") => {
      if (!authState.isLoading && !authState.isAuthenticated) {
        router.push(redirectTo)
        return false
      }
      return authState.isAuthenticated
    },
    [authState.isLoading, authState.isAuthenticated, router],
  )

  // 初始化時驗證會話
  useEffect(() => {
    verifySession()
  }, [verifySession])

  // 定期檢查會話狀態（每 5 分鐘）
  useEffect(() => {
    if (authState.isAuthenticated) {
      const interval = setInterval(
        () => {
          verifySession()
        },
        5 * 60 * 1000,
      ) // 5 分鐘

      return () => clearInterval(interval)
    }
  }, [authState.isAuthenticated, verifySession])

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    verifySession,
    getCSRFToken,
  }
}
