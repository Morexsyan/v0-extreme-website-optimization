"use client"

import React from "react"
import { motion } from "framer-motion"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <motion.div
            className="text-center max-w-md mx-auto px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">系統錯誤</h1>
            <p className="text-gray-400 mb-6">抱歉，發生了一個意外錯誤。請重新整理頁面或稍後再試。</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg hover:from-red-300 hover:to-red-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              重新整理頁面
            </motion.button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-400/30 rounded-lg text-left">
                <h3 className="text-red-400 font-bold mb-2">錯誤詳情 (開發模式):</h3>
                <pre className="text-xs text-red-300 overflow-auto">{this.state.error.message}</pre>
              </div>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
