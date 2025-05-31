import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_TC, JetBrains_Mono } from "next/font/google"
import "./globals.css"

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
  keywords:
    "quantum computing, AI, machine learning, web development, blockchain, cybersecurity",
  authors: [
    {
      name: "Syan",
      url: "https://github.com/Morexsyan", // ✅ 建議加上作者頁面
    },
  ],
  viewport: "width=device-width, initial-scale=1",
  generator: "v0.dev",
  openGraph: {
    title: "Syan - Red Team Exercise & Developer",
    description: "自由の奴隷",
    url: "https://syansyan.vercel.app/",
    siteName: "Syan",
    images: [
      {
        url: "https://i.pinimg.com/736x/5c/24/37/5c243711ecb6352b4d7023ced310da1f.jpg",
        width: 1200,
        height: 630,
        alt: "Syan 預覽圖",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syan - Red Team Exercise & Developer",
    description: "自由の奴隷",
    images: ["https://i.pinimg.com/736x/5c/24/37/5c243711ecb6352b4d7023ced310da1f.jpg"], // ⚠️ 建議改成 Twitter ID，如沒有可留空或移除
  },
  other: {
    renderer: "webkit",
    "force-rendering": "webkit",
    "page-visibility": "visible",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.variable} ${notoSansTC.variable} ${jetbrainsMono.variable} font-sans`}>{children}</body>
    </html>
  )
}
