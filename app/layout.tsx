import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_TC, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import ErrorBoundary from "@/components/error-boundary"

// 載入 Inter 字體 (主要英文字體)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// 載入 Noto Sans TC 字體 (中文字體)
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
})

// 載入 JetBrains Mono 字體 (程式碼字體)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Syan - Red Team Exercise & Developer",
  description: "自由の奴隷",
  keywords: "quantum computing, AI, machine learning, web development, blockchain, cybersecurity",
  authors: [{ name: "syan" }],
  viewport: "width=device-width, initial-scale=1",
  other: {
    // 優化 GPU 性能
    renderer: "webkit",
    "force-rendering": "webkit",
    // 防止頁面被掛起時丟失 WebGL 上下文
    "page-visibility": "visible",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 清理全局變量，防止未定義的變量錯誤
              if (typeof window !== 'undefined') {
                // 移除可能存在的問題變量
                if (typeof recorder !== 'undefined') {
                  delete window.recorder;
                }
                
                // 設置錯誤處理
                window.addEventListener('error', function(e) {
                  console.warn('Global error caught:', e.error);
                });
                
                window.addEventListener('unhandledrejection', function(e) {
                  console.warn('Unhandled promise rejection:', e.reason);
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansTC.variable} ${jetbrainsMono.variable} font-sans`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
